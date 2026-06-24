import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError } from './AppError'
import { logger } from '../logger'

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>

type ErrorInfo = { code: string; message: string; status?: number }

function classifyError(err: unknown): ErrorInfo {
  if (err instanceof ZodError) {
    return { code: 'VALIDATION_ERROR', message: err.issues[0]?.message ?? 'Validation failed', status: 400 }
  }
  if (err instanceof AppError) {
    return { code: err.code ?? 'APP_ERROR', message: err.message, status: err.status }
  }
  if (err instanceof Error) {
    if (err.name === 'ValidationError') {
      const first = Object.values((err as any).errors)?.[0] as any
      return { code: 'VALIDATION_ERROR', message: first?.message ?? 'Validation failed', status: 422 }
    }
    if (err.name === 'CastError') {
      return { code: 'INVALID_ID', message: `Invalid ${(err as any).path}`, status: 400 }
    }
    if ((err as any).code === 11000) {
      return { code: 'DUPLICATE', message: 'Duplicate entity', status: 409 }
    }
  }
  return {
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : 'Internal server error',
  }
}

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
        code: classifyError(err).code,
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      })

      return errorResponse
    }
  }
}

function handleApiError(err: unknown): NextResponse {
  const info = classifyError(err)
  return NextResponse.json(
    { success: false, code: info.code, message: info.message },
    { status: info.status ?? 500 },
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
  const info = classifyError(err)
  return { success: false, code: info.code, message: info.message }
}
