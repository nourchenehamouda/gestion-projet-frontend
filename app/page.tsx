"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Gestion de Projets",
    description:
      "Créez, organisez et suivez vos projets avec des statuts, dates et équipes dédiées.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ChartBarIcon,
    title: "Tableau Kanban",
    description:
      "Visualisez l'avancement avec des colonnes À faire, En cours et Terminé.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: UserGroupIcon,
    title: "Gestion d'Équipe",
    description:
      "Assignez des rôles, gérez les permissions et collaborez efficacement.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: BellAlertIcon,
    title: "Notifications",
    description:
      "Restez informé des assignations, deadlines et changements en temps réel.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: DocumentTextIcon,
    title: "Gestion Documentaire",
    description:
      "Attachez des fichiers, spécifications et livrables à vos projets.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: ShieldCheckIcon,
    title: "Sécurité Avancée",
    description:
      "Authentification JWT, chiffrement BCrypt et contrôle RBAC complet.",
    gradient: "from-rose-500 to-pink-500",
  },
];

const stats = [
  { value: "99.9%", label: "Disponibilité" },
  { value: "500+", label: "Projets Gérés" },
  { value: "50+", label: "Équipes Actives" },
  { value: "24/7", label: "Support" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen hero-bg flex items-center justify-center px-6 py-20">
        {/* Animated Background Elements */}
        <div className="hero-blob hero-blob-1 animate-float-slow" />
        <div className="hero-blob hero-blob-2 animate-float" style={{ animationDelay: "2s" }} />
        <div className="hero-blob hero-blob-3 animate-pulse-glow" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <SparklesIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">
              Centre National d'Informatique · Tunisie
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Gérez vos projets
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              avec excellence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-xl text-white/70 max-w-2xl mx-auto mb-12"
          >
            Plateforme moderne de gestion de projets, tâches et sprints conçue pour
            optimiser la collaboration et la productivité de vos équipes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Commencer maintenant
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/documentation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              Documentation
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Fonctionnalités
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Une suite complète d'outils pour gérer efficacement vos projets,
              équipes et livrables.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative p-8 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Gradient Glow on Hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-semibold mb-4">
              Architecture
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              Technologies modernes
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Une stack technique robuste et performante pour une expérience optimale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend",
                tech: "Next.js 16",
                description: "Interface réactive avec React 19, TailwindCSS et Framer Motion",
                icon: "⚛️",
              },
              {
                title: "Backend",
                tech: "Spring Boot",
                description: "API REST sécurisée avec JWT, Spring Security et validation",
                icon: "🍃",
              },
              {
                title: "Base de données",
                tech: "MongoDB",
                description: "Stockage flexible et performant pour vos données projet",
                icon: "🍃",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark rounded-3xl p-8 text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <div className="text-primary-400 font-mono text-sm mb-4">{item.tech}</div>
                <p className="text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-[40px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à transformer votre gestion de projets ?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-xl mx-auto">
              Rejoignez le CNI et découvrez une nouvelle façon de collaborer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Accéder à la plateforme
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-display">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  CNI
                </span>{" "}
                <span className="text-white/80">Gestion Projets</span>
              </h3>
              <p className="text-white/50 mt-2">
                Centre National d'Informatique · Tunisie
              </p>
            </div>

            <div className="flex gap-8">
              <Link href="/login" className="text-white/70 hover:text-white transition-colors">
                Connexion
              </Link>
              <Link href="/documentation" className="text-white/70 hover:text-white transition-colors">
                Documentation
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © 2026 Centre National d'Informatique. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
