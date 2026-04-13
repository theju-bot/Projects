import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith('/dashboard')) return NextResponse.next()

  const session = req.cookies.get('jwt')?.value
  if (!session) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('callbackUrl', req.nextUrl.pathname) // adds the callbackUrl query parameter and changes the pathname webfriendly(%20 instead of space) 
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = { matcher: '/dashboard/:path*' }
