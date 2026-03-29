import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { AssignmentItem } from './AssignmentItem'
import { AssignmentForm } from './AssignmentForm'
import { EmptyState } from '../shared/EmptyState'
import {
  getMonthDays, nextMonth, prevMonth, formatMonthYear,
  formatDayNum, toISODate, isSameDay, startOfMonth,
  isToday, parseISO
} from '../../utils/dateUtils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function DayCell({ day, currentMonth, isSelected, assignments, checkinSet, onClick }) {
  const isCurrent = isSameDay(startOfMonth(day), startOfMonth(currentMonth))
  const todayDate = isToday(day)
  const iso = toISODate(day)
  const hasAssignments = assignments.length > 0
  const isCheckedIn = checkinSet.has(iso)

  return (
    <button
      onClick={() => onClick(day)}
      className={`relative aspect-square flex flex-col items-center justify-start pt-1 pb-0.5 rounded-xl text-sm transition-all ${
        isSelected
          ? 'bg-orange-500 text-white'
          : todayDate
          ? 'bg-gray-700 text-white ring-1 ring-orange-500'
          : isCurrent
          ? 'text-gray-200 hover:bg-gray-800'
          : 'text-gray-600 hover:bg-gray-800/50'
      }`}
    >
      <span className="font-medium leading-none">{formatDayNum(day)}</span>
      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
        {isCheckedIn && !isSelected && (
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-80" />
        )}
        {hasAssignments && assignments.slice(0, 3).map((a, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : (a.course?.colorHex || '#6366f1') }}
          />
        ))}
      </div>
    </button>
  )
}

export function CalendarView() {
  const { assignments, addAssignment, getAssignmentsForDate, checkins, courses } = useApp()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAdd, setShowAdd] = useState(false)

  const days = useMemo(() => getMonthDays(currentMonth), [currentMonth])
  const checkinSet = useMemo(() => new Set(checkins.map(c => c.date)), [checkins])

  const selectedISO = toISODate(selectedDate)
  const selectedAssignments = getAssignmentsForDate(selectedISO)

  // Enrich assignments with course data for dots
  const assignmentsWithCourse = useMemo(() => {
    return assignments.map(a => ({
      ...a,
      course: a.courseId ? courses.find(c => c.id === a.courseId) : null
    }))
  }, [assignments, courses])

  const getAssignmentsForDay = (day) => {
    const iso = toISODate(day)
    return assignmentsWithCourse.filter(a => a.dueDate === iso)
  }

  const overdueCount = assignments.filter(a => {
    const today = toISODate(new Date())
    return !a.completed && a.dueDate < today
  }).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Calendar</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {overdueCount > 0 && (
        <div className="bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-red-400 text-lg">⚠️</span>
          <p className="text-sm text-red-300">
            <strong>{overdueCount}</strong> overdue assignment{overdueCount !== 1 ? 's' : ''} need attention
          </p>
        </div>
      )}

      {/* Calendar grid */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(prevMonth(currentMonth))}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="font-bold text-white text-base">{formatMonthYear(currentMonth)}</h3>
          <button
            onClick={() => setCurrentMonth(nextMonth(currentMonth))}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => (
            <DayCell
              key={toISODate(day)}
              day={day}
              currentMonth={currentMonth}
              isSelected={isSameDay(day, selectedDate)}
              assignments={getAssignmentsForDay(day)}
              checkinSet={checkinSet}
              onClick={(d) => setSelectedDate(d)}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span>Study session</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Assignment</span>
          </div>
        </div>
      </div>

      {/* Selected day assignments */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">
            {isToday(selectedDate) ? 'Today' : formatMonthYear(selectedDate).split(' ')[0] + ' ' + formatDayNum(selectedDate)}
          </h3>
          <button
            onClick={() => setShowAdd(true)}
            className="text-sm text-orange-400 hover:text-orange-300 font-medium"
          >
            + Add
          </button>
        </div>

        {selectedAssignments.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">No assignments due on this day</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {selectedAssignments.map(a => (
              <AssignmentItem key={a.id} assignment={a} />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming assignments */}
      {assignments.filter(a => !a.completed).length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-white mb-3">All Upcoming</h3>
          <div className="divide-y divide-gray-800">
            {assignments
              .filter(a => !a.completed)
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .slice(0, 10)
              .map(a => (
                <AssignmentItem key={a.id} assignment={a} showDate />
              ))}
          </div>
        </div>
      )}

      <AssignmentForm
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={addAssignment}
        defaultDate={selectedISO}
      />
    </div>
  )
}
