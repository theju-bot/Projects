import { z } from 'zod'

export const createColumnSchema = z.object({
  name: z.string().min(1, 'Column name is required').max(50, 'Name too long'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
})

export const updateColumnSchema = createColumnSchema.partial().extend({
  order: z.number().optional(),
})
