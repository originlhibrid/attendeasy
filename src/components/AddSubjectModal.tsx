import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface AddSubjectModalProps {
  onClose: () => void
  onSuccess: () => Promise<void>
}

export default function AddSubjectModal({ onClose, onSuccess }: AddSubjectModalProps) {
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [attended, setAttended] = useState(0)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      setError('You must be logged in to add a subject')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          attended,
          total,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create subject')
      }

      await onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to create subject')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Subject</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="attended" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Classes Attended
            </label>
            <input
              type="number"
              id="attended"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="total" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Classes
            </label>
            <input
              type="number"
              id="total"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
