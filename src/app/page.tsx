'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import SubjectItem from '../components/SubjectItem'
import AddSubjectModal from '../components/AddSubjectModal'
import { RealTimeProvider, useRealTime } from '../context/RealTimeContext'

function SubjectList() {
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false)
  const [targetPercentage, setTargetPercentage] = useState(75)
  const { subjects, setSubjects, loading, error, refetchSubjects } = useRealTime()

  const handleMarkAttendance = async (index: number, isPresent: boolean) => {
    try {
      const subject = subjects[index]
      const newAttended = isPresent ? subject.attended + 1 : subject.attended
      const newTotal = subject.total + 1

      // Optimistically update the UI
      const updatedSubjects = [...subjects]
      updatedSubjects[index] = {
        ...subject,
        attended: newAttended,
        total: newTotal
      }
      setSubjects(updatedSubjects)

      // Make the API call
      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attended: newAttended,
          total: newTotal,
        }),
      })

      if (!response.ok) {
        // If the request fails, revert the optimistic update
        setSubjects(subjects)
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update attendance')
      }
    } catch (error: any) {
      console.error('Error updating attendance:', error)
      // UI has already been reverted in case of error
    }
  }

  const handleDeleteSubject = async (index: number) => {
    try {
      const subject = subjects[index]
      
      // Optimistically update UI
      const updatedSubjects = subjects.filter((_, i) => i !== index)
      setSubjects(updatedSubjects)

      const response = await fetch(`/api/subjects/${subject.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        // If the request fails, revert the optimistic update
        setSubjects(subjects)
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete subject')
      }
    } catch (error: any) {
      console.error('Error deleting subject:', error)
      // UI has already been reverted in case of error
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Smart Attendance Tracker
          </h1>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
            <label htmlFor="targetPercentage" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Attendance:
            </label>
            <input
              id="targetPercentage"
              type="number"
              min="0"
              max="100"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Subject
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No subjects added</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first subject!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {subjects.map((subject, index) => (
            <SubjectItem
              key={subject.id}
              subject={subject}
              index={index}
              targetPercentage={targetPercentage}
              onMarkAttendance={handleMarkAttendance}
              onDeleteSubject={handleDeleteSubject}
            />
          ))}
        </div>
      )}

      {showAddSubjectModal && (
        <AddSubjectModal 
          onClose={() => setShowAddSubjectModal(false)} 
          onSuccess={refetchSubjects}
        />
      )}
    </div>
  )
}

export default function Home() {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome to AttendEasy
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please sign in to manage your attendance
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <RealTimeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <SubjectList />
            </div>
          </div>
        </div>
      </div>
    </RealTimeProvider>
  )
}
