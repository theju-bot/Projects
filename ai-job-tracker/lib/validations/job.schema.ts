import { z } from 'zod'

export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  jobUrl: z.url('Must be a valid URL').optional().or(z.literal('')),
  salary: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  columnId: z.string().min(1, 'Column is required'),
  appliedAt: z.date().optional().nullable(),
})

export const updateJobSchema = createJobSchema.partial().extend({
  order: z.number().optional(),
  columnId: z.string().optional(),
})

export const moveJobSchema = z.object({
  columnId: z.string().min(1, 'Column is required'),
  order: z.number().min(0, 'Order must be positive'),
})
