import { NextResponse } from 'next/server'
import { mongoClient } from '@/lib/db/mongodb'
import { connectDB } from '@/lib/db/mongodb'
import { Column } from '@/models/Column.model'

const TEST_USER_ID = 'test-user-playwright-001'
const SESSION_TOKEN = 'playwright-test-session-token'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  await connectDB()
  const db = mongoClient.db()

  // Upsert test user
  await db.collection('user').updateOne(
    { _id: TEST_USER_ID as any },
    {
      $set: {
        _id: TEST_USER_ID,
        id: TEST_USER_ID,
        name: 'Playwright Test User',
        email: 'playwright@test.com',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        targetRole: '',
        skills: [],
        yearsOfExperience: 0,
        bio: '',
        preferredModel: '',
        openRouterKey: '',
      },
    },
    { upsert: true },
  )

  // Upsert default columns for test user
  const existing = await db
    .collection('column')
    .findOne({ userId: TEST_USER_ID })
  if (!existing) {
    await Column.insertMany([
      { name: 'Saved', color: '#6366f1', order: 0, userId: TEST_USER_ID },
      { name: 'Applying', color: '#f59e0b', order: 1, userId: TEST_USER_ID },
      { name: 'Applied', color: '#3b82f6', order: 2, userId: TEST_USER_ID },
      { name: 'Interview', color: '#8b5cf6', order: 3, userId: TEST_USER_ID },
      { name: 'Offer', color: '#10b981', order: 4, userId: TEST_USER_ID },
      { name: 'Rejected', color: '#ef4444', order: 5, userId: TEST_USER_ID },
    ])
  }

  // Upsert session
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
  await db.collection('session').updateOne(
    { token: SESSION_TOKEN },
    {
      $set: {
        token: SESSION_TOKEN,
        userId: TEST_USER_ID,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'Playwright',
      },
    },
    { upsert: true },
  )

  return NextResponse.json({ token: SESSION_TOKEN })
}