import { z } from 'zod'
import {
  updateProfileSchema,
  saveApiKeySchema,
  registerSchema,
  loginSchema,
} from '@/lib/validations/user.schema'

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type SaveApiKeyInput = z.infer<typeof saveApiKeySchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
