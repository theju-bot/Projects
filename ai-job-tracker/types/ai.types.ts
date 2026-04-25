import { z } from 'zod'
import { aiRequestSchema, aiFeatureSchema } from '@/lib/validations/ai.schema'

export type AiFeature = z.infer<typeof aiFeatureSchema>
export type AiRequest = z.infer<typeof aiRequestSchema>
