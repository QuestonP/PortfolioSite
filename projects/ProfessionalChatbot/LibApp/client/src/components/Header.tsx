import React, { useState } from 'react';
import { BookOpen, Search, Library, Sparkles, X } from 'lucide-react';
import type { GoogleBooksVolume } from '../types';
import { booksApi } from '../api';

interface HeaderProps {
  libraryCount: number;
  readCount: number;
  onSearchResult: (books: GoogleBooksVolume[]) => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  libraryCount,
  readCount,
  onSearchResult,
  onClearSearch,
  isSearching,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await booksApi.searchWeb(query);
      onSearchResult(results);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onClearSearch();
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-800/95 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-serif text-xl font-semibold text-white hidden sm:block">
              Lib<span className="text-blue-400">App</span>
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search
                className="absolute left-3 text-slate-400 pointer-events-none"
                size={16}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books by title, author, genre..."
                className="w-full bg-navy-900 border border-slate-600 rounded-lg pl-9 pr-20 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              {isSearching && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-14 text-slate-400 hover:text-slate-200 p-1"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-1.5 btn-primary text-xs px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Nav Items */}
          <nav className="flex items-center gap-1 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1.5 bg-navy-900/60 border border-slate-700/50 rounded-lg px-3 py-1.5">
              <Library className="text-blue-400" size={15} />
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-white">{libraryCount}</span>{' '}
                <span className="hidden lg:inline">books</span>
              </span>
              {libraryCount > 0 && (
                <>
                  <span className="text-slate-600 mx-0.5">·</span>
                  <span className="text-sm text-emerald-400 font-medium">{readCount} read</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-1.5">
              <Sparkles className="text-blue-400" size={15} />
              <span className="text-sm text-blue-300 hidden sm:inline font-medium">AI Bot</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
