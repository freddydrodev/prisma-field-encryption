import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, authorId } = body

    const post = await db.post.create({
      data: {
        title,
        content, // This will be encrypted automatically
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true // This will be decrypted automatically
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Post created successfully',
      post: {
        id: post.id,
        title: post.title,
        content: post.content, // This will be decrypted automatically
        published: post.published,
        author: post.author,
        createdAt: post.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const posts = await db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true // This will be decrypted automatically
          }
        }
      }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
