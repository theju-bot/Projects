import { NextRequest, NextResponse } from 'next/server'
import { idProps as exerciseIdProps } from '@/types/types'
import { connectDB } from '@/lib/mongodb'
import { Exercise } from '@/lib/models/Exercise'
import { getHeaderUser } from '@/lib/auth'
import { exerciseSchema } from '@/lib/schema/exerciseSchema'
import { withErrorHandler } from '@/lib/error/withErrorHandler'
import { AppError } from '@/lib/error/error'

async function putExercise(req: NextRequest, { params }: exerciseIdProps) {
  const searchParams = req.nextUrl.searchParams
  const pwd = searchParams.get('password')
  if (pwd !== process.env.EXERCISE_PASSWORD)
    throw new AppError('Unauthorized', 401)

  const { id } = await params

  getHeaderUser(req)

  const body = await req.json()
  const validatedData = exerciseSchema.parse(body)

  await connectDB()
  const updatedExercise = await Exercise.findByIdAndUpdate(id, validatedData, {
    new: true,
  })
  if (!updatedExercise) throw new AppError('Error Updating Exercise', 400)

  return NextResponse.json(updatedExercise)
}

async function deleteExercise(req: NextRequest, { params }: exerciseIdProps) {
  const searchParams = req.nextUrl.searchParams
  const pwd = searchParams.get('password')
  if (pwd !== process.env.EXERCISE_PASSWORD)
    throw new AppError('Unauthorized', 401)

  const { id } = await params

  getHeaderUser(req)

  await connectDB()
  const deletedExercise = await Exercise.findByIdAndDelete(id)
  if (!deletedExercise) throw new AppError('Error Deleting Exercise', 400)

  return NextResponse.json({ message: `Exercise ${id} deleted` })
}

export const PUT = withErrorHandler(putExercise)
export const DELETE = withErrorHandler(deleteExercise)
