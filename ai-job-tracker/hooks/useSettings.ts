import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { logClientError } from '@/lib/logClient'
import type { SaveApiKeyInput } from '@/types/user.types'

const SETTINGS_KEY = ['settings', 'openRouterKey']

export function useOpenRouterKey() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      const res = await fetch('/api/user/settings')
      if (!res.ok) throw new Error('Failed to fetch key status')
      const data = await res.json()
      return data.hasKey as boolean
    },
  })
}

export function useSaveOpenRouterKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SaveApiKeyInput) => {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data
    },
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
    mutationFn: async () => {
      const res = await fetch('/api/user/settings', {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data
    },
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
