import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const protectedRoutes = ['/dashboard', '/jobs', '/settings', '/analytics']
const authRoutes = ['/login', '/register']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))

  const session = getSessionCookie(req)

  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('callbackURL', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobs/:path*',
    '/settings/:path*',
    '/analytics/:path*',
    '/login',
    '/register',
  ],
}

// __Secure-better-auth.session_token
// better-auth.session_token
