import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Hobby {
  id: string;
  name: string;
}

interface HobbyState {
  hobbies: Hobby[];
}

const initialState: HobbyState = {
  hobbies: [],
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
