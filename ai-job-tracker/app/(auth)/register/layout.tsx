import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | AI Job Trackerv',
  description: 'Register to create an account',
}

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
