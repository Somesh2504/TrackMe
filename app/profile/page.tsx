"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbaseClient"
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setEmail(data?.user?.email ?? null);
    }
    loadUser();
  }, []);

  return (
    <main className="min-h-screen text-white pb-16">
      <Navbar />

      <section className="mx-auto max-w-xl px-5">
        <div className="mt-6 mb-5 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            Account
          </p>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-slate-300 text-sm">
            Your login details and quick stats at a glance.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30"
        >
          <p className="text-sm text-slate-400">Email</p>
          <p className="text-lg font-semibold text-white">{email ?? "Loading..."}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Streak", value: "—" },
              { label: "Total workouts", value: "—" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/5 bg-slate-900/50 p-3"
              >
                <p className="text-slate-400">{item.label}</p>
                <p className="text-lg font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
