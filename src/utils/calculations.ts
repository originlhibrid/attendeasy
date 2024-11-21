export function calculateAttendance(attended: number, total: number): number {
  if (total === 0) return 0
  return (attended / total) * 100
}

export function calculateClassesToAttend(attended: number, total: number, target: number): number {
  if (total === 0) return 0
  const targetDecimal = target / 100
  const requiredClasses = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal))
  return Math.max(0, requiredClasses)
}

export function calculateClassesToBunk(attended: number, total: number, target: number): number {
  if (total === 0) return 0
  const targetDecimal = target / 100
  const maxAbsences = Math.floor(attended / targetDecimal - total)
  return Math.max(0, maxAbsences)
}

