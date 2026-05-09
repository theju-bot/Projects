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

  if (parsed.order !== undefined || parsed.columnId !== undefined) {
    const existingJob = await Job.findOne({ _id: id, userId: session.user.id })
    if (!existingJob) throw new AppError('Job not found', 404, 'JOB_NOT_FOUND')

    const oldColumnId = existingJob.columnId.toString()
    const newColumnId = parsed.columnId || oldColumnId
    const newOrder = parsed.order ?? existingJob.order

    if (oldColumnId === newColumnId) {
      const oldOrder = existingJob.order
      if (oldOrder !== newOrder) {
        if (newOrder < oldOrder) {
          await Job.updateMany(
            {
              userId: session.user.id,
              columnId: newColumnId,
              _id: { $ne: id },
              order: { $gte: newOrder, $lt: oldOrder },
            },
            { $inc: { order: 1 } },
          )
        } else {
          await Job.updateMany(
            {
              userId: session.user.id,
              columnId: newColumnId,
              _id: { $ne: id },
              order: { $gt: oldOrder, $lte: newOrder },
            },
            { $inc: { order: -1 } },
          )
        }
      }
    } else {
      await Job.updateMany(
        {
          userId: session.user.id,
          columnId: oldColumnId,
          order: { $gt: existingJob.order },
        },
        { $inc: { order: -1 } },
      )
      await Job.updateMany(
        {
          userId: session.user.id,
          columnId: newColumnId,
          order: { $gte: newOrder },
        },
        { $inc: { order: 1 } },
      )
    }

    const job = await Job.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { ...parsed, columnId: newColumnId, order: newOrder } },
      { new: true },
    )

    return NextResponse.json({ success: true, data: job })
  }

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
