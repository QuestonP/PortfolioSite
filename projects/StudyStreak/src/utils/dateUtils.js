import { format, isToday, isSameDay, differenceInCalendarDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isThisMonth, isBefore, isAfter, startOfDay } from 'date-fns'

export const toISODate = (date) => format(date, 'yyyy-MM-dd')
export const todayISO = () => toISODate(new Date())
export const yesterdayISO = () => toISODate(new Date(Date.now() - 86400000))

export const parseDate = (isoString) => parseISO(isoString)

export const isDateToday = (isoDate) => isToday(parseISO(isoDate))

export const daysDiff = (isoDate1, isoDate2) =>
  differenceInCalendarDays(parseISO(isoDate1), parseISO(isoDate2))

export const formatDisplay = (isoDate) => format(parseISO(isoDate), 'MMM d, yyyy')
export const formatShort = (isoDate) => format(parseISO(isoDate), 'MMM d')
export const formatMonthYear = (date) => format(date, 'MMMM yyyy')
export const formatDayNum = (date) => format(date, 'd')
export const formatWeekday = (date) => format(date, 'EEE')
export const formatTime = (isoDate) => format(parseISO(isoDate), 'h:mm a')

export const getMonthDays = (date) => {
  const start = startOfWeek(startOfMonth(date))
  const end = endOfWeek(endOfMonth(date))
  return eachDayOfInterval({ start, end })
}

export const nextMonth = (date) => addMonths(date, 1)
export const prevMonth = (date) => subMonths(date, 1)

export const isCurrentMonth = (date) => isThisMonth(date)
export const isDayInMonth = (day, month) => isSameDay(startOfMonth(month), startOfMonth(day))

export const isOverdue = (isoDate) => isBefore(parseISO(isoDate), startOfDay(new Date()))
export const isDueToday = (isoDate) => isToday(parseISO(isoDate))
export const isDueSoon = (isoDate) => {
  const diff = differenceInCalendarDays(parseISO(isoDate), new Date())
  return diff >= 0 && diff <= 3
}

export { isSameDay, format, parseISO, isToday, isAfter, isBefore, startOfMonth }
