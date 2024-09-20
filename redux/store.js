import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import petReducer from './slice/petSlice';


export const store = configureStore({
    reducer: {
      user: userReducer,
      pet: petReducer
    },
  });