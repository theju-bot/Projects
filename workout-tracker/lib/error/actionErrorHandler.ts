import { ZodError } from 'zod'
import { AppError } from './AppError'

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; message: string; issues?: unknown }

export function handleActionError<T = unknown>(err: unknown): ActionResult<T> {
  console.error('Server Action Error', err)

  if (err instanceof ZodError) {
    return {
      success: false,
      message: err.issues[0]?.message ?? 'Validation Failed',
    }
  }

  if (err instanceof AppError) {
    return { success: false, message: err.message }
  }

  if (err instanceof Error) {
    const e = err as any

    if (e.name === 'ValidationError') {
      const firstError = Object.values(e.errors)[0] as any
      return {
        success: false,
        message: firstError?.message ?? 'Validation failed',
      }
    }

    if (e.name === 'CastError') {
      return { success: false, message: `Invalid ${e.path}` }
    }

    if (e.code === 11000) {
      return { success: false, message: 'Duplicate entity' }
    }

    if (process.env.NODE_ENV === 'development') {
      return { success: false, message: e.message }
    }
  }

  return { success: false, message: 'Internal Server Error' }
}
