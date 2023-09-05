import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";

export interface AuthSlice {
  token: string | null | undefined;
  isAuthenticated: boolean;
  authLoading: boolean;
}

const initialState: AuthSlice = {
  token: null,
  isAuthenticated: false,
  authLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },

    logOut: (
      state,
      action: PayloadAction<{ token: string | null; authStatus: boolean }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = action.payload.authStatus;
    },

    setUserAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.authLoading = false;
      state.isAuthenticated = action.payload;
    },
  },
});

export default authSlice.reducer;

export const authActions = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
