import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userInfo: {
    name: '',
    last_name: '',
    phone: '',
    email: '',
    birtday: '',
    password: '',
    pet: [
      {
        name: '',
        last_name: '',
        age: 4,
        birthday: '',
        gender: '',
        color: 'black',
        weight: 0,
        food_brand_id: 0,
        type_food_id: 1,
        activity_level_id: 1,
        pet_breed_id: 0,
      },
    ],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    clearUser(state) {
      state.userInfo = initialState;
    },
  },
});

export const {setUserInfo, clearUser} = userSlice.actions;

export default userSlice.reducer;
