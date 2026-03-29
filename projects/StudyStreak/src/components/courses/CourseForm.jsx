import { useState, useEffect } from 'react'
import { Modal } from '../shared/Modal'

const COLORS = [
  '#f97316', '#ef4444', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#14b8a6',
]

export function CourseForm({ show, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    colorHex: '#6366f1',
    totalUnits: 10,
  })

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        description: initial.description || '',
        colorHex: initial.colorHex || '#6366f1',
        totalUnits: initial.totalUnits || 10,
      })
    } else {
      setForm({ name: '', description: '', colorHex: '#6366f1', totalUnits: 10 })
    }
  }, [initial, show])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({ ...form, totalUnits: Number(form.totalUnits) })
    onClose()
  }

  return (
    <Modal show={show} onClose={onClose} title={initial ? 'Edit Course' : 'Add Course'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Course Name *</label>
          <input
            className="input"
            placeholder="e.g. Data Structures"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="What is this course about?"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Total Units / Chapters</label>
          <input
            type="number"
            className="input"
            min={1}
            max={999}
            value={form.totalUnits}
            onChange={e => setForm(p => ({ ...p, totalUnits: e.target.value }))}
          />
        </div>
        <div>
          <label className="label">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(p => ({ ...p, colorHex: c }))}
                className={`w-8 h-8 rounded-full transition-transform ${form.colorHex === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" className="btn-primary flex-1">{initial ? 'Save Changes' : 'Add Course'}</button>
        </div>
      </form>
    </Modal>
  )
}
