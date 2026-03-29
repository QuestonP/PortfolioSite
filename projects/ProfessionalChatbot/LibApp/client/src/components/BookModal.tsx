import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, BookOpen, Bookmark, Calendar, Hash, Check, Trash2, Tag, NotebookPen, RefreshCw, Search, ArrowLeft, Loader2 } from 'lucide-react';
import type { Book, ReadStatus, GoogleBooksVolume } from '../types';
import { booksApi } from '../api';
import { StarRating } from './StarRating';

const STATUS_OPTIONS: Array<{ status: ReadStatus; label: string; icon: React.ReactNode; activeClass: string }> = [
  { status: 'unread',  label: 'Unread',  icon: <BookOpen size={13} />, activeClass: 'bg-slate-600 text-white border-slate-500' },
  { status: 'reading', label: 'Reading', icon: <Bookmark size={13} />, activeClass: 'bg-amber-500 text-white border-amber-400' },
  { status: 'read',    label: 'Read',    icon: <Check size={13} />,    activeClass: 'bg-emerald-500 text-white border-emerald-400' },
];

const BADGE_CLASS: Record<ReadStatus, string> = {
  unread: 'badge-unread',
  reading: 'badge-reading',
  read: 'badge-read',
};

const BADGE_LABEL: Record<ReadStatus, string> = {
  unread: 'Unread',
  reading: '📖 Reading',
  read: '✓ Read',
};

// ─── Date Picker ─────────────────────────────────────────────────────────────
function DatePicker({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (iso: string | undefined) => void;
}) {
  const dayRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const fromIso = (iso: string | undefined) => {
    if (!iso) return { m: '', d: '', y: '' };
    const date = new Date(iso);
    return {
      m: String(date.getMonth() + 1).padStart(2, '0'),
      d: String(date.getDate()).padStart(2, '0'),
      y: String(date.getFullYear()),
    };
  };

  const initial = fromIso(value);
  const [m, setM] = useState(initial.m);
  const [d, setD] = useState(initial.d);
  const [y, setY] = useState(initial.y);

  useEffect(() => {
    const parts = fromIso(value);
    setM(parts.m);
    setD(parts.d);
    setY(parts.y);
  }, [value]);

  const tryCommit = useCallback((month: string, day: string, year: string) => {
    if (!month && !day && !year) { onChange(undefined); return; }
    const mNum = parseInt(month, 10);
    const dNum = parseInt(day, 10);
    const yNum = parseInt(year, 10);
    if (mNum >= 1 && mNum <= 12 && dNum >= 1 && dNum <= 31 && yNum >= 1900 && yNum <= 2099) {
      const date = new Date(`${yNum}-${String(mNum).padStart(2, '0')}-${String(dNum).padStart(2, '0')}T12:00:00`);
      if (!isNaN(date.getTime())) onChange(date.toISOString());
    }
  }, [onChange]);

  const inputClass =
    'bg-navy-900 border border-slate-600 hover:border-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 text-sm text-center py-2 rounded-lg focus:outline-none transition-colors';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex flex-col items-center gap-0.5">
        <input
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={m}
          placeholder="MM"
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 2);
            setM(v);
            if (v.length === 2) dayRef.current?.focus();
          }}
          onBlur={() => tryCommit(m, d, y)}
          className={`w-12 ${inputClass}`}
        />
        <span className="text-xs text-slate-600">month</span>
      </div>
      <span className="text-slate-500 font-medium mb-3">/</span>
      <div className="flex flex-col items-center gap-0.5">
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          value={d}
          placeholder="DD"
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 2);
            setD(v);
            if (v.length === 2) yearRef.current?.focus();
          }}
          onBlur={() => tryCommit(m, d, y)}
          className={`w-12 ${inputClass}`}
        />
        <span className="text-xs text-slate-600">day</span>
      </div>
      <span className="text-slate-500 font-medium mb-3">/</span>
      <div className="flex flex-col items-center gap-0.5">
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          maxLength={4}
          value={y}
          placeholder="YYYY"
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 4);
            setY(v);
          }}
          onBlur={() => tryCommit(m, d, y)}
          className={`w-16 ${inputClass}`}
        />
        <span className="text-xs text-slate-600">year</span>
      </div>
    </div>
  );
}

interface LibraryBookModalProps {
  book: Book;
  onClose: () => void;
  onSetStatus: (book: Book, status: ReadStatus) => void;
  onRate: (book: Book, rating: number) => void;
  onRemove: (book: Book) => void;
  onUpdateDateRead: (book: Book, dateRead: string | undefined) => void;
  onUpdateNotes: (book: Book, notes: string) => void;
  onRefresh: (book: Book, volume: GoogleBooksVolume) => Promise<void>;
}

export const LibraryBookModal: React.FC<LibraryBookModalProps> = ({
  book,
  onClose,
  onSetStatus,
  onRate,
  onRemove,
  onUpdateDateRead,
  onUpdateNotes,
  onRefresh,
}) => {
  const [imgError, setImgError] = useState(false);
  const [pickingCover, setPickingCover] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [coverResults, setCoverResults] = useState<GoogleBooksVolume[]>([]);
  const [coverSearching, setCoverSearching] = useState(false);

  const startPickCover = async () => {
    const q = `${book.title} ${book.author}`;
    setSearchQuery(q);
    setPickingCover(true);
    setCoverSearching(true);
    try {
      const results = await booksApi.searchWeb(q);
      setCoverResults(results);
    } catch {
      setCoverResults([]);
    }
    setCoverSearching(false);
  };

  const handleCoverSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setCoverSearching(true);
    try {
      const results = await booksApi.searchWeb(searchQuery);
      setCoverResults(results);
    } catch {
      setCoverResults([]);
    }
    setCoverSearching(false);
  };

  const handlePickVolume = async (volume: GoogleBooksVolume) => {
    await onRefresh(book, volume);
    setPickingCover(false);
  };
  const [notes, setNotes] = useState(book.notes ?? '');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync notes if the book prop changes (e.g. after external update)
  useEffect(() => { setNotes(book.notes ?? ''); }, [book.notes]);

  const handleNotesBlur = () => {
    if (notes === (book.notes ?? '')) return;
    onUpdateNotes(book, notes);
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
  };

  if (pickingCover) {
    return (
      <ModalWrapper onClose={onClose}>
        <div>
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setPickingCover(false)}
              className="p-1.5 rounded-lg hover:bg-navy-700 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-serif text-xl font-semibold text-white">Pick a New Cover</h2>
              <p className="text-sm text-slate-500">{book.title}</p>
            </div>
          </div>
          <form onSubmit={handleCoverSearch} className="flex gap-2 mb-5">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for book…"
              className="flex-1 bg-navy-900 border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-200 text-sm px-3 py-2 rounded-lg focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={coverSearching}
              className="btn-primary px-4 flex items-center gap-2"
            >
              {coverSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              Search
            </button>
          </form>
          {coverSearching ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-blue-400" />
            </div>
          ) : coverResults.length === 0 ? (
            <p className="text-center text-slate-500 text-sm py-8">No results. Try a different search.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-80 overflow-y-auto pr-1">
              {coverResults.map((vol) => {
                const info = vol.volumeInfo;
                const cover =
                  info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
                  info.imageLinks?.smallThumbnail?.replace('http://', 'https://');
                if (!cover) return null;
                return (
                  <button key={vol.id} onClick={() => handlePickVolume(vol)} className="group text-left">
                    <div className="rounded overflow-hidden shadow-lg aspect-[2/3] hover:ring-2 hover:ring-blue-500 transition-all">
                      <img src={cover} alt={info.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-300 line-clamp-2 transition-colors">
                      {info.title}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex gap-6">
        {/* Cover */}
        <div className="flex-shrink-0 w-36 md:w-44">
          <div
            className="rounded-lg overflow-hidden shadow-2xl"
            style={{ aspectRatio: '2/3' }}
          >
            {!imgError ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                <BookOpen className="text-blue-400" size={40} />
              </div>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {/* Reading status segmented control */}
            <div className="flex gap-1">
              {STATUS_OPTIONS.map(({ status, label, icon, activeClass }) => (
                <button
                  key={status}
                  onClick={() => onSetStatus(book, status)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    book.readStatus === status
                      ? activeClass
                      : 'bg-navy-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={startPickCover}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg bg-navy-900 text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-500 transition-all"
            >
              <RefreshCw size={14} />
              Refresh Cover
            </button>
            <button
              onClick={() => { onRemove(book); onClose(); }}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white leading-tight">
                {book.title}
              </h2>
              <p className="text-blue-400 mt-1 font-medium">{book.author}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-navy-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={BADGE_CLASS[book.readStatus]}>
              {BADGE_LABEL[book.readStatus]}
            </span>
            {book.publishedDate && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={11} /> {book.publishedDate.slice(0, 4)}
              </span>
            )}
            {book.pageCount && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Hash size={11} /> {book.pageCount} pages
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500">Your rating:</span>
            <StarRating rating={book.userRating} onRate={(r) => onRate(book, r)} size={16} />
            {book.userRating && (
              <span className="text-amber-400 text-sm font-medium">{book.userRating}/5</span>
            )}
          </div>

          {/* Genres */}
          {book.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {book.genres.map((g) => (
                <span
                  key={g}
                  className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full"
                >
                  <Tag size={9} />
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-6">
            {book.description}
          </p>

          {/* Notes */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <NotebookPen size={12} />
                My Notes
              </label>
              {saved && <span className="text-xs text-emerald-400 animate-fade-in">Saved</span>}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add your thoughts, quotes, or takeaways…"
              rows={4}
              className="w-full bg-navy-900 border border-slate-700 hover:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-300 placeholder-slate-600 rounded-lg px-3 py-2 resize-none focus:outline-none transition-colors"
            />
          </div>

          {/* Dates */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
            <span className="text-xs text-slate-600">Added: {new Date(book.dateAdded).toLocaleDateString()}</span>

            {book.readStatus === 'read' && (
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-2">Date read</span>
                <div className="flex flex-wrap items-center gap-3">
                  <DatePicker
                    value={book.dateRead}
                    onChange={(iso) => onUpdateDateRead(book, iso)}
                  />
                  <div className="flex items-center gap-1.5 mb-3">
                    <button
                      onClick={() => onUpdateDateRead(book, new Date().toISOString())}
                      className="text-xs px-2.5 py-2 rounded-lg bg-navy-900 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        onUpdateDateRead(book, yesterday.toISOString());
                      }}
                      className="text-xs px-2.5 py-2 rounded-lg bg-navy-900 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors"
                    >
                      Yesterday
                    </button>
                    {book.dateRead && (
                      <button
                        onClick={() => onUpdateDateRead(book, undefined)}
                        className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                {book.dateRead && (
                  <p className="text-xs text-slate-600 -mt-1">
                    {new Date(book.dateRead).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

// ─── Search Volume Modal ────────────────────────────────────────────────────
interface SearchVolumeModalProps {
  volume: GoogleBooksVolume;
  isInLibrary: boolean;
  onClose: () => void;
  onAdd: (volume: GoogleBooksVolume) => void;
}

export const SearchVolumeModal: React.FC<SearchVolumeModalProps> = ({
  volume,
  isInLibrary,
  onClose,
  onAdd,
}) => {
  const [imgError, setImgError] = useState(false);
  const info = volume.volumeInfo;
  const cover =
    info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
    info.imageLinks?.smallThumbnail?.replace('http://', 'https://');

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex gap-6">
        <div className="flex-shrink-0 w-36 md:w-44">
          <div
            className="rounded-lg overflow-hidden shadow-2xl"
            style={{ aspectRatio: '2/3' }}
          >
            {cover && !imgError ? (
              <img
                src={cover}
                alt={info.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                <BookOpen className="text-blue-400" size={40} />
              </div>
            )}
          </div>

          <button
            onClick={() => { onAdd(volume); onClose(); }}
            disabled={isInLibrary}
            className={`w-full mt-3 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-all ${
              isInLibrary
                ? 'bg-navy-700 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'btn-primary'
            }`}
          >
            {isInLibrary ? (
              <><Check size={14} /> In Library</>
            ) : (
              <>+ Add to Library</>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white leading-tight">
                {info.title}
              </h2>
              <p className="text-blue-400 mt-1 font-medium">
                {(info.authors ?? ['Unknown Author']).join(', ')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-navy-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {info.publishedDate && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar size={11} /> {info.publishedDate.slice(0, 4)}
              </span>
            )}
            {info.pageCount && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Hash size={11} /> {info.pageCount} pages
              </span>
            )}
          </div>

          {info.categories && info.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {info.categories.map((g) => (
                <span
                  key={g}
                  className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full"
                >
                  <Tag size={9} /> {g}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm text-slate-400 leading-relaxed line-clamp-8">
            {info.description ?? 'No description available.'}
          </p>
        </div>
      </div>
    </ModalWrapper>
  );
};

// ─── Modal Wrapper ──────────────────────────────────────────────────────────
const ModalWrapper: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    onClick={onClose}
  >
    <div
      className="bg-navy-800 border border-slate-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);
