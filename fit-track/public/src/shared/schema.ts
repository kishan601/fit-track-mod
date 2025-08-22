import { z } from "zod";

// Since this is a frontend-only version, we'll create mock types without drizzle
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Workout {
  id: string;
  userId: string;
  exerciseType: string;
  duration: number; // in minutes
  caloriesBurned: number;
  intensity: string; // Low, Moderate, High, Very High
  notes?: string;
  workoutDate: Date; // When the workout actually occurred
  createdAt: Date;
}

export interface Exercise {
  id: string;
  name: string;
  caloriesPerMinute: number;
  category: string;
}

export interface Goal {
  id: string;
  userId: string;
  type: string; // daily_calories, weekly_workouts, active_hours
  target: number;
  current: number;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertWorkoutSchema = z.object({
  exerciseType: z.string().min(1, "Exercise type is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  caloriesBurned: z.number().min(0, "Calories burned must be non-negative"),
  intensity: z.enum(["Low", "Moderate", "High", "Very High"]),
  notes: z.string().optional(),
  workoutDate: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === 'string') {
      return new Date(val);
    }
    return val;
  }),
});

export const insertExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  caloriesPerMinute: z.number().min(0, "Calories per minute must be non-negative"),
  category: z.string().min(1, "Category is required"),
});

export const insertGoalSchema = z.object({
  type: z.string().min(1, "Goal type is required"),
  target: z.number().min(1, "Target must be at least 1"),
});

// Type inference
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertGoal = z.infer<typeof insertGoalSchema>;