"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

type RepEntry = {
  weight: string;
  count: string;
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

  // reps entered per exercise
  const [repCounts, setRepCounts] = useState<Record<string, string>>({});
  // weight + count per rep
  const [repsData, setRepsData] = useState<Record<string, RepEntry[]>>({});

  function setRepsForExercise(ex: string) {
    const count = Number(repCounts[ex]);
    if (!count || count <= 0) {
      alert("Enter a valid number of reps");
      return;
    }

    setRepsData((prev) => ({
      ...prev,
      [ex]: Array.from({ length: count }, () => ({
        weight: "",
        count: "",
      })),
    }));
  }

  function updateRep(
    ex: string,
    index: number,
    field: "weight" | "count",
    value: string
  ) {
    setRepsData((prev) => {
      const arr = [...(prev[ex] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [ex]: arr };
    });
  }

  async function handleSubmit() {
    const payloadExercises = exercises
      .map((ex) => {
        const reps = (repsData[ex] || [])
          .filter((r) => r.weight && r.count)
          .map((r) => ({
            weight: Number(r.weight),
            count: Number(r.count),
          }));

        return reps.length > 0 ? { name: ex, reps } : null;
      })
      .filter(Boolean);

    if (payloadExercises.length === 0) {
      alert("Please log at least one exercise with weight and count.");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workout),
      });

      const result = await res.json();

      if (result.success) {
        alert("Workout saved successfully 🏋️‍♂️");
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
        <div className="mt-6 mb-4 text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/80">
            {parts.join(" · ")}
          </p>
          <h1 className="text-3xl font-bold">Log reps & weights</h1>
        </div>

        <div className="space-y-6 mb-6">
          {exercises.map((ex) => (
            <div
              key={ex}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <h2 className="text-lg font-semibold mb-3">{ex}</h2>

              {/* STEP 1: enter number of reps */}
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  min={1}
                  placeholder="Number of reps"
                  value={repCounts[ex] || ""}
                  onChange={(e) =>
                    setRepCounts((prev) => ({
                      ...prev,
                      [ex]: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-lg bg-slate-900 p-2 text-sm text-white"
                />
                <button
                  onClick={() => setRepsForExercise(ex)}
                  className="rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-slate-950"
                >
                  Set
                </button>
              </div>

              {/* STEP 2: weight + count per rep */}
              {repsData[ex] && (
                <div className="space-y-2">
                  {repsData[ex].map((rep, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl bg-slate-900/60 p-2"
                    >
                      <span className="text-sm w-14">Rep {idx + 1}</span>

                      <input
                        type="number"
                        min={1}
                        placeholder="kg"
                        value={rep.weight}
                        onChange={(e) =>
                          updateRep(ex, idx, "weight", e.target.value)
                        }
                        className="w-24 rounded-lg bg-slate-950 p-2 text-sm text-right text-white"
                      />

                      <input
                        type="number"
                        min={1}
                        placeholder="count"
                        value={rep.count}
                        onChange={(e) =>
                          updateRep(ex, idx, "count", e.target.value)
                        }
                        className="w-20 rounded-lg bg-slate-950 p-2 text-sm text-right text-white"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
        >
          Save full workout
        </button>
      </section>
    </main>
  );
}
