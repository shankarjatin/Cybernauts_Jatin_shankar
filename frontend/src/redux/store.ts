import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import hobbyReducer from './hobbySlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    hobbies: hobbyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
