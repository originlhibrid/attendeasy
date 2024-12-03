import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '../auth/auth.config';

// Get all subjects for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subjects = await prisma.subject.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

// Create a new subject
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, attended = 0, total = 0 } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check for existing subject with same name
    const existingSubject = await prisma.subject.findFirst({
      where: {
        userId: session.user.id,
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'A subject with this name already exists' },
        { status: 409 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        attended,
        total,
        userId: session.user.id
      }
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error creating subject:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
  }
}
