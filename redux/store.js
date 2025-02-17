import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import petReducer from './slice/petSlice';
import appointmentReducer from './slice/appointmentSlice';
import { setupListeners } from '@reduxjs/toolkit/query'
import { tobiApi } from '../api/auth';


export const store = configureStore({
    reducer: {
      [tobiApi.reducerPath]:tobiApi.reducer,
      user: userReducer,
      pet: petReducer,
      appointment: appointmentReducer,
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(tobiApi.middleware)    
  });

  setupListeners(store.dispatch)