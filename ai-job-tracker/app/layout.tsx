import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/Providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AI Job Tracker',
  description: 'AI Powered App that tracks job applications',
  authors: [{ name: 'Thesigan' }],
  keywords: ['Job Tracker', 'AI', 'Career', 'Job Search', 'Productivity'],
  openGraph: {
    title: 'AI Job Tracker',
    description: 'AI Powered App that tracks job applications',
    url: 'https://ai-job-tracker-lemon.vercel.app/',
    siteName: 'AI Job Tracker',
    images: [
      {
        url: 'https://ai-job-tracker-lemon.vercel.app/icon.jpg', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Job Tracker',
    description: 'AI Powered App that tracks job applications',
    images: ['https://ai-job-tracker-lemon.vercel.app/icon.jpg'], 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className='min-h-full flex flex-col'>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
