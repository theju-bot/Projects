import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'AI Powerd App that tracks job Applications',
}

export default function AnalyticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
