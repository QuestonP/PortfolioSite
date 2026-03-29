import { todayISO } from './dateUtils'

export const shouldFireStreakReminder = (prefs, isCheckedInToday, currentStreak) => {
  if (!prefs.enabled || !prefs.permissionGranted) return false
  if (prefs.lastFiredDate === todayISO()) return false
  if (isCheckedInToday) return false

  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  return hour === prefs.reminderHour && minute === prefs.reminderMinute
}

export const shouldFireAssignmentReminder = (assignments, prefs) => {
  if (!prefs.enabled || !prefs.permissionGranted || !prefs.assignmentReminders) return []
  if (prefs.lastAssignmentReminderDate === todayISO()) return []

  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  if (hour !== prefs.reminderHour || minute !== prefs.reminderMinute) return []

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowISO = tomorrow.toISOString().split('T')[0]

  return assignments.filter(a => !a.completed && a.dueDate === tomorrowISO)
}

export const fireNotification = (title, body, tag = 'studystreak') => {
  if (Notification.permission !== 'granted') return
  new Notification(title, {
    body,
    icon: '/favicon.svg',
    tag,
    requireInteraction: false,
  })
}

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported'
  return await Notification.requestPermission()
}

export const DEFAULT_NOTIFICATION_PREFS = {
  enabled: true,
  permissionGranted: false,
  reminderHour: 20,
  reminderMinute: 0,
  lastFiredDate: null,
  lastAssignmentReminderDate: null,
  assignmentReminders: true,
  streakReminderEnabled: true,
}
