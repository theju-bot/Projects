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
    setSites: (state, action: PayloadAction<Site[]>) => {
      state.sites = action.payload
    },
    addSite: (state, action: PayloadAction<Site>) => {
      state.sites.push(action.payload)
    },
    removeSite: (state, action: PayloadAction<string>) => {
      state.sites = state.sites.filter((s) => s._id !== action.payload)
    },
    setSelectedSite: (state, action: PayloadAction<Site>) => {
      state.selectedSite = action.payload
    },
  },
})

export const { setSites, addSite, removeSite, setSelectedSite } =
  sitesSlice.actions
export default sitesSlice.reducer

export const selectSites = (state: RootState) => state.sites.sites
export const selectSelectedSite = (state: RootState) => state.sites.selectedSite
