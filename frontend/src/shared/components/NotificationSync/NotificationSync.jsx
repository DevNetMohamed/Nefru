import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearNotifications,
  fetchNotifications,
} from "../../../store/slices/notificationSlice";

export default function NotificationSync() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
      return;
    }

    dispatch(clearNotifications());
  }, [dispatch, isAuthenticated]);

  return null;
}
