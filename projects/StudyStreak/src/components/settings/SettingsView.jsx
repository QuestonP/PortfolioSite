import { useApp } from '../../context/AppContext'
import { requestNotificationPermission } from '../../utils/notificationUtils'

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-gray-700'}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  )
}

export function SettingsView() {
  const { notifications } = useApp()
  const { prefs, requestPermission, updatePrefs } = notifications

  const handleRequestPermission = async () => {
    const granted = await requestPermission()
    if (!granted) {
      alert('Notification permission was denied. Please enable it in your browser settings.')
    }
  }

  const supportsNotifications = 'Notification' in window

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h2 className="text-xl font-bold text-white">Settings</h2>

      {/* Notification permission banner */}
      {supportsNotifications && !prefs.permissionGranted && (
        <div className="bg-orange-900/30 border border-orange-700/50 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <p className="font-semibold text-orange-300">Enable Notifications</p>
              <p className="text-sm text-orange-400/80 mt-1">
                Get reminded to study every day before you break your streak.
              </p>
              <button
                onClick={handleRequestPermission}
                className="btn-primary mt-3 text-sm py-2"
              >
                Enable Reminders
              </button>
            </div>
          </div>
        </div>
      )}

      {!supportsNotifications && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-400">
          Your browser does not support desktop notifications.
        </div>
      )}

      {/* Notification settings */}
      <div className="card space-y-1 divide-y divide-gray-800">
        <h3 className="font-semibold text-white pb-2">Notifications</h3>

        <Toggle
          checked={prefs.enabled}
          onChange={(v) => updatePrefs({ enabled: v })}
          label="Enable Notifications"
          description="Master switch for all reminders"
        />
        <Toggle
          checked={prefs.streakReminderEnabled}
          onChange={(v) => updatePrefs({ streakReminderEnabled: v })}
          label="Streak Reminder"
          description="Remind me if I haven't studied today"
        />
        <Toggle
          checked={prefs.assignmentReminders}
          onChange={(v) => updatePrefs({ assignmentReminders: v })}
          label="Assignment Reminders"
          description="Notify me about assignments due tomorrow"
        />

        <div className="py-3">
          <p className="text-sm font-medium text-gray-200 mb-2">Reminder Time</p>
          <p className="text-xs text-gray-500 mb-3">You'll be reminded at this time if you haven't studied yet today.</p>
          <div className="flex items-center gap-3">
            <select
              className="input w-28"
              value={prefs.reminderHour}
              onChange={e => updatePrefs({ reminderHour: Number(e.target.value) })}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}
                </option>
              ))}
            </select>
            <span className="text-gray-500">:</span>
            <select
              className="input w-24"
              value={prefs.reminderMinute}
              onChange={e => updatePrefs({ reminderMinute: Number(e.target.value) })}
            >
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>

        {prefs.permissionGranted && (
          <div className="pt-3">
            <button
              onClick={() => {
                if (Notification.permission === 'granted') {
                  new Notification('📚 StudyStreak', {
                    body: "This is a test notification. You're all set!",
                    icon: '/favicon.svg',
                    tag: 'test',
                  })
                }
              }}
              className="btn-secondary text-sm w-full"
            >
              Send Test Notification
            </button>
          </div>
        )}
      </div>

      {/* App info */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-white">About</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>📦 All data is stored locally in your browser. No account required.</p>
          <p>🔥 Streaks reset if you miss a day — keep showing up!</p>
          <p>🔔 Notifications require the browser tab to be open to fire.</p>
          <p>🏆 Milestones trigger at: 3, 7, 14, 21, 30, 60, 100, 365 days.</p>
        </div>
      </div>

      {/* Data management */}
      <div className="card">
        <h3 className="font-semibold text-white mb-3">Data</h3>
        <button
          onClick={() => {
            if (confirm('This will permanently delete ALL your data including streaks, courses, and assignments. This cannot be undone. Continue?')) {
              localStorage.clear()
              window.location.reload()
            }
          }}
          className="btn-danger text-sm w-full"
        >
          Clear All Data
        </button>
        <p className="text-xs text-gray-600 mt-2 text-center">This action cannot be undone.</p>
      </div>
    </div>
  )
}
