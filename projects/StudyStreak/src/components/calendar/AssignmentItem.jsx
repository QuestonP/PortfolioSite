import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Badge } from '../shared/Badge'
import { AssignmentForm } from './AssignmentForm'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { formatDisplay, formatShort, isOverdue, isDueToday, isDueSoon } from '../../utils/dateUtils'

const PRIORITY_STYLES = {
  low: { dot: 'bg-blue-400', label: 'Low', color: '#60a5fa' },
  medium: { dot: 'bg-yellow-400', label: 'Medium', color: '#facc15' },
  high: { dot: 'bg-red-400', label: 'High', color: '#f87171' },
}

export function AssignmentItem({ assignment, showDate = false }) {
  const { toggleComplete, updateAssignment, deleteAssignment, getCourse } = useApp()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const course = assignment.courseId ? getCourse(assignment.courseId) : null
  const priority = PRIORITY_STYLES[assignment.priority] || PRIORITY_STYLES.medium
  const overdue = !assignment.completed && isOverdue(assignment.dueDate) && !isDueToday(assignment.dueDate)
  const dueToday = !assignment.completed && isDueToday(assignment.dueDate)

  return (
    <>
      <div className={`group flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-gray-800/50 ${assignment.completed ? 'opacity-60' : ''}`}>
        <button
          onClick={() => toggleComplete(assignment.id)}
          className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 transition-all flex items-center justify-center ${
            assignment.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-600 hover:border-orange-400'
          }`}
        >
          {assignment.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium text-sm ${assignment.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}>
              {assignment.title}
            </span>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priority.dot}`} />
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {course && <Badge color={course.colorHex} size="sm">{course.name}</Badge>}
            {showDate && (
              <span className={`text-xs ${overdue ? 'text-red-400' : dueToday ? 'text-orange-400' : 'text-gray-500'}`}>
                {overdue ? '⚠️ ' : dueToday ? '🔔 ' : ''}{formatShort(assignment.dueDate)}
                {assignment.dueTime && ` at ${assignment.dueTime}`}
              </span>
            )}
            {assignment.description && (
              <span className="text-xs text-gray-600 truncate max-w-xs">{assignment.description}</span>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => setShowEdit(true)}
            className="p-1 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-1 hover:bg-red-900/40 rounded-lg text-gray-500 hover:text-red-400"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <AssignmentForm
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={(data) => updateAssignment(assignment.id, data)}
        initial={assignment}
      />
      <ConfirmDialog
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteAssignment(assignment.id)}
        title="Delete Assignment?"
        message={`"${assignment.title}" will be permanently deleted.`}
      />
    </>
  )
}
