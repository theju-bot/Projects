import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { WorkoutPlan } from '@/lib/models/WorkoutPlan'
import { getHeaderUser, checkOwnership } from '@/lib/auth'
import type { idProps as workoutPlanIdProps } from '@/types/types'
import { workoutPlanSchema } from '@/lib/schema/workoutPlanSchema'
import { withErrorHandler } from '@/lib/error/withErrorHandler'
import { AppError } from '@/lib/error/error'

async function getWorkoutPlan(
  req: NextRequest,
  { params }: workoutPlanIdProps,
) {
  const { id } = await params
  const session = getHeaderUser(req)

  await connectDB()
  const workoutPlan = await WorkoutPlan.findById(id)
  if (!workoutPlan) throw new AppError('Workout plan not found', 404)

  checkOwnership(workoutPlan, session)

  return NextResponse.json(workoutPlan)
}

async function putWorkoutPlan(
  req: NextRequest,
  { params }: workoutPlanIdProps,
) {
  const { id } = await params
  const session = getHeaderUser(req)

  await connectDB()
  const workoutPlan = await WorkoutPlan.findById(id)
  if (!workoutPlan) throw new AppError('Workout plan not found', 404)

  checkOwnership(workoutPlan, session)

  const body = await req.json()
  workoutPlanSchema.parse(body)

  const updatedWorkoutPlan = await WorkoutPlan.findByIdAndUpdate(id, body, {
    new: true,
  })

  return NextResponse.json(updatedWorkoutPlan)
}

export async function deleteWorkoutPlan(
  req: NextRequest,
  { params }: workoutPlanIdProps,
) {
  const { id } = await params
  const session = getHeaderUser(req)

  await connectDB()
  const workoutPlan = await WorkoutPlan.findById(id)
  if (!workoutPlan) throw new AppError('Workout plan not found', 404)

  checkOwnership(workoutPlan, session)

  await WorkoutPlan.findByIdAndDelete(id)
  return NextResponse.json({ message: `Workout plan ${id} deleted` })
}

export const GET = withErrorHandler(getWorkoutPlan)
export const PUT = withErrorHandler(putWorkoutPlan)
export const DELETE = withErrorHandler(deleteWorkoutPlan)
