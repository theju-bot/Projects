import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { Job } from '@/models/Job.model'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { createJobSchema } from '@/lib/validations/job.schema'
import { requireSession } from '@/lib/auth/getSession'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)

  await connectDB()

  const jobs = await Job.find({ userId: session.user.id }).sort({ order: 1 })

  return NextResponse.json({ success: true, data: jobs })
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)

  const body = await req.json()
  const parsed = createJobSchema.parse(body)

  await connectDB()

  const lastJob = await Job.findOne({
    userId: session.user.id,
    columnId: parsed.columnId,
  }).sort({ order: -1 })

  const order = lastJob ? lastJob.order + 1 : 0

  const job = await Job.create({
    userId: session.user.id,
    ...parsed,
    order,
  })

  return NextResponse.json({ success: true, data: job }, { status: 201 })
})
