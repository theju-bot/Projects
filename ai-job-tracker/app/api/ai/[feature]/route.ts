import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/getSession'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { AppError } from '@/lib/errors/AppError'
import { getAiContext, getVerifiedJob } from '@/lib/ai/getAiContext'
import { callOpenRouter } from '@/lib/ai/openrouter'
import { aiRequestSchema, aiFeatureSchema } from '@/lib/validations/ai.schema'
import { buildCoverLetterPrompt } from '@/lib/ai/prompts/coverLetter'
import { buildGapAnalysisPrompt } from '@/lib/ai/prompts/gapAnalysis'
import { buildColdEmailPrompt } from '@/lib/ai/prompts/coldEmail'
import { buildFollowUpPrompt } from '@/lib/ai/prompts/followUp'
import { buildInterviewPrepPrompt } from '@/lib/ai/prompts/interviewPrep'
import { buildRejectionAnalysisPrompt } from '@/lib/ai/prompts/rejectionAnalysis'
import type { FullPromptContext } from '@/types/ai.types'
import { format } from 'date-fns'

const promptBuilders: Record<string, (ctx: FullPromptContext) => string> = {
  'cover-letter': buildCoverLetterPrompt,
  'gap-analysis': buildGapAnalysisPrompt,
  'cold-email': buildColdEmailPrompt,
  'follow-up': buildFollowUpPrompt,
  'interview-prep': buildInterviewPrepPrompt,
  'rejection-analysis': buildRejectionAnalysisPrompt,
}

export const POST = withErrorHandler(async (req: NextRequest, ctx: any) => {
  const session = await requireSession(req)

  const { feature: rawFeature } = await ctx.params
  const featureParsed = aiFeatureSchema.safeParse(rawFeature)

  if (!featureParsed.success) {
    throw new AppError('Invalid AI feature', 400, 'VALIDATION_ERROR')
  }

  const { jobId } = aiRequestSchema.parse(await req.json())

  const job = await getVerifiedJob(jobId, session.user.id)
  const { apiKey, model, profile } = await getAiContext(session.user.id)

  const context: FullPromptContext = {
    jobTitle: job.title,
    company: job.company,
    jobDescription: job.description ?? '',
    applicantName: session.user.name,
    appliedAt: job.appliedAt
      ? format(new Date(job.appliedAt), 'MMM d, yyyy')
      : null,
    ...profile,
  }

  const prompt = promptBuilders[featureParsed.data](context)

  const { content } = await callOpenRouter({
    apiKey,
    model,
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({ success: true, data: content })
})
