import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

import {
  selectIsAddJobOpen,
  selectEditJobId,
  selectFilterStatus,
  selectSearchQuery,
  selectIsBannerDismissed,
  selectIsAnyModalOpen,
} from '@/features/ui/uiSelectors'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector)

export const useAddModal = () => useAppSelector(selectIsAddJobOpen)
export const useEditJobId = () => useAppSelector(selectEditJobId)
export const useFilterStatus = () => useAppSelector(selectFilterStatus)
export const useSearchQuery = () => useAppSelector(selectSearchQuery)
export const useBannerDismissed = () => useAppSelector(selectIsBannerDismissed)
export const useAnyModalOpen = () => useAppSelector(selectIsAnyModalOpen)