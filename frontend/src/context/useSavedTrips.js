import { useContext } from "react";

import SavedTripsContext from "./savedTripsContext";

export function useSavedTrips() {
  const value = useContext(SavedTripsContext);
  if (!value) throw new Error("useSavedTrips must be used within SavedTripsProvider");
  return value;
}
