import React, { useState } from 'react';
import { Plus, Check, BookOpen, Bookmark, Trash2 } from 'lucide-react';
import type { Book, ReadStatus, GoogleBooksVolume } from '../types';
import { StarRating } from './StarRating';

const STATUS_CONFIG: Record<ReadStatus, { label: string; badgeClass: string; icon: React.ReactNode; activeClass: string }> = {
  unread:  { label: 'Unread',  badgeClass: 'badge-unread',  icon: <BookOpen size={14} />, activeClass: 'bg-slate-600 text-white' },
  reading: { label: 'Reading', badgeClass: 'badge-reading', icon: <Bookmark size={14} />, activeClass: 'bg-amber-500 text-white' },
  read:    { label: 'Read',    badgeClass: 'badge-read',    icon: <Check size={14} />,    activeClass: 'bg-emerald-500 text-white' },
};

interface LibraryBookCardProps {
  book: Book;
  onSetStatus: (book: Book, status: ReadStatus) => void;
  onRate: (book: Book, rating: number) => void;
  onRemove: (book: Book) => void;
  onClick: (book: Book) => void;
}

export const LibraryBookCard: React.FC<LibraryBookCardProps> = ({
  book,
  onSetStatus,
  onRate,
  onRemove,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const cfg = STATUS_CONFIG[book.readStatus];

  return (
    <div className="book-card group relative flex flex-col">
      {/* Cover */}
      <div
        className="relative cursor-pointer overflow-hidden bg-navy-900"
        style={{ aspectRatio: '2/3' }}
        onClick={() => onClick(book)}
      >
        {!imgError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-navy-700 to-navy-900">
            <BookOpen className="text-blue-400 mb-2" size={32} />
            <p className="text-xs text-slate-400 text-center line-clamp-3">{book.title}</p>
          </div>
        )}

        {/* Status corner badge */}
        {book.readStatus === 'read' && (
          <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
            <Check size={10} className="text-white" />
          </div>
        )}
        {book.readStatus === 'reading' && (
          <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1 shadow-lg">
            <Bookmark size={10} className="text-white" />
          </div>
        )}

        {/* Hover overlay — three status buttons + remove */}
        <div className="absolute inset-0 bg-navy-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <div className="flex gap-1.5">
            {(Object.keys(STATUS_CONFIG) as ReadStatus[]).map((s) => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); onSetStatus(book, s); }}
                className={`p-2 rounded-full transition-all ${
                  book.readStatus === s
                    ? STATUS_CONFIG[s].activeClass
                    : 'bg-navy-800/80 text-slate-400 hover:bg-navy-700'
                }`}
                title={STATUS_CONFIG[s].label}
              >
                {STATUS_CONFIG[s].icon}
              </button>
            ))}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(book); }}
            className="p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-all"
            title="Remove from library"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3
          className="text-sm font-semibold text-white line-clamp-2 cursor-pointer hover:text-blue-300 transition-colors leading-snug"
          onClick={() => onClick(book)}
        >
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{book.author}</p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className={cfg.badgeClass}>
            {cfg.label}
          </span>
          <StarRating rating={book.userRating} onRate={(r) => onRate(book, r)} size={12} />
        </div>
      </div>
    </div>
  );
};

// ─── Search Result Card ─────────────────────────────────────────────────────
interface SearchBookCardProps {
  volume: GoogleBooksVolume;
  isInLibrary: boolean;
  onAdd: (volume: GoogleBooksVolume) => void;
  onClick: (volume: GoogleBooksVolume) => void;
}

export const SearchBookCard: React.FC<SearchBookCardProps> = ({
  volume,
  isInLibrary,
  onAdd,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);
  const info = volume.volumeInfo;
  const cover =
    info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
    info.imageLinks?.smallThumbnail?.replace('http://', 'https://');

  return (
    <div className="book-card group relative flex flex-col">
      <div
        className="relative cursor-pointer overflow-hidden bg-navy-900"
        style={{ aspectRatio: '2/3' }}
        onClick={() => onClick(volume)}
      >
        {cover && !imgError ? (
          <img
            src={cover}
            alt={info.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-navy-700 to-navy-900">
            <BookOpen className="text-blue-400 mb-2" size={32} />
            <p className="text-xs text-slate-400 text-center line-clamp-3">{info.title}</p>
          </div>
        )}

        {isInLibrary && (
          <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-lg">
            <Check size={10} className="text-white" />
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3
          className="text-sm font-semibold text-white line-clamp-2 cursor-pointer hover:text-blue-300 transition-colors leading-snug"
          onClick={() => onClick(volume)}
        >
          {info.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
          {(info.authors ?? ['Unknown']).join(', ')}
        </p>
        {info.publishedDate && (
          <p className="text-xs text-slate-600 mt-0.5">{info.publishedDate.slice(0, 4)}</p>
        )}

        <div className="mt-auto pt-2">
          <button
            onClick={() => onAdd(volume)}
            disabled={isInLibrary}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-all ${
              isInLibrary
                ? 'bg-navy-700 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'btn-primary'
            }`}
          >
            {isInLibrary ? (
              <>
                <Check size={12} /> In Library
              </>
            ) : (
              <>
                <Plus size={12} /> Add to Library
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
