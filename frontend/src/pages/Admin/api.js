import { apiRequest } from "../../services/api";

// All calls return the parsed response body on success
// ({success, message, data, meta}) or a rejected-shaped result on failure:
// {error: message, status, code} — never throws.
async function request(endpoint, options, fallbackMessage) {
  try {
    return await apiRequest(endpoint, options);
  } catch (error) {
    return {
      error: error?.message || fallbackMessage,
      status: error?.status,
      code: error?.code,
    };
  }
}

export const getDashboard = () => request("/admin/dashboard", undefined, "Failed to load dashboard data");

export const getAccount = (accountType = "tourist", page = 1) =>
  request(
    `/admin/user?role=${encodeURIComponent(accountType)}&page=${page}`,
    undefined,
    "Failed to load accounts",
  );

// state: "all" | "published" | "unpublished"
export const getTrips = (page = 1, state = "all") =>
  request(
    `/admin/tours/${page}?state=${encodeURIComponent(state || "all")}`,
    undefined,
    "Failed to load trips",
  );

// Read-only bookings listing for the admin Booking page.
export const getBookings = (page = 1) =>
  request(`/admin/bookings/${page}`, undefined, "Failed to load bookings");

// --- Mutations ---

export const banUser = (id) =>
  request(`/admin/user/${id}/ban`, { method: "PATCH" }, "Failed to ban user");

export const unbanUser = (id) =>
  request(`/admin/user/${id}/unban`, { method: "PATCH" }, "Failed to unban user");

export const deleteUser = (id) =>
  request(`/admin/user/${id}`, { method: "DELETE" }, "Failed to delete user");

// action: "approve" | "reject" | "suspend"
export const reviewGuide = (id, action, rejectionReason) =>
  request(
    `/admin/guide/${id}/${action}`,
    {
      method: "PATCH",
      body: JSON.stringify(rejectionReason ? { rejectionReason } : {}),
    },
    `Failed to ${action} guide`,
  );

// action: "publish" | "hide" | "reject" (approve/suspend are legacy aliases)
export const setTripStatus = (id, action) =>
  request(
    `/admin/trip/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ action }) },
    `Failed to ${action} trip`,
  );
