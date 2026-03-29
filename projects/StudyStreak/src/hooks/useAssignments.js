import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../constants/storageKeys'

export function useAssignments() {
  const [assignments, setAssignments] = useLocalStorage(STORAGE_KEYS.ASSIGNMENTS, [])

  const addAssignment = useCallback((assignment) => {
    const newAssignment = {
      ...assignment,
      id: crypto.randomUUID(),
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    }
    setAssignments(prev => [...prev, newAssignment])
    return newAssignment.id
  }, [setAssignments])

  const updateAssignment = useCallback((id, updates) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }, [setAssignments])

  const deleteAssignment = useCallback((id) => {
    setAssignments(prev => prev.filter(a => a.id !== id))
  }, [setAssignments])

  const toggleComplete = useCallback((id) => {
    setAssignments(prev => prev.map(a => {
      if (a.id !== id) return a
      return {
        ...a,
        completed: !a.completed,
        completedAt: !a.completed ? new Date().toISOString() : null,
      }
    }))
  }, [setAssignments])

  const getAssignmentsForDate = useCallback((isoDate) => {
    return assignments.filter(a => a.dueDate === isoDate)
  }, [assignments])

  const getAssignmentsForCourse = useCallback((courseId) => {
    return assignments.filter(a => a.courseId === courseId)
  }, [assignments])

  const upcomingAssignments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return assignments
      .filter(a => !a.completed && a.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [assignments])

  const overdueAssignments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return assignments
      .filter(a => !a.completed && a.dueDate < today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [assignments])

  return {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleComplete,
    getAssignmentsForDate,
    getAssignmentsForCourse,
    upcomingAssignments,
    overdueAssignments,
  }
}
