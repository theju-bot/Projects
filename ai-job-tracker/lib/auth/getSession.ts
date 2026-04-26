import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { AppError } from '@/lib/errors/AppError'

export async function requireSession(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) throw new AppError('Unauthorized', 401, 'AUTH_REQUIRED')
  return session
}
