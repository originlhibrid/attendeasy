'use client'

import { useState, useEffect } from 'react'
import SubjectList from '../components/SubjectList'
import AddSubjectModal from '../components/AddSubjectModal'
import { Subject } from '../types/subject'
import { Card } from '../components/ui/card'
import { Header } from '../components/Header'

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [targetPercentage, setTargetPercentage] = useState(75)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  const loadFromLocalStorage = () => {
    const savedSubjects = localStorage.getItem('subjects')
    const savedTarget = localStorage.getItem('targetPercentage')
    
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects))
    }
    
    if (savedTarget) {
      setTargetPercentage(Number(savedTarget))
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('subjects', JSON.stringify(subjects))
    localStorage.setItem('targetPercentage', targetPercentage.toString())
  }

  const handleAddSubject = (newSubject: Subject) => {
    const isDuplicate = subjects.some(
      s => s.name.toLowerCase() === newSubject.name.toLowerCase()
    )
    
    if (isDuplicate) {
      setError("A subject with this name already exists")
      return
    }
    
    setSubjects([newSubject, ...subjects])
    saveToLocalStorage()
    setError(null)
  }

  const handleMarkAttendance = (index: number, isPresent: boolean) => {
    const updatedSubjects = [...subjects];
    const subject = updatedSubjects[index];

    if (isPresent) {
      subject.attended++;
      subject.total++;
    } else {
      if (subject.total > 0) {
        subject.total++;
      } else {
        // If it's the first absent and total was 0, set total to 1
        subject.total = 1;
      }
    }

    setSubjects(updatedSubjects);
    saveToLocalStorage();
  }

  const handleDeleteSubject = (index: number) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      const updatedSubjects = subjects.filter((_, i) => i !== index)
      setSubjects(updatedSubjects)
      saveToLocalStorage()
    }
  }

  const handleTargetChange = (value: number) => {
    setTargetPercentage(value)
    saveToLocalStorage()
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <Card className="w-full max-w-4xl mx-auto p-8 border-2 border-solid border-gray-800 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Attendance Tracker</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Track your class attendance easily</p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="target" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target:
                </label>
                <input
                  type="number"
                  id="target"
                  value={targetPercentage}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 mb-6"
            >
              <i className="bi bi-plus-lg mr-2"></i>Add New Subject
            </button>

            <SubjectList
              subjects={subjects}
              targetPercentage={targetPercentage}
              onMarkAttendance={handleMarkAttendance}
              onDeleteSubject={handleDeleteSubject}
            />

            <AddSubjectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddSubject={handleAddSubject}
              error={error}
            />
          </div>
        </Card>
      </div>
    </>
  )
}
