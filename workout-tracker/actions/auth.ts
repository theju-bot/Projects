'use server'

import { registerUser } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginUser } from '@/lib/auth'

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
      maxAge: 60 * 15,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    return { error: message }
  }
}

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
      maxAge: process.env.NODE_ENV !== 'development' ? 60 * 15 : 60 * 60 * 24,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed'
    return { error: message }
  }
}

export async function logoutAction() {
  const cookie = await cookies()
  cookie.delete('jwt')
  redirect('/auth/signin')
}
