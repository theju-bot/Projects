import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Exercise } from '@/lib/models/Exercise'
import { exerciseSchema } from '@/lib/schema/exerciseSchema'
import { z } from 'zod'
import { getHeaderUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = getHeaderUser(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    
    const body = await req.json()
    const validatedData = exerciseSchema.parse(body)

    await connectDB()

    const exercise = await Exercise.create({
      ...validatedData,
    })

    return NextResponse.json({ message: 'Exercise created' }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: err.issues[0]?.message || 'Validation Error',
      })
    }

    console.log('Exercise creation error:', err)
    return NextResponse.json(
      { success: false, error: 'Exercise creation Failed' },
      { status: 500 },
    )
  }
}
