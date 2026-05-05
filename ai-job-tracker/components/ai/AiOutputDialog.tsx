'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  closeAIDialog,
  selectIsAIDialogOpen,
  selectAIDialogJobId,
} from '@/store/slices/uiSlice'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AiFeaturePanel } from './AiFeaturePanel'
import { Copy, Check, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export function AiOutputDialog() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector(selectIsAIDialogOpen)
  const jobId = useAppSelector(selectAIDialogJobId)

  const [result, setResult] = useState<{
    feature: string
    content: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  function handleClose() {
    dispatch(closeAIDialog())
    setTimeout(() => {
      setResult(null)
      setCopied(false)
    }, 300)
  }

  function handleResult(feature: string, content: string) {
    setResult({ feature, content })
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.content)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>{result ? result.feature : 'AI Actions'}</DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto'>
          {!jobId ? (
            <p className='text-sm text-muted-foreground'>No job selected</p>
          ) : result ? (
            <div className='space-y-3'>
              <Textarea
                value={result.content}
                onChange={(e) =>
                  setResult({ ...result, content: e.target.value })
                }
                rows={16}
                className='resize-none font-mono text-sm'
              />
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setResult(null)}
                >
                  <ArrowLeft size={14} className='mr-1' />
                  Back
                </Button>
                <Button size='sm' onClick={handleCopy}>
                  {copied ? (
                    <Check size={14} className='mr-1' />
                  ) : (
                    <Copy size={14} className='mr-1' />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          ) : (
            <AiFeaturePanel jobId={jobId} onResult={handleResult} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
