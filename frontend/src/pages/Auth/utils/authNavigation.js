export function getPostAuthPath(user, profile) {
  if (user?.role === "admin") return "/admin/overview";

  if (user?.role === "guide") {
    if (["draft", "rejected"].includes(profile?.verificationStatus)) {
      return "/guide/verification";
    }
    return "/guide/dashboard";
  }

  return "/user/home";
}
