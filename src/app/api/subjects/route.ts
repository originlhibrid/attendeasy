import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import Subject from '@/models/Subject'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Get all subjects for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const subjects = await Subject.find({ userId: session.user.id })
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching subjects' },
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

    const { name, attended, total } = await req.json()
    
    await connectToDatabase()
    const subject = await Subject.create({
      name,
      attended,
      total,
      userId: session.user.id
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating subject' },
      { status: 500 }
    )
  }
}
