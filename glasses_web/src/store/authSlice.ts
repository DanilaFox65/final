import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, login as loginApi, logout as logoutApi, register as registerApi } from '../api/authService';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const data = await loginApi(username, password);
      const user = await getProfile(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: data.token, user };
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка входа');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { username, password, role }: { username: string; password: string; role: string },
    thunkAPI
  ) => {
    try {
      const data = await registerApi(username, password, role);
      const user = await getProfile(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token: data.token, user };
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка регистрации');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as { auth: AuthState };
  const token = state.auth.token;
  if (token) {
    await logoutApi(token);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutLocal(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { logoutLocal } = authSlice.actions;

export default authSlice.reducer;

