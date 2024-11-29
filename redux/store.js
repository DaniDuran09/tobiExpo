import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import petReducer from './slice/petSlice';
import appointmentReducer from './slice/appointmentSlice';


export const store = configureStore({
    reducer: {
      user: userReducer,
      pet: petReducer,
      appointment: appointmentReducer,
    },
  });