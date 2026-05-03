import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/shared/AppSidebar'
import { Navbar } from '@/components/shared/NavBar'
import { AddJobModal } from '@/components/jobs/AddJobModal'
import { EditJobModal } from '@/components/jobs/EditJobModal'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className='flex-1 overflow-auto p-6'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <AddJobModal />
      <EditJobModal />
    </TooltipProvider>
  )
}
