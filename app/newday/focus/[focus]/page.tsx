// app/newday/focus/[focus]/page.tsx  (optional legacy route)

import ExerciseList from "./ExerciseList";
import { defaultExercises } from "../../../../lib/exercises";

type FocusPageParams = Promise<{ focus: string }>;

type FocusPageProps = {
  params: FocusPageParams;
};

export default async function FocusPage({ params }: FocusPageProps) {
  // await the params Promise
  const { focus } = await params;

  const raw = decodeURIComponent(focus);

  const workoutName = raw
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const exercises = defaultExercises[workoutName] || [];

  return <ExerciseList workoutName={workoutName} exercises={exercises} />;
}

