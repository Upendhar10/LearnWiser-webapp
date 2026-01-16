import { createSlice } from "@reduxjs/toolkit";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

const tokenFromStorage = localStorage.getItem("authToken");

const initialState = {
  token: tokenFromStorage,
  user: null,
  status: tokenFromStorage ? "checking" : "unauthenticated",
} as {
  token: string | null;
  user: any | null;
  status: AuthStatus;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload.token;
      state.status = "authenticated";
    },
    logoutSuccess(state) {
      state.token = null;
      state.user = null;
      state.status = "unauthenticated";
    },
    setLoginUser(state, action) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    authFailed(state) {
      state.token = null;
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { loginSuccess, logoutSuccess, setLoginUser, authFailed } =
  authSlice.actions;

export default authSlice.reducer;
