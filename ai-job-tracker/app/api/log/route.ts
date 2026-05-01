import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, method, path, message, code } = body

    logger.error(method ?? 'CLIENT', path ?? source ?? 'unknown', 0, 0, {
      code,
      message,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
