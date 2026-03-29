import { todayISO, yesterdayISO, daysDiff, toISODate } from './dateUtils'

export const computeCurrentStreak = (checkins) => {
  if (!checkins || checkins.length === 0) return 0

  const dates = [...checkins].map(c => c.date).sort().reverse()
  const today = todayISO()
  const yesterday = yesterdayISO()

  // Must have checked in today or yesterday to have an active streak
  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = daysDiff(dates[i - 1], dates[i])
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export const computeLongestStreak = (checkins) => {
  if (!checkins || checkins.length === 0) return 0

  const dates = [...checkins].map(c => c.date).sort()
  let longest = 1
  let current = 1

  for (let i = 1; i < dates.length; i++) {
    const diff = daysDiff(dates[i], dates[i - 1])
    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }
  return longest
}

export const isStreakBroken = (lastCheckinDate) => {
  if (!lastCheckinDate) return false
  const today = todayISO()
  const yesterday = yesterdayISO()
  return lastCheckinDate !== today && lastCheckinDate !== yesterday
}

export const getMilestone = (streak) => {
  const milestones = [3, 7, 14, 21, 30, 60, 100, 150, 200, 365]
  return milestones.find(m => m === streak) || null
}

export const getLast30Days = () => {
  const days = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(toISODate(d))
  }
  return days
}
