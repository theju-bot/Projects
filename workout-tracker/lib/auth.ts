import bcrypt from 'bcrypt'
import { SignJWT, jwtVerify } from 'jose'
import { User } from '@/lib/models/User'
import { connectDB } from './mongodb'
import { AuthPayload } from '@/types/types'
import { NextRequest } from 'next/server'
import { AppError } from './error/AppError'

const JWT_SECRET = process.env.JWT_SECRET as string
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing')
}
const secret = new TextEncoder().encode(JWT_SECRET)

async function createAccessToken(userId: string): Promise<string> {
  const payload: AuthPayload = { userId }

  const expirationTime = process.env.NODE_ENV !== 'development' ? '15m' : '1d'

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .setIssuer('theju')
    .sign(secret)
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<string> {
  await connectDB()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError('User already exists', 409)
  }

  const hashedPwd = await bcrypt.hash(password, 10)
  const newUser = await User.create({ name, email, password: hashedPwd })

  return await createAccessToken(newUser._id.toString())
}

export async function loginUser(
  email: string,
  password: string,
): Promise<string> {
  await connectDB()

  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError('Invalid email or password', 401)
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401)
  }

  return await createAccessToken(user._id.toString())
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    })
    return payload as AuthPayload
  } catch (err) {
    console.error('Token verification failed:', err)
    return null
  }
}

export function getHeaderUser(req: NextRequest): AuthPayload {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    throw new AppError('Unauthorized', 401)
  }
  return { userId }
}

export function checkOwnership(resource: any, session: AuthPayload) {
  const ownerId = resource.user?._id?.toString() ?? resource.user?.toString()
  if (ownerId !== session.userId) {
    throw new AppError('Forbidden', 403)
  }
}
