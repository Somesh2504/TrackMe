"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbaseClient";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";

type Workout = {
  id: string;
  focus: string;
  created_at: string;
  exercises?: { name: string; reps?: { weight: number; count: number }[] }[];
};

export default function HistoryPage() {
  const [data, setData] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("workout")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError("Error fetching workouts");
      } else {
        setData(data as Workout[]);
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <main className="min-h-screen text-white pb-16">
      <Navbar />
      <section className="mx-auto max-w-xl px-5">
        <div className="mt-6 mb-6 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            History
          </p>
          <h1 className="text-3xl font-bold">Previous workouts</h1>
          <p className="text-slate-300 text-sm">
            Tap a day to review what you lifted. Stored securely via Supabase.
          </p>
        </div>

        <div className="space-y-4">
          {loading && <p className="text-center text-slate-400">Loading...</p>}
          {error && (
            <p className="text-center text-red-400 font-semibold">{error}</p>
          )}
          {!loading && !error && data.length === 0 && (
            <p className="text-center text-slate-400">No workouts found yet.</p>
          )}
          {!loading &&
            !error &&
            data.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-200/80 uppercase tracking-[0.18em]">
                      {workout.focus}
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(workout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-100 ring-1 ring-emerald-400/40">
                    {workout.exercises?.length ?? 0} exercises
                  </span>
                </div>

                {workout.exercises?.length ? (
                  <ul className="mt-3 text-sm text-slate-300 space-y-1">
                    {workout.exercises.slice(0, 3).map((ex, i) => (
                      <li key={`${workout.id}-${i}`} className="flex justify-between">
                        <span>{ex.name}</span>
                        <span className="text-slate-400">
                          {ex.reps?.length ?? 0} rep(s)
                        </span>
                      </li>
                    ))}
                    {workout.exercises.length > 3 && (
                      <li className="text-xs text-slate-400">
                        +{workout.exercises.length - 3} more
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-400 mt-2">No exercises logged.</p>
                )}
              </motion.div>
            ))}
        </div>
      </section>
    </main>
  );
}
