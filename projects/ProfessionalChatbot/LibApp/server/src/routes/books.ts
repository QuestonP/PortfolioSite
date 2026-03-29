import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getBooks, getBook, saveBook, deleteBook } from '../db.js';
import type { Book, ReadStatus, GoogleBooksVolume } from '../types.js';

const router = Router();

// ─── Open Library types ───────────────────────────────────────────────────────
interface OLDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
}

interface OLSearchResult {
  numFound: number;
  docs: OLDoc[];
}

// Convert Open Library doc → GoogleBooksVolume shape (reuses existing client types)
function olToVolume(doc: OLDoc): GoogleBooksVolume {
  return {
    id: doc.key,
    volumeInfo: {
      title: doc.title,
      authors: doc.author_name ?? ['Unknown'],
      imageLinks: doc.cover_i
        ? {
            thumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
            smallThumbnail: `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`,
          }
        : undefined,
      publishedDate: doc.first_publish_year?.toString(),
      categories: doc.subject?.slice(0, 3),
    },
  };
}

// ─── Helper: enrich a manually-added book via Open Library (primary) or Google Books ──
async function searchOL(query: string): Promise<OLDoc | null> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=key,title,author_name,cover_i,first_publish_year,subject`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LibApp/1.0' } });
  if (!res.ok) return null;
  const data = await res.json() as OLSearchResult;
  // Prefer the first result with a cover image
  return data.docs?.find((d) => d.cover_i) ?? data.docs?.[0] ?? null;
}

async function enrichFromOpenLibrary(title: string, author: string): Promise<Partial<Book> | null> {
  try {
    // Try title+author first, then fall back to title-only if no cover found
    let doc = await searchOL(`${title} ${author}`);
    if (!doc?.cover_i) {
      const titleOnly = await searchOL(title);
      if (titleOnly?.cover_i) doc = titleOnly;
    }
    if (!doc) return null;

    // Try to get description from work endpoint
    let description = '';
    try {
      const workRes = await fetch(`https://openlibrary.org${doc.key}.json`, {
        headers: { 'User-Agent': 'LibApp/1.0' },
      });
      if (workRes.ok) {
        const work = await workRes.json() as { description?: string | { value: string } };
        const raw = work.description;
        description = typeof raw === 'string' ? raw : (raw?.value ?? '');
      }
    } catch { /* skip description */ }

    return {
      coverImage: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : undefined,
      description: description.slice(0, 1000),
      genres: doc.subject?.slice(0, 5) ?? [],
      publishedDate: doc.first_publish_year?.toString(),
    };
  } catch {
    return null;
  }
}

async function enrichFromGoogleBooks(title: string, author: string): Promise<Partial<Book> | null> {
  const toResult = (vol: GoogleBooksVolume): Partial<Book> => {
    const info = vol.volumeInfo;
    return {
      coverImage:
        info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
        info.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
      description: info.description,
      genres: info.categories ?? [],
      publishedDate: info.publishedDate,
      pageCount: info.pageCount,
      googleBooksId: vol.id,
    };
  };

  const search = async (q: string): Promise<GoogleBooksVolume | null> => {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=5&printType=books`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json() as { items?: GoogleBooksVolume[] };
      // Prefer a result that has a cover and whose title closely matches
      const items = data.items ?? [];
      const normalTitle = title.toLowerCase().replace(/[^\w\s]/g, '');
      const exact = items.find((v) => {
        const t = v.volumeInfo.title?.toLowerCase().replace(/[^\w\s]/g, '') ?? '';
        return t.includes(normalTitle.slice(0, 15)) && v.volumeInfo.imageLinks;
      });
      return exact ?? items.find((v) => v.volumeInfo.imageLinks) ?? items[0] ?? null;
    } catch {
      return null;
    }
  };

  // 1. Exact intitle + inauthor (most precise)
  let vol = await search(`intitle:"${title}" inauthor:"${author}"`);
  if (vol?.volumeInfo.imageLinks) return toResult(vol);

  // 2. Exact intitle only
  vol = await search(`intitle:"${title}"`);
  if (vol?.volumeInfo.imageLinks) return toResult(vol);

  // 3. Broad fallback
  vol = await search(`${title} ${author}`);
  return vol ? toResult(vol) : null;
}

async function enrichBook(title: string, author: string): Promise<Partial<Book>> {
  // Try Google Books first (better covers), fall back to Open Library
  const gb = await enrichFromGoogleBooks(title, author);
  if (gb?.coverImage) return gb;
  const ol = await enrichFromOpenLibrary(title, author);
  return { ...(ol ?? {}), ...(gb ?? {}) }; // merge, preferring GB fields when present
}

// ─── Recommendations via Open Library (no quota) ─────────────────────────────
async function fetchOLRecommendations(query: string, limit = 8): Promise<OLDoc[]> {
  const url = `https://openlibrary.org/search.json?${query}&limit=${limit}&fields=key,title,author_name,cover_i,first_publish_year,subject`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LibApp/1.0' } });
  if (!res.ok) return [];
  const data = await res.json() as OLSearchResult;
  return data.docs ?? [];
}

// ─── GET /api/books (must stay before /:id) ───────────────────────────────────
router.get('/', (_req, res) => {
  res.json(getBooks());
});

// ─── GET /api/books/search/web?q=... (must be before /:id) ───────────────────
router.get('/search/web', async (req, res) => {
  const q = req.query.q as string;
  if (!q) return res.status(400).json({ error: 'q parameter required' });

  // Try Google Books first, fall back to Open Library
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=12&printType=books`;
    const response = await fetch(url);
    const data = (await response.json()) as { items?: unknown[]; error?: unknown };
    if (!data.error && data.items?.length) {
      return res.json(data.items);
    }
  } catch { /* fall through */ }

  // Open Library fallback
  try {
    const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=12&fields=key,title,author_name,cover_i,first_publish_year,subject`;
    const olRes = await fetch(olUrl, { headers: { 'User-Agent': 'LibApp/1.0' } });
    const olData = await olRes.json() as OLSearchResult;
    res.json((olData.docs ?? []).map(olToVolume));
  } catch {
    res.json([]);
  }
});

// ─── GET /api/books/recommendations (must be before /:id) ────────────────────
const normalizeTitle = (t: string) =>
  t.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

router.get('/recommendations', async (req, res) => {
  const page = Math.max(0, parseInt((req.query.page as string) ?? '0', 10) || 0);
  const olOffset = page * 8; // shift OL results window on each refresh

  const books = getBooks();
  const readBooks = books.filter((b) => b.readStatus === 'read');
  const libraryIds = new Set(books.map((b) => b.googleBooksId).filter(Boolean));
  const libraryKeys = new Set(books.map((b) => b.id));
  const libraryTitles = new Set(books.map((b) => normalizeTitle(b.title)));

  // If nothing read yet, return popular fiction from Open Library (vary by page)
  if (readBooks.length === 0) {
    const popularQueries = [
      'q=popular+fiction+bestseller&sort=rating',
      'q=bestseller+novel&sort=new',
      'subject=fiction&sort=rating',
      'q=award+winning+fiction',
    ];
    const q = popularQueries[page % popularQueries.length];
    const docs = await fetchOLRecommendations(`${q}&offset=${olOffset}`, 24);
    return res.json(docs.filter((d) => d.cover_i).map(olToVolume).slice(0, 20));
  }

  // Build a rotated pool of queries — each refresh shifts which authors/genres/pivots are used
  const topRead = [...readBooks].sort((a, b) => (b.userRating ?? 0) - (a.userRating ?? 0));
  const allAuthors = [...new Set(topRead.map((b) => b.author))];
  const allGenres = [...new Set(readBooks.flatMap((b) => b.genres))];

  // Rotate starting index so each page surfaces different authors/genres
  const authorStart = (page * 2) % Math.max(allAuthors.length, 1);
  const genreStart = (page * 3) % Math.max(allGenres.length, 1);
  const pivotBook = topRead[page % topRead.length];

  const rotatedAuthors = [
    ...allAuthors.slice(authorStart),
    ...allAuthors.slice(0, authorStart),
  ].slice(0, 3);

  const rotatedGenres = [
    ...allGenres.slice(genreStart),
    ...allGenres.slice(0, genreStart),
  ].slice(0, 2);

  const olQueries: string[] = [
    ...rotatedAuthors.map((a) => `author=${encodeURIComponent(a)}&offset=${olOffset}`),
    ...rotatedGenres.map((g) => `subject=${encodeURIComponent(g)}&offset=${olOffset}`),
    `q=${encodeURIComponent(pivotBook.title)}&offset=${olOffset}`,
  ];

  const seen = new Set<string>();
  const results: GoogleBooksVolume[] = [];

  for (const q of olQueries) {
    if (results.length >= 24) break;
    const docs = await fetchOLRecommendations(q, 12);
    for (const doc of docs) {
      if (!doc.cover_i) continue;
      if (seen.has(doc.key)) continue;
      if (libraryIds.has(doc.key) || libraryKeys.has(doc.key)) continue;
      if (libraryTitles.has(normalizeTitle(doc.title))) continue;
      seen.add(doc.key);
      results.push(olToVolume(doc));
    }
  }

  res.json(results.slice(0, 20));
});

// ─── POST /api/books/enrich-all ──────────────────────────────────────────────
// Enriches existing books that are missing covers or descriptions.
router.post('/enrich-all', async (_req, res) => {
  const books = getBooks();
  const stale = books.filter(
    (b) => b.coverImage.includes('via.placeholder.com') || !b.description
  );

  // Enrich books in parallel (with concurrency cap to avoid hammering APIs)
  const CONCURRENCY = 3;
  const enriched: Book[] = [];

  for (let i = 0; i < stale.length; i += CONCURRENCY) {
    const batch = stale.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (book) => {
        const data = await enrichBook(book.title, book.author);
        if (!data.coverImage && !data.description) return; // nothing found

        const updated: Book = {
          ...book,
          coverImage: book.coverImage.includes('via.placeholder.com')
            ? (data.coverImage ?? book.coverImage)
            : book.coverImage,
          description: book.description || data.description || '',
          genres: book.genres.length ? book.genres : (data.genres ?? []),
          publishedDate: book.publishedDate ?? data.publishedDate,
          pageCount: book.pageCount ?? data.pageCount,
          googleBooksId: book.googleBooksId ?? data.googleBooksId,
        };
        saveBook(updated);
        enriched.push(updated);
      })
    );
  }

  res.json({ enriched: enriched.length, books: enriched });
});

// ─── POST /api/books/:id/enrich ──────────────────────────────────────────────
// Force re-fetch cover + metadata for a single book, always overwriting.
router.post('/:id/enrich', async (req, res) => {
  const book = getBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const data = await enrichBook(book.title, book.author);
  if (!data.coverImage && !data.description) {
    return res.status(404).json({ error: 'No data found for this book' });
  }

  const updated: Book = {
    ...book,
    coverImage: data.coverImage ?? book.coverImage,
    description: data.description || book.description,
    genres: data.genres?.length ? data.genres : book.genres,
    publishedDate: data.publishedDate ?? book.publishedDate,
    pageCount: data.pageCount ?? book.pageCount,
    googleBooksId: data.googleBooksId ?? book.googleBooksId,
  };

  saveBook(updated);
  res.json(updated);
});

// ─── GET /api/books/:id ───────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const book = getBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// ─── POST /api/books ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const body = req.body as Partial<Book>;
  if (!body.title || !body.author) {
    return res.status(400).json({ error: 'title and author are required' });
  }

  // Auto-enrich when added manually (no cover/id provided)
  let enriched: Partial<Book> = {};
  if (!body.googleBooksId && (!body.coverImage || !body.description)) {
    enriched = await enrichBook(body.title, body.author);
  }

  const book: Book = {
    id: uuidv4(),
    title: body.title,
    author: body.author,
    description: body.description || enriched.description || '',
    coverImage:
      body.coverImage ||
      enriched.coverImage ||
      `https://via.placeholder.com/128x192/1e293b/e2e8f0?text=${encodeURIComponent(body.title)}`,
    genres: body.genres?.length ? body.genres : (enriched.genres ?? []),
    publishedDate: body.publishedDate ?? enriched.publishedDate,
    pageCount: body.pageCount ?? enriched.pageCount,
    readStatus: (body.readStatus as ReadStatus) ?? 'unread',
    userRating: body.userRating,
    dateAdded: new Date().toISOString(),
    googleBooksId: body.googleBooksId ?? enriched.googleBooksId,
    source: 'user',
  };

  saveBook(book);
  res.status(201).json(book);
});

// ─── PUT /api/books/:id ───────────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const book = getBook(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const updates = req.body as Partial<Book>;
  const updated: Book = { ...book, ...updates, id: book.id };

  if (updates.readStatus === 'read' && book.readStatus !== 'read') {
    updated.dateRead = new Date().toISOString();
  }

  saveBook(updated);
  res.json(updated);
});

// ─── DELETE /api/books/:id ────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const deleted = deleteBook(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Book not found' });
  res.json({ success: true });
});

export default router;
