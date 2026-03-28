import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import questReducer from './questSlice';
import battleReducer from './battleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quest: questReducer,
    battle: battleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
