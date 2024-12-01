import { Trash2, Check, X } from 'lucide-react'
import { calculateAttendance, calculateClassesToAttend, calculateClassesToBunk } from '../utils/calculations'

interface SubjectItemProps {
  subject: {
    id: string
    name: string
    attended: number
    total: number
  }
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

  const getProgressColor = (percentage: number) => {
    if (percentage >= targetPercentage) return 'bg-green-500'
    if (percentage >= targetPercentage - 10) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {subject.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Classes Attended: {subject.attended}/{subject.total}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onMarkAttendance(index, true)}
              className="inline-flex items-center px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg transition-colors duration-200"
              title="Mark Present"
            >
              <Check className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onMarkAttendance(index, false)}
              className="inline-flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors duration-200"
              title="Mark Absent"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDeleteSubject(index)}
              className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-400 rounded-lg transition-colors duration-200"
              title="Delete Subject"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Attendance: {subject.total > 0 ? attendance.toFixed(1) : 0}%
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Target: {targetPercentage}%
            </span>
          </div>
          
          <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${getProgressColor(attendance)}`}
              style={{ width: `${Math.min(100, attendance)}%` }}
            />
          </div>

          <div className="text-sm">
            {classesToBunk > 0 ? (
              <p className="text-green-600 dark:text-green-400 font-medium">
                🎮 You can skip next {classesToBunk} {classesToBunk === 1 ? 'class' : 'classes'} while maintaining {targetPercentage}% attendance
              </p>
            ) : classesNeeded > 0 ? (
              <p className="text-blue-600 dark:text-blue-400">
                📚 Need to attend next {classesNeeded} {classesNeeded === 1 ? 'class' : 'classes'} to reach {targetPercentage}% attendance
              </p>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-400">
                ⚠️ Attend the next class to maintain your attendance target
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
