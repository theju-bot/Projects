'use server'

import { registerUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'All fields are required' }
  }

  try {
    const token = await registerUser(name, email, password)

    const cookie = await cookies()
    cookie.set('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 15 * 60,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    return { error: message }
  }
}
