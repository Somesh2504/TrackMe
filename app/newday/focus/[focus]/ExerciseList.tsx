"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";
type RepEntry = { weight: number; count: number };

type ExerciseLog = {
  name: string;
  reps: RepEntry[];
};

export default function ExerciseList({
  workoutName,
  exercises,
}: {
  workoutName: string;
  exercises: string[];
}) {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [repCount, setRepCount] = useState<string>("");
  const [weights, setWeights] = useState<string[]>([]);
  const [loggedExercises, setLoggedExercises] = useState<ExerciseLog[]>([]);
  const [customExercise, setCustomExercise] = useState("");
  const [customList, setCustomList] = useState<string[]>([]);

  const exerciseOptions = [...exercises, ...customList];

  function handleExerciseClick(ex: string) {
    setActiveExercise(ex);
    setRepCount("");
    setWeights([]);
  }

  function handleSetRepCount() {
    const count = Number(repCount);
    if (!count || count <= 0) {
      alert("Please enter a valid number of reps");
      return;
    }
    setWeights(Array(count).fill(""));
  }

  function handleWeightChange(index: number, value: string) {
    const updated = [...weights];
    updated[index] = value;
    setWeights(updated);
  }

  function handleSaveExercise() {
    if (!activeExercise) return;

    const numericWeights = weights.map((w) => Number(w));
    if (numericWeights.length === 0) {
      alert("Please set reps and weights first");
      return;
    }
    if (numericWeights.some((w) => !w || w <= 0)) {
      alert("Please fill weight for every rep with a valid number");
      return;
    }

    const reps: RepEntry[] = numericWeights.map((w) => ({
      weight: w,
      count: 1, // each entry = 1 rep (we’ll keep it simple for now)
    }));

    const newLog: ExerciseLog = {
      name: activeExercise,
      reps,
    };

    setLoggedExercises((prev) => {
      // if this exercise already logged, overwrite it
      const filtered = prev.filter((e) => e.name !== activeExercise);
      return [...filtered, newLog];
    });

    // Clear current input
    setActiveExercise(null);
    setRepCount("");
    setWeights([]);
    
    console.log(`Saved ${activeExercise} with ${reps.length} reps.`)
    alert(`Saved ${activeExercise} with ${reps.length} reps.`);
  }

  function addCustomExercise() {
    const name = customExercise.trim();
    if (!name) return;
    if (exerciseOptions.includes(name)) {
      alert("This exercise already exists in the list.");
      return;
    }
    setCustomList((prev) => [...prev, name]);
    setCustomExercise("");
  }

async function handleSaveWorkout() {
  if (loggedExercises.length === 0) {
    alert("No exercises logged yet!");
    return;
  }

  const workout = {
    focus: workoutName,
    date: new Date().toISOString(),
    exercises: loggedExercises,
  };

  try {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    });

    const result = await res.json();

    if (result.success) {
      alert("Workout saved to Supabase! 🏋️‍♂️");
      // optional: clear local state if you want
      setLoggedExercises([]);
    } else {
      alert("Error saving workout: " + result.error);
    }
  } catch (error:any) {
    alert("Network error: " + error.message);
  }
}

  return (
    <main className="min-h-screen text-white pb-16">
      <Navbar />
      <section className="mx-auto max-w-xl px-5">
        <div className="mt-6 mb-5 space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            {workoutName}
          </p>
          <h1 className="text-3xl font-bold">Log your sets</h1>
          <p className="text-slate-300 text-sm">
            Tap an exercise, set reps, then swipe through weights. Add custom moves anytime.
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={customExercise}
            onChange={(e) => setCustomExercise(e.target.value)}
            placeholder="Add custom exercise"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400/60 focus:outline-none"
          />
          <button
            onClick={addCustomExercise}
            className="rounded-xl bg-emerald-500 px-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {exerciseOptions.map((ex, index) => (
            <motion.button
              key={ex}
              onClick={() => handleExerciseClick(ex)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`w-full text-left rounded-2xl border px-4 py-3 font-semibold transition ${
                activeExercise === ex
                  ? "border-emerald-400/70 bg-emerald-500/15 shadow-lg shadow-emerald-500/20"
                  : "border-white/10 bg-white/5 hover:border-emerald-400/50"
              }`}
            >
              {ex}
            </motion.button>
          ))}
        </div>

        {activeExercise && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6 shadow-lg shadow-black/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-emerald-200/80 uppercase tracking-[0.25em]">
                  Active
                </p>
                <h2 className="text-xl font-semibold">{activeExercise}</h2>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-100 ring-1 ring-emerald-400/40">
                {weights.length || 0} reps
              </span>
            </div>

            <div className="mt-4">
              <label className="block mb-2 text-sm text-slate-300">
                How many reps?
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={repCount}
                  onChange={(e) => setRepCount(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 p-2 text-white placeholder:text-slate-500"
                  placeholder="e.g. 10"
                  min={1}
                />
                <button
                  onClick={handleSetRepCount}
                  className="rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
                >
                  Set reps
                </button>
              </div>
            </div>

            {weights.length > 0 && (
              <div className="mt-4 space-y-3">
                {weights.map((w, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2"
                  >
                    <span className="text-sm text-slate-200">Rep {index + 1}</span>
                    <input
                      type="number"
                      value={w}
                      onChange={(e) => handleWeightChange(index, e.target.value)}
                      className="w-24 rounded-lg border border-white/10 bg-slate-950 p-2 text-right text-white placeholder:text-slate-500"
                      placeholder="kg"
                      min={1}
                    />
                  </div>
                ))}
              </div>
            )}

            {weights.length > 0 && (
              <button
                onClick={handleSaveExercise}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-500/30"
              >
                Save exercise
              </button>
            )}
          </motion.div>
        )}

        {loggedExercises.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 shadow-lg shadow-emerald-500/25"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-emerald-50">Workout summary</h2>
              <span className="text-xs text-emerald-100">
                {loggedExercises.length} exercise(s)
              </span>
            </div>

            <ul className="space-y-2 mb-4 text-sm">
              {loggedExercises.map((ex) => (
                <li
                  key={ex.name}
                  className="rounded-xl bg-slate-900/60 border border-white/10 p-3"
                >
                  <div className="font-semibold text-white">{ex.name}</div>
                  <div className="text-slate-300">
                    Reps: {ex.reps.length} | Weights: {ex.reps.map((r) => r.weight).join(", ")} kg
                  </div>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSaveWorkout}
              className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
            >
              Save full workout
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
