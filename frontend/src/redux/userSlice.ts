import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  username: string;
  age: number;
  hobbies: string[];
}

interface UserState {
  users: User[];
  hobbies: string[];
}

const initialState: UserState = {
  users: [],
  hobbies: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.hobbies = Array.from(new Set(action.payload.flatMap(user => user.hobbies)));
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;

// Redux slice or actions
