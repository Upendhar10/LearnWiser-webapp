import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("authToken");

const initialState = {
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage, // tokenFromStorage !== null
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user ?? null;
    },
    logoutSuccess(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    restoreAuth(state, action) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user ?? null;
    },
  },
});

export const { loginSuccess, logoutSuccess, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
