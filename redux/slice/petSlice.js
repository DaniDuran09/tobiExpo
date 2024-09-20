import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info:{
    name: "",
    last_name: " ",
    birthday: "",
    age: 0,
    color: "black",
    gender: "",
    sterilized: 0,
    weight: 0,
    food_brand_id: 0,
    type_food_id: 0,
    activity_level_id: 1,
    pet_breed_id: 0,
    // pet_type: 0,
  },
  picture: ""
};

const petSlice = createSlice({
  name: "pet",
  initialState,
  reducers: {
    setPetInfo(state, action) {
      state.info = action.payload;
    },
    clearPetInfo(state) {
      state.info = null;
    },
    setPicturePet(state, action){
      state.picture = action.payload
    }
  },
});

export const { setPetInfo, clearPetInfo, setPicturePet } = petSlice.actions;

export default petSlice.reducer;
