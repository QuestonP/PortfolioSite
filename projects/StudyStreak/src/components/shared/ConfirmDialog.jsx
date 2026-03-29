import { Modal } from './Modal'

export function ConfirmDialog({ show, onClose, onConfirm, title, message }) {
  return (
    <Modal show={show} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className="btn-danger flex-1">Delete</button>
        </div>
      </div>
    </Modal>
  )
}
