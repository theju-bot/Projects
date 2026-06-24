import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AiFeature } from '@/types/ai.types'
import apiFetch from '@/lib/apiFetch'

async function callAiFeature(
  feature: AiFeature,
  jobId: string,
): Promise<string> {
  return apiFetch(`/api/ai/${feature}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  })
}

export function useAiFeature(feature: AiFeature) {
  return useMutation({
    mutationFn: (jobId: string) => callAiFeature(feature, jobId),
    onError: (err: Error) => {
      if (err.message.includes('OPENROUTER_KEY_MISSING')) {
        toast.error(
          'Add your OpenRouter API key in Settings to use AI features',
        )
      } else {
        toast.error(err.message ?? 'AI request failed')
      }
    },
  })
}
