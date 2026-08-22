import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiRequest } from "../../services/api";

const normalizeNotification = (notification) => ({
  ...notification,
  id: notification.id || notification._id,
});

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    const response = await apiRequest("/notifications");
    return (response.data?.notifications || []).map(normalizeNotification);
  },
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId) => {
    await apiRequest(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
    return notificationId;
  },
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async () => {
    await apiRequest("/notifications/read-all", { method: "PATCH" });
  },
);

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unable to load notifications";
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (item) => item.id === action.payload,
        );

        if (notification) notification.isRead = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
