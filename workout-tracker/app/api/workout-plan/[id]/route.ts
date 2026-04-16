import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { WorkoutPlan } from '@/lib/models/WorkoutPlan'
import { getHeaderUser } from '@/lib/auth'
import type { workoutPlanIdProps } from '@/types/types'
import { workoutPlanSchema } from '@/lib/schema/workoutPlanSchema'

export async function GET(req: NextRequest, { params }: workoutPlanIdProps) {
  const { id } = await params
  const session = getHeaderUser(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const workoutPlan = await WorkoutPlan.findById(id)

  if (!workoutPlan) {
    return NextResponse.json(
      { error: 'Workout plan not found' },
      { status: 404 },
    )
  }

  if (workoutPlan.user.toString() !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(workoutPlan)
}

export async function PUT(req: NextRequest, { params }: workoutPlanIdProps) {
  const { id } = await params
  const session = getHeaderUser(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const workoutPlan = await WorkoutPlan.findById(id)

  if (!workoutPlan) {
    return NextResponse.json(
      { error: 'Workout plan not found' },
      { status: 404 },
    )
  }

  if (workoutPlan.user.toString() !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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

  const updatedWorkoutPlan = await WorkoutPlan.findByIdAndUpdate(id, body, {
    new: true,
  })
  return NextResponse.json(updatedWorkoutPlan)
}

export async function DELETE(req: NextRequest, { params }: workoutPlanIdProps) {
  const { id } = await params
  const session = getHeaderUser(req)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const workoutPlan = await WorkoutPlan.findById(id)

  if (!workoutPlan) {
    return NextResponse.json(
      { error: 'Workout plan not found' },
      { status: 404 },
    )
  }

  if (workoutPlan.user.toString() !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await WorkoutPlan.findByIdAndDelete(id)
  return NextResponse.json({ message: `Workout plan ${id} deleted` })
}
