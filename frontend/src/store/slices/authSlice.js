import { createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/api";

const initialState = {
  token: null,
  user: null,
  profile: null,
  isAuthenticated: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token = null, user, profile = null } = action.payload || {};

      state.token = token;
      state.user = user || null;
      state.profile = profile;
      state.isAuthenticated = Boolean(user);
      state.initialized = true;
    },

    updateProfile: (state, action) => {
      const { user, profile } = action.payload;
      state.user = user;
      state.profile = profile;
    },

    authCheckFinished: (state) => {
      state.initialized = true;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.initialized = true;
    },
  },
});

export const { loginSuccess, updateProfile, authCheckFinished, logout } =
  authSlice.actions;

export const logoutUser = () => async (dispatch) => {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    // Always clear local auth state, even if the session already expired.
  } finally {
    dispatch(logout());
  }
};

export default authSlice.reducer;
