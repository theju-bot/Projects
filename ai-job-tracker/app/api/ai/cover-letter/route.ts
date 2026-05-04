import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/getSession'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { getAiContext } from '@/lib/ai/getAiContext'
import { callOpenRouter } from '@/lib/ai/openrouter'
import { buildCoverLetterPrompt } from '@/lib/ai/prompts/coverLetter'
import { aiRequestSchema } from '@/lib/validations/ai.schema'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)
  const body = await req.json()
  const { job } = aiRequestSchema.parse(body)

  const { apiKey, model, profile } = await getAiContext(session.user.id)

  const prompt = buildCoverLetterPrompt({
    jobTitle: job.title,
    company: job.company,
    jobDescription: job.description ?? '',
    applicantName: session.user.name,
    ...profile,
  })

  const { content } = await callOpenRouter({
    apiKey,
    model,
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({ success: true, data: content })
})
