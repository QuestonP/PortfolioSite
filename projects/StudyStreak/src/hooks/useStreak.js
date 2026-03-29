import { useMemo, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { todayISO } from '../utils/dateUtils'
import { computeCurrentStreak, computeLongestStreak, isStreakBroken, getMilestone } from '../utils/streakUtils'

export function useStreak() {
  const [checkins, setCheckins] = useLocalStorage(STORAGE_KEYS.CHECKINS, [])
  const [streakMeta, setStreakMeta] = useLocalStorage(STORAGE_KEYS.STREAK_META, {
    longestStreak: 0,
    lastCheckinDate: null,
  })

  const today = todayISO()

  const isCheckedInToday = useMemo(
    () => checkins.some(c => c.date === today),
    [checkins, today]
  )

  const currentStreak = useMemo(() => computeCurrentStreak(checkins), [checkins])
  const longestStreak = useMemo(
    () => Math.max(streakMeta.longestStreak, currentStreak),
    [streakMeta.longestStreak, currentStreak]
  )
  const streakBroken = useMemo(
    () => isStreakBroken(streakMeta.lastCheckinDate),
    [streakMeta.lastCheckinDate]
  )

  const milestone = useMemo(() => getMilestone(currentStreak), [currentStreak])

  const checkIn = useCallback(() => {
    if (isCheckedInToday) return

    const newCheckin = { date: today, timestamp: new Date().toISOString() }
    const newCheckins = [...checkins, newCheckin]
    setCheckins(newCheckins)

    const newStreak = computeCurrentStreak(newCheckins)
    const newLongest = Math.max(streakMeta.longestStreak, newStreak)
    setStreakMeta({
      longestStreak: newLongest,
      lastCheckinDate: today,
    })
  }, [isCheckedInToday, today, checkins, setCheckins, streakMeta, setStreakMeta])

  const totalStudyDays = checkins.length

  return {
    checkins,
    isCheckedInToday,
    currentStreak,
    longestStreak,
    streakBroken,
    milestone,
    checkIn,
    totalStudyDays,
    lastCheckinDate: streakMeta.lastCheckinDate,
  }
}
