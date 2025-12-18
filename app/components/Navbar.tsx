"use client";

import Link from "next/link";
import { supabase } from "../../lib/superbaseClient";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { href: "/newday", label: "New" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/70 border-b border-white/5">
      <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-slate-900 font-black shadow-lg shadow-emerald-500/20">
            TM
          </div>
          <div className="text-sm leading-tight">
            <p className="text-xs text-emerald-300/90">TrackMe</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 rounded-full transition hover:text-emerald-300"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/5 border border-emerald-400/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="ml-1 px-3 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/40 transition"
          >
            Logout
          </button>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/newday"
            className="rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
          >
            New
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-white"
          >
            <span className="block h-0.5 w-5 bg-white mb-1"></span>
            <span className="block h-0.5 w-5 bg-white mb-1"></span>
            <span className="block h-0.5 w-5 bg-white"></span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="sm:hidden border-t border-white/10 bg-slate-900/90 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-xl px-4 py-3 space-y-2">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-white/10 text-emerald-200 border border-emerald-400/30"
                        : "bg-white/5 text-white border border-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
