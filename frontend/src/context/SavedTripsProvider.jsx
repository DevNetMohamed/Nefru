import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { apiRequest } from "../services/api";
import SavedTripsContext from "./savedTripsContext";

export default function SavedTripsProvider({ children }) {
  const { initialized, isAuthenticated, user } = useSelector((state) => state.auth);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || user?.role !== "tourist") {
      setSavedIds(new Set());
      return [];
    }
    setLoading(true);
    try {
      const response = await apiRequest("/users/saved-trips");
      const ids = (response?.data?.ids || []).map(String);
      setSavedIds(new Set(ids));
      return response?.data?.trips || [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    if (!initialized) return undefined;
    const timer = window.setTimeout(() => {
      refresh().catch(() => setSavedIds(new Set()));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialized, refresh]);

  const toggleSaved = useCallback(async (tripId) => {
    if (!isAuthenticated || user?.role !== "tourist") {
      window.location.assign(`/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    const id = String(tripId || "");
    const wasSaved = savedIds.has(id);
    setSavedIds((previous) => {
      const next = new Set(previous);
      if (wasSaved) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      await apiRequest(`/users/saved-trips/${id}`, { method: wasSaved ? "DELETE" : "POST" });
      return !wasSaved;
    } catch (error) {
      setSavedIds((previous) => {
        const next = new Set(previous);
        if (wasSaved) next.add(id);
        else next.delete(id);
        return next;
      });
      throw error;
    }
  }, [isAuthenticated, savedIds, user?.role]);

  const value = useMemo(
    () => ({ savedIds, loading, refresh, toggleSaved }),
    [savedIds, loading, refresh, toggleSaved],
  );
  return <SavedTripsContext.Provider value={value}>{children}</SavedTripsContext.Provider>;
}
