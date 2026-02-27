"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, LayoutDashboard, FlaskConical as Tests, Settings, Plus } from "lucide-react";

const NAV_LINKS = [
  { title: "Dashboard", url: "/admin",        icon: LayoutDashboard },
  { title: "Tests",     url: "/admin/tests",  icon: Tests },
  { title: "Settings",  url: "/admin/settings", icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #D8DAFF 0%, #C8CBF8 50%, #B5BAF4 100%)",
        borderRadius: 16,
        height: 56,
        padding: "0 24px",
        boxShadow: "0 4px 24px rgba(181,186,244,0.45)",
      }}
      className="flex items-center justify-between"
    >
      {/* Brand */}
      <Link href="/admin" className="flex items-center gap-2 shrink-0">
        <div
          style={{
            background: "rgba(255,255,255,0.35)",
            borderRadius: 8,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FlaskConical size={15} style={{ color: "#3D3F6E" }} />
        </div>
        <span style={{ color: "#3D3F6E", fontWeight: 700, fontSize: 15 }}>
          HiTest
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {NAV_LINKS.map((item) => {
          const isActive =
            item.url === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.url);

          return (
            <Link
              key={item.title}
              href={item.url}
              style={{
                color: isActive ? "#3D3F6E" : "rgba(61,63,110,0.65)",
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                padding: "6px 14px",
                borderRadius: 10,
                background: isActive ? "rgba(255,255,255,0.4)" : "transparent",
                transition: "background 0.15s, color 0.15s",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.color = "#3D3F6E";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(61,63,110,0.65)";
                }
              }}
            >
              <item.icon size={13} />
              {item.title}
            </Link>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href="/admin/tests/new"
        style={{
          background: "#ffffff",
          color: "#6A6EAF",
          fontWeight: 700,
          fontSize: 12,
          borderRadius: 10,
          padding: "7px 18px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          border: "none",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 6,
          whiteSpace: "nowrap",
        }}
      >
        <Plus size={12} />
        New Test
      </Link>
    </nav>
  );
}
