import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { WorkoutPlan } from '@/lib/models/WorkoutPlan'
import { workoutPlanSchema } from '@/lib/schema/workoutPlanSchema'
import { getHeaderUser } from '@/lib/auth'
import { Types } from 'mongoose'
import { withErrorHandler } from '@/lib/error/withErrorHandler'

async function getWorkoutPlans(req: NextRequest) {
  const session = getHeaderUser(req)
  await connectDB()
  const plans = await WorkoutPlan.find({ user: session.userId }).populate(
    'exercises.exercise',
  )

  return NextResponse.json(plans)
}

async function postWorkoutPlan(req: NextRequest) {
  const session = getHeaderUser(req)
  await connectDB()
  const body = await req.json()

  const validation = workoutPlanSchema.parse(body)
  const plan = await WorkoutPlan.create({
    ...validation,
    user: new Types.ObjectId(session.userId),
    date: validation.date ?? new Date(),
  })

  return NextResponse.json(plan, { status: 201 })
}

export const GET = withErrorHandler(getWorkoutPlans)
export const POST = withErrorHandler(postWorkoutPlan)
