import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import petReducer from "./slice/petSlice";
import appointmentReducer from "./slice/appointmentSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { tobiApi } from "../api/auth/auth";
import { petsApi } from "../services/api/pets.api";
import { userApi } from "../services/api/user.api";
import { healthApi } from "../services/api/health.api";
import { notificationsApi } from "../services/api/notifications.api";
export const store = configureStore({
  reducer: {
    [tobiApi.reducerPath]: tobiApi.reducer,
    [petsApi.reducerPath]: petsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    user: userReducer,
    pet: petReducer,
    appointment: appointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tobiApi.middleware, petsApi.middleware, userApi.middleware, healthApi.middleware, notificationsApi.middleware),
});

setupListeners(store.dispatch);
