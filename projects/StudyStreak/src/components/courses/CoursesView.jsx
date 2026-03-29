import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CourseCard } from './CourseCard'
import { CourseForm } from './CourseForm'
import { EmptyState } from '../shared/EmptyState'

export function CoursesView() {
  const { courses, addCourse } = useApp()
  const [showAdd, setShowAdd] = useState(false)

  const totalProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.totalUnits > 0 ? c.completedUnits / c.totalUnits : 0), 0) / courses.length * 100)
    : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Courses</h2>
          {courses.length > 0 && (
            <p className="text-sm text-gray-500">{totalProgress}% overall progress</p>
          )}
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No courses yet"
          description="Add your first course to start tracking your progress and assignments."
          action={
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              Add Your First Course
            </button>
          }
        />
      ) : (
        <>
          {/* Overall progress bar */}
          <div className="card-sm">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 font-medium">Overall Progress</span>
              <span className="text-orange-400 font-bold">{totalProgress}%</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">{courses.length} course{courses.length !== 1 ? 's' : ''} tracked</p>
          </div>

          <div className="grid gap-3">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </>
      )}

      <CourseForm
        show={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={addCourse}
      />
    </div>
  )
}
