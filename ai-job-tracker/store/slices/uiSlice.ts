import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

interface UIState {
  isAddJobModalOpen: boolean
  isEditJobModalOpen: boolean
  selectedJobId: string | null
  searchQuery: string
  isAIDialogOpen: boolean
  aiDialogJobId: string | null
}

const initialState: UIState = {
  isAddJobModalOpen: false,
  isEditJobModalOpen: false,
  selectedJobId: null,
  searchQuery: '',
  isAIDialogOpen: false,
  aiDialogJobId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddJobModal(state) {
      state.isAddJobModalOpen = true
    },
    closeAddJobModal(state) {
      state.isAddJobModalOpen = false
    },
    openEditJobModal(state, action: PayloadAction<string>) {
      state.isEditJobModalOpen = true
      state.selectedJobId = action.payload
    },
    closeEditJobModal(state) {
      state.isEditJobModalOpen = false
      state.selectedJobId = null
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },

    openAIDialog(state, action: PayloadAction<string>) {
      state.isAIDialogOpen = true
      state.aiDialogJobId = action.payload
    },
    closeAIDialog(state) {
      state.isAIDialogOpen = false
      state.aiDialogJobId = null
    },
  },
})

export const {
  openAddJobModal,
  closeAddJobModal,
  openEditJobModal,
  closeEditJobModal,
  setSearchQuery,
  openAIDialog,
  closeAIDialog,
} = uiSlice.actions

export default uiSlice.reducer

export const selectIsAddJobModalOpen = (state: RootState) =>
  state.ui.isAddJobModalOpen
export const selectIsEditJobModalOpen = (state: RootState) =>
  state.ui.isEditJobModalOpen
export const selectSelectedJobId = (state: RootState) => state.ui.selectedJobId
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery
export const selectIsAIDialogOpen = (state: RootState) =>
  state.ui.isAIDialogOpen
export const selectAIDialogJobId = (state: RootState) => state.ui.aiDialogJobId
