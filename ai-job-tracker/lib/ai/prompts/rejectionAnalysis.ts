export interface RejectionAnalysisContext {
  jobTitle: string
  company: string
  jobDescription: string
  targetRole: string
  skills: string[]
  yearsOfExperience: number
  bio: string
}

export function buildRejectionAnalysisPrompt(ctx: RejectionAnalysisContext): string {
  return `You are a career advisor helping a job seeker learn from a job rejection.

Analyze this situation and provide constructive feedback.

JOB DETAILS:
Title: ${ctx.jobTitle}
Company: ${ctx.company}
Description:
${ctx.jobDescription || 'Not provided'}

APPLICANT PROFILE:
Target Role: ${ctx.targetRole || 'Not specified'}
Skills: ${ctx.skills.length ? ctx.skills.join(', ') : 'Not specified'}
Years of Experience: ${ctx.yearsOfExperience || 0}
Bio: ${ctx.bio || 'Not provided'}

INSTRUCTIONS:
Provide a structured analysis with these sections:

Likely Reasons for Rejection:
- 2-3 honest, specific reasons based on the gap between the role and profile

What to Improve:
- 3-4 concrete, actionable steps to be more competitive for similar roles

Similar Roles to Target:
- 2-3 alternative job titles or company types that might be a better fit right now

Encouragement:
- One short, genuine encouraging note (not generic)

Be honest but constructive. Avoid being harsh or discouraging.`
}