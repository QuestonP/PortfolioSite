import type { Book, GoogleBooksVolume, ReadingGoal } from './types';

const BASE = '/api';

export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    const res = await fetch(`${BASE}/books`);
    return res.json();
  },

  add: async (book: Partial<Book>): Promise<Book> => {
    const res = await fetch(`${BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    return res.json();
  },

  update: async (id: string, updates: Partial<Book>): Promise<Book> => {
    const res = await fetch(`${BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  remove: async (id: string): Promise<void> => {
    await fetch(`${BASE}/books/${id}`, { method: 'DELETE' });
  },

  enrichAll: async (): Promise<{ enriched: number; books: Book[] }> => {
    const res = await fetch(`${BASE}/books/enrich-all`, { method: 'POST' });
    return res.json();
  },

  enrichOne: async (id: string): Promise<Book> => {
    const res = await fetch(`${BASE}/books/${id}/enrich`, { method: 'POST' });
    if (!res.ok) throw new Error('No data found');
    return res.json();
  },

  recommendations: async (): Promise<GoogleBooksVolume[]> => {
    const res = await fetch(`${BASE}/books/recommendations`);
    return res.json();
  },

  searchWeb: async (q: string): Promise<GoogleBooksVolume[]> => {
    const res = await fetch(`${BASE}/books/search/web?q=${encodeURIComponent(q)}`);
    return res.json();
  },
};

export const goalsApi = {
  get: async (): Promise<ReadingGoal> => {
    const res = await fetch(`${BASE}/goals`);
    return res.json();
  },

  update: async (target: number): Promise<ReadingGoal> => {
    const res = await fetch(`${BASE}/goals`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target }),
    });
    return res.json();
  },
};

export interface StreamEvent {
  type: 'delta' | 'tool_start' | 'tool_running' | 'tool_result' | 'done' | 'error';
  data: unknown;
}

export function streamAgentChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  onEvent: (event: StreamEvent) => void
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${BASE}/agent/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        onEvent({ type: 'error', data: { message: `HTTP ${res.status}` } });
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        let eventType = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ') && eventType) {
            try {
              const data = JSON.parse(line.slice(6));
              onEvent({ type: eventType as StreamEvent['type'], data });
            } catch {
              // ignore parse errors
            }
            eventType = '';
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        onEvent({ type: 'error', data: { message: (err as Error).message } });
      }
    }
  })();

  return controller;
}
