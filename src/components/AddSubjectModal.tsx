import { useState } from 'react'
import { Subject } from '../types/subject'

interface AddSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSubject: (subject: Subject) => void
  error?: string | null
}

export default function AddSubjectModal({ isOpen, onClose, onAddSubject }: AddSubjectModalProps) {
  const [name, setName] = useState('')
  const [attended, setAttended] = useState(0)
  const [total, setTotal] = useState(0)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const newSubject: Subject = {
      name,
      attended,
      total: total < attended ? attended : total,
    }
    onAddSubject(newSubject)
    onClose()
    setName('')
    setAttended(0)
    setTotal(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md m-4">
        <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Initial Classes Attended</label>
            <input
              type="number"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Total Classes (Optional)</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Add Subject</button>
          </div>
        </form>
      </div>
    </div>
  )
}

