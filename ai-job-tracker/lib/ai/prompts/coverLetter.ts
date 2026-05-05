import type { FullPromptContext } from '@/types/ai.types'

export function buildCoverLetterPrompt(ctx: FullPromptContext): string {
  return `You are a professional cover letter writer helping job seekers land remote positions.

Write a concise, tailored cover letter for the following:

JOB DETAILS:
Title: ${ctx.jobTitle}
Company: ${ctx.company}
Description:
${ctx.jobDescription || 'Not provided'}

APPLICANT:
Name: ${ctx.applicantName}
Target Role: ${ctx.targetRole || ctx.jobTitle}
Skills: ${ctx.skills.length ? ctx.skills.join(', ') : 'Not specified'}
Years of Experience: ${ctx.yearsOfExperience || 0}
Bio: ${ctx.bio || 'Not provided'}

INSTRUCTIONS:
- Keep it to 3 short paragraphs
- First paragraph: why this role at this company
- Second paragraph: relevant skills and experience
- Third paragraph: confident closing with call to action
- Avoid clichés like "I am writing to express my interest"
- Do not fabricate specific achievements or numbers
- Professional but human tone
- Output only the cover letter, no extra commentary`
}