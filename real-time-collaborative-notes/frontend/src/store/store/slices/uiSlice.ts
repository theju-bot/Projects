import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface UIState {
  isSidebarOpen: boolean
  activeDocumentId: string | null
}

const initialState: UIState = {
  isSidebarOpen: true,
  activeDocumentId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setActiveDocument: (state, action: PayloadAction<string | null>) => {
      state.activeDocumentId = action.payload
    },
  },
})

export const { toggleSidebar, setActiveDocument } = uiSlice.actions
export default uiSlice.reducer

export const isSidebarOpen = (state: RootState) => state.ui.isSidebarOpen
export const selectActiveDocument = (state: RootState) =>
  state.ui.activeDocumentId
