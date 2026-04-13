import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | Workout Tracker',
  description: 'Register to create an account',
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
