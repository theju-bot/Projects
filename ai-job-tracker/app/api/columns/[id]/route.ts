import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongodb'
import { Column } from '@/models/Column.model'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { updateColumnSchema } from '@/lib/validations/column.schema'
import { AppError } from '@/lib/errors/AppError'
import { requireSession } from '@/lib/auth/getSession'

export const PATCH = withErrorHandler(async (req: NextRequest, ctx: any) => {
  const session = await requireSession(req)

  const { id } = await ctx.params

  const body = await req.json()
  const parsed = updateColumnSchema.parse(body)

  await connectDB()

  const column = await Column.findOneAndUpdate(
    { _id: id, userId: session.user.id },
    { $set: parsed },
    { new: true },
  )

  if (!column) throw new AppError('Column not found', 404, 'COLUMN_NOT_FOUND')

  return NextResponse.json({ success: true, data: column })
})

export const DELETE = withErrorHandler(async (req: NextRequest, ctx: any) => {
  const session = await requireSession(req)

  const { id } = await ctx.params

  await connectDB()

  const column = await Column.findOneAndDelete({
    _id: id,
    userId: session.user.id,
  })

  if (!column) throw new AppError('Column not found', 404, 'COLUMN_NOT_FOUND')

  return NextResponse.json({ success: true, data: column })
})
