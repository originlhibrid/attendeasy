import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import Subject from '@/models/Subject'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { pusher } from '@/lib/pusher'

interface Params {
  params: {
    id: string
  }
}

// Update a subject
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await req.json()

    await connectToDatabase()
    const subject = await Subject.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { ...body, lastUpdated: new Date() },
      { new: true }
    )

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found' },
        { status: 404 }
      )
    }

    // Trigger Pusher event for real-time updates
    await pusher.trigger(
      `private-user-${session.user.id}`,
      'subject-updated',
      subject
    )

    return NextResponse.json(subject)
  } catch (error: any) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { message: error.message || 'Error updating subject' },
      { status: 500 }
    )
  }
}

// Delete a subject
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await connectToDatabase()
    const subject = await Subject.findOneAndDelete({
      _id: id,
      userId: session.user.id
    })

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found' },
        { status: 404 }
      )
    }

    // Trigger Pusher event for real-time updates
    await pusher.trigger(
      `private-user-${session.user.id}`,
      'subject-deleted',
      { id }
    )

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { message: error.message || 'Error deleting subject' },
      { status: 500 }
    )
  }
}
