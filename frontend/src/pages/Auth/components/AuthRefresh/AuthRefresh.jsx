import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  authCheckFinished,
  loginSuccess,
  logout,
} from "../../../../store/slices/authSlice";
import { apiRequest } from "../../../../services/api";

export default function AuthRefresh() {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;

    const refreshAuth = async () => {
      try {
        const response = await apiRequest("/users/profile/me");
        if (!active) return;

        dispatch(
          loginSuccess({
            user: response.data.user,
            profile: response.data.profile,
          }),
        );
      } catch {
        if (active) dispatch(logout());
      } finally {
        if (active) dispatch(authCheckFinished());
      }
    };

    refreshAuth();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return null;
}
