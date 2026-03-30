'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Board', icon: '📋' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📊' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/auth/signin')
  }

  return (
    <>
      <aside className='hidden md:flex w-56 shrink-0 border-r flex-col h-screen'>
        <div className='px-5 py-5 border-b'>
          <span className='font-semibold text-sm tracking-tight'>
            AI Job Tracker
          </span>
        </div>

        <nav className='flex-1 px-3 py-4 space-y-1'>
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-foreground text-background font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            )
          })}
        </nav>

        <div className='px-3 py-4 border-t'>
          <button
            onClick={handleSignOut}
            className='w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted hover:cursor-pointer transition-colors'
          >
            🚪 Sign out
          </button>
        </div>
      </aside>

      <nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t flex items-center justify-around px-2 py-2'>
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs transition-colors ${
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              <span className='text-lg'>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}

        <button
          onClick={handleSignOut}
          className='flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs text-muted-foreground transition-colors hover:cursor-pointer'
        >
          <span className='text-lg'>🚪</span>
          <span>Sign out</span>
        </button>
      </nav>
    </>
  )
}
