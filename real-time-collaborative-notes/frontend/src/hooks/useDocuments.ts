import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import client from '../lib/axios'
import type { RTCADocument } from './../types/types'

const useDocuments = () => {
  return useQuery<RTCADocument[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await client.get('/documents')
      return res.data
    },
  })
}

const useDocument = (id: string) => {
  return useQuery<RTCADocument>({
    queryKey: ['documents', id],
    queryFn: async () => {
      const res = await client.get(`/documents/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

const useCreateDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await client.post('/documents')
      return res.data as RTCADocument
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<RTCADocument>
    }) => {
      const res = await client.patch(`/documents/${id}`, data)
      return res.data as RTCADocument
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['documents', id] })
    },
  })
}

const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/documents/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export {
  useDocuments,
  useDocument,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
}
