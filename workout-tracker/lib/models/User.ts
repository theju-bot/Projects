import { Schema, model, models } from 'mongoose'
import type { UserWT } from '@/types/types'

const userSchema = new Schema<UserWT>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

export const User = models.User || model<UserWT>('User', userSchema)
