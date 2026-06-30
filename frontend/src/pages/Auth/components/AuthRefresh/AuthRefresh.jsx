import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { loginSuccess, logout } from "../../../store/slices/authSlice";
import { apiRequest } from "../../../services/api";

export default function AuthRefresh() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await apiRequest("/users/me", {
          method: "GET",
        });

        dispatch(
          loginSuccess({
            token,
            user: response.data.user,
          }),
        );
      } catch (error) {
        dispatch(logout());
      }
    };

    refreshAuth();
  }, [dispatch]);

  return null;
}