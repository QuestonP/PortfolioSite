import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const MILESTONE_MESSAGES = {
  3: { emoji: '🌱', title: '3-Day Streak!', msg: "You're building a habit!" },
  7: { emoji: '⭐', title: 'One Week Strong!', msg: "A full week of studying!" },
  14: { emoji: '🏆', title: '2 Weeks!', msg: "Two weeks of consistency!" },
  21: { emoji: '💪', title: '21 Days!', msg: "Habit locked in!" },
  30: { emoji: '🥇', title: '30 Days!', msg: "One month of daily study!" },
  60: { emoji: '🚀', title: '60 Days!', msg: "Two months! You're unstoppable!" },
  100: { emoji: '💯', title: '100 Day Streak!', msg: "Legendary dedication!" },
  365: { emoji: '🎊', title: 'One Full Year!', msg: "Absolute legend!" },
}

export function StreakMilestone({ milestone, onDismiss }) {
  useEffect(() => {
    if (!milestone) return
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f97316', '#ef4444', '#fbbf24', '#22c55e', '#3b82f6'],
    })
  }, [milestone])

  if (!milestone) return null
  const info = MILESTONE_MESSAGES[milestone] || { emoji: '🔥', title: `${milestone}-Day Streak!`, msg: 'Amazing work!' }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none">
      <div className="card text-center animate-bounce-in pointer-events-auto max-w-sm w-full shadow-2xl border-orange-500/50">
        <div className="text-7xl mb-3">{info.emoji}</div>
        <h2 className="text-2xl font-bold text-white mb-1">{info.title}</h2>
        <p className="text-gray-400 mb-5">{info.msg}</p>
        <button onClick={onDismiss} className="btn-primary w-full">Keep Going! 🔥</button>
      </div>
    </div>
  )
}
