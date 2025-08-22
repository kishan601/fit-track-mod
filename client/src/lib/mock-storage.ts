// This file provides localStorage-based persistence for the FitTrack app
// It simulates the backend functionality on the frontend

import type { Workout, Exercise, Goal } from "@shared/schema";

const STORAGE_KEYS = {
  WORKOUTS: "fittrack_workouts",
  EXERCISES: "fittrack_exercises", 
  GOALS: "fittrack_goals",
} as const;

export class MockStorage {
  private static instance: MockStorage;

  static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
    }
    return MockStorage.instance;
  }

  private constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize exercises if not already present
    if (!localStorage.getItem(STORAGE_KEYS.EXERCISES)) {
      const defaultExercises: Exercise[] = [
        { id: "1", name: "Running", category: "cardio", caloriesPerMinute: 8, emoji: "🏃‍♂️" },
        { id: "2", name: "Push-ups", category: "strength", caloriesPerMinute: 5, emoji: "💪" },
        { id: "3", name: "Yoga", category: "flexibility", caloriesPerMinute: 3, emoji: "🧘‍♀️" },
        { id: "4", name: "HIIT", category: "cardio", caloriesPerMinute: 12, emoji: "⚡" },
        { id: "5", name: "Cycling", category: "cardio", caloriesPerMinute: 6, emoji: "🚴‍♂️" },
        { id: "6", name: "Swimming", category: "cardio", caloriesPerMinute: 10, emoji: "🏊‍♂️" },
        { id: "7", name: "Weight Training", category: "strength", caloriesPerMinute: 7, emoji: "🏋️‍♂️" },
        { id: "8", name: "Pilates", category: "flexibility", caloriesPerMinute: 4, emoji: "🤸‍♀️" },
      ];
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(defaultExercises));
    }

    // Initialize empty arrays for workouts and goals if not present
    if (!localStorage.getItem(STORAGE_KEYS.WORKOUTS)) {
      localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]));
    }
  }

  getWorkouts(): Workout[] {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  }

  addWorkout(workout: Omit<Workout, "id" | "userId" | "date">): Workout {
    const workouts = this.getWorkouts();
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      userId: "demo-user",
      date: new Date(),
    };
    workouts.unshift(newWorkout); // Add to beginning for chronological order
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    return newWorkout;
  }

  getWeeklyWorkouts(): Workout[] {
    const workouts = this.getWorkouts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return workouts.filter(workout => new Date(workout.date) >= oneWeekAgo);
  }

  getExercises(): Exercise[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    return data ? JSON.parse(data) : [];
  }

  addExercise(exercise: Omit<Exercise, "id">): Exercise {
    const exercises = this.getExercises();
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    exercises.push(newExercise);
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    return newExercise;
  }

  getGoals(): Goal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  }

  addGoal(goal: Omit<Goal, "id" | "userId" | "current" | "date">): Goal {
    const goals = this.getGoals();
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      userId: "demo-user",
      current: 0,
      date: new Date(),
    };
    goals.push(newGoal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    return newGoal;
  }

  updateGoal(goalId: string, current: number): Goal | undefined {
    const goals = this.getGoals();
    const goalIndex = goals.findIndex(goal => goal.id === goalId);
    
    if (goalIndex !== -1) {
      goals[goalIndex].current = current;
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return goals[goalIndex];
    }
    
    return undefined;
  }
}

export const mockStorage = MockStorage.getInstance();
