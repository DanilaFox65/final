
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import draftOrderReducer from './draftOrderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    draftOrder: draftOrderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
