import { LayoutDashboard, FlaskConical, Settings } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Tests",
    url: "/admin/tests",
    icon: FlaskConical,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];
