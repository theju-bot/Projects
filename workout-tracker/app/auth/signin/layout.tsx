import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SignIn | Workout Tracker',
  description: 'Signin to your account to access your wokrout plans',
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
