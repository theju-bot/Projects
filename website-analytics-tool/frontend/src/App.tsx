import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectIsAuthenticated, setUser } from './store/slices/authSlice'
import client from './api/client'
import type { User } from './types/types'
import Login from './pages/Login'
import Register from './pages/Register'
import Sites from './pages/Sites'
import Dashboard from './pages/Dashboard'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  return !isAuthenticated ? <>{children}</> : <Navigate to='/sites' replace />
}

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    client
      .get<{ user: User }>('/auth/refresh')
      .then((res) => dispatch(setUser(res.data.user)))
      .catch(() => {})
  }, [dispatch])

  return (
    <Routes>
      <Route
        path='/login'
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path='/sites'
        element={
          <ProtectedRoute>
            <Sites />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/:siteId'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}

export default App
