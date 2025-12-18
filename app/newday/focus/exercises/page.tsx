// app/newday/focus/exercises/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
import { defaultExercises } from "@/lib/exercises";

export default function FocusExercisesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const partsParam = searchParams.get("parts") ?? "";
  const selectedParts = partsParam
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const [chosenExercises, setChosenExercises] = useState<string[]>([]);

  const allExercises = useMemo(() => {
    const set = new Set<string>();
    selectedParts.forEach((part) => {
      const list = defaultExercises[part] || [];
      list.forEach((ex) => set.add(ex));
    });
    return Array.from(set).sort();
  }, [selectedParts]);

  function toggleExercise(ex: string) {
    setChosenExercises((prev) =>
      prev.includes(ex) ? prev.filter((e) => e !== ex) : [...prev, ex]
    );
  }

  function handleContinue() {
    if (chosenExercises.length === 0) {
      alert("Select at least one exercise.");
      return;
    }
    const params = new URLSearchParams();
    params.set("parts", selectedParts.join(","));
    params.set("exs", chosenExercises.join(","));
    router.push(`/newday/focus/log?${params.toString()}`);
  }

  if (selectedParts.length === 0) {
    return (
      <main className="min-h-screen text-white pb-16">
        <Navbar />
        <section className="mx-auto max-w-xl px-5 mt-10 text-center">
          <p className="text-slate-300">
            No focus selected. Go back and choose body parts for today.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white pb-16">
      <Navbar />
      <section className="mx-auto max-w-xl px-5">
        <div className="mt-6 mb-4 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            {selectedParts.join(" · ")}
          </p>
          <h1 className="text-3xl font-bold">Choose today’s exercises</h1>
          <p className="text-slate-300 text-sm">
            Pick all movements you will do today. Next page: log reps & weights.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {allExercises.map((ex, index) => {
            const active = chosenExercises.includes(ex);
            return (
              <motion.button
                type="button"
                key={ex}
                onClick={() => toggleExercise(ex)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                className={`w-full text-left rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "border-emerald-400/70 bg-emerald-500/15 shadow-lg shadow-emerald-500/20"
                    : "border-white/10 bg-white/5 hover:border-emerald-400/50"
                }`}
              >
                {ex}
              </motion.button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
        >
          Continue to logging
        </button>
      </section>
    </main>
  );
}
