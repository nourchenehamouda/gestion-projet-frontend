"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  UserIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

const roles = [];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      return;
    }
    if (login.isPending) {
      return;
    }
    login.mutate({ email, password });
  };

  const fillCredentials = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-bg">
        <div className="hero-blob hero-blob-1 animate-float-slow" />
        <div className="hero-blob hero-blob-2 animate-float" style={{ animationDelay: "2s" }} />
        <div className="hero-blob hero-blob-3 animate-pulse-glow" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          {/* Logo & Back Link */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              <span>Retour à l'accueil</span>
            </Link>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold font-display text-white">
                CNI <span className="text-white/60">Projets</span>
              </span>
            </motion.div>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Login Form */}
            <div className="glass rounded-[32px] p-8 md:p-10">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Connexion sécurisée
                </h1>
                <p className="text-white/60">
                  Accédez à vos projets, tâches et sprints.
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {login.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm"
                  >
                    {login.error.message || "Erreur de connexion"}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <EnvelopeIcon
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-purple-400' : 'text-white/40'
                        }`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="votre@email.tn"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <LockClosedIcon
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-purple-400' : 'text-white/40'
                        }`}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={login.isPending || !email || !password}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {login.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Security Note */}
              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Graphical Showcase */}
            <div className="glass rounded-[32px] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 -tr-y-1/2 -tr-x-1/2 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700" />
              <div className="absolute bottom-0 left-0 tr-y-1/2 tr-x-1/2 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <img
                    src="/artifacts/login_visual_showcase.png"
                    alt="CNI Ecosystem"
                    className="w-full h-48 object-cover rounded-2xl shadow-2xl border border-white/10"
                  />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-6">
                  L'excellence dans la <span className="text-gradient">Gestion de Projets</span>
                </h2>

                <div className="grid gap-6">
                  {[
                    {
                      title: "Collaboration en temps réel",
                      desc: "Équipes, Managers et Clients synchronisés instantanément.",
                      icon: UserGroupIcon,
                      color: "text-blue-400"
                    },
                    {
                      title: "Visibilité Totale",
                      desc: "Suivez l'avancement de vos sprints et tâches avec précision.",
                      icon: ChartBarIcon,
                      color: "text-emerald-400"
                    },
                    {
                      title: "Sécurité de pointe",
                      desc: "Vos données protégées par les standards les plus élevés.",
                      icon: ShieldCheckIcon,
                      color: "text-purple-400"
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
                    >
                      <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white/90">{item.title}</h3>
                        <p className="text-sm text-white/50 mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 text-center">
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Platforme Officielle</p>
                  <p className="text-sm text-white/70 italic">
                    "Propulsé par le Centre National d'Informatique"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
