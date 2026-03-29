import { createContext, useContext, useState } from 'react'
import { useStreak } from '../hooks/useStreak'
import { useCourses } from '../hooks/useCourses'
import { useAssignments } from '../hooks/useAssignments'
import { useNotifications } from '../hooks/useNotifications'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('checkin')
  const streak = useStreak()
  const courses = useCourses()
  const assignments = useAssignments()
  const notifications = useNotifications(
    streak.isCheckedInToday,
    streak.currentStreak,
    assignments.assignments
  )

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      ...streak,
      ...courses,
      ...assignments,
      notifications,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
