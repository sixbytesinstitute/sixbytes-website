export type AppRole = "admin" | "manager" | "faculty" | "student";

export function canManagePublicResources(role: string): boolean {
  return role === "admin" || role === "manager";
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "manager":
      return "/manager/resources";
    case "faculty":
      return "/faculty/dashboard";
    case "student":
    default:
      return "/dashboard";
  }
}
