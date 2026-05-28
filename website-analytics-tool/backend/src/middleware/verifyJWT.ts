import Jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import type { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  userId?: mongoose.Types.ObjectId
}

const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.accessToken as string | undefined

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const decoded = Jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as { userId: string }
    req.userId = new mongoose.Types.ObjectId(decoded.userId)
    next()
  } catch {
    res.status(403).json({ message: 'Forbidden' })
  }
}

export default verifyJWT
