import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend
} from 'recharts'
import { getLast30Days } from '../../utils/streakUtils'
import { formatShort, parseISO } from '../../utils/dateUtils'
import { format } from 'date-fns'

function StatCard({ emoji, label, value, sub, color = 'text-orange-400' }) {
  return (
    <div className="card-sm text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      <div className="text-sm font-medium text-gray-300 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm">
        <p className="text-gray-300">{label}</p>
        <p className="text-orange-400 font-semibold">{payload[0].value === 1 ? '✅ Studied' : '❌ Missed'}</p>
      </div>
    )
  }
  return null
}

export function StatsView() {
  const { checkins, currentStreak, longestStreak, totalStudyDays, courses, assignments } = useApp()

  const checkinSet = useMemo(() => new Set(checkins.map(c => c.date)), [checkins])

  // 30-day bar chart data
  const barData = useMemo(() => {
    const last30 = getLast30Days()
    return last30.map(date => ({
      date,
      label: format(parseISO(date), 'M/d'),
      studied: checkinSet.has(date) ? 1 : 0,
    }))
  }, [checkinSet])

  // Assignments pie chart
  const assignmentStats = useMemo(() => {
    const total = assignments.length
    const completed = assignments.filter(a => a.completed).length
    const overdue = assignments.filter(a => {
      const today = new Date().toISOString().split('T')[0]
      return !a.completed && a.dueDate < today
    }).length
    const pending = total - completed - overdue
    return [
      { name: 'Completed', value: completed, color: '#22c55e' },
      { name: 'Pending', value: pending, color: '#f97316' },
      { name: 'Overdue', value: overdue, color: '#ef4444' },
    ].filter(d => d.value > 0)
  }, [assignments])

  // Course progress radial data
  const courseData = useMemo(() => {
    return courses.map(c => ({
      name: c.name,
      progress: c.totalUnits > 0 ? Math.round((c.completedUnits / c.totalUnits) * 100) : 0,
      fill: c.colorHex,
    }))
  }, [courses])

  // Study consistency
  const last7Days = getLast30Days().slice(-7)
  const studiedLast7 = last7Days.filter(d => checkinSet.has(d)).length
  const studiedLast30 = getLast30Days().filter(d => checkinSet.has(d)).length
  const consistencyPct = Math.round((studiedLast30 / 30) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-xl font-bold text-white">Statistics</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard emoji="🔥" label="Current Streak" value={currentStreak} sub="days" color="text-orange-400" />
        <StatCard emoji="🏆" label="Longest Streak" value={longestStreak} sub="days" color="text-yellow-400" />
        <StatCard emoji="📅" label="Total Sessions" value={totalStudyDays} sub="all time" color="text-blue-400" />
        <StatCard emoji="📈" label="Consistency" value={`${consistencyPct}%`} sub="last 30 days" color="text-green-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="📚" label="This Week" value={`${studiedLast7}/7`} sub="days studied" color="text-purple-400" />
        <StatCard emoji="✅" label="Assignments" value={assignments.filter(a => a.completed).length} sub={`of ${assignments.length} done`} color="text-cyan-400" />
      </div>

      {/* 30-day study chart */}
      <div className="card">
        <h3 className="font-semibold text-white mb-4">30-Day Study History</h3>
        {checkins.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No study sessions yet. Check in to start tracking!</p>
        ) : (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={barData} barSize={8}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#6b7280' }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="studied" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.studied ? '#f97316' : '#1f2937'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Course progress */}
      {courses.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Course Progress</h3>
          <div className="space-y-3">
            {courseData.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-300 truncate">{c.name}</span>
                  <span className="font-semibold ml-2" style={{ color: c.fill }}>{c.progress}%</span>
                </div>
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.progress}%`, backgroundColor: c.fill }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments pie chart */}
      {assignments.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-white mb-4">Assignment Completion</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={assignmentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assignmentStats.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {assignmentStats.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-gray-300">{s.name}</span>
                  <span className="text-sm font-bold text-white ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {assignments.length === 0 && courses.length === 0 && (
        <div className="card text-center py-10">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-gray-500">Add courses and assignments to see detailed statistics here.</p>
        </div>
      )}
    </div>
  )
}
