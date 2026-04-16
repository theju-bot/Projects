import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

const PUBLIC_PATHS = ['/api/auth', '/auth']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const cookie = req.cookies.get('jwt')?.value
  if (!cookie) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const payload = await verifyJWT(cookie)
  if (!payload) {
    const response = NextResponse.redirect(new URL('/auth/signin', req.url))
    response.cookies.delete('jwt')
    return response
  }

  const headers = new Headers(req.headers)
  headers.set('x-user-id', payload.userId)

  return NextResponse.next({ request: { headers } })
}

export const config = { matcher: ['/dashboard/:path*', '/api/:path*'] }
