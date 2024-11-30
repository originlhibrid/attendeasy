import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import Subject from '@/models/Subject'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { pusher } from '@/lib/pusher'

// Get all subjects for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const subjects = await Subject.find({ userId: session.user.id })
      .sort({ lastUpdated: -1 })
      .select('-__v')
      .lean()

    return NextResponse.json(subjects)
  } catch (error: any) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { message: error.message || 'Error fetching subjects' },
      { status: 500 }
    )
  }
}

// Create a new subject
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, attended, total } = body

    // Validate input
    if (!name || attended < 0 || total < 0 || attended > total) {
      return NextResponse.json(
        { message: 'Invalid input data' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check for duplicate subject names for this user
    const existingSubject = await Subject.findOne({
      userId: session.user.id,
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    })

    if (existingSubject) {
      return NextResponse.json(
        { message: 'Subject with this name already exists' },
        { status: 409 }
      )
    }

    const subject = await Subject.create({
      name,
      attended,
      total,
      userId: session.user.id,
      lastUpdated: new Date()
    })

    // Trigger Pusher event for real-time updates
    await pusher.trigger(
      `private-user-${session.user.id}`,
      'subject-created',
      subject
    )

    return NextResponse.json(subject, { status: 201 })
  } catch (error: any) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { message: error.message || 'Error creating subject' },
      { status: 500 }
    )
  }
}
