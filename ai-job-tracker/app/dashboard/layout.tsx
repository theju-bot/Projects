import { AIKeyBanner } from "../components/AIKeyBanner"
import Navbar from '@/app/components/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='flex flex-col flex-1 overflow-hidden'>
        <div className='px-6 pt-4'>
          <AIKeyBanner />
        </div>
        <Navbar />
        <main className='flex-1 overflow-auto px-6 pb-6'>{children}</main>
      </div>
    </div>
  )
}
