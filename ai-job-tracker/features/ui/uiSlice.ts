import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UIState, JobStatus } from '@/types/types'

const initialState: UIState = {
  isAddJobOpen: false,
  editJobId: null,
  filterStatus: 'all',
  searchQuery: '',
  isBannerDismissed: false,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAddJobOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddJobOpen = action.payload
    },
    setEditJobId: (state, action: PayloadAction<string | null>) => {
      state.editJobId = action.payload
    },
    setFilterStatus: (state, action: PayloadAction<JobStatus | 'all'>) => {
      state.filterStatus = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    dismissBanner: (state) => {
      state.isBannerDismissed = true
    },
  },
})

export const {
  setAddJobOpen,
  setEditJobId,
  setFilterStatus,
  setSearchQuery,
  dismissBanner,
} = uiSlice.actions

export default uiSlice.reducer

export * from './uiSelectors'