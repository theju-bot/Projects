import type { Mongoose } from 'mongoose'
import { Document, Types } from 'mongoose'

export interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

export interface UserWT extends Document {
  name: string
  email: string
  password: string
}

export interface ExerciseWT extends Document {
  name: string
  description: string
  category: string
}

export interface WorkoutWT extends Document {
  exercise: Types.ObjectId
  sets: number
  reps: number
  weight: number
  notes: string
}

export interface WorkoutPlanWT extends Document {
  user: Types.ObjectId
  name: string
  date: Date
  exercises: WorkoutWT[]
  comments: string
}

export type idProps = { params: Promise<{ id: string }> }

export interface AuthPayload {
  userId: string
  [key: string]: any
}
