import { Subject } from '../types/subject'
import { calculateAttendance, calculateClassesToAttend, calculateClassesToBunk } from '../utils/calculations'

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onMarkAttendance(index, true)} 
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
          >
            Present
          </button>
          <button 
            onClick={() => onMarkAttendance(index, false)} 
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
          >
            Absent
          </button>
          <button 
            onClick={() => onDeleteSubject(index)} 
            className="text-red-500 hover:text-red-600 transition-colors duration-300"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Attendance: {subject.total > 0 ? (attendance).toFixed(1) : 0}%</span>
          <span>Classes Attended: {subject.attended}/{subject.total}</span>
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500"
            style={{ width: `${attendance}%` }}
          ></div>
        </div>
        <div className="text-sm">
          {attendance >= targetPercentage ? (
            <p className="text-green-600 dark:text-green-400">Target attendance achieved!</p>
          ) : classesNeeded > 0 ? (
            <p className="text-blue-600 dark:text-blue-400">
              Need to attend next {classesNeeded} {classesNeeded === 1 ? 'class' : 'classes'} to reach target
            </p>
          ) : classesToBunk > 0 ? (
            <p className="text-purple-600 dark:text-purple-400">
              Can skip next {classesToBunk} {classesToBunk === 1 ? 'class' : 'classes'} and still meet target
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Cannot skip any classes at the moment</p>
          )}
        </div>
      </div>
    </div>
  )
}
