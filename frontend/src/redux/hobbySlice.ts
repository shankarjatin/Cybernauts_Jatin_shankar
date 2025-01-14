import { createSlice } from '@reduxjs/toolkit';

export const hobbySlice = createSlice({
  name: 'hobbies',
  initialState: { hobbies: [] },
  reducers: {
    setHobbies(state, action) {
      state.hobbies = action.payload;
    },
  },
});

export const { setHobbies } = hobbySlice.actions;
export default hobbySlice.reducer;
