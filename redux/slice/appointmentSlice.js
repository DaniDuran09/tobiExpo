import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  service: [],
  appointment: {},
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setServiceInfo(state, action) {
      state.service = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointment=action.payload;
    },
    clearAppointments: (state) => {
      state.appointment = {};
    },
  },
});

export const { setServiceInfo, addAppointment, clearAppointments } = appointmentSlice.actions;

export default appointmentSlice.reducer;
