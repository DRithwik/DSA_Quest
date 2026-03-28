import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  avatar: string;
  joinedDate: string;
  skills: Record<string, number>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const savedToken = localStorage.getItem('dsa_quest_token');
const savedUser = localStorage.getItem('dsa_quest_user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken,
  isAuthenticated: !!savedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('dsa_quest_token', action.payload.token);
      localStorage.setItem('dsa_quest_user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('dsa_quest_token');
      localStorage.removeItem('dsa_quest_user');
    },
    updateXP(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.xp += action.payload;
        while (state.user.xp >= state.user.xpToNext) {
          state.user.xp -= state.user.xpToNext;
          state.user.level += 1;
          state.user.xpToNext = Math.floor(state.user.xpToNext * 1.3);
        }
        localStorage.setItem('dsa_quest_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { login, logout, updateXP } = authSlice.actions;
export default authSlice.reducer;
