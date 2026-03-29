import React, { useState } from 'react';
import { Sparkles, TrendingUp, Target, Pencil, Check, X } from 'lucide-react';
import type { ReadingGoal } from '../types';

interface HeroSectionProps {
  libraryCount: number;
  readCount: number;
  booksReadThisYear: number;
  goal: ReadingGoal | null;
  onUpdateGoal: (target: number) => void;
  onAskAI: (message: string) => void;
}

const suggestions = [
  'Recommend me a mystery novel',
  'Find books similar to Harry Potter',
  'What should I read next?',
  'Add "The Midnight Library" to my library',
];

function GoalWidget({
  booksReadThisYear,
  goal,
  onUpdateGoal,
}: {
  booksReadThisYear: number;
  goal: ReadingGoal | null;
  onUpdateGoal: (target: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const target = goal?.target ?? 0;
  const year = goal?.year ?? new Date().getFullYear();

  const startEdit = () => {
    setInputVal(target > 0 ? String(target) : '');
    setEditing(true);
  };

  const commitEdit = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 0) onUpdateGoal(n);
    setEditing(false);
  };

  const cancelEdit = () => setEditing(false);

  const pct = target > 0 ? Math.min(100, Math.round((booksReadThisYear / target) * 100)) : 0;

  if (target === 0) {
    return (
      <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-700/50">
        <Target size={16} className="text-slate-500 flex-shrink-0" />
        {editing ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Set {year} goal:</span>
            <input
              autoFocus
              type="number"
              min={1}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-16 bg-navy-900 border border-blue-500 text-white text-sm px-2 py-0.5 rounded focus:outline-none"
              placeholder="12"
            />
            <span className="text-xs text-slate-400">books</span>
            <button onClick={commitEdit} className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
            <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-300"><X size={14} /></button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="text-xs text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            Set a {year} reading goal
            <Pencil size={11} />
          </button>
        )}
      </div>
    );
  }

  const remaining = Math.max(0, target - booksReadThisYear);

  return (
    <div className="mt-6 pt-6 border-t border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-blue-400" />
          <span className="text-xs font-medium text-slate-400">{year} Reading Goal</span>
        </div>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              type="number"
              min={0}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-14 bg-navy-900 border border-blue-500 text-white text-xs px-1.5 py-0.5 rounded focus:outline-none"
            />
            <button onClick={commitEdit} className="text-emerald-400 hover:text-emerald-300"><Check size={12} /></button>
            <button onClick={cancelEdit} className="text-slate-500 hover:text-slate-300"><X size={12} /></button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors"
          >
            <span className="font-semibold text-white">{booksReadThisYear}</span>
            <span className="text-slate-500">/ {target}</span>
            <Pencil size={10} className="ml-1" />
          </button>
        )}
      </div>
      <div className="w-full bg-navy-900 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-emerald-400' : 'bg-blue-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-600 mt-1.5">
        {pct >= 100
          ? '🎉 Goal reached!'
          : `${remaining} book${remaining !== 1 ? 's' : ''} to go · ${pct}%`}
      </p>
    </div>
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  libraryCount,
  readCount,
  booksReadThisYear,
  goal,
  onUpdateGoal,
  onAskAI,
}) => {
  const unread = libraryCount - readCount;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 border-b border-slate-700/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium px-3 py-1 rounded-full">
                <Sparkles size={12} />
                AI-Powered Library
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-white leading-tight">
              Your Personal
              <br />
              <span className="text-blue-400">Book Universe</span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg max-w-lg">
              Track what you've read, discover what to read next — with an AI assistant that knows your taste.
            </p>

            {/* Stats */}
            {libraryCount > 0 && (
              <div className="flex gap-6 mt-6">
                <div>
                  <div className="text-2xl font-bold text-white">{libraryCount}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Total Books</div>
                </div>
                <div className="w-px bg-slate-700" />
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{readCount}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Books Read</div>
                </div>
                <div className="w-px bg-slate-700" />
                <div>
                  <div className="text-2xl font-bold text-blue-400">{unread}</div>
                  <div className="text-xs text-slate-500 mt-0.5">To Read</div>
                </div>
              </div>
            )}

            {/* Goal widget */}
            <GoalWidget
              booksReadThisYear={booksReadThisYear}
              goal={goal}
              onUpdateGoal={onUpdateGoal}
            />
          </div>

          {/* AI Suggestions Card */}
          <div className="w-full lg:w-80 xl:w-96">
            <div className="bg-navy-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">BookBot</p>
                  <p className="text-xs text-slate-500">Ask me anything about books</p>
                </div>
                <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>

              <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">
                Quick suggestions
              </p>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => onAskAI(s)}
                    className="w-full text-left text-sm text-slate-300 bg-navy-900/60 hover:bg-navy-700/60 border border-slate-700/50 hover:border-blue-500/30 px-3 py-2.5 rounded-lg transition-all hover:text-blue-300 flex items-center gap-2"
                  >
                    <TrendingUp size={12} className="text-blue-400 flex-shrink-0" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
