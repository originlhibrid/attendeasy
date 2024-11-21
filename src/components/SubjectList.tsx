import { Subject } from '../types/subject'
import SubjectItem from './SubjectItem'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface SubjectListProps {
  subjects: Subject[]
  targetPercentage: number
  onMarkAttendance: (index: number, isPresent: boolean) => void
  onDeleteSubject: (index: number) => void
  onError?: (message: string) => void
}

export default function SubjectList({
  subjects,
  targetPercentage,
  onMarkAttendance,
  onDeleteSubject,
  onError,
}: SubjectListProps) {
  useEffect(() => {
    const subjectNames = subjects.map(s => s.name.toLowerCase())
    const hasDuplicates = new Set(subjectNames).size !== subjectNames.length
    
    if (hasDuplicates) {
      onError?.("Subject names must be unique")
    }
  }, [subjects])

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.name}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <SubjectItem
              subject={subject}
              index={index}
              targetPercentage={targetPercentage}
              onMarkAttendance={onMarkAttendance}
              onDeleteSubject={onDeleteSubject}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

