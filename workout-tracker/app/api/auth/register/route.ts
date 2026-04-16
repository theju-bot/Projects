import { NextRequest, NextResponse } from 'next/server'
import { registerUserSchema } from '@/lib/schema/userSchema'
import { registerUser } from '@/lib/auth'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: err.issues[0]?.message || 'Validation Error',
        },
        { status: 400 },
      )
    }

    if (err instanceof Error) {
      if (err.message === 'User already exists') {
        return NextResponse.json(
          {
            success: false,
            error: err.message,
          },
          { status: 409 },
        )
      }
    }
    console.error('Registration failed:', err)
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
      },
      { status: 500 },
    )
  }
}
