import { useState } from 'react'
import { Subject } from '../types/subject'

interface AddSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSubject: (subject: Subject) => void
  error?: string | null
}

export default function AddSubjectModal({ isOpen, onClose, onAddSubject, error }: AddSubjectModalProps) {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md m-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter subject name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Classes Attended
            </label>
            <input
              type="number"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Classes (Optional)
            </label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                       transition-colors duration-200"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
