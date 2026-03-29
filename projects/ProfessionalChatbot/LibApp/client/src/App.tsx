import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  LayoutGrid,
  List,
  Sparkles,
  Plus,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import type { Book, ReadStatus, GoogleBooksVolume, ReadingGoal } from './types';
import { booksApi, goalsApi } from './api';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LibraryBookCard, SearchBookCard } from './components/BookCard';
import { LibraryBookModal, SearchVolumeModal } from './components/BookModal';
import { AIChat } from './components/AIChat';
import { RecommendationCarousel } from './components/RecommendationCarousel';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'read' | 'reading' | 'unread';
type SortMode = 'recent' | 'title' | 'author' | 'rating';

function AddBookForm({ onAdd, onClose }: { onAdd: (b: Partial<Book>) => void; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;
    onAdd({ title, author, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-navy-800 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-white">Add Book Manually</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Book title"
              className="mt-1 w-full bg-navy-900 border border-slate-600 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Author *</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              placeholder="Author name"
              className="mt-1 w-full bg-navy-900 border border-slate-600 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description (optional)"
              rows={3}
              className="mt-1 w-full bg-navy-900 border border-slate-600 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" className="flex-1 btn-primary">Add Book</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchResults, setSearchResults] = useState<GoogleBooksVolume[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [filter, setFilter] = useState<FilterMode>('all');
  const [sort, setSort] = useState<SortMode>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [genreFilter, setGenreFilter] = useState<string>('');

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<GoogleBooksVolume | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [goal, setGoal] = useState<ReadingGoal | null>(null);

  const [aiMessage, setAiMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBooks = useCallback(async () => {
    try {
      const data = await booksApi.getAll();
      setBooks(data);

      // Auto-enrich books that still have placeholder covers or no description
      const needsEnrichment = data.some(
        (b) => b.coverImage.includes('via.placeholder.com') || !b.description
      );
      if (needsEnrichment) {
        setEnriching(true);
        try {
          const result = await booksApi.enrichAll();
          if (result.enriched > 0) {
            const refreshed = await booksApi.getAll();
            setBooks(refreshed);
            showToast(`Updated ${result.enriched} book${result.enriched > 1 ? 's' : ''} with covers & details`);
          }
        } catch { /* silently ignore enrichment errors */ }
        setEnriching(false);
      }
    } catch {
      showToast('Failed to load library', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBooks();
    goalsApi.get().then(setGoal).catch(() => null);
  }, [loadBooks]);

  // ─── Derived data ────────────────────────────────────────────────────────
  const allGenres = [...new Set(books.flatMap((b) => b.genres))].sort();

  const filteredBooks = books
    .filter((b) => {
      if (filter === 'read') return b.readStatus === 'read';
      if (filter === 'reading') return b.readStatus === 'reading';
      if (filter === 'unread') return b.readStatus === 'unread';
      return true;
    })
    .filter((b) => !genreFilter || b.genres.includes(genreFilter))
    .sort((a, b) => {
      switch (sort) {
        case 'title': return a.title.localeCompare(b.title);
        case 'author': return a.author.localeCompare(b.author);
        case 'rating': return (b.userRating ?? 0) - (a.userRating ?? 0);
        default: return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const libraryGoogleIds = new Set(books.map((b) => b.googleBooksId).filter(Boolean));
  const readCount = books.filter((b) => b.readStatus === 'read').length;
  const goalYear = goal?.year ?? new Date().getFullYear();
  const booksReadThisYear = books.filter(
    (b) => b.readStatus === 'read' && b.dateRead && new Date(b.dateRead).getFullYear() === goalYear
  ).length;

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleAddBook = async (data: Partial<Book>) => {
    try {
      const book = await booksApi.add(data);
      setBooks((prev) => [book, ...prev]);
      showToast(`Added "${book.title}" to library`);
    } catch {
      showToast('Failed to add book', 'error');
    }
  };

  const handleAddVolume = async (volume: GoogleBooksVolume) => {
    const info = volume.volumeInfo;
    await handleAddBook({
      title: info.title,
      author: (info.authors ?? ['Unknown']).join(', '),
      description: info.description,
      coverImage:
        info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
        info.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
      genres: info.categories ?? [],
      publishedDate: info.publishedDate,
      pageCount: info.pageCount,
      googleBooksId: volume.id,
    });
  };

  const handleSetReadStatus = async (book: Book, status: ReadStatus) => {
    try {
      const updated = await booksApi.update(book.id, { readStatus: status });
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      if (selectedBook?.id === book.id) setSelectedBook(updated);
      const labels: Record<ReadStatus, string> = { read: 'read', reading: 'currently reading', unread: 'unread' };
      showToast(`Marked "${book.title}" as ${labels[status]}`);
    } catch {
      showToast('Failed to update book', 'error');
    }
  };

  const handleRate = async (book: Book, rating: number) => {
    try {
      const updated = await booksApi.update(book.id, { userRating: rating });
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      if (selectedBook?.id === book.id) setSelectedBook(updated);
    } catch {
      showToast('Failed to update rating', 'error');
    }
  };

  const handleRemove = async (book: Book) => {
    try {
      await booksApi.remove(book.id);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      if (selectedBook?.id === book.id) setSelectedBook(null);
      showToast(`Removed "${book.title}"`);
    } catch {
      showToast('Failed to remove book', 'error');
    }
  };

  const handleUpdateGoal = async (target: number) => {
    try {
      const updated = await goalsApi.update(target);
      setGoal(updated);
    } catch {
      showToast('Failed to update goal', 'error');
    }
  };

  const handleUpdateNotes = async (book: Book, notes: string) => {
    try {
      const updated = await booksApi.update(book.id, { notes });
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      if (selectedBook?.id === book.id) setSelectedBook(updated);
    } catch {
      showToast('Failed to save notes', 'error');
    }
  };

  const handleRefreshBook = async (book: Book, volume: GoogleBooksVolume) => {
    try {
      const info = volume.volumeInfo;
      const cover =
        info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
        info.imageLinks?.smallThumbnail?.replace('http://', 'https://');
      const updates: Partial<Book> = {};
      if (cover) updates.coverImage = cover;
      if (info.description) updates.description = info.description;
      if (info.categories?.length) updates.genres = info.categories;
      if (info.publishedDate) updates.publishedDate = info.publishedDate;
      if (info.pageCount) updates.pageCount = info.pageCount;
      if (volume.id) updates.googleBooksId = volume.id;
      const updated = await booksApi.update(book.id, updates);
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      if (selectedBook?.id === book.id) setSelectedBook(updated);
      showToast(`Updated cover for "${book.title}"`);
    } catch {
      showToast('Failed to update cover', 'error');
    }
  };

  const handleUpdateDateRead = async (book: Book, dateRead: string | undefined) => {
    try {
      const updated = await booksApi.update(book.id, { dateRead });
      setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
      if (selectedBook?.id === book.id) setSelectedBook(updated);
    } catch {
      showToast('Failed to update date', 'error');
    }
  };

  const handleSearchResult = (results: GoogleBooksVolume[]) => {
    setSearchResults(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-navy-900">
      <Header
        libraryCount={books.length}
        readCount={readCount}
        onSearchResult={handleSearchResult}
        onClearSearch={handleClearSearch}
        isSearching={isSearching}
      />

      <HeroSection
        libraryCount={books.length}
        readCount={readCount}
        booksReadThisYear={booksReadThisYear}
        goal={goal}
        onUpdateGoal={handleUpdateGoal}
        onAskAI={(msg) => setAiMessage(msg)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

        {/* Recommendation Carousel */}
        {!isSearching && (
          <RecommendationCarousel
            books={books}
            onAddVolume={handleAddVolume}
            onClickVolume={setSelectedVolume}
          />
        )}

        {/* Search Results Section */}
        {isSearching && (
          <section className="mb-10 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title">Search Results</h2>
                <p className="text-sm text-slate-500">{searchResults.length} books found</p>
              </div>
              <button onClick={handleClearSearch} className="btn-secondary flex items-center gap-1.5 text-sm">
                <X size={14} /> Clear
              </button>
            </div>
            {searchResults.length === 0 ? (
              <p className="text-slate-500 text-sm">No results found. Try a different search.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {searchResults.map((vol) => (
                  <SearchBookCard
                    key={vol.id}
                    volume={vol}
                    isInLibrary={libraryGoogleIds.has(vol.id)}
                    onAdd={handleAddVolume}
                    onClick={setSelectedVolume}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Library Section */}
        <section>
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="section-title">My Library</h2>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-500">
                  {filteredBooks.length} of {books.length} books
                </p>
                {enriching && (
                  <span className="flex items-center gap-1 text-xs text-blue-400">
                    <Loader2 size={11} className="animate-spin" />
                    Fetching covers…
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter */}
              <div className="flex items-center bg-navy-800 border border-slate-700/50 rounded-lg overflow-hidden">
                {(['all', 'read', 'reading', 'unread'] as FilterMode[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      filter === f
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f === 'reading' ? 'Reading' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Genre filter */}
              {allGenres.length > 0 && (
                <div className="relative">
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="appearance-none bg-navy-800 border border-slate-700/50 text-slate-400 text-xs px-3 pr-7 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">All Genres</option>
                    {allGenres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" size={12} />
                </div>
              )}

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortMode)}
                  className="appearance-none bg-navy-800 border border-slate-700/50 text-slate-400 text-xs px-3 pr-7 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="recent">Recent</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" size={12} />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-navy-800 border border-slate-700/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <List size={14} />
                </button>
              </div>

              {/* Add Book */}
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center gap-1.5 text-xs"
              >
                <Plus size={13} /> Add Book
              </button>
            </div>
          </div>

          {/* Book Grid / List */}
          {loading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' : 'grid-cols-1'}`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="book-card">
                  <div className="skeleton" style={{ aspectRatio: '2/3' }} />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-3 rounded w-3/4" />
                    <div className="skeleton h-2 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="text-slate-600" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-slate-400 mb-2">
                {books.length === 0 ? 'Your library is empty' : 'No books match your filters'}
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mb-6">
                {books.length === 0
                  ? 'Search for books above, ask BookBot for recommendations, or add one manually.'
                  : 'Try adjusting your filters.'}
              </p>
              {books.length === 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setAiMessage('Recommend me some great books to start my library')}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Ask BookBot
                  </button>
                  <button onClick={() => setShowAddForm(true)} className="btn-secondary flex items-center gap-2">
                    <Plus size={14} /> Add Manually
                  </button>
                </div>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredBooks.map((book) => (
                <LibraryBookCard
                  key={book.id}
                  book={book}
                  onSetStatus={handleSetReadStatus}
                  onRate={handleRate}
                  onRemove={handleRemove}
                  onClick={setSelectedBook}
                />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-2">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-navy-800 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:border-slate-600 transition-colors cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{book.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{book.author}</p>
                    {book.genres.length > 0 && (
                      <p className="text-xs text-slate-600 truncate mt-0.5">{book.genres.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={{ read: 'badge-read', reading: 'badge-reading', unread: 'badge-unread' }[book.readStatus]}>
                      {{ read: '✓ Read', reading: '📖 Reading', unread: 'Unread' }[book.readStatus]}
                    </span>
                    {book.userRating && (
                      <span className="text-amber-400 text-xs font-medium">★ {book.userRating}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {selectedBook && (
        <LibraryBookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSetStatus={handleSetReadStatus}
          onRate={handleRate}
          onRemove={handleRemove}
          onUpdateDateRead={handleUpdateDateRead}
          onUpdateNotes={handleUpdateNotes}
          onRefresh={handleRefreshBook}
        />
      )}

      {selectedVolume && (
        <SearchVolumeModal
          volume={selectedVolume}
          isInLibrary={libraryGoogleIds.has(selectedVolume.id)}
          onClose={() => setSelectedVolume(null)}
          onAdd={handleAddVolume}
        />
      )}

      {showAddForm && (
        <AddBookForm onAdd={handleAddBook} onClose={() => setShowAddForm(false)} />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl animate-slide-up ${
          toast.type === 'success'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          {toast.text}
        </div>
      )}

      {/* AI Chat */}
      <AIChat
        onLibraryUpdate={loadBooks}
        initialMessage={aiMessage}
        onInitialMessageUsed={() => setAiMessage(undefined)}
      />
    </div>
  );
}
