import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import client from '../lib/axios'

export default function Join() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const token = searchParams.get('token')
    if (!token) {
      setError('Invalid invite link.')
      return
    }

    client
      .get(`/invites/accept/${token}`)
      .then((res) => {
        navigate(`/doc/${res.data.documentId.toString()}`, { replace: true })
      })
      .catch(() => {
        setError('This invite link is invalid or has expired.')
      })
  }, [])

  return (
    <div className='min-h-screen bg-bg flex items-center justify-center'>
      {error ? (
        <div className='text-center'>
          <p className='text-red-400 text-sm mb-4'>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className='text-accent text-sm hover:underline cursor-pointer'
          >
            Go to dashboard
          </button>
        </div>
      ) : (
        <p className='text-muted text-sm'>Joining document...</p>
      )}
    </div>
  )
}
