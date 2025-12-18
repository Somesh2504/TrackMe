"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-5 pb-16 pt-14">
      <div className="mx-auto max-w-xl space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-white/10">
            Mobile-first · Frictionless logging · Progress focused
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Track every lift. <span className="text-emerald-300">See progress.</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            TrackMe is a zero-friction gym weight tracker built for fast logging on the go.
            Pick a focus, tap in your sets, and see your streak grow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-5 shadow-2xl backdrop-blur-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-emerald-200/80 tracking-[0.2em]">
                Today
              </p>
              <p className="text-lg font-semibold">Leg Day | Strength</p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-100 ring-1 ring-emerald-400/40">
              Streak · 6 days
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            {[
              { label: "Sets", value: "12" },
              { label: "Top Weight", value: "265 lb" },
              { label: "Time", value: "48 min" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/5"
              >
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
                <p className="text-base font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-3">
          <Link
            href="/auth?mode=login"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-slate-950 py-3 text-base font-semibold shadow-lg shadow-emerald-500/30 transition hover:translate-y-[-1px] hover:shadow-emerald-400/40"
          >
            Jump back in
          </Link>
          <Link
            href="/auth?mode=signup"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/10 text-white py-3 text-base font-semibold ring-1 ring-white/15 transition hover:bg-white/15"
          >
            Create an account
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { title: "Fast focus", desc: "Pick Chest, Back, Legs, or custom in two taps." },
            { title: "Inline sets", desc: "Log weight + reps in one flow, no extra screens." },
            { title: "History", desc: "See past sessions, spot trends, and repeat winners." },
            { title: "Offline-first", desc: "Optimized for spotty gym Wi-Fi with local feedback." },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10"
            >
              <p className="font-semibold text-white">{item.title}</p>
              <p className="text-slate-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
