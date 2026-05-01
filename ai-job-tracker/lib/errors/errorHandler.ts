import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from './AppError'
import { logger } from '../logger'

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>

export function withErrorHandler(handler: RouteHandler) {
  return async (req: NextRequest, ctx?: any): Promise<NextResponse> => {
    const start = Date.now()
    const method = req.method
    const path = new URL(req.url).pathname

    try {
      const response = await handler(req, ctx)
      const duration = Date.now() - start
      logger.request(method, path, response.status, duration)
      return response
    } catch (err) {
      const duration = Date.now() - start
      const errorResponse = handleApiError(err)

      logger.error(method, path, errorResponse.status, duration, {
        code: err instanceof AppError ? err.code : err instanceof ZodError ? 'VALIDATION_ERROR' : undefined,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      })

      return errorResponse
    }
  }
}

function handleApiError(err: any): NextResponse {
  console.error('Api Error', err)

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: err.issues[0].message ?? 'Validation failed',
      },
      { status: 400 },
    )
  }

  if (err instanceof AppError) {
    return NextResponse.json(
      { success: false, code: err.code ?? 'APP_ERROR', message: err.message },
      { status: err.status },
    )
  }

  if (err instanceof Error) {
    const e = err as any

    if (e.name === 'ValidationError') {
      const first = Object.values(e.errors)[0] as any
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: first?.message ?? 'Validation failed',
        },
        { status: 422 },
      )
    }

    if (e.name === 'CastError') {
      const first = Object.values(e.errors)[0] as any
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_ID',
          message: `Invalid ${e.path}`,
        },
        { status: 400 },
      )
    }

    if (e.code === 11000) {
      const first = Object.values(e.errors)[0] as any
      return NextResponse.json(
        {
          success: false,
          code: 'DUPLICATE',
          message: 'Duplicate entity',
        },
        { status: 409 },
      )
    }
  }

  return NextResponse.json(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : String(err)
          : 'Internal server error',
    },
    { status: 500 },
  )
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; code: string; message: string }

type ActionFn<TArgs extends unknown[], TData> = (
  ...args: TArgs
) => Promise<ActionResult<TData>>

export function withAction<TArgs extends unknown[], TData>(
  fn: (...args: TArgs) => Promise<TData>,
): ActionFn<TArgs, TData> {
  return async (...args: TArgs): Promise<ActionResult<TData>> => {
    try {
      const data = await fn(...args)
      return { success: true, data }
    } catch (err) {
      return handleActionError(err)
    }
  }
}

function handleActionError<T = unknown>(err: unknown): ActionResult<T> {
  console.error('[Action Error]', err)

  if (err instanceof ZodError) {
    return {
      success: false,
      code: 'VALIDATION_ERROR',
      message: err.issues[0]?.message ?? 'Validation failed',
    }
  }

  if (err instanceof AppError) {
    return {
      success: false,
      code: err.code ?? 'APP_ERROR',
      message: err.message,
    }
  }

  if (err instanceof Error) {
    const e = err as any

    if (e.name === 'ValidationError') {
      const first = Object.values(e.errors)[0] as any
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        message: first?.message ?? 'Validation failed',
      }
    }

    if (e.name === 'CastError') {
      return {
        success: false,
        code: 'INVALID_ID',
        message: `Invalid ${e.path}`,
      }
    }

    if (e.code === 11000) {
      return { success: false, code: 'DUPLICATE', message: 'Duplicate entity' }
    }

    if (process.env.NODE_ENV === 'development') {
      return { success: false, code: 'INTERNAL_ERROR', message: e.message }
    }
  }

  return {
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'Internal Server Error',
  }
}
