import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { mongoClient } from '@/lib/db/mongodb'

const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'playwright@test.com',
  password: process.env.TEST_USER_PASSWORD || 'Playwright1',
  name: 'Playwright Test User',
} as const

export async function POST(request: Request) {
  const secret = request.headers.get('x-test-secret')
  if (secret !== process.env.TEST_SECRET) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const db = mongoClient.db(process.env.MONGODB_DB || undefined)
    const existingUser = await db.collection('user').findOne({ email: TEST_USER.email })

    if (existingUser) {
      const userIdStr = existingUser._id.toString()
      await db.collection('account').deleteMany({ userId: userIdStr })
      await db.collection('session').deleteMany({ userId: userIdStr })
      await db.collection('verification').deleteMany({ identifier: TEST_USER.email })
      await db.collection('user').deleteOne({ _id: existingUser._id })
      console.log('🧹 Cleaned up existing test user:', TEST_USER.email)
    }

    console.log('🌱 Seeding test user...')
    const result = await auth.api.signUpEmail({
      body: {
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    })

    console.log('✅ User seeded successfully:', result.user?.id)
    return NextResponse.json({ ok: true, userId: result.user?.id })
  } catch (error) {
    console.error('❌ Seed Error:', error)
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 })
  }
}