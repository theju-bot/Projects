import { NextRequest, NextResponse } from 'next/server'
import { loginUserSchema } from '@/lib/schema/userSchema'
import { loginUser } from '@/lib/auth'
import { withErrorHandler } from '@/lib/error/withErrorHandler'

export async function postSignIn(request: NextRequest) {
  const body = await request.json()
  const validatedData = loginUserSchema.parse(body)

  const token = await loginUser(validatedData.email, validatedData.password)

  const response = NextResponse.json({
    success: true,
    message: 'Login successful',
  })

  response.cookies.set('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: process.env.NODE_ENV !== 'development' ? 60 * 15 : 60 * 60 * 24,
    path: '/',
  })

  return response
}

export const POST = withErrorHandler(postSignIn)
