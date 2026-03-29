import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { CourseForm } from './CourseForm'

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>{value} / {max} units</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function CourseCard({ course }) {
  const { updateCourse, deleteCourse, updateProgress, getAssignmentsForCourse } = useApp()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editingProgress, setEditingProgress] = useState(false)
  const [progressInput, setProgressInput] = useState(course.completedUnits)

  const assignments = getAssignmentsForCourse(course.id)
  const completedAssignments = assignments.filter(a => a.completed).length
  const pct = course.totalUnits > 0 ? Math.round((course.completedUnits / course.totalUnits) * 100) : 0

  const handleProgressSave = () => {
    updateProgress(course.id, Number(progressInput))
    setEditingProgress(false)
  }

  return (
    <>
      <div className="card-sm group relative" style={{ borderLeft: `4px solid ${course.colorHex}` }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-white text-base">{course.name}</h3>
            {course.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
            )}
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowEdit(true)}
              className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-1.5 hover:bg-red-900/40 rounded-lg transition-colors text-gray-400 hover:text-red-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <ProgressBar value={course.completedUnits} max={course.totalUnits} color={course.colorHex} />

        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {completedAssignments}/{assignments.length} assignments done
          </div>
          {editingProgress ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="input w-16 text-sm py-1 px-2"
                min={0}
                max={course.totalUnits}
                value={progressInput}
                onChange={e => setProgressInput(e.target.value)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleProgressSave(); if (e.key === 'Escape') setEditingProgress(false) }}
              />
              <button onClick={handleProgressSave} className="text-green-400 hover:text-green-300 text-xs font-semibold">Save</button>
              <button onClick={() => setEditingProgress(false)} className="text-gray-500 hover:text-gray-400 text-xs">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => { setProgressInput(course.completedUnits); setEditingProgress(true) }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Update Progress
            </button>
          )}
        </div>
      </div>

      <CourseForm
        show={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={(data) => updateCourse(course.id, data)}
        initial={course}
      />
      <ConfirmDialog
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteCourse(course.id)}
        title="Delete Course?"
        message={`"${course.name}" and all its data will be permanently deleted.`}
      />
    </>
  )
}
