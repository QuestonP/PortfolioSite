import { useApp } from '../../context/AppContext'

export function Header() {
  const { currentStreak, isCheckedInToday } = useApp()

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          StudyStreak
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
          currentStreak > 0
            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            : 'bg-gray-800 text-gray-500 border border-gray-700'
        }`}>
          <span>🔥</span>
          <span>{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span>
        </div>
        {isCheckedInToday && (
          <div className="flex items-center gap-1 text-green-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </header>
  )
}
