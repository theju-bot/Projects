export interface InterviewPrepContext {
  jobTitle: string
  company: string
  jobDescription: string
  skills: string[]
  yearsOfExperience: number
}

export function buildInterviewPrepPrompt(ctx: InterviewPrepContext): string {
  return `You are a career coach helping a job seeker prepare for a job interview.

Generate targeted interview preparation based on the following:

JOB DETAILS:
Title: ${ctx.jobTitle}
Company: ${ctx.company}
Description:
${ctx.jobDescription || 'Not provided'}

APPLICANT:
Skills: ${ctx.skills.length ? ctx.skills.join(', ') : 'Not specified'}
Years of Experience: ${ctx.yearsOfExperience || 0}

INSTRUCTIONS:
Provide the following sections:

Likely Technical Questions:
- 4-5 role-specific technical questions they are likely to be asked

Likely Behavioral Questions:
- 3-4 behavioral questions based on the role and company type

Key Topics to Review:
- 3-5 concepts or technologies to brush up on before the interview

Tips for This Role:
- 2-3 specific tips based on the job description

Keep responses practical and specific to this role, not generic.`
}