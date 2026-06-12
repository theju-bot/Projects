import { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import authClient from '../lib/authClient'

export default function AuthGuard() {
  const navigate = useNavigate()
  const location = useLocation()

  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) return
    if (!session) {
      navigate('/login', { state: { from: location.pathname }, replace: true })
    }
  }, [location, isPending, session, navigate])

  if (isPending) return null
  if (!session) return null

  return <Outlet />
}
