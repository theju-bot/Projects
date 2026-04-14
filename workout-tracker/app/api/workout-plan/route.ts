import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { WorkoutPlan } from '@/models/WorkoutPlan'
import { getSession } from '@/lib/getSession'
import { workoutPlanSchema } from '@/lib/validations/workoutPlanSchema'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const plans = await WorkoutPlan.find({ user: session.userId }).populate(
    'exercises.exercise',
  )

  return NextResponse.json(plans)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  const validation = workoutPlanSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error.issues,
      },
      { status: 400 },
    )
  }

  const plan = await WorkoutPlan.create({
    ...validation.data,
    user: session.userId,
    date: validation.data.date ?? new Date(),
  })

  return NextResponse.json(plan, { status: 201 })
}
