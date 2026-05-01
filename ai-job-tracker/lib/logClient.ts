export async function logClientError(source: string, error: Error | string) {
  try {
    const message = error instanceof Error ? error.message : error
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, message }),
    })
  } catch (error) {}
}
