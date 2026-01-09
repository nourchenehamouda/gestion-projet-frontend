"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useUserActions, useUsers } from "@/hooks/useUsers";
import { roleLabels } from "@/utils/roles";
import type { Role } from "@/utils/types";

const userSchema = z.object({
  name: z.string().min(3, "Nom requis"),
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();
  const { data: users = [] } = useUsers();
  const { createMutation, updateMutation } = useUserActions();
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: "TEAM_MEMBER" },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
    if (!isLoading && role && role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, role, router]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return users;
    }
    const term = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term),
    );
  }, [search, users]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Administration
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Gestion des utilisateurs
        </h1>
        <p className="mt-4 text-slate-600">
          Créez des comptes, attribuez les rôles et activez ou désactivez l'accès.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Utilisateurs</h2>
            <input
              type="search"
              placeholder="Rechercher un utilisateur"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm sm:w-64"
            />
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Utilisateur</th>
                  <th className="px-4 py-3 font-medium">Rôle</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="bg-white">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{userItem.name}</div>
                      <div className="text-xs text-slate-500">{userItem.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={userItem.role}
                        onChange={(event) =>
                          updateMutation.mutate({
                            id: userItem.id,
                            payload: { role: event.target.value as Role },
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          userItem.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {userItem.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateMutation.mutate({
                            id: userItem.id,
                            payload: { isActive: !userItem.isActive },
                          })
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        {userItem.isActive ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                Aucun utilisateur trouvé.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ajoutez un nouvel utilisateur et attribuez un rôle initial.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit((data) => {
              createMutation.mutate({
                ...data,
                isActive: true,
              });
              reset();
            })}
          >
            <label className="block text-sm font-medium text-slate-700">
              Nom complet
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("name")}
              />
              {errors.name && (
                <span className="mt-2 block text-xs text-red-600">{errors.name.message}</span>
              )}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("email")}
              />
              {errors.email && (
                <span className="mt-2 block text-xs text-red-600">{errors.email.message}</span>
              )}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Rôle
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("role")}
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Créer l'utilisateur
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
