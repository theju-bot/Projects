import { useState } from 'react'
import client from '../../lib/axios'

interface ShareModalProps {
  docId: string
  onClose: () => void
}

export default function ShareModal({ docId, onClose }: ShareModalProps) {
  const [link, setLink] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateLink = async () => {
    setIsLoading(true)
    try {
      const res = await client.post(`/invites/${docId}`)
      const token = res.data.token as string
      setLink(`${import.meta.env.VITE_URL}/join?token=${token}`)
    } catch {
      // handle error
    } finally {
      setIsLoading(false)
    }
  }

  const copyLink = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
      <div className='bg-surface border border-app-border rounded-xl p-6 w-full max-w-md'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-app-text font-medium'>Share Document</h2>
          <button
            onClick={onClose}
            className='text-app-muted hover:text-app-text transition-colors cursor-pointer'
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='6' x2='6' y2='18' />
              <line x1='6' y1='6' x2='18' y2='18' />
            </svg>
          </button>
        </div>

        <p className='text-app-muted text-sm mb-4'>
          Generate a one-time invite link. It expires in 24 hours.
        </p>

        {!link ? (
          <button
            onClick={generateLink}
            disabled={isLoading}
            className='w-full py-2.5 bg-app-accent text-bg text-sm font-medium rounded-lg hover:bg-app-accent-dim transition-colors cursor-pointer disabled:opacity-50'
          >
            {isLoading ? 'Generating...' : 'Generate Invite Link'}
          </button>
        ) : (
          <div className='flex gap-2'>
            <input
              value={link}
              readOnly
              className='flex-1 bg-bg border border-app-border rounded-lg px-3 py-2 text-xs text-app-muted focus:outline-none truncate'
            />
            <button
              onClick={copyLink}
              className='px-3 py-2 bg-app-accent text-bg text-xs font-medium rounded-lg hover:bg-app-accent-dim transition-colors cursor-pointer whitespace-nowrap'
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
