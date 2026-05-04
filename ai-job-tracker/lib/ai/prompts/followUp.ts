export interface FollowUpContext {
  jobTitle: string
  company: string
  applicantName: string
  appliedAt: string | null
}

export function buildFollowUpPrompt(ctx: FollowUpContext): string {
  return `You are helping a job seeker write a follow-up email after submitting a job application.

SITUATION:
Job Title: ${ctx.jobTitle}
Company: ${ctx.company}
Applicant Name: ${ctx.applicantName}
Applied On: ${ctx.appliedAt ?? 'recently'}

INSTRUCTIONS:
- Subject line + email body
- Email body: 2-3 sentences max
- Politely check on application status
- Reaffirm interest in the role
- Do not sound desperate or pushy
- Professional and warm tone
- Output format:
  Subject: [subject line]
  
  [email body]`
}
