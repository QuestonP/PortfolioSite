import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { TOOL_DEFINITIONS, executeTool } from '../agent/tools.js';

const router = Router();

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const MODEL = 'claude-sonnet-4-6';

const SYSTEM_PROMPT = `You are BookBot, an intelligent library assistant embedded in the user's personal library web application. You have a warm, knowledgeable personality — like a friendly librarian who loves books.

You have access to these tools:
- search_books: find books via Google Books (covers, metadata)
- get_library: view the user's full library with read status (includes hasNotes flag per book)
- get_book_summary: get the full description AND the user's personal notes for a specific library book
- add_book: add a book to the library
- mark_as_read: mark a book read/unread with optional rating
- remove_book: remove a book from the library
- get_recommendations: personalized recommendations based on reading history
- web_search: search the web (DuckDuckGo + Google Books) for ANY book info — summaries, themes, reviews, awards, series order, author background, reader opinions
- get_book_details: fetch deep data from Open Library — full description, subjects, characters, settings, community ratings, author bio

WHEN TO USE WHICH TOOLS:
- User asks for a summary of a library book → get_book_summary (returns saved description + their notes), then synthesize a rich summary
- User asks what notes they took on a book → get_book_summary, then present their notes with your commentary
- User asks "what did I think of X?" or "remind me about X" → get_library to find it, then get_book_summary
- User wants summaries of all their books → get_library, then get_book_summary for each, then present them clearly
- User asks for a plot summary or synopsis of any book → get_book_summary first (if in library), then get_book_details or web_search if needed
- User asks about themes, characters, or meaning → get_book_summary + get_book_details + web_search
- User asks for recommendations → get_library first, then get_recommendations or web_search "books similar to X"
- User asks about an author → web_search "[author name] biography books"
- User asks if a book is part of a series → web_search "[title] series order"
- User asks about reviews or whether a book is worth reading → web_search "[title] review"

When summarizing books:
1. Use get_book_summary to get the stored description and the user's personal notes
2. Synthesize the description into a clear, engaging summary in your own words
3. If the user has notes, weave them in naturally ("You noted that...", "Your thoughts captured...")
4. If the stored description is sparse, supplement with get_book_details or web_search
5. Always mention the user's rating if they have one

When adding books, always search_books first to get the googleBooksId for cover art and metadata.

Keep responses concise and well-formatted with markdown.`;

// TOOL_DEFINITIONS are already in Anthropic's native format
const TOOLS = TOOL_DEFINITIONS as unknown as Anthropic.Tool[];

type AnthropicMessage = Anthropic.MessageParam;

function buildMessages(
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): AnthropicMessage[] {
  return history.map((m) => ({ role: m.role, content: m.content }));
}

// POST /api/agent/stream — SSE streaming with Claude
router.post('/stream', async (req, res) => {
  const { messages } = req.body as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const currentMessages: AnthropicMessage[] = buildMessages(messages);
  let libraryUpdated = false;
  const MAX_TURNS = 8;
  let turns = 0;

  try {
    while (turns++ < MAX_TURNS) {
      const stream = await client.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: currentMessages,
        stream: true,
      });

      // Accumulate content blocks by index
      type BlockAccum = {
        type: string;
        id?: string;
        name?: string;
        text: string;
        inputJson: string;
      };
      const blocks = new Map<number, BlockAccum>();
      let stopReason: string | null = null;

      for await (const event of stream) {
        switch (event.type) {
          case 'content_block_start': {
            const b = event.content_block;
            if (b.type === 'text') {
              blocks.set(event.index, { type: 'text', text: '', inputJson: '' });
            } else if (b.type === 'tool_use') {
              blocks.set(event.index, {
                type: 'tool_use',
                id: b.id,
                name: b.name,
                text: '',
                inputJson: '',
              });
              send('tool_start', { name: b.name });
            }
            break;
          }
          case 'content_block_delta': {
            const block = blocks.get(event.index);
            if (!block) break;
            if (event.delta.type === 'text_delta') {
              block.text += event.delta.text;
              send('delta', { text: event.delta.text });
            } else if (event.delta.type === 'input_json_delta') {
              block.inputJson += event.delta.partial_json;
            }
            break;
          }
          case 'message_delta': {
            stopReason = event.delta.stop_reason ?? null;
            break;
          }
        }
      }

      // Build the typed content array for the assistant message
      const assistantContent: Anthropic.ContentBlock[] = [];
      for (const [, block] of blocks) {
        if (block.type === 'text') {
          if (block.text) assistantContent.push({ type: 'text', text: block.text });
        } else if (block.type === 'tool_use') {
          let input: Record<string, unknown> = {};
          try { input = JSON.parse(block.inputJson || '{}') as Record<string, unknown>; } catch { /* malformed */ }
          assistantContent.push({
            type: 'tool_use',
            id: block.id!,
            name: block.name!,
            input,
          });
        }
      }

      const toolUseBlocks = assistantContent.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      );

      // Done — no tools called
      if (stopReason !== 'tool_use' || toolUseBlocks.length === 0) {
        send('done', { libraryUpdated });
        res.end();
        return;
      }

      // Add assistant turn
      currentMessages.push({ role: 'assistant', content: assistantContent });

      // Execute each tool and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const toolBlock of toolUseBlocks) {
        if (['add_book', 'mark_as_read', 'remove_book'].includes(toolBlock.name)) {
          libraryUpdated = true;
        }

        send('tool_running', { name: toolBlock.name });

        let result: unknown;
        try {
          result = await executeTool(
            toolBlock.name,
            toolBlock.input as Record<string, unknown>
          );
        } catch (err) {
          result = { error: err instanceof Error ? err.message : 'Tool execution failed' };
        }

        send('tool_result', { name: toolBlock.name, result });

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolBlock.id,
          content: JSON.stringify(result),
        });
      }

      // Add tool results as a user turn
      currentMessages.push({ role: 'user', content: toolResults });
    }

    // Max turns reached
    send('done', { libraryUpdated });
    res.end();
  } catch (err) {
    send('error', { message: err instanceof Error ? err.message : 'Unknown error' });
    res.end();
  }
});

export default router;
