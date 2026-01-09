"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isAdmin } from "@/hooks/useAuth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projets" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <aside className="flex h-full w-60 flex-col gap-2 border-r border-slate-200 bg-white p-4">
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        {isAdmin(role) && (
          <Link
            href="/users"
            className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
              pathname.startsWith("/users")
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Utilisateurs
          </Link>
        )}
      </nav>
    </aside>
  );
}
