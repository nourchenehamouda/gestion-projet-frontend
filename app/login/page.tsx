"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels, roleRedirects } from "@/utils/roles";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      router.replace(roleRedirects[user.role]);
    }
  }, [router, user]);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Connexion
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Accès sécurisé à la plateforme
          </h1>
          <p className="mt-4 text-slate-600">
            Utilisez vos identifiants pour accéder aux projets, tâches et tableaux de bord.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit((data) => login.mutate(data))}
          >
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                placeholder="prenom.nom@cni.local"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                {...register("email")}
              />
              {errors.email && (
                <span className="mt-2 block text-xs text-red-600">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Mot de passe
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                {...register("password")}
              />
              {errors.password && (
                <span className="mt-2 block text-xs text-red-600">
                  {errors.password.message}
                </span>
              )}
            </label>

            {login.isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                Identifiants invalides. Veuillez réessayer.
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {login.isPending ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Rôles & redirections</h2>
          <p className="mt-2 text-sm text-slate-600">
            Après connexion, l'accès est ajusté selon votre rôle.
          </p>
          <div className="mt-4 space-y-3">
            {Object.entries(roleLabels).map(([role, label]) => (
              <div
                key={role}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Redirection : {roleRedirects[role as keyof typeof roleLabels]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
