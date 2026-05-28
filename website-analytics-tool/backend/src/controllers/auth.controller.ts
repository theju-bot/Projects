import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import User from '../models/User.model.js'

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string }

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const user = await User.findOne({ email }).exec()
    if (user) {
      res.status(409).json({ message: 'Email already exists' })
      return
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const newUser = await User.create({ email, password: hashedPwd })

    res
      .status(201)
      .json({ message: 'User created successfully', userId: newUser._id })
  } catch (err) {
    next(err)
  }
}

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string }

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const user = await User.findOne({ email }).exec()
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m', issuer: 'theju' },
    )

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d', issuer: 'theju' },
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({ message: 'Logged in successfully' })
  } catch (err) {
    next(err)
  }
}

const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken as string | undefined

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { userId: string }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m', issuer: 'theju' },
    )

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    })

    res.status(200).json({ message: 'Token refreshed' })
  } catch (err) {
    next(err)
  }
}

const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    })

    res.status(200).json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

export { register, login, refresh, logout }
