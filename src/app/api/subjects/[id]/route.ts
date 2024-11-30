import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import Subject from '@/models/Subject'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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
    const { name, attended, total } = await req.json()

    await connectToDatabase()
    const subject = await Subject.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { name, attended, total },
      { new: true }
    )

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating subject' },
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

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting subject' },
      { status: 500 }
    )
  }
}
