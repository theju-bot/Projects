import { z } from 'zod'

export const workoutPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  exercises: z
    .array(
      z.object({
        exercise: z.string().min(1, 'Exercise is required'),
        sets: z.number().min(1, 'Sets is required'),
        reps: z.number().min(1, 'Reps is required'),
        weight: z.number().min(0, 'Weight must be a positive number'),
        notes: z.string().trim().min(1).optional(),
      }),
    )
    .min(1, 'At least one exercise is required'),
  comments: z.string().trim().min(1).optional(),
  date: z.iso
    .date({ message: 'Please provide a valid date' })
    .transform((val) => new Date(val))
    .optional(),
})
