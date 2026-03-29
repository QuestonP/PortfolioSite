import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../constants/storageKeys'

export function useCourses() {
  const [courses, setCourses] = useLocalStorage(STORAGE_KEYS.COURSES, [])

  const addCourse = useCallback((course) => {
    const newCourse = {
      ...course,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedUnits: 0,
    }
    setCourses(prev => [...prev, newCourse])
    return newCourse.id
  }, [setCourses])

  const updateCourse = useCallback((id, updates) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [setCourses])

  const deleteCourse = useCallback((id) => {
    setCourses(prev => prev.filter(c => c.id !== id))
  }, [setCourses])

  const getCourse = useCallback((id) => {
    return courses.find(c => c.id === id)
  }, [courses])

  const updateProgress = useCallback((id, completedUnits) => {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, completedUnits: Math.min(completedUnits, c.totalUnits) } : c
    ))
  }, [setCourses])

  return { courses, addCourse, updateCourse, deleteCourse, getCourse, updateProgress }
}
