import { AppProvider, useApp } from './context/AppContext'
import { Header } from './components/layout/Header'
import { TabBar } from './components/layout/TabBar'
import { CheckInView } from './components/checkin/CheckInView'
import { CoursesView } from './components/courses/CoursesView'
import { CalendarView } from './components/calendar/CalendarView'
import { StatsView } from './components/stats/StatsView'
import { SettingsView } from './components/settings/SettingsView'

function AppContent() {
  const { activeTab } = useApp()

  const views = {
    checkin: CheckInView,
    courses: CoursesView,
    calendar: CalendarView,
    stats: StatsView,
    settings: SettingsView,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 overflow-y-auto">
        {Object.entries(views).map(([id, View]) => (
          <div key={id} className={activeTab === id ? 'block animate-fade-in' : 'hidden'}>
            <View />
          </div>
        ))}
      </main>
      <TabBar />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
