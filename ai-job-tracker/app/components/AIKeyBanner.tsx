'use client'
import Link from 'next/link'
import { useAIStatus } from '@/hooks/useAIStatus'
import {
  useAppDispatch,
  useAppSelector,
  useBannerDismissed,
} from '@/store/hooks'
import { dismissBanner } from '@/features/ui'

export function AIKeyBanner() {
  const { data } = useAIStatus()
  const dispatch = useAppDispatch()
  const isBannerDispatched = useBannerDismissed()

  if (data?.hasKey || isBannerDispatched) return null

  const handleDismiss = () => {
    dispatch(dismissBanner())
  }

  return (
    <div className='flex items-center justify-between bg-muted border rounded-lg px-4 py-3 mb-4 text-sm'>
      <span className='text-muted-foreground'>
        Want AI cover letters, interview prep, and fit scores?
      </span>

      <div className='flex items-center gap-4'>
        <Link
          href='/dashboard/settings'
          className='font-medium underline underline-offset-2 hover:text-foreground transition-colors hover:cursor-pointer'
        >
          Add a free API key →
        </Link>

        <button
          onClick={handleDismiss}
          className='text-muted-foreground hover:text-foreground transition-colors text-lg leading-none hover:cursor-pointer'
          aria-label='Dismiss banner'
        >
          ✕
        </button>
      </div>
    </div>
  )
}
