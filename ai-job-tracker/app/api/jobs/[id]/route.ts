import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { Job } from '@/models/Job.model'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { updateJobSchema } from '@/lib/validations/job.schema'
import { AppError } from '@/lib/errors/AppError'
import { requireSession } from '@/lib/auth/getSession'

export const GET = withErrorHandler(async (req: NextRequest, ctx: any) => {
  const session = await requireSession(req)

  const { id } = await ctx.params

  await connectDB()

  const job = await Job.findOne({ _id: id, userId: session.user.id })

  if (!job) throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')

  return NextResponse.json({ success: true, data: job })
})

export const PATCH = withErrorHandler(async (req: NextRequest, ctx: any) => {
  const session = await requireSession(req)

  const { id } = await ctx.params

  const body = await req.json()
  const parsed = updateJobSchema.parse(body)

  await connectDB()

  const job = await Job.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: parsed },
    { new: true },
  )

  if (!job) throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')

  return NextResponse.json({ success: true, data: job })
})

export const DELETE = withErrorHandler(async (req: NextRequest, ctx: any) => {
  const session = await requireSession(req)

  const { id } = await ctx.params

  await connectDB()

  const job = await Job.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  })

  if (!job) throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')

  return NextResponse.json({ success: true, message: 'Job deleted' })
})
