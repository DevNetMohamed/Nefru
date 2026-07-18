import { createSlice } from "@reduxjs/toolkit";
import { mockNotifications } from "../../pages/User/Notifications/data/mockNotifications";

const initialState = {
  // Temporary mock data until backend notifications API is ready.
  notifications: mockNotifications,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (item) => item.id === action.payload
      );

      if (notification) {
        notification.isRead = true;
      }
    },

    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
  },
});

export const { markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
