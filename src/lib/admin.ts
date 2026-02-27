import { redirect } from "next/navigation";
import { isAuthenticated } from "./auth";

export function requireAdmin() {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }
}
