import { v4 as uuidv4 } from 'uuid';
import { getBooks, saveBook, deleteBook, getBook } from '../db.js';
import type { Book, GoogleBooksVolume } from '../types.js';

// ─── Google Books Search (with cache to avoid 429s) ────────────────────────
const gbCache = new Map<string, { results: GoogleBooksVolume[]; ts: number }>();
const GB_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function searchGoogleBooks(query: string, maxResults = 8): Promise<GoogleBooksVolume[]> {
  const cacheKey = `${query}::${maxResults}`;
  const cached = gbCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < GB_TTL_MS) return cached.results;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&printType=books`;
  try {
    const res = await fetch(url);
    if (res.status === 429) {
      // Rate limited — return cached stale data or empty
      console.warn('[Google Books] 429 rate limited, returning cached/empty');
      return cached?.results ?? [];
    }
    if (!res.ok) {
      console.warn(`[Google Books] HTTP ${res.status} for query: ${query}`);
      return cached?.results ?? [];
    }
    const data = (await res.json()) as { items?: GoogleBooksVolume[] };
    const results = data.items ?? [];
    gbCache.set(cacheKey, { results, ts: Date.now() });
    return results;
  } catch (err) {
    console.warn('[Google Books] fetch error:', err);
    return cached?.results ?? [];
  }
}

function volumeToBook(vol: GoogleBooksVolume, source: 'agent' = 'agent'): Book {
  const info = vol.volumeInfo;
  const cover =
    info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
    info.imageLinks?.smallThumbnail?.replace('http://', 'https://') ??
    `https://via.placeholder.com/128x192/1e293b/e2e8f0?text=${encodeURIComponent(info.title ?? 'Book')}`;

  return {
    id: uuidv4(),
    googleBooksId: vol.id,
    title: info.title ?? 'Unknown Title',
    author: (info.authors ?? ['Unknown Author']).join(', '),
    description: info.description ?? 'No description available.',
    coverImage: cover,
    publishedDate: info.publishedDate,
    genres: info.categories ?? [],
    pageCount: info.pageCount,
    readStatus: 'unread',
    dateAdded: new Date().toISOString(),
    source,
  };
}

// ─── Tool Implementations ───────────────────────────────────────────────────
export async function tool_search_books(args: { query: string; max_results?: number }) {
  const results = await searchGoogleBooks(args.query, args.max_results ?? 8);
  if (results.length === 0) return { results: [], message: 'No books found for that query.' };
  return {
    results: results.map((v) => ({
      googleBooksId: v.id,
      title: v.volumeInfo.title,
      author: (v.volumeInfo.authors ?? ['Unknown']).join(', '),
      description: (v.volumeInfo.description ?? '').slice(0, 200),
      coverImage:
        v.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ??
        `https://via.placeholder.com/128x192/1e293b/e2e8f0?text=${encodeURIComponent(v.volumeInfo.title ?? 'Book')}`,
      publishedDate: v.volumeInfo.publishedDate,
      genres: v.volumeInfo.categories ?? [],
      pageCount: v.volumeInfo.pageCount,
    })),
  };
}

export async function tool_get_library() {
  const books = getBooks();
  return {
    total: books.length,
    read: books.filter((b) => b.readStatus === 'read').length,
    reading: books.filter((b) => b.readStatus === 'reading').length,
    unread: books.filter((b) => b.readStatus === 'unread').length,
    books: books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      readStatus: b.readStatus,
      genres: b.genres,
      userRating: b.userRating,
      dateAdded: b.dateAdded,
      hasNotes: !!b.notes,
    })),
  };
}

export async function tool_get_book_summary(args: { book_id?: string; title?: string }) {
  let book: Book | undefined;

  if (args.book_id) {
    book = getBook(args.book_id);
  } else if (args.title) {
    book = getBooks().find((b) => b.title.toLowerCase().includes(args.title!.toLowerCase()));
  }

  if (!book) {
    return { found: false, message: 'Book not found in library.' };
  }

  return {
    found: true,
    id: book.id,
    title: book.title,
    author: book.author,
    description: book.description || 'No description saved for this book.',
    notes: book.notes || null,
    readStatus: book.readStatus,
    userRating: book.userRating,
    dateRead: book.dateRead ?? null,
    genres: book.genres,
    publishedDate: book.publishedDate,
    pageCount: book.pageCount,
  };
}

export async function tool_add_book(args: {
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  genres?: string[];
  publishedDate?: string;
  pageCount?: number;
  googleBooksId?: string;
}) {
  // Avoid duplicates by title+author
  const existing = getBooks().find(
    (b) =>
      b.title.toLowerCase() === args.title.toLowerCase() &&
      b.author.toLowerCase() === args.author.toLowerCase()
  );
  if (existing) {
    return { success: false, message: `"${args.title}" is already in the library.`, book: existing };
  }

  // If we have a googleBooksId, try to enrich from Google Books
  let enriched: Partial<Book> = {};
  if (args.googleBooksId) {
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${args.googleBooksId}`);
      if (res.ok) {
        const vol = (await res.json()) as GoogleBooksVolume;
        const b = volumeToBook(vol);
        enriched = {
          coverImage: b.coverImage,
          description: b.description,
          genres: b.genres,
          pageCount: b.pageCount,
          publishedDate: b.publishedDate,
        };
      }
    } catch {
      // ignore enrichment errors
    }
  }

  const book: Book = {
    id: uuidv4(),
    title: args.title,
    author: args.author,
    description: enriched.description ?? args.description ?? 'No description available.',
    coverImage:
      enriched.coverImage ??
      args.coverImage ??
      `https://via.placeholder.com/128x192/1e293b/e2e8f0?text=${encodeURIComponent(args.title)}`,
    genres: enriched.genres ?? args.genres ?? [],
    publishedDate: enriched.publishedDate ?? args.publishedDate,
    pageCount: enriched.pageCount ?? args.pageCount,
    readStatus: 'unread',
    dateAdded: new Date().toISOString(),
    googleBooksId: args.googleBooksId,
    source: 'agent',
  };

  saveBook(book);
  return { success: true, message: `Added "${book.title}" to your library.`, book };
}

export async function tool_mark_as_read(args: {
  book_id?: string;
  title?: string;
  is_read: boolean;
  rating?: number;
}) {
  let book: Book | undefined;

  if (args.book_id) {
    book = getBook(args.book_id);
  } else if (args.title) {
    book = getBooks().find((b) => b.title.toLowerCase().includes(args.title!.toLowerCase()));
  }

  if (!book) {
    return { success: false, message: 'Book not found in library.' };
  }

  book.readStatus = args.is_read ? 'read' : 'unread';
  if (args.is_read) {
    book.dateRead = new Date().toISOString();
  } else {
    delete book.dateRead;
  }
  if (args.rating !== undefined) {
    book.userRating = Math.min(5, Math.max(1, args.rating));
  }

  saveBook(book);
  return {
    success: true,
    message: `Marked "${book.title}" as ${args.is_read ? 'read' : 'unread'}${args.rating ? ` with a ${args.rating}/5 rating` : ''}.`,
    book,
  };
}

export async function tool_remove_book(args: { book_id?: string; title?: string }) {
  let book: Book | undefined;

  if (args.book_id) {
    book = getBook(args.book_id);
  } else if (args.title) {
    book = getBooks().find((b) => b.title.toLowerCase().includes(args.title!.toLowerCase()));
  }

  if (!book) {
    return { success: false, message: 'Book not found in library.' };
  }

  deleteBook(book.id);
  return { success: true, message: `Removed "${book.title}" from your library.` };
}

export async function tool_get_recommendations(args: { based_on?: string; genre?: string }) {
  const library = getBooks();
  const readBooks = library.filter((b) => b.readStatus === 'read');

  let query = args.based_on ?? args.genre ?? '';

  if (!query && readBooks.length > 0) {
    // Base recommendations on genres from read books
    const allGenres = readBooks.flatMap((b) => b.genres);
    const genreCounts: Record<string, number> = {};
    allGenres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] ?? 0) + 1;
    });
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topAuthors = [...new Set(readBooks.map((b) => b.author))].slice(0, 2);
    query = topGenre ? `${topGenre} books similar to ${topAuthors.join(' ')}` : 'popular fiction';
  } else if (!query) {
    query = 'bestselling books 2024';
  }

  const results = await searchGoogleBooks(`${query} recommended`, 6);
  const libraryIds = new Set(library.map((b) => b.googleBooksId).filter(Boolean));
  const filtered = results.filter((v) => !libraryIds.has(v.id));

  return {
    query_used: query,
    recommendations: filtered.slice(0, 5).map((v) => ({
      googleBooksId: v.id,
      title: v.volumeInfo.title,
      author: (v.volumeInfo.authors ?? ['Unknown']).join(', '),
      description: (v.volumeInfo.description ?? '').slice(0, 300),
      coverImage:
        v.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ??
        `https://via.placeholder.com/128x192/1e293b/e2e8f0?text=${encodeURIComponent(v.volumeInfo.title ?? 'Book')}`,
      genres: v.volumeInfo.categories ?? [],
      publishedDate: v.volumeInfo.publishedDate,
    })),
  };
}

// ─── Web Search (DuckDuckGo — no API key) ──────────────────────────────────
interface DDGResult {
  Abstract?: string;
  AbstractText?: string;
  AbstractURL?: string;
  AbstractSource?: string;
  RelatedTopics?: Array<{ Text?: string; FirstURL?: string; Topics?: Array<{ Text?: string; FirstURL?: string }> }>;
  Results?: Array<{ Text?: string; FirstURL?: string }>;
  Answer?: string;
}

export async function tool_web_search(args: { query: string; max_results?: number }) {
  const max = args.max_results ?? 5;

  // DuckDuckGo Instant Answer API (no key required)
  const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(args.query)}&format=json&no_html=1&skip_disambig=1`;
  const ddgRes = await fetch(ddgUrl, { headers: { 'Accept-Language': 'en-US' } });
  const ddg = (await ddgRes.json()) as DDGResult;

  const results: Array<{ title: string; url: string; snippet: string }> = [];

  // Instant answer / Wikipedia abstract
  if (ddg.AbstractText) {
    results.push({
      title: ddg.AbstractSource ?? 'Summary',
      url: ddg.AbstractURL ?? '',
      snippet: ddg.AbstractText,
    });
  }
  if (ddg.Answer) {
    results.push({ title: 'Quick Answer', url: '', snippet: ddg.Answer });
  }

  // Related topics
  for (const topic of ddg.RelatedTopics ?? []) {
    if (results.length >= max) break;
    // Top-level topic
    if (topic.Text) {
      results.push({ title: '', url: topic.FirstURL ?? '', snippet: topic.Text });
    }
    // Nested topics
    for (const sub of topic.Topics ?? []) {
      if (results.length >= max) break;
      if (sub.Text) results.push({ title: '', url: sub.FirstURL ?? '', snippet: sub.Text });
    }
  }

  // Also pull a Google Books search for book-specific context
  try {
    const gbResults = await searchGoogleBooks(args.query, 3);
    for (const vol of gbResults) {
      if (results.length >= max + 3) break;
      const info = vol.volumeInfo;
      if (info.description) {
        results.push({
          title: `${info.title} by ${(info.authors ?? []).join(', ')}`,
          url: `https://books.google.com/books?id=${vol.id}`,
          snippet: info.description.slice(0, 300),
        });
      }
    }
  } catch { /* non-fatal */ }

  if (results.length === 0) {
    return { query: args.query, results: [], message: 'No results found. Try a different query.' };
  }

  return { query: args.query, results: results.slice(0, max) };
}

// ─── Open Library Book Details ──────────────────────────────────────────────
interface OLSearchResult {
  docs?: Array<{
    key?: string;
    title?: string;
    author_name?: string[];
    first_publish_year?: number;
    subject?: string[];
    place?: string[];
    time?: string[];
    person?: string[];
    description?: string;
    number_of_pages_median?: number;
    ratings_average?: number;
    ratings_count?: number;
    want_to_read_count?: number;
    already_read_count?: number;
    cover_i?: number;
  }>;
  numFound?: number;
}

interface OLWork {
  description?: string | { value?: string };
  subjects?: string[];
  subject_places?: string[];
  subject_times?: string[];
  subject_people?: string[];
  excerpts?: Array<{ text?: string; comment?: string }>;
}

interface OLAuthor {
  name?: string;
  bio?: string | { value?: string };
  birth_date?: string;
  death_date?: string;
  wikipedia?: string;
}

export async function tool_get_book_details(args: { title: string; author?: string }) {
  const q = args.author
    ? `title=${encodeURIComponent(args.title)}&author=${encodeURIComponent(args.author)}`
    : `title=${encodeURIComponent(args.title)}`;

  // Open Library search
  const searchUrl = `https://openlibrary.org/search.json?${q}&limit=1&fields=key,title,author_name,author_key,first_publish_year,subject,place,time,person,number_of_pages_median,ratings_average,ratings_count,already_read_count,want_to_read_count,cover_i`;
  const searchRes = await fetch(searchUrl);
  const searchData = (await searchRes.json()) as OLSearchResult;
  const doc = searchData.docs?.[0];

  if (!doc) {
    return { found: false, message: `No Open Library entry found for "${args.title}".` };
  }

  const result: Record<string, unknown> = {
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublished: doc.first_publish_year,
    pages: doc.number_of_pages_median,
    subjects: (doc.subject ?? []).slice(0, 15),
    places: (doc.place ?? []).slice(0, 5),
    periods: (doc.time ?? []).slice(0, 5),
    characters: (doc.person ?? []).slice(0, 5),
    communityStats: {
      ratingsAverage: doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : null,
      ratingsCount: doc.ratings_count,
      alreadyRead: doc.already_read_count,
      wantToRead: doc.want_to_read_count,
    },
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : null,
  };

  // Fetch the work record for description and excerpts
  if (doc.key) {
    try {
      const workRes = await fetch(`https://openlibrary.org${doc.key}.json`);
      const work = (await workRes.json()) as OLWork;
      const desc = typeof work.description === 'string'
        ? work.description
        : work.description?.value ?? null;
      if (desc) result.description = desc.slice(0, 800);
      if (work.excerpts?.length) {
        result.excerpt = work.excerpts[0].text?.slice(0, 400);
      }
    } catch { /* non-fatal */ }
  }

  // Fetch author bio if available
  if (doc.author_name?.[0]) {
    try {
      const authorSearchRes = await fetch(
        `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(doc.author_name[0])}&limit=1`
      );
      const authorSearch = (await authorSearchRes.json()) as { docs?: Array<{ key?: string }> };
      const authorKey = authorSearch.docs?.[0]?.key;
      if (authorKey) {
        const authorRes = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);
        const author = (await authorRes.json()) as OLAuthor;
        const bio = typeof author.bio === 'string' ? author.bio : author.bio?.value;
        result.authorBio = {
          name: author.name,
          bio: bio?.slice(0, 400),
          born: author.birth_date,
          died: author.death_date,
        };
      }
    } catch { /* non-fatal */ }
  }

  return { found: true, source: 'Open Library', ...result };
}

// ─── Tool Definitions for Claude ───────────────────────────────────────────
export const TOOL_DEFINITIONS = [
  {
    name: 'search_books',
    description:
      'Search for books using the Google Books API. Returns titles, authors, descriptions, covers, and metadata. Use this to find books the user is looking for or to research books.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query (title, author, topic, genre, ISBN)' },
        max_results: { type: 'number', description: 'Maximum results to return (default: 8, max: 20)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_library',
    description: "Get all books in the user's personal library with read status and ratings.",
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'add_book',
    description:
      "Add a book to the user's library. Provide the title and author at minimum. Include googleBooksId if you found the book via search_books — this enables cover art and rich metadata.",
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Book title' },
        author: { type: 'string', description: 'Book author(s)' },
        description: { type: 'string', description: 'Book description/synopsis' },
        coverImage: { type: 'string', description: 'URL for book cover image' },
        genres: { type: 'array', items: { type: 'string' }, description: 'Genre tags' },
        publishedDate: { type: 'string', description: 'Publication date' },
        pageCount: { type: 'number', description: 'Number of pages' },
        googleBooksId: { type: 'string', description: 'Google Books volume ID for enrichment' },
      },
      required: ['title', 'author'],
    },
  },
  {
    name: 'mark_as_read',
    description: "Mark a book in the user's library as read or unread, optionally with a rating.",
    input_schema: {
      type: 'object' as const,
      properties: {
        book_id: { type: 'string', description: 'Book ID from the library' },
        title: { type: 'string', description: 'Book title (used if book_id is unknown)' },
        is_read: { type: 'boolean', description: 'Whether the book has been read' },
        rating: { type: 'number', description: 'User rating 1-5 (optional)' },
      },
      required: ['is_read'],
    },
  },
  {
    name: 'remove_book',
    description: "Remove a book from the user's library.",
    input_schema: {
      type: 'object' as const,
      properties: {
        book_id: { type: 'string', description: 'Book ID from the library' },
        title: { type: 'string', description: 'Book title (used if book_id is unknown)' },
      },
      required: [],
    },
  },
  {
    name: 'get_recommendations',
    description:
      "Get personalized book recommendations based on the user's reading history, a specific topic, or genre. Searches the web for relevant books not already in their library.",
    input_schema: {
      type: 'object' as const,
      properties: {
        based_on: { type: 'string', description: 'Topic, author, or book to base recommendations on' },
        genre: { type: 'string', description: 'Genre to recommend from' },
      },
      required: [],
    },
  },
  {
    name: 'web_search',
    description:
      'Search the web (via DuckDuckGo + Google Books) for any book-related information: plot summaries, themes, reviews, author background, series order, awards, comparisons, reader opinions, and more. Use this whenever you need current or detailed information about a book that is not in your internal knowledge.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'The search query, e.g. "Mr Mercedes Stephen King plot summary", "books similar to The Whisper Man thriller"' },
        max_results: { type: 'number', description: 'Number of results to return (default 5)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_book_details',
    description:
      'Fetch rich details about a specific book from Open Library: full description, subjects/themes, characters, settings, time periods, community ratings, how many people have read it, and the author biography. Use this for deep dives on a book already in the library or one the user is curious about.',
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string', description: 'Book title' },
        author: { type: 'string', description: 'Author name (optional but improves accuracy)' },
      },
      required: ['title'],
    },
  },
  {
    name: 'get_book_summary',
    description:
      "Get the full description and the user's personal notes for a specific book in their library. Use this when the user asks about a summary, what a book is about, their thoughts on a book, or what notes they took. Call get_library first to find the book ID or title, then call this.",
    input_schema: {
      type: 'object' as const,
      properties: {
        book_id: { type: 'string', description: 'Book ID from the library' },
        title: { type: 'string', description: 'Book title (used if book_id is unknown)' },
      },
      required: [],
    },
  },
] as const;

// ─── Tool Dispatcher ────────────────────────────────────────────────────────
export async function executeTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_books':
      return tool_search_books(input as Parameters<typeof tool_search_books>[0]);
    case 'get_library':
      return tool_get_library();
    case 'add_book':
      return tool_add_book(input as Parameters<typeof tool_add_book>[0]);
    case 'mark_as_read':
      return tool_mark_as_read(input as Parameters<typeof tool_mark_as_read>[0]);
    case 'remove_book':
      return tool_remove_book(input as Parameters<typeof tool_remove_book>[0]);
    case 'get_recommendations':
      return tool_get_recommendations(input as Parameters<typeof tool_get_recommendations>[0]);
    case 'web_search':
      return tool_web_search(input as Parameters<typeof tool_web_search>[0]);
    case 'get_book_details':
      return tool_get_book_details(input as Parameters<typeof tool_get_book_details>[0]);
    case 'get_book_summary':
      return tool_get_book_summary(input as Parameters<typeof tool_get_book_summary>[0]);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
