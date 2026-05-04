export interface GapAnalysisContext {
  jobTitle: string
  company: string
  jobDescription: string
  targetRole: string
  skills: string[]
  yearsOfExperience: number
  bio: string
}

export function buildGapAnalysisPrompt(ctx: GapAnalysisContext): string {
  return `You are a career advisor helping job seekers evaluate whether to apply for a role.

Analyze the fit between the job and the applicant profile.

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

Overall Fit: (Strong / Moderate / Weak) — one sentence verdict

Strengths:
- List 3-4 things the applicant has that match the role

Gaps:
- List 2-4 skills or experience areas missing or underrepresented

Should They Apply?
- Clear yes/no recommendation with a 2-3 sentence reasoning

Keep the tone honest but encouraging. Be specific, not generic.`
}