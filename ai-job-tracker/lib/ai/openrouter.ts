export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface OpenRouterOptions {
  apiKey: string
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  maxTokens?: number
}

export interface OpenRouterResponse {
  content: string
}

export async function callOpenRouter({
  apiKey,
  model,
  messages,
  temperature = 0.7,
  maxTokens = 1500,
}: OpenRouterOptions): Promise<OpenRouterResponse> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.BETTER_AUTH_URL ?? 'https://localhost:3000',
      'X-Title': 'AI Job Tracker',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    let errorMsg = `OpenRouter error: ${res.statusText}`

    try {
      const errorData = await res.json()
      errorMsg = errorData?.error?.message || errorMsg
    } catch (_) {}

    throw new Error(errorMsg)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No content returned from OpenRouter')
  }

  return { content }
}
