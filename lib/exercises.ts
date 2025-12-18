// lib/exercises.ts

const baseExercises: Record<string, string[]> = {
  Chest: [
    "Barbell Bench Press",
    "Dumbbell Bench Press",
    "Incline Barbell Bench Press",
    "Incline Dumbbell Bench Press",
    "Decline Bench Press",
    "Push-ups",
    "Weighted Push-ups",
    "Machine Chest Press",
    "Smith Machine Bench Press",
    "Dumbbell Flyes",
    "Incline Dumbbell Flyes",
    "Cable Flyes",
    "Low to High Cable Flyes",
    "High to Low Cable Flyes",
    "Pec Deck Machine",
    "Chest Dips",
    "Single-Arm Cable Press",
    "Squeeze Press",
    "Floor Press",
    "Guillotine Press"
  ],

  Back: [
    "Conventional Deadlift",
    "Romanian Deadlift",
    "Rack Pulls",
    "Pull-ups",
    "Chin-ups",
    "Neutral-Grip Pull-ups",
    "Lat Pulldown",
    "Wide-Grip Lat Pulldown",
    "Close-Grip Lat Pulldown",
    "Seated Cable Row",
    "Chest-Supported Row",
    "Barbell Bent-Over Row",
    "Pendlay Row",
    "T-Bar Row",
    "One-Arm Dumbbell Row",
    "Meadows Row",
    "Inverted Row",
    "Straight-Arm Pulldown",
    "Dumbbell Pullover",
    "Machine Row",
    "Shrugs (Barbell)",
    "Shrugs (Dumbbell)",
    "Face Pulls"
  ],

  Legs: [
    "Back Squat",
    "Front Squat",
    "Goblet Squat",
    "Box Squat",
    "Hack Squat (Machine)",
    "Leg Press",
    "Bulgarian Split Squat",
    "Walking Lunges",
    "Reverse Lunges",
    "Lateral Lunges",
    "Step-ups",
    "Romanian Deadlift",
    "Stiff-Leg Deadlift",
    "Good Mornings",
    "Hip Thrusts",
    "Glute Bridges",
    "Leg Extensions",
    "Seated Leg Curl",
    "Lying Leg Curl",
    "Standing Leg Curl",
    "Standing Calf Raise",
    "Seated Calf Raise",
    "Donkey Calf Raise"
  ],

  Shoulders: [
    "Barbell Overhead Press",
    "Seated Barbell Shoulder Press",
    "Dumbbell Shoulder Press",
    "Arnold Press",
    "Machine Shoulder Press",
    "Push Press",
    "Lateral Raises",
    "Cable Lateral Raises",
    "Seated Lateral Raises",
    "Front Raises (Dumbbell)",
    "Front Raises (Plate)",
    "Cable Front Raises",
    "Rear Delt Flyes (Dumbbell)",
    "Rear Delt Flyes (Machine)",
    "Reverse Pec Deck",
    "Face Pulls",
    "Upright Row (Barbell)",
    "Cable Upright Row"
  ],

  Arms: [
    // Biceps
    "Barbell Curl",
    "EZ-Bar Curl",
    "Dumbbell Biceps Curl",
    "Alternating Dumbbell Curl",
    "Hammer Curl",
    "Incline Dumbbell Curl",
    "Preacher Curl",
    "Cable Curl",
    "Concentration Curl",
    "Spider Curl",
    // Triceps
    "Tricep Pushdown (Rope)",
    "Tricep Pushdown (Bar)",
    "Overhead Tricep Extension (Dumbbell)",
    "Overhead Tricep Extension (Cable)",
    "Skull Crushers (EZ-Bar)",
    "Close-Grip Bench Press",
    "Dips (Triceps Focus)",
    "Bench Dips",
    "Kickbacks (Dumbbell)",
    "Single-Arm Cable Pushdown"
  ],

  "Abs Core": [
    "Crunches",
    "Reverse Crunches",
    "Sit-ups",
    "Hanging Leg Raises",
    "Hanging Knee Raises",
    "Captain’s Chair Leg Raises",
    "Lying Leg Raises",
    "V-Ups",
    "Toe Touches",
    "Cable Crunch",
    "Ab Wheel Rollout",
    "Plank",
    "Side Plank",
    "Plank with Shoulder Tap",
    "Mountain Climbers",
    "Russian Twists",
    "Bicycle Crunches",
    "Dead Bug",
    "Pallof Press"
  ]
};

// build Full Body from all strength movements (no explicit cardio/conditioning)
const fullBody = Array.from(
  new Set(
    [
      ...baseExercises.Chest,
      ...baseExercises.Back,
      ...baseExercises.Legs,
      ...baseExercises.Shoulders,
      ...baseExercises.Arms,
      ...baseExercises["Abs Core"]
    ]
      // if you later add obvious cardio-only names, you can filter them here
      .filter((name) => !["Burpees", "Bear Crawl"].includes(name))
  )
).sort();

export const defaultExercises: Record<string, string[]> = {
  ...baseExercises,
  "Full Body": fullBody
};
