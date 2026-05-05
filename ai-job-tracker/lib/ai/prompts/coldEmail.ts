import type { FullPromptContext } from '@/types/ai.types'

export function buildColdEmailPrompt(ctx: FullPromptContext): string {
  return `You are helping a job seeker write a cold outreach email to a recruiter or hiring manager.

Write a short, compelling cold email for this situation:

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
- Subject line + email body
- Email body: 3-4 sentences max
- Open with a specific hook about the company or role
- One sentence on what makes the applicant relevant
- Clear ask: request a 15 minute call
- No fluff, no long paragraphs
- Do not fabricate metrics or achievements
- Output format:
  Subject: [subject line]
  
  [email body]`
}