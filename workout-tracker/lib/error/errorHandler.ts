import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from './AppError'

function isMongooseError(e: unknown): e is {
  name: string
  code?: number
  path?: string
  errors?: Record<string, { message: string }>
} {
  return e instanceof Error
}

export function errorHandler(err: unknown): NextResponse {
  console.error('API Error occurred : ', err)

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: err.issues[0]?.message ?? 'Validation Failed',
      },
      { status: 400 },
    )
  }

  if (err instanceof AppError) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: err.status },
    )
  }

  if (err instanceof Error) {
    const e = isMongooseError(err) ? err : (err as any)

    if (e.name === 'ValidationError') {
      const firstError = Object.values(e.errors)[0] as any
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message ?? 'Validation failed',
        },
        { status: 400 },
      )
    }

    if (e.name === 'CastError') {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid ${e.path}`,
        },
        { status: 400 },
      )
    }

    if (e.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Duplicate entity',
        },
        { status: 409 },
      )
    }
  }

  return NextResponse.json(
    {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : String(err)
          : 'Internal Server Error',
    },
    { status: 500 },
  )
}
