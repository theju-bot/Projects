import { Schema, model, models } from 'mongoose'
import type { ExerciseWT } from '@/types/types'

const exerciseSchema = new Schema<ExerciseWT>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true },
)

export const Exercise =
  models.Exercise || model<ExerciseWT>('Exercise', exerciseSchema)
