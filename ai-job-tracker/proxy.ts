import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  const session = req.cookies.get('better-auth.session_token')
  if (!session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
