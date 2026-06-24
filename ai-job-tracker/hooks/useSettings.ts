import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { logClientError } from '@/lib/logClient'
import type { SaveApiKeyInput } from '@/types/user.types'
import apiFetch from '@/lib/apiFetch'

const SETTINGS_KEY = ['settings']

async function isOpenRouterKey(): Promise<boolean> {
  const { hasKey } = await apiFetch<{ hasKey: boolean }>('/api/user/settings')
  return hasKey
}

async function saveOpenRouterKey(input: SaveApiKeyInput) {
  return apiFetch('/api/user/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

async function deleteOpenRouterKey(): Promise<void> {
  return apiFetch('/api/user/settings', { method: 'DELETE' })
}

export function useOpenRouterKey() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: isOpenRouterKey,
  })
}

export function useSaveOpenRouterKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveApiKeyInput) => saveOpenRouterKey(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY })
      toast.success('API key saved')
    },
    onError: (err: Error) => {
      logClientError('useSaveOpenRouterKey', err)
      toast.error(err.message ?? 'Failed to save API key')
    },
  })
}

export function useDeleteOpenRouterKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOpenRouterKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY })
      toast.success('API key removed')
    },
    onError: (err: Error) => {
      logClientError('useDeleteOpenRouterKey', err)
      toast.error(err.message ?? 'Failed to remove API key')
    },
  })
}
