import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { StreakMilestone } from './StreakMilestone'
import { getLast30Days } from '../../utils/streakUtils'
import { formatDisplay, formatShort, isDateToday } from '../../utils/dateUtils'

function StreakRing({ streak }) {
  const max = Math.max(streak, 10)
  const pct = Math.min(streak / max, 1)
  const r = 52
  const circ = 2 * Math.PI * r
  const dashOffset = circ - pct * circ

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke={streak > 0 ? '#f97316' : '#374151'}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-4xl font-black text-white">{streak}</div>
        <div className="text-xs text-gray-400 font-medium">days</div>
      </div>
    </div>
  )
}

function HeatmapDot({ date, isChecked }) {
  const isToday = isDateToday(date)
  return (
    <div
      title={formatDisplay(date)}
      className={`w-5 h-5 rounded-sm transition-all ${
        isToday
          ? isChecked
            ? 'bg-orange-400 ring-2 ring-orange-300 ring-offset-1 ring-offset-gray-900'
            : 'bg-gray-700 ring-2 ring-gray-500 ring-offset-1 ring-offset-gray-900'
          : isChecked
          ? 'bg-orange-500/80'
          : 'bg-gray-800'
      }`}
    />
  )
}

export function CheckInView() {
  const {
    checkins, isCheckedInToday, currentStreak, longestStreak,
    totalStudyDays, checkIn, milestone, streakBroken, lastCheckinDate,
  } = useApp()

  const [showMilestone, setShowMilestone] = useState(false)
  const [justCheckedIn, setJustCheckedIn] = useState(false)
  const last30 = getLast30Days()
  const checkinSet = new Set(checkins.map(c => c.date))

  const handleCheckIn = () => {
    checkIn()
    setJustCheckedIn(true)
    setTimeout(() => {
      if (milestone) setShowMilestone(true)
    }, 300)
  }

  useEffect(() => {
    if (milestone && isCheckedInToday && justCheckedIn) {
      setShowMilestone(true)
    }
  }, [milestone, isCheckedInToday, justCheckedIn])

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {showMilestone && (
        <StreakMilestone milestone={milestone} onDismiss={() => setShowMilestone(false)} />
      )}

      {/* Streak broken warning */}
      {streakBroken && lastCheckinDate && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">💔</span>
          <div>
            <p className="font-semibold text-red-300">Streak Broken</p>
            <p className="text-sm text-red-400/80">
              Your last session was {formatDisplay(lastCheckinDate)}. Start a new streak today!
            </p>
          </div>
        </div>
      )}

      {/* Main check-in card */}
      <div className="card text-center space-y-5">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold text-gray-200">
            {isCheckedInToday ? '✅ Studied Today!' : '📚 Ready to Study?'}
          </h2>
          <p className="text-sm text-gray-500">
            {isCheckedInToday
              ? 'Great work! Come back tomorrow to keep the streak going.'
              : 'Log your study session to keep your streak alive.'}
          </p>
        </div>

        <div className="flex justify-center">
          <StreakRing streak={currentStreak} />
        </div>

        <div className="text-sm font-medium text-gray-400">
          {currentStreak > 0 ? `🔥 ${currentStreak}-day streak` : 'No active streak'}
        </div>

        <button
          onClick={handleCheckIn}
          disabled={isCheckedInToday}
          className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-200 ${
            isCheckedInToday
              ? 'bg-green-800/40 text-green-400 border border-green-700/40 cursor-default'
              : 'btn-primary text-xl hover:shadow-lg hover:shadow-orange-500/20 active:scale-95'
          }`}
        >
          {isCheckedInToday ? '✅ Checked In!' : '🔥 Log Study Session'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Current Streak', value: currentStreak, unit: 'days', emoji: '🔥' },
          { label: 'Longest Streak', value: longestStreak, unit: 'days', emoji: '🏆' },
          { label: 'Total Sessions', value: totalStudyDays, unit: 'days', emoji: '📅' },
        ].map(stat => (
          <div key={stat.label} className="card-sm text-center">
            <div className="text-xl mb-1">{stat.emoji}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 30-day heatmap */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Last 30 Days
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {last30.map(date => (
            <HeatmapDot key={date} date={date} isChecked={checkinSet.has(date)} />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-500/80" />
            <span>Studied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-800" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gray-700 ring-1 ring-gray-500" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  )
}
