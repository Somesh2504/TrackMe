// app/newday/focus/log/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

type SetEntry = {
  weight: string;
  reps: string;
};

export default function LogWorkoutPage() {
  const searchParams = useSearchParams();
  const parts = (searchParams.get("parts") ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const exercises = (searchParams.get("exs") ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const [data, setData] = useState<Record<string, SetEntry[]>>(() => {
    const initial: Record<string, SetEntry[]> = {};
    exercises.forEach((ex) => {
      initial[ex] = [];
    });
    return initial;
  });

  function addSet(exName: string) {
    setData((prev) => ({
      ...prev,
      [exName]: [...(prev[exName] || []), { weight: "", reps: "" }],
    }));
  }

  function updateSet(exName: string, index: number, field: "weight" | "reps", value: string) {
    setData((prev) => {
      const sets = [...(prev[exName] || [])];
      sets[index] = { ...sets[index], [field]: value };
      return { ...prev, [exName]: sets };
    });
  }

  async function handleSubmit() {
    // basic validation
    const payloadExercises = Object.entries(data)
      .map(([name, sets]) => ({
        name,
        reps: sets
          .filter((s) => s.weight && s.reps)
          .map((s) => ({
            weight: Number(s.weight),
            count: Number(s.reps),
          })),
      }))
      .filter((e) => e.reps.length > 0);

    if (payloadExercises.length === 0) {
      alert("Please add at least one set with weight and reps.");
      return;
    }

    const workout = {
      focus: parts.join(" · "),
      date: new Date().toISOString(),
      exercises: payloadExercises,
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
      } else {
        alert("Error saving workout: " + result.error);
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    }
  }

  if (exercises.length === 0) {
    return (
      <main className="min-h-screen text-white pb-16">
        <Navbar />
        <section className="mx-auto max-w-xl px-5 mt-10 text-center">
          <p className="text-slate-300">
            No exercises selected. Go back and choose exercises first.
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
            {parts.join(" · ")}
          </p>
          <h1 className="text-3xl font-bold">Log weights & reps</h1>
          <p className="text-slate-300 text-sm">
            For each exercise, add sets with weight (kg) and reps, then save once.
          </p>
        </div>

        <div className="space-y-6 mb-6">
          {exercises.map((ex) => (
            <div
              key={ex}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{ex}</h2>
                <button
                  type="button"
                  onClick={() => addSet(ex)}
                  className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/30"
                >
                  + Add set
                </button>
              </div>

              {data[ex]?.length === 0 && (
                <p className="text-xs text-slate-300">
                  No sets yet. Tap &ldquo;+ Add set&rdquo; to begin.
                </p>
              )}

              <div className="space-y-2">
                {data[ex]?.map((set, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2"
                  >
                    <span className="text-xs text-slate-300 w-10">
                      Set {index + 1}
                    </span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(ex, index, "weight", e.target.value)
                      }
                      placeholder="Weight (kg)"
                      min={1}
                      className="flex-1 rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white placeholder:text-slate-500"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(ex, index, "reps", e.target.value)
                      }
                      placeholder="Reps"
                      min={1}
                      className="w-20 rounded-lg border border-white/10 bg-slate-950 p-2 text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
        >
          Save full workout
        </button>
      </section>
    </main>
  );
}
