'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { saveApiKeySchema } from '@/lib/validations/user.schema'
import type { SaveApiKeyInput } from '@/types/user.types'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  useOpenRouterKey,
  useSaveOpenRouterKey,
  useDeleteOpenRouterKey,
} from '@/hooks/useSettings'

export function OpenRouterKeyForm() {
  const [showKey, setShowKey] = useState(false)

  const { data: hasKey, isLoading: isLoadingKey } = useOpenRouterKey()
  const { mutateAsync: saveKey, isPending: isSaving } = useSaveOpenRouterKey()
  const { mutateAsync: removeKey, isPending: isRemoving } =
    useDeleteOpenRouterKey()

  const isPending = isSaving || isRemoving

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SaveApiKeyInput>({
    resolver: zodResolver(saveApiKeySchema),
  })

  async function onSubmit(data: SaveApiKeyInput) {
    try {
      await saveKey(data)
      reset()
    } catch (error) {}
  }

  async function handleRemove() {
    if (!confirm('Remove your OpenRouter key?')) return

    try {
      await removeKey()
    } catch (error) {}
  }

  if (isLoadingKey) {
    return (
      <div className='text-sm text-muted-foreground'>Loading key status...</div>
    )
  }

  if (hasKey) {
    return (
      <div className='space-y-2'>
        <p className='text-sm text-muted-foreground'>
          API key is configured. AI features are enabled.
        </p>
        <Button
          variant='destructive'
          onClick={handleRemove}
          disabled={isPending}
        >
          {isRemoving ? 'Removing...' : 'Remove Key'}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Field>
        <FieldLabel>API Key</FieldLabel>
        <div className='relative'>
          <Input
            type={showKey ? 'text' : 'password'}
            placeholder='sk-or-...'
            className='pr-10'
            {...register('openRouterKey')}
          />
          <button
            type='button'
            onClick={() => setShowKey(!showKey)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <FieldError errors={[{ message: errors.openRouterKey?.message }]} />
      </Field>

      <Button type='submit' disabled={isPending}>
        {isSaving ? 'Saving...' : 'Save Key'}
      </Button>
    </form>
  )
}
