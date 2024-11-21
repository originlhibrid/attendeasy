import { Subject } from '../types/subject'
import { calculateAttendance, calculateClassesToAttend, calculateClassesToBunk } from '@/utils/calculations'

interface SubjectItemProps {
  subject: Subject
  index: number
  targetPercentage: number
  onMarkAttendance: (index: number, isPresent: boolean) => void
  onDeleteSubject: (index: number) => void
}

export default function SubjectItem({
  subject,
  index,
  targetPercentage,
  onMarkAttendance,
  onDeleteSubject,
}: SubjectItemProps) {
  const attendance = calculateAttendance(subject.attended, subject.total)
  const classesNeeded = calculateClassesToAttend(subject.attended, subject.total, targetPercentage)
  const classesToBunk = calculateClassesToBunk(subject.attended, subject.total, targetPercentage)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <h3 className="font-semibold text-lg">{subject.name}</h3>
        <div className="space-x-2">
          <button onClick={() => onMarkAttendance(index, true)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Present</button>
          <button onClick={() => onMarkAttendance(index, false)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Absent</button>
          <button onClick={() => onDeleteSubject(index)} className="text-red-500 hover:text-red-600">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Attendance: {attendance.toFixed(1)}%</span>
          <span>Classes Attended: {subject.attended}/{subject.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: `${Math.min(100, attendance)}%` }}></div>
        </div>
        <div className="text-sm space-y-1">
          <p className={attendance >= targetPercentage ? 'text-green-600' : 'text-red-600'}>
            {classesNeeded === 0 
              ? 'Target attendance achieved!' 
              : `Need to attend ${classesNeeded} more classes to reach target`}
          </p>
          <p className="text-blue-600">
            {classesToBunk > 0 
              ? `You can skip ${classesToBunk} classes while maintaining target attendance` 
              : 'Cannot skip any classes at the moment'}
          </p>
        </div>
      </div>
    </div>
  )
}

