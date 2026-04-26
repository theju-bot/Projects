import { z } from 'zod'

export const updateProfileSchema = z.object({
  targetRole: z.string().min(1, 'Target role is required'),
  skills: z.array(z.string().min(1)).min(1, 'Add at least one skill'),
  yearsOfExperience: z
    .number()
    .min(0, 'Cannot be negative')
    .max(50, 'Invalid value'),
  bio: z.string().max(500, 'Bio must be under 500 characters'),
  preferredModel: z.string().min(1, 'Select a model'),
})

export const saveApiKeySchema = z.object({
  openRouterKey: z
    .string()
    .min(1, 'API key is required')
    .startsWith('sk-or-', 'Must be a valid OpenRouter key'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .check(z.email('Invalid email address')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .check(z.email('Invalid email address')),
  password: z.string().min(1, 'Password is required'),
})
