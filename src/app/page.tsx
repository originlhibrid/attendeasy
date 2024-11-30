'use client'

import { useState, useEffect } from 'react'
import SubjectList from '../components/SubjectList'
import AddSubjectModal from '../components/AddSubjectModal'
import { Subject } from '../types/subject'
import { Card } from '../components/ui/card'

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl mx-auto p-8 border-2 border-solid border-gray-800 bg-white shadow-xl">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Attendance Tracker</h1>
              <p className="mt-1 text-sm text-gray-600">Track your class attendance easily</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Target: </span>
              <input
                type="number"
                value={targetPercentage}
                onChange={(e) => {
                  setTargetPercentage(Number(e.target.value))
                  saveToLocalStorage()
                }}
                min="0"
                max="100"
                className="w-16 px-2 py-1 border rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-700">%</span>
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
  )
}
