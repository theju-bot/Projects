import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (
    pathname.startsWith('/dashboard') ||
    (pathname.startsWith('/api') && !pathname.startsWith('/api/auth'))
  ) {
    const session = req.cookies.get('jwt')?.value
    if (!session) {
      const redirectUrl = new URL('/auth/signin', req.url)
      redirectUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = { matcher: '/dashboard/:path*' }
