import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/Providers'
import Script from 'next/script'

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
        <Script
          id='analytics'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `(function () {
            const SITE_ID = '6a204f6ad99a43781f049b9e'
            const API_URL = 'https://theju.duckdns.org/api/events'

            function getOS() {
              if (navigator.userAgentData?.platform) return navigator.userAgentData.platform
              const ua = navigator.userAgent
              if (/Android/.test(ua)) return 'Android'
              if (/iPhone|iPad|iPod/.test(ua)) return 'iOS'
              if (/Windows/.test(ua)) return 'Windows'
              if (/Mac/.test(ua)) return 'MacOS'
              if (/Linux/.test(ua)) return 'Linux'
              return 'Unknown'
            }

            function getBrowser() {
              if (navigator.userAgentData?.brands) {
                const brands = navigator.userAgentData.brands
                if (brands.some(function(b) { return /Edg/i.test(b.brand) })) return 'Edge'
                if (brands.some(function(b) { return /Opera|OPR/i.test(b.brand) })) return 'Opera'
                if (brands.some(function(b) { return /Chrome|Chromium/i.test(b.brand) })) return 'Chrome'
                if (brands.some(function(b) { return /Firefox/i.test(b.brand) })) return 'Firefox'
              }
              const ua = navigator.userAgent
              if (/Edg\\//.test(ua)) return 'Edge'
              if (/OPR\\/|Opera/.test(ua)) return 'Opera'
              if (/Firefox\\//.test(ua)) return 'Firefox'
              if (/Chrome\\//.test(ua) && !/Chromium/.test(ua)) return 'Chrome'
              if (/Chromium\\//.test(ua)) return 'Chromium'
              if (/Safari\\//.test(ua) && !/Chrome/.test(ua)) return 'Safari'
              return 'Unknown'
            }

            fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                siteId: SITE_ID,
                type: 'pageview',
                path: window.location.pathname,
                referrer: document.referrer,
                browser: getBrowser(),
                os: getOS(),
              }),
            })
          })()`,
          }}
        />
        <Toaster />
      </body>
    </html>
  )
}
