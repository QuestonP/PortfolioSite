import { useState, useEffect } from 'react'
import { Modal } from '../shared/Modal'
import { useApp } from '../../context/AppContext'

const PRIORITIES = ['low', 'medium', 'high']

export function AssignmentForm({ show, onClose, onSubmit, initial, defaultDate }) {
  const { courses } = useApp()
  const [form, setForm] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: defaultDate || new Date().toISOString().split('T')[0],
    dueTime: '',
    priority: 'medium',
  })

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        courseId: initial.courseId || '',
        dueDate: initial.dueDate || '',
        dueTime: initial.dueTime || '',
        priority: initial.priority || 'medium',
      })
    } else {
      setForm({
        title: '',
        description: '',
        courseId: courses[0]?.id || '',
        dueDate: defaultDate || new Date().toISOString().split('T')[0],
        dueTime: '',
        priority: 'medium',
      })
    }
  }, [initial, show, defaultDate, courses])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.dueDate) return
    onSubmit(form)
    onClose()
  }

  const priorityColors = { low: 'text-blue-400', medium: 'text-yellow-400', high: 'text-red-400' }

  return (
    <Modal show={show} onClose={onClose} title={initial ? 'Edit Assignment' : 'Add Assignment'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            placeholder="e.g. Chapter 5 Homework"
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="Any notes about this assignment..."
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Course</label>
            <select
              className="input"
              value={form.courseId}
              onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
            >
              <option value="">No course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select
              className="input"
              value={form.priority}
              onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Due Date *</label>
            <input
              type="date"
              className="input"
              value={form.dueDate}
              onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="label">Due Time (optional)</label>
            <input
              type="time"
              className="input"
              value={form.dueTime}
              onChange={e => setForm(p => ({ ...p, dueTime: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save Changes' : 'Add Assignment'}</button>
        </div>
      </form>
    </Modal>
  )
}
