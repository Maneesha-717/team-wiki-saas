"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Organizations", href: "/dashboard/organizations" },
  { name: "Workspaces", href: "/dashboard/workspaces" },
  { name: "Documents", href: "/dashboard/documents" },
  { name: "Members", href: "/dashboard/members" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-64 shrink-0 flex-col border-r bg-white p-6"
      style={{ borderColor: "#E4DFD4" }}
    >
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <svg width="20" height="20" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="24" height="24" rx="3" stroke="#1B4332" strokeWidth="1.4" />
          <path d="M8 18V8.5L13 6l5 2.5V18" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.75 18v-4.5h4.5V18" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className="text-[18px]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "#1C1B19" }}
        >
          Team Wiki
        </span>
      </Link>

      <nav className="mt-8 space-y-0.5">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="flex items-center rounded-md px-3 py-2 text-[14px] transition-colors"
              style={
                isActive
                  ? { background: "#F3F0E8", color: "#1B4332", fontWeight: 500 }
                  : { color: "#6F6A62" }
              }
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#F3F0E8";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}