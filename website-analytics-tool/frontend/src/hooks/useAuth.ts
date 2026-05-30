import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  selectIsAuthenticated,
  selectUser,
  clearUser,
} from '../store/slices/authSlice'
import client from '../api/client'

const useAuth = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const logout = async () => {
    await client.post('/auth/logout')
    dispatch(clearUser())
  }

  return { user, isAuthenticated, logout }
}

export default useAuth
