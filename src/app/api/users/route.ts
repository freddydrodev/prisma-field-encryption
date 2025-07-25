import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, ssn } = body

    const user = await db.user.create({
      data: {
        email,
        name,
        ssn
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name, // This will be decrypted automatically
        ssn: user.ssn, // This will be decrypted automatically
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true, // This will be decrypted automatically
        ssn: true, // This will be decrypted automatically
        createdAt: true
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
