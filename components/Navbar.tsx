"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels } from "@/utils/roles";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
        Gestion Projets
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{roleLabels[user.role]}</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => logout.mutate()}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
