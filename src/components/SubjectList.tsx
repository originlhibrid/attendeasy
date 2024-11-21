import { Subject } from '../types/subject'
import SubjectItem from './SubjectItem'

interface SubjectListProps {
  subjects: Subject[]
  targetPercentage: number
  onMarkAttendance: (index: number, isPresent: boolean) => void
  onDeleteSubject: (index: number) => void
}

export default function SubjectList({
  subjects,
  targetPercentage,
  onMarkAttendance,
  onDeleteSubject,
}: SubjectListProps) {
  return (
    <div className="space-y-4 mb-8">
      {subjects.map((subject, index) => (
        <SubjectItem
          key={index}
          subject={subject}
          index={index}
          targetPercentage={targetPercentage}
          onMarkAttendance={onMarkAttendance}
          onDeleteSubject={onDeleteSubject}
        />
      ))}
    </div>
  )
}

