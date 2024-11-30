'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SubjectItem from '../components/SubjectItem'
import AddSubjectModal from '../components/AddSubjectModal'
import { RealTimeSubjects } from '../components/RealTimeSubjects'
import { Subject } from '../types/subject'

export default function Home() {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [targetPercentage, setTargetPercentage] = useState(75)
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    fetchSubjects()
  }, [session])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      if (!response.ok) {
        throw new Error('Failed to fetch subjects')
      }
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      setError('Error loading subjects')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (index: number, isPresent: boolean) => {
    try {
      const subject = subjects[index]
      const newAttended = isPresent ? subject.attended + 1 : subject.attended
      const newTotal = subject.total + 1

      const response = await fetch(`/api/subjects/${subject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attended: newAttended,
          total: newTotal,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update attendance')
      }

      // Optimistic update
      const newSubjects = [...subjects]
      newSubjects[index] = {
        ...subject,
        attended: newAttended,
        total: newTotal,
      }
      setSubjects(newSubjects)
    } catch (error) {
      console.error('Error updating attendance:', error)
      setError('Failed to update attendance')
    }
  }

  const handleDeleteSubject = async (index: number) => {
    try {
      const subject = subjects[index]
      const response = await fetch(`/api/subjects/${subject._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subject')
      }

      // Optimistic update
      const newSubjects = subjects.filter((_, i) => i !== index)
      setSubjects(newSubjects)
    } catch (error) {
      console.error('Error deleting subject:', error)
      setError('Failed to delete subject')
    }
  }

  const handleSubjectCreated = (newSubject: Subject) => {
    setSubjects(prev => [...prev, newSubject])
    setShowAddSubjectModal(false)
  }

  const handleSubjectUpdated = (updatedSubject: Subject) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject._id === updatedSubject._id ? updatedSubject : subject
      )
    )
  }

  const handleSubjectDeleted = (subjectId: string) => {
    setSubjects(prev => prev.filter(subject => subject._id !== subjectId))
  }

  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Welcome to AttendEasy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Please sign in to manage your attendance
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 m-4">
        <h1 className="text-2xl font-bold mb-2">Smart Attendance Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Track your class attendance easily</p>
        
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowAddSubjectModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <span>+</span> Add New Subject
          </button>
          
          <div className="flex items-center gap-2">
            <span>Target:</span>
            <input
              type="number"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded bg-transparent"
            />
            <span>%</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : subjects.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No subjects added yet. Add your first subject above!
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <SubjectItem
                key={subject._id}
                subject={subject}
                index={index}
                targetPercentage={targetPercentage}
                onMarkAttendance={handleMarkAttendance}
                onDeleteSubject={handleDeleteSubject}
              />
            ))}
          </div>
        )}
      </div>

      {showAddSubjectModal && (
        <AddSubjectModal
          isOpen={showAddSubjectModal}
          onClose={() => setShowAddSubjectModal(false)}
          onAddSubject={handleSubjectCreated}
          error={error}
        />
      )}
    </main>
  )
}
