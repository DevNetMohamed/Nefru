import { DEV_AUTH_BYPASS, getDevelopmentRole } from "../config/devAccess";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

export async function apiRequest(endpoint, options = {}) {
  const headers = { ...options.headers };

  // DEV ONLY: lets the API attach the matching seeded user without a session.
  if (DEV_AUTH_BYPASS && !headers["X-Dev-Auth-Role"]) {
    headers["X-Dev-Auth-Role"] = getDevelopmentRole();
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.msg || "Something went wrong",
    );
    error.status = response.status;
    error.code = data?.error?.code;
    error.data = data;
    throw error;
  }

  return data;
}

export { API_BASE_URL };

export function resolveMediaUrl(value) {
  if (!value || typeof value !== "string") return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}

// Resolves values stored for uploaded media (trip images, avatars):
// - "trips/pyramids.webp"      -> ${API_ORIGIN}/uploads/trips/pyramids.webp
// - "/uploads/avatar.jpg"      -> ${API_ORIGIN}/uploads/avatar.jpg
// - "https://..." / data:/blob:-> unchanged
export function resolveUploadsUrl(value) {
  if (!value || typeof value !== "string") return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  const path = value.startsWith("/") ? value : `/uploads/${value}`;
  return `${API_ORIGIN}${path}`;
}
