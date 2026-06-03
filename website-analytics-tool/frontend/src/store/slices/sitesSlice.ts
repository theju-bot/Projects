import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Site } from '../../types/types'
import type { RootState } from '../index'

interface SitesState {
  sites: Site[]
  selectedSite: Site | null
}

const initialState: SitesState = {
  sites: [],
  selectedSite: null,
}

const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {
    setSelectedSite: (state, action: PayloadAction<Site>) => {
      state.selectedSite = action.payload
    },
  },
})

export const { setSelectedSite } = sitesSlice.actions
export default sitesSlice.reducer

export const selectSelectedSite = (state: RootState) => state.sites.selectedSite
