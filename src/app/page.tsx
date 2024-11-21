'use client'

import { useState, useEffect } from 'react'
import SubjectList from '@/components/SubjectList'
import AddSubjectModal from '@/components/AddSubjectModal'
import { Subject } from '@/types/subject'

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [targetPercentage, setTargetPercentage] = useState(75)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setSubjects([...subjects, newSubject])
    saveToLocalStorage()
  }

  const handleMarkAttendance = (index: number, isPresent: boolean) => {
    const updatedSubjects = [...subjects]
    if (isPresent) {
      updatedSubjects[index].attended++
    }
    
    if (updatedSubjects[index].total === 0 || updatedSubjects[index].total < updatedSubjects[index].attended) {
      updatedSubjects[index].total = updatedSubjects[index].attended
    } else {
      updatedSubjects[index].total++
    }

    setSubjects(updatedSubjects)
    saveToLocalStorage()
  }

  const handleDeleteSubject = (index: number) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      const updatedSubjects = subjects.filter((_, i) => i !== index)
      setSubjects(updatedSubjects)
      saveToLocalStorage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Attendance Tracker</h1>
          <p className="text-gray-600">Track your class attendance easily</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Target: </span>
          <input
            type="number"
            value={targetPercentage}
            onChange={(e) => {
              setTargetPercentage(Number(e.target.value))
              saveToLocalStorage()
            }}
            min="0"
            max="100"
            className="w-16 px-2 py-1 border rounded"
          />
          <span className="text-gray-600">%</span>
        </div>
      </div>

      <SubjectList
        subjects={subjects}
        targetPercentage={targetPercentage}
        onMarkAttendance={handleMarkAttendance}
        onDeleteSubject={handleDeleteSubject}
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        <i className="bi bi-plus-lg mr-2"></i>Add New Subject
      </button>

      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSubject={handleAddSubject}
      />
    </div>
  )
}

