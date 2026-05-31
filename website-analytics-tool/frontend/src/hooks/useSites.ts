import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'
import type { Site } from '../types/types'

const useSites = () => {
  const queryClient = useQueryClient()

  const { data: sites = [], isLoading } = useQuery<Site[]>({
    queryKey: ['sites'],
    queryFn: async () => {
      const res = await client.get<Site[]>('/sites')
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/sites/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; domain: string }) => {
      await client.post('/sites', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
    },
  })

  return { sites, isLoading, deleteMutation, createMutation }
}

export default useSites
