import { useEffect } from 'react'
import { Subject } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export function useRealTimeSubjects(userId: string, onUpdate: (subject: Subject) => void) {
  useEffect(() => {
    const subscription = prisma.$subscribe
      .subject({
        where: {
          AND: [
            { userId: userId },
            {
              OR: [
                { attended: { set: true } },
                { total: { set: true } }
              ]
            }
          ]
        }
      })
      .on('update', (event) => {
        onUpdate(event.after)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, onUpdate])
}
