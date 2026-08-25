import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CheckoutWizard from "../../../../../../components/Checkout/CheckoutWizard";
import { apiRequest } from "../../../../../../services/api";

export default function Status() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest(`/bookings/${bookingId}`)
      .then((response) => active && setBooking(response?.data?.booking))
      .catch((requestError) => active && setError(requestError.message));
    return () => { active = false; };
  }, [bookingId]);

  if (error) return <main style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>{error}</main>;
  if (!booking) return <main style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>Loading secure checkout...</main>;
  return <CheckoutWizard initialData={booking} />;
}
