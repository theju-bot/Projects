import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from './error'

export function errorHandler(err: unknown): NextResponse {
  console.error('API Error occurred : ', err)

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        issues: err.issues,
      },
      { status: 400 },
    )
  }

  if (err instanceof Error) {
    const e = err as any

    if (e.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Database validation failed',
          details: e.errors,
        },
        { status: 400 },
      )
    }

    if (e.name === 'CastError') {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid ${e.path}`,
        },
        { status: 400 },
      )
    }

    if (e.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate entity',
        },
        { status: 409 },
      )
    }
  }

  if (err instanceof AppError) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.status },
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && {
        message: err instanceof Error ? err.message : String(err),
      }),
    },
    { status: 500 },
  )
}
