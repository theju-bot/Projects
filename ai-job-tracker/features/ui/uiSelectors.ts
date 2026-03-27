import { RootState } from '@/store/store'

export const selectUI = (state: RootState) => state.ui

export const selectIsAddJobOpen = (state: RootState) => state.ui.isAddJobOpen
export const selectEditJobId = (state: RootState) => state.ui.editJobId
export const selectFilterStatus = (state: RootState) => state.ui.filterStatus
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery
export const selectIsBannerDismissed = (state: RootState) =>
  state.ui.isBannerDismissed

// export const selectActiveFilters = (state: RootState) => ({
//     filterStatus: state.ui.filterStatus,
//     searchQuery: state.ui.searchQuery
// })

export const selectIsAnyModalOpen = (state: RootState) =>
  state.ui.isAddJobOpen || Boolean(state.ui.editJobId)
