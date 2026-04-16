import { NextRequest, NextResponse } from 'next/server'
import { registerUserSchema } from '@/lib/schema/userSchema'
import { registerUser } from '@/lib/auth'
import { withErrorHandler } from '@/lib/error/withErrorHandler'

async function postRegister(req: NextRequest) {
  const body = await req.json()
  const validatedData = registerUserSchema.parse(body)

  const token = await registerUser(
    validatedData.name,
    validatedData.email,
    validatedData.password,
  )

  const response = NextResponse.json(
    {
      success: true,
      message: 'Registration Successful',
    },
    { status: 201 },
  )

  response.cookies.set('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 60 * 15,
    path: '/',
  })

  return response
}

export const POST = withErrorHandler(postRegister)
