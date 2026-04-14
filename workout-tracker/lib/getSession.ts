import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function getSession() {
  const cookie = await cookies()
  const token = cookie.get('jwt')?.value

  if (!token) return null

  try {
    const secrect = process.env.JWT_SECRET
    if (!secrect) throw new Error('JWT_SECRET is missing')

    const payload = jwt.verify(token, secrect) as {
      userId: string
      userName: string
    }
    return payload
  } catch (err: unknown) {
    return null
  }
}
