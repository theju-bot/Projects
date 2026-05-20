import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { mongoClient } from '@/lib/db/mongodb' 

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  try {
    const db = mongoClient.db(process.env.MONGODB_DB || undefined)
    const testEmail = 'playwright@test.com'

    const existingUser = await db.collection('user').findOne({ email: testEmail })

    if (existingUser) {
      const userIdStr = existingUser._id.toString()
      
      await db.collection('account').deleteMany({ userId: userIdStr })
      await db.collection('session').deleteMany({ userId: userIdStr })
      await db.collection('verification').deleteMany({ identifier: testEmail })
      await db.collection('user').deleteOne({ _id: existingUser._id })
      
      console.log('🧹 Cleaned up existing test user:', testEmail)
    }

    console.log('🌱 Seeding test user...')
    const result = await auth.api.signUpEmail({
      body: {
        name: 'Playwright Test User',
        email: testEmail,
        password: 'Playwright1',
      },
    })

    console.log('✅ User seeded successfully:', result.user?.id)
    return NextResponse.json({ ok: true, userId: result.user?.id })

  } catch (error) {
    console.error('❌ Seed Error:', error)
    return NextResponse.json({ 
      error: 'Seeding failed', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}