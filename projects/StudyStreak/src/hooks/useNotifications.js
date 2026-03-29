import { useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../constants/storageKeys'
import {
  shouldFireStreakReminder,
  shouldFireAssignmentReminder,
  fireNotification,
  requestNotificationPermission,
  DEFAULT_NOTIFICATION_PREFS,
} from '../utils/notificationUtils'
import { todayISO } from '../utils/dateUtils'

export function useNotifications(isCheckedInToday, currentStreak, assignments) {
  const [prefs, setPrefs] = useLocalStorage(
    STORAGE_KEYS.NOTIFICATION_PREFS,
    DEFAULT_NOTIFICATION_PREFS
  )

  // Sync permission state on mount
  useEffect(() => {
    if ('Notification' in window) {
      const granted = Notification.permission === 'granted'
      if (granted !== prefs.permissionGranted) {
        setPrefs(p => ({ ...p, permissionGranted: granted }))
      }
    }
  }, []) // eslint-disable-line

  const requestPermission = useCallback(async () => {
    const result = await requestNotificationPermission()
    const granted = result === 'granted'
    setPrefs(p => ({ ...p, permissionGranted: granted, enabled: granted }))
    return granted
  }, [setPrefs])

  const updatePrefs = useCallback((updates) => {
    setPrefs(p => ({ ...p, ...updates }))
  }, [setPrefs])

  // Polling scheduler - runs every 60 seconds
  useEffect(() => {
    if (!prefs.permissionGranted || !prefs.enabled) return

    const tick = () => {
      const today = todayISO()

      // Streak reminder
      if (prefs.streakReminderEnabled && shouldFireStreakReminder(prefs, isCheckedInToday, currentStreak)) {
        const body = currentStreak > 0
          ? `Don't break your ${currentStreak}-day streak! Log your study session now.`
          : `Start your study streak today! Log a session now.`
        fireNotification('📚 StudyStreak Reminder', body, 'streak-reminder')
        setPrefs(p => ({ ...p, lastFiredDate: today }))
      }

      // Assignment reminders
      if (prefs.assignmentReminders) {
        const dueAssignments = shouldFireAssignmentReminder(assignments, prefs)
        if (dueAssignments.length > 0) {
          const titles = dueAssignments.map(a => `• ${a.title}`).join('\n')
          fireNotification(
            `📋 ${dueAssignments.length} Assignment${dueAssignments.length > 1 ? 's' : ''} Due Tomorrow`,
            titles,
            'assignment-reminder'
          )
          setPrefs(p => ({ ...p, lastAssignmentReminderDate: today }))
        }
      }
    }

    // Run immediately then every minute
    tick()
    const interval = setInterval(tick, 60000)
    return () => clearInterval(interval)
  }, [prefs, isCheckedInToday, currentStreak, assignments, setPrefs])

  return { prefs, requestPermission, updatePrefs }
}
