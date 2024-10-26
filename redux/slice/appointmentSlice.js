import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  service: [],
  appointments: [],
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    setServiceInfo(state, action) {
      state.service = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
  },
});

export const { setServiceInfo, addAppointment, clearAppointments } = appointmentSlice.actions;

export default appointmentSlice.reducer;
