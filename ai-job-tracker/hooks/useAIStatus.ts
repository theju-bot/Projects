import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AIStatus } from '@/types/types'

export function useAIStatus(){
    return useQuery<AIStatus>({
        queryKey: ['ai-status'],
        queryFn: () => fetch('/api/user/ai-status').then(res => res.json())
    })
}

export function useInvalidateAIStatus(){
    const qc = useQueryClient()
    return () => qc.invalidateQueries({ queryKey: ['ai-status'] })
}