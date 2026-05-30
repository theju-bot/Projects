import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import sitesReducer from './slices/sitesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sites: sitesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
