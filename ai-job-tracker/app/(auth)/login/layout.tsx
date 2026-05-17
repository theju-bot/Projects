import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | AI Job Tracker',
  description: 'Login to your account to access your Job applications',
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
