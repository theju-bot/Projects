import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from './index'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
