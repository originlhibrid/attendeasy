import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Subject } from '@prisma/client'
import { useSession } from 'next-auth/react'

interface RealTimeContextType {
  subjects: Subject[]
  setSubjects: (subjects: Subject[]) => void
  loading: boolean
  error: string | null
  refetchSubjects: () => Promise<void>
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined)

export function RealTimeProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/subjects')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch subjects')
      }
      
      const data = await response.json()
      setSubjects(data)
    } catch (err) {
      console.error('Error fetching subjects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubjects()
    }
  }, [session?.user?.id])

  return (
    <RealTimeContext.Provider 
      value={{ 
        subjects,
        setSubjects, 
        loading, 
        error,
        refetchSubjects: fetchSubjects 
      }}
    >
      {children}
    </RealTimeContext.Provider>
  )
}

export function useRealTime() {
  const context = useContext(RealTimeContext)
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider')
  }
  return context
}
