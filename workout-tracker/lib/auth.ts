import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '@/models/User'
import { connectDB } from './mongodb'

function accessToken(userId: string, userName: string): string {
  const JWT_SECRET = process.env.JWT_SECRET as string
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing')
  }

  return jwt.sign({ userId, userName }, JWT_SECRET, {
    expiresIn: '15m',
    issuer: 'theju',
  })
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<string> {
  await connectDB()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPwd = await bcrypt.hash(password, 10)
  const newUser = await User.create({ name, email, password: hashedPwd })

  return accessToken(newUser._id, newUser.name)
}

export async function loginUser(
  email: string,
  password: string,
): Promise<string> {
  await connectDB()

  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  return accessToken(user._id, user.name)
}
