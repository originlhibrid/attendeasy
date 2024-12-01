import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../../auth/auth.config';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { attended, total } = await req.json()

    // Validate the subject belongs to the user
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSubject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    const subject = await prisma.subject.update({
      where: {
        id: params.id,
      },
      data: {
        attended,
        total,
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 })
  }
}

// Delete a subject
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate the subject belongs to the user
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingSubject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    await prisma.subject.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
  }
}
