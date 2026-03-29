import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, RefreshCw, BookOpen, Plus, Check } from 'lucide-react';
import type { Book, GoogleBooksVolume } from '../types';

interface RecommendationCarouselProps {
  books: Book[];
  onAddVolume: (volume: GoogleBooksVolume) => Promise<void>;
  onClickVolume: (volume: GoogleBooksVolume) => void;
}

// ─── Mini card (same look as SearchBookCard, fixed width for carousel) ────────
function RecoCard({
  volume,
  isInLibrary,
  onAdd,
  onClick,
}: {
  volume: GoogleBooksVolume;
  isInLibrary: boolean;
  onAdd: (v: GoogleBooksVolume) => void;
  onClick: (v: GoogleBooksVolume) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const info = volume.volumeInfo;
  const cover =
    info.imageLinks?.thumbnail?.replace('http://', 'https://') ??
    info.imageLinks?.smallThumbnail?.replace('http://', 'https://');

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInLibrary || adding) return;
    setAdding(true);
    await onAdd(volume);
    setAdding(false);
  };

  return (
    <div className="book-card group relative flex flex-col flex-shrink-0" style={{ width: '148px' }}>
      {/* Cover */}
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
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-navy-700 to-navy-900">
            <BookOpen className="text-blue-400 mb-2" size={28} />
            <p className="text-xs text-slate-400 text-center line-clamp-3 leading-tight">{info.title}</p>
          </div>
        )}

        {isInLibrary && (
          <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-lg">
            <Check size={9} className="text-white" />
          </div>
        )}

        {/* Quick-add hover overlay */}
        {!isInLibrary && (
          <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg"
            >
              <Plus size={11} />
              {adding ? 'Adding…' : 'Add'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col flex-1">
        <h3
          className="text-xs font-semibold text-white line-clamp-2 cursor-pointer hover:text-blue-300 transition-colors leading-snug"
          onClick={() => onClick(volume)}
        >
          {info.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
          {(info.authors ?? ['Unknown']).join(', ')}
        </p>
        {info.publishedDate && (
          <p className="text-xs text-slate-700 mt-0.5">{info.publishedDate.slice(0, 4)}</p>
        )}

        <div className="mt-auto pt-2">
          <button
            onClick={handleAdd}
            disabled={isInLibrary || adding}
            className={`w-full flex items-center justify-center gap-1 text-xs font-medium py-1.5 rounded-lg transition-all ${
              isInLibrary
                ? 'bg-navy-700 text-slate-500 cursor-not-allowed border border-slate-700'
                : adding
                ? 'bg-blue-700 text-blue-200 cursor-wait'
                : 'btn-primary'
            }`}
          >
            {isInLibrary ? (
              <><Check size={11} /> In Library</>
            ) : adding ? (
              'Adding…'
            ) : (
              <><Plus size={11} /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="book-card flex-shrink-0" style={{ width: '148px' }}>
      <div className="skeleton" style={{ aspectRatio: '2/3' }} />
      <div className="p-2.5 space-y-2">
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-2 rounded w-2/3" />
        <div className="skeleton h-6 rounded w-full mt-3" />
      </div>
    </div>
  );
}

// ─── Main carousel ────────────────────────────────────────────────────────────
export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  books,
  onAddVolume,
  onClickVolume,
}) => {
  const [recommendations, setRecommendations] = useState<GoogleBooksVolume[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const libraryGoogleIds = new Set(books.map((b) => b.googleBooksId).filter(Boolean));

  const loadRecommendations = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/recommendations?page=${p}`);
      const data = (await res.json()) as GoogleBooksVolume[];
      setRecommendations(Array.isArray(data) ? data : []);
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecommendations(0);
  }, [loadRecommendations]);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -480 : 480, behavior: 'smooth' });
  };

  if (!loading && recommendations.length === 0) return null;

  return (
    <section className="mb-10 animate-slide-up">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-400" />
          <h2 className="section-title">Recommended for You</h2>
          {!loading && (
            <span className="text-xs text-slate-600 ml-1">
              · {recommendations.length} picks
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              void loadRecommendations(next);
              scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-navy-700 transition-colors"
            title="Refresh recommendations"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-lg transition-colors ${
              canScrollLeft
                ? 'text-slate-400 hover:text-white hover:bg-navy-700'
                : 'text-slate-700 cursor-not-allowed'
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight && !loading}
            className={`p-1.5 rounded-lg transition-colors ${
              canScrollRight || loading
                ? 'text-slate-400 hover:text-white hover:bg-navy-700'
                : 'text-slate-700 cursor-not-allowed'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-navy-900 to-transparent z-10 pointer-events-none rounded-l-lg" />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-navy-900 to-transparent z-10 pointer-events-none rounded-r-lg" />
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="carousel-scroll flex gap-3 overflow-x-auto pb-2"
        >

          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            : recommendations.map((vol) => (
                <RecoCard
                  key={vol.id}
                  volume={vol}
                  isInLibrary={libraryGoogleIds.has(vol.id)}
                  onAdd={onAddVolume}
                  onClick={onClickVolume}
                />
              ))}
        </div>
      </div>
    </section>
  );
};
