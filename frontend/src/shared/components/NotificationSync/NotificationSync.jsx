import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearNotifications,
  fetchNotifications,
} from "../../../store/slices/notificationSlice";

export default function NotificationSync() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications());
      return;
    }

    dispatch(clearNotifications());
  }, [dispatch, token]);

  return null;
}
