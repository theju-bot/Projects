import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Exercise } from '@/lib/models/Exercise'
import { exerciseSchema } from '@/lib/schema/exerciseSchema'
import { getHeaderUser } from '@/lib/auth'
import { withErrorHandler } from '@/lib/error/withErrorHandler'
import { AppError } from '@/lib/error/AppError'
import { z } from 'zod'

async function getExercise(req: NextRequest) {
  getHeaderUser(req)
  await connectDB()
  const exercises = await Exercise.find()
  return NextResponse.json(exercises)
}

async function postExercise(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const pwd = searchParams.get('password')
  if (pwd !== process.env.EXERCISE_PASSWORD)
    throw new AppError('Unauthorized', 401)

  getHeaderUser(req)

  const body = await req.json()
  const dataArray = Array.isArray(body) ? body : [body]
  const validatedData = z.array(exerciseSchema).parse(dataArray)

  await connectDB()
  const exercise = await Exercise.insertMany(validatedData)

  return NextResponse.json(
    { message: 'Exercise created', count: exercise.length, exercise },
    { status: 201 },
  )
}

export const GET = withErrorHandler(getExercise)
export const POST = withErrorHandler(postExercise)
