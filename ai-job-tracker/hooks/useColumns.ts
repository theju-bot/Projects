import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { logClientError } from '@/lib/logClient'
import type {
  Column,
  CreateColumnInput,
  UpdateColumnInput,
} from '@/types/column.types'
import apiFetch from '@/lib/apiFetch'

const COLUMNS_KEY = ['columns']

async function fetchColumns(): Promise<Column[]> {
  return apiFetch('/api/columns')
}

async function createColumn(input: CreateColumnInput): Promise<Column> {
  return apiFetch('/api/columns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

async function updateColumn(
  id: string,
  input: UpdateColumnInput,
): Promise<Column> {
  return apiFetch(`/api/columns/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

async function instantUpdateColumns(
  queryClient: QueryClient,
  id: string,
  input: UpdateColumnInput,
) {
  await queryClient.cancelQueries({ queryKey: COLUMNS_KEY })

  const previousColumns = queryClient.getQueryData<Column[]>(COLUMNS_KEY)

  queryClient.setQueryData<Column[]>(
    COLUMNS_KEY,
    (old) =>
      old?.map((col) => (col._id === id ? { ...col, ...input } : col)) ?? [],
  )

  return { previousColumns }
}

async function deleteColumn(id: string): Promise<void> {
  return apiFetch(`/api/columns/${id}`, { method: 'DELETE' })
}

export function useColumns() {
  return useQuery<Column[]>({
    queryKey: COLUMNS_KEY,
    queryFn: fetchColumns,
  })
}

export function useCreateColumn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateColumnInput) => createColumn(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_KEY })
      toast.success('Column created')
    },
    onError: (err: Error) => {
      logClientError('useCreateColumn', err)
      toast.error(err.message ?? 'Failed to create column')
    },
  })
}

export function useUpdateColumn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateColumnInput }) =>
      updateColumn(id, input),
    onMutate: async ({ id, input }) =>
      instantUpdateColumns(queryClient, id, input),
    onError: (err: Error, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_KEY, context.previousColumns)
      }
      logClientError('useUpdateColumn', err)
      toast.error(err.message ?? 'Failed to update column')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_KEY })
    },
  })
}

export function useDeleteColumn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteColumn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_KEY })
      toast.success('Column deleted')
    },
    onError: (err: Error) => {
      logClientError('useDeleteColumn', err)
      toast.error(err.message ?? 'Failed to delete column')
    },
  })
}
