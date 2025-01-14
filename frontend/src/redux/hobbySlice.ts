import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Hobby } from '../types/hobby';

interface HobbyState {
  hobbies: Hobby[];
}

const initialState: HobbyState = {
  hobbies: [
    { id: '1', name: 'Reading' },
    { id: '2', name: 'Coding' },
    { id: '3', name: 'Music' },
    { id: '4', name: 'Gaming' },
  ],
};

const hobbySlice = createSlice({
  name: 'hobbies',
  initialState,
  reducers: {
    setHobbies(state, action: PayloadAction<Hobby[]>) {
      state.hobbies = action.payload;
    },
  },
});

export const { setHobbies } = hobbySlice.actions;
export default hobbySlice.reducer;
