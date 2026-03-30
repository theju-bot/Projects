import { AIKeyBanner } from '../components/AIKeyBanner'
import { Sidebar } from '../components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <div className='px-6 pt-4'>
          <AIKeyBanner />
        </div>
        <main className='flex-1 overflow-auto px-6 pb-20 md:pb-6'>{children}</main>
      </div>
    </div>
  )
}
