import { Metadata } from 'next'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/shared/AppSidebar'
import { Navbar } from '@/components/shared/NavBar'
import { JobModal } from '@/components/jobs/JobModal'
import { AiOutputDialog } from '@/components/ai/AiOutputDialog'

export const metadata: Metadata = {
  title: {
    template: '%s | AI Job Tracker',
    default: 'AI Job Tracker',
  },
  description: 'AI Powerd App that tracks job Applications',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className='min-w-0'>
          <Navbar />
          <main className='flex-1 overflow-auto p-6 min-w-0'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <JobModal />
      <AiOutputDialog />
    </TooltipProvider>
  )
}
