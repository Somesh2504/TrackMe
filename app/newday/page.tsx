// app/newday/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const workoutOptions = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Cardio",
  "Abs Core",   // normalize naming to match keys
  "Full Body",
];

export default function NewWorkoutPage() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const router = useRouter();

  function togglePart(part: string) {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  }

  function handleContinue() {
    const partsForQuery = selectedParts.filter((p) => p !== "Cardio");
    if (partsForQuery.length === 0) {
      alert("Select at least one body part (excluding Cardio).");
      return;
    }

    const params = new URLSearchParams();
    params.set("parts", partsForQuery.join(","));

    router.push(`/newday/focus/exercises?${params.toString()}`);
  }

  return (
    <main className="min-h-screen text-white pb-16">
      <Navbar />
      <section className="mx-auto max-w-xl px-5">
        <div className="mt-6 mb-6 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            Day planner
          </p>
          <h1 className="text-3xl font-bold">Select today’s focus</h1>
          <p className="text-slate-300 text-sm">
            Pick one or more body parts for today (e.g. Chest + Triceps).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {workoutOptions.map((option, index) => {
            const active = selectedParts.includes(option);
            return (
              <motion.button
                type="button"
                key={option}
                onClick={() => togglePart(option)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`block rounded-2xl border px-4 py-4 text-center font-semibold transition ${
                  active
                    ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-50 shadow-lg shadow-emerald-500/20"
                    : "border-white/10 bg-white/5 text-white hover:border-emerald-400/40"
                }`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        {selectedParts.length > 0 && (
          <div className="mt-6 text-center text-sm text-emerald-100">
            Selected: {selectedParts.join(" · ")}
          </div>
        )}

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 disabled:bg-slate-600"
          disabled={selectedParts.filter((p) => p !== "Cardio").length === 0}
        >
          Continue to exercises
        </button>
      </section>
    </main>
  );
}
