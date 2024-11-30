'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/lib/pusher'

interface RealTimeSubjectsProps {
  onSubjectCreated: (subject: any) => void
  onSubjectUpdated: (subject: any) => void
  onSubjectDeleted: (id: string) => void
}

export function RealTimeSubjects({
  onSubjectCreated,
  onSubjectUpdated,
  onSubjectDeleted,
}: RealTimeSubjectsProps) {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.user?.id) return

    // Subscribe to user's private channel
    const channel = pusherClient.subscribe(`private-user-${session.user.id}`)

    // Handle real-time events
    channel.bind('subject-created', onSubjectCreated)
    channel.bind('subject-updated', onSubjectUpdated)
    channel.bind('subject-deleted', (data: { id: string }) => {
      onSubjectDeleted(data.id)
    })

    // Cleanup on unmount
    return () => {
      channel.unbind('subject-created', onSubjectCreated)
      channel.unbind('subject-updated', onSubjectUpdated)
      channel.unbind('subject-deleted', onSubjectDeleted)
      pusherClient.unsubscribe(`private-user-${session.user.id}`)
    }
  }, [session?.user?.id, onSubjectCreated, onSubjectUpdated, onSubjectDeleted])

  return null
}
