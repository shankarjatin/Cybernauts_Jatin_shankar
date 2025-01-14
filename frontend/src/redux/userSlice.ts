import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/user';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },
    addHobbyToUser(state, action: PayloadAction<{ userId: string; hobby: string }>) {
      const { userId, hobby } = action.payload;
      const user = state.users.find((user) => user.id === userId);
      if (user) {
        user.hobbies.push(hobby);
      }
    },
  },
});

export const { setUsers, setLoading, setError, addUser, addHobbyToUser } = userSlice.actions;
export default userSlice.reducer;
