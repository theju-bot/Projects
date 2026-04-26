import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { Column } from '@/models/Column.model'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { createColumnSchema } from '@/lib/validations/column.schema'
import { requireSession } from '@/lib/auth/getSession'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)

  await connectDB()

  const columns = await Column.find({ userId: session.user.id }).sort({
    order: 1,
  })

  return NextResponse.json({ success: true, data: columns })
})

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)

  const body = await req.json()
  const parsed = createColumnSchema.parse(body)

  await connectDB()

  const lastColumn = await Column.findOne({ userId: session.user.id }).sort({
    order: -1,
  })
  const order = lastColumn ? lastColumn.order + 1 : 0

  const column = await Column.create({
    userId: session.user.id,
    name: parsed.name,
    color: parsed.color ?? '#6366f1',
    order,
  })

  return NextResponse.json({ success: true, data: column }, { status: 201 })
})
