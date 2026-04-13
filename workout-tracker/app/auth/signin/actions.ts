'use server'

import { loginUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'All fields are required' }
  }

  try {
    const token = await loginUser(email, password)

    const cookie = await cookies()
    cookie.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 15 * 60,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return { error: message }
  }
}
