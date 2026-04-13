import { Schema, model, models } from 'mongoose'
import type { ExerciseWT, WorkoutWT, WorkoutPlanWT } from '@/types/types'

const exerciseSchema = new Schema<ExerciseWT>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true },
)

const workoutSchema = new Schema<WorkoutWT>(
  {
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
  },
  { timestamps: true },
)

const workoutPlanSchema = new Schema<WorkoutPlanWT>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    exercises: [
      { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    ],
    date: { type: Date, default: Date.now },
    comments: { type: String },
  },
  { timestamps: true },
)

export const Exercise =
  models.Exercise || model<ExerciseWT>('Exercise', exerciseSchema)
export const Workout =
  models.Workout || model<WorkoutWT>('Workout', workoutSchema)
export const WorkoutPlan =
  models.WorkoutPlan || model<WorkoutPlanWT>('WorkoutPlan', workoutPlanSchema)
