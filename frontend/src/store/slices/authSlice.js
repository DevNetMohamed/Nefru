import { createSlice } from "@reduxjs/toolkit";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
const storedProfile = localStorage.getItem("profile");

const parsedUser = safeParse(storedUser);
const parsedProfile = safeParse(storedProfile);

const initialState = {
  token: storedToken || null,
  user: parsedUser,
  profile: parsedProfile,
  isAuthenticated: Boolean(storedToken && parsedUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user, profile } = action.payload;

      // Only store token and user when both are present
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (profile !== undefined) {
        state.profile = profile;
        localStorage.setItem("profile", JSON.stringify(profile));
      } else {
        state.profile = null;
        localStorage.removeItem("profile");
      }
    },

    updateProfile: (state, action) => {
      const { user, profile } = action.payload;

      state.user = user;
      state.profile = profile;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("profile", JSON.stringify(profile));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profile");
    },
  },
});

export const { loginSuccess, updateProfile, logout } = authSlice.actions;

export default authSlice.reducer;