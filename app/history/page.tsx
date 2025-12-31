"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/superbaseClient";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";

type RepEntry = {
  weight: number;
  count: number;
};

type Exercise = {
  name: string;
  reps?: RepEntry[];
};

type Workout = {
  id: string;
  focus: string;
  created_at: string;
  exercises?: Exercise[];
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
            Review exactly what you lifted — weight × reps.
          </p>
        </div>

        <div className="space-y-4">
          {loading && (
            <p className="text-center text-slate-400">Loading...</p>
          )}

          {error && (
            <p className="text-center text-red-400 font-semibold">
              {error}
            </p>
          )}

          {!loading && !error && data.length === 0 && (
            <p className="text-center text-slate-400">
              No workouts found yet.
            </p>
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
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
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

                {/* Exercises */}
                {workout.exercises?.length ? (
                  <div className="space-y-3">
                    {workout.exercises.map((ex, i) => (
                      <div
                        key={`${workout.id}-${i}`}
                        className="rounded-xl border border-white/10 bg-slate-900/60 p-3"
                      >
                        <p className="font-semibold text-white mb-1">
                          {ex.name}
                        </p>

                        {ex.reps?.length ? (
                          <ul className="text-sm text-slate-300 space-y-1">
                            {ex.reps.map((r, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between"
                              >
                                <span>
                                  {r.weight} kg
                                </span>
                                <span className="text-slate-400">
                                  × {r.count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-400">
                            No reps logged
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No exercises logged.
                  </p>
                )}
              </motion.div>
            ))}
        </div>
      </section>
    </main>
  );
}
