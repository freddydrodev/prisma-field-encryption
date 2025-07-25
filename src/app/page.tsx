'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  ssn: string | null
  createdAt: string
}

interface Post {
  id: string
  title: string
  content: string | null
  published: boolean
  author: {
    id: string
    email: string
    name: string | null
  } | null
  createdAt: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [newUser, setNewUser] = useState({ email: '', name: '', ssn: '' })
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    authorId: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchPosts()
  }, [])

  const fetchUsers = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    setUsers(data.users || [])
  }

  const fetchPosts = async () => {
    const response = await fetch('/api/posts')
    const data = await response.json()
    setPosts(data.posts || [])
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    if (response.ok) {
      setNewUser({ email: '', name: '', ssn: '' })
      fetchUsers()
    }
  }

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
    if (response.ok) {
      setNewPost({ title: '', content: '', authorId: '' })
      fetchPosts()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Prisma Field Encryption Demo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Users (with encrypted name & SSN)
            </h2>

            <form onSubmit={createUser} className="mb-6 space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={e =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Name (will be encrypted)"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="SSN (will be encrypted)"
                value={newUser.ssn}
                onChange={e => setNewUser({ ...newUser, ssn: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Create User
              </button>
            </form>

            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="border rounded p-3">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Name:</strong> {user.name || 'N/A'}
                  </p>
                  <p>
                    <strong>SSN:</strong> {user.ssn || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Posts Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Posts (with encrypted content)
            </h2>

            <form onSubmit={createPost} className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={e =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Content (will be encrypted)"
                value={newPost.content}
                onChange={e =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="w-full p-2 border rounded h-20"
              />
              <select
                value={newPost.authorId}
                onChange={e =>
                  setNewPost({ ...newPost, authorId: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Author</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Create Post
              </button>
            </form>

            <div className="space-y-2">
              {posts.map(post => (
                <div key={post.id} className="border rounded p-3">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p>
                    <strong>Content:</strong> {post.content || 'N/A'}
                  </p>
                  <p>
                    <strong>Author:</strong>{' '}
                    {post.author?.name || post.author?.email || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>
              • User names and SSNs are automatically encrypted in the database
            </li>
            <li>• Post content is automatically encrypted in the database</li>
            <li>
              • Data is automatically decrypted when retrieved from the database
            </li>
            <li>
              • The encryption/decryption is transparent to your application
              code
            </li>
            <li>• Check the database directly to see the encrypted values</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
