import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'AI Powerd App that tracks job Applications',
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
