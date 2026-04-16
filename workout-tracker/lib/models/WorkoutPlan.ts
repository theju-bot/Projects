import { Schema, model, models } from 'mongoose'
import type { WorkoutWT, WorkoutPlanWT } from '@/types/types'

const workoutSchema = new Schema<WorkoutWT>(
  {
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true },
)

const workoutPlanSchema = new Schema<WorkoutPlanWT>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    exercises: [workoutSchema],
    comments: { type: String },
  },
  { timestamps: true },
)

export const WorkoutPlan =
  models.WorkoutPlan || model<WorkoutPlanWT>('WorkoutPlan', workoutPlanSchema)
