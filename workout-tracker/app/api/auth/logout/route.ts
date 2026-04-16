import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(
    new URL('/auth/signin', process.env.NEXT_PUBLIC_BASE_URL),
  )

  response.cookies.delete('jwt')

  return response
}
