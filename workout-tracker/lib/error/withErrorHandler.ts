import { NextRequest, NextResponse } from 'next/server'
import { errorHandler } from './errorHandler'

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>

export function withErrorHandler(handler: RouteHandler) {
  return async (req: NextRequest, ctx?: any): Promise<NextResponse> => {
    try {
      return await handler(req, ctx)
    } catch (err) {
      return errorHandler(err)
    }
  }
}
