import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import clientPromise from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('attendeasy')

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ 
      email: email.toLowerCase().trim() 
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await db.collection('users').insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date()
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: result.insertedId
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', {
      message: error.message,
      code: error.code,
      codeName: error.codeName,
      stack: error.stack
    })

    return NextResponse.json(
      { message: 'Error creating user. Please try again.' },
      { status: 500 }
    )
  }
}
