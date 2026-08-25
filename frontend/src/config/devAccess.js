// TEMPORARY DEVELOPMENT BYPASS:
// Keep this enabled while building screens that should not be blocked by auth.
// Set VITE_DEV_AUTH_BYPASS=false to test the real authentication flow locally.
// import.meta.env.DEV guarantees that production builds never enable the bypass.
export const DEV_AUTH_BYPASS =
  import.meta.env.DEV &&
  String(import.meta.env.VITE_DEV_AUTH_BYPASS ?? "false").toLowerCase() !==
    "false";

export function getDevelopmentRole() {
  if (window.location.pathname.startsWith("/admin")) return "admin";
  if (window.location.pathname.startsWith("/guide")) return "guide";
  return "tourist";
}
