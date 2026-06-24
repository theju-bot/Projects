export default async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  const data = await res.json()
  if (!data.success) throw new Error(data.message)
  return data.data
}
