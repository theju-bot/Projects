import { Schema, model, models } from 'mongoose'
import type { IUser } from '@/types/types'

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    aiProvider: {
      type: String,
      enum: ['anthropic', 'gemini', 'groq', 'grok'],
      default: '',
    },
    apiKey: { type: String, select: false },
  },
  { timestamps: true },
)

export const UserModel = models.User || model<IUser>('User', UserSchema)
