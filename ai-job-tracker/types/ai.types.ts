import { z } from 'zod'
import { aiRequestSchema, aiFeatureSchema } from '@/lib/validations/ai.schema'

export type AiFeature = z.infer<typeof aiFeatureSchema>
export type AiRequest = z.infer<typeof aiRequestSchema>
export interface FullPromptContext {
  jobTitle: string
  company: string
  jobDescription: string
  applicantName: string
  appliedAt: string | null
  targetRole: string
  skills: string[]
  yearsOfExperience: number
  bio: string
}