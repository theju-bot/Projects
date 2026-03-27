import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  // const session = req.cookies.get('better-auth.session_token')
  const session = getSessionCookie(req)

  if (!session) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('callbackURL', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
// __Secure-better-auth.session_token
