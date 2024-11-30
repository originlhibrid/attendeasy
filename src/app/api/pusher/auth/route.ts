import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { pusher } from '@/lib/pusher'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.error('Auth failed: No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const socketId = data.socket_id
    const channel = data.channel_name

    if (!socketId || !channel) {
      console.error('Auth failed: Missing socket_id or channel_name')
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Only authorize if the channel belongs to the current user
    if (!channel.startsWith(`private-user-${session.user.id}`)) {
      console.error('Auth failed: Invalid channel', { channel, userId: session.user.id })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authResponse = pusher.authorizeChannel(socketId, channel)
    console.log('Auth success:', { channel, socketId })
    
    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Pusher auth error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
