import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, AuthenticatedUser } from './types';
import type { RootState } from '../../app/store';

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuthenticatedUser: (state, action: PayloadAction<AuthenticatedUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.errorMessage = null;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
      state.isLoading = false;
    },
    signOutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.errorMessage = null;
    },
  },
});

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) =>
  typeof state.auth === 'object' && state.auth !== null ? state.auth.currentUser : null;
export const selectIsAuthenticated = (state: RootState) =>
  typeof state.auth === 'object' && state.auth !== null && state.auth.isAuthenticated === true;

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
