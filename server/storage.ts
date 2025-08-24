import { type User, type InsertUser, type Workout, type InsertWorkout, type Exercise, type InsertExercise, type Goal, type InsertGoal } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWorkouts(userId: string): Promise<Workout[]>;
  createWorkout(userId: string, workout: InsertWorkout): Promise<Workout>;
  updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout | undefined>;
  getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  
  getExercises(): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(goalId: string, current: number): Promise<Goal | undefined>;
}

// File storage paths
const STORAGE_DIR = './data';
const STORAGE_FILES = {
  USERS: 'users.json',
  WORKOUTS: 'workouts.json', 
  EXERCISES: 'exercises.json',
  GOALS: 'goals.json',
  SEEDED: 'seeded.json'
} as const;

export class FileStorage implements IStorage {
  constructor() {
    // Ensure storage directory exists
    if (!existsSync(STORAGE_DIR)) {
      mkdirSync(STORAGE_DIR, { recursive: true });
    }
    
    // Only seed once on first load
    if (!this.isSeeded()) {
      this.seedExercises();
      this.seedSampleData();
      this.setSeeded();
    }
  }

  private getFromStorage<T>(filename: string, defaultValue: T[] = []): T[] {
    const filepath = join(STORAGE_DIR, filename);
    try {
      if (existsSync(filepath)) {
        const data = readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
      }
      return defaultValue as T[];
    } catch (error) {
      console.error(`Failed to read from ${filename}:`, error);
      return defaultValue as T[];
    }
  }

  private isSeeded(): boolean {
    const filepath = join(STORAGE_DIR, STORAGE_FILES.SEEDED);
    try {
      if (existsSync(filepath)) {
        const data = readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
      }
      return false;
    } catch (error) {
      console.error(`Failed to read seeded flag:`, error);
      return false;
    }
  }

  private setSeeded(): void {
    const filepath = join(STORAGE_DIR, STORAGE_FILES.SEEDED);
    try {
      writeFileSync(filepath, JSON.stringify(true, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Failed to save seeded flag:`, error);
    }
  }

  private setInStorage<T>(filename: string, data: T[]): void {
    const filepath = join(STORAGE_DIR, filename);
    try {
      writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error(`Failed to save to ${filename}:`, error);
    }
  }

  private findById<T extends { id: string }>(items: T[], id: string): T | undefined {
    return items.find(item => item.id === id);
  }

  private filterByUserId<T extends { userId: string }>(items: T[], userId: string): T[] {
    return items.filter(item => item.userId === userId);
  }

  private seedExercises() {
    const exercises: Exercise[] = [
      { id: randomUUID(), name: "Running", category: "cardio", caloriesPerMinute: 8, emoji: "🏃‍♂️" },
      { id: randomUUID(), name: "Push-ups", category: "strength", caloriesPerMinute: 5, emoji: "💪" },
      { id: randomUUID(), name: "Yoga", category: "flexibility", caloriesPerMinute: 3, emoji: "🧘‍♀️" },
      { id: randomUUID(), name: "HIIT", category: "cardio", caloriesPerMinute: 12, emoji: "⚡" },
      { id: randomUUID(), name: "Cycling", category: "cardio", caloriesPerMinute: 6, emoji: "🚴‍♂️" },
      { id: randomUUID(), name: "Swimming", category: "cardio", caloriesPerMinute: 10, emoji: "🏊‍♂️" },
      { id: randomUUID(), name: "Weight Training", category: "strength", caloriesPerMinute: 7, emoji: "🏋️‍♂️" },
      { id: randomUUID(), name: "Pilates", category: "flexibility", caloriesPerMinute: 4, emoji: "🤸‍♀️" },
    ];
    
    this.setInStorage(STORAGE_FILES.EXERCISES, exercises);
  }

  private seedSampleData() {
    // Create demo user and sample workouts
    const demoUserId = "demo-user";
    
    const now = new Date();
    
    // Calculate current week to ensure all workouts fall within it
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Sample workouts for demo purposes - distributed across current week
    const sampleWorkouts: Workout[] = [
      {
        id: randomUUID(),
        userId: demoUserId,
        exerciseType: "Running",
        duration: 30,
        calories: 240,
        intensity: "medium",
        notes: "Morning jog in the park",
        date: new Date(startOfWeek.getTime() + 1 * 24 * 60 * 60 * 1000), // Tuesday
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        exerciseType: "Yoga",
        duration: 45,
        calories: 135,
        intensity: "low",
        notes: "Relaxing evening session",
        date: new Date(startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000), // Thursday
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        exerciseType: "HIIT",
        duration: 20,
        calories: 240,
        intensity: "high",
        notes: "Intense workout session",
        date: new Date(startOfWeek.getTime() + 5 * 24 * 60 * 60 * 1000), // Saturday
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        exerciseType: "Weight Training",
        duration: 40,
        calories: 280,
        intensity: "high",
        notes: "Strength training session",
        date: new Date(startOfWeek.getTime() + 0 * 24 * 60 * 60 * 1000), // Monday
      },
    ];

    // Sample goals
    const sampleGoals: Goal[] = [
      {
        id: randomUUID(),
        userId: demoUserId,
        type: "daily_calories",
        target: 500,
        current: 240,
        date: new Date(),
      },
      {
        id: randomUUID(),
        userId: demoUserId,
        type: "weekly_workouts",
        target: 5,
        current: 3,
        date: new Date(),
      },
    ];

    this.setInStorage(STORAGE_FILES.WORKOUTS, sampleWorkouts);
    this.setInStorage(STORAGE_FILES.GOALS, sampleGoals);
  }

  async getUser(id: string): Promise<User | undefined> {
    const users = this.getFromStorage<User>(STORAGE_FILES.USERS);
    return this.findById(users, id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = this.getFromStorage<User>(STORAGE_FILES.USERS);
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = this.getFromStorage<User>(STORAGE_FILES.USERS);
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    users.push(user);
    this.setInStorage(STORAGE_FILES.USERS, users);
    return user;
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    const workouts = this.getFromStorage<Workout>(STORAGE_FILES.WORKOUTS);
    return this.filterByUserId(workouts, userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createWorkout(userId: string, insertWorkout: InsertWorkout): Promise<Workout> {
    const workouts = this.getFromStorage<Workout>(STORAGE_FILES.WORKOUTS);
    const id = randomUUID();
    const workout: Workout = { 
      ...insertWorkout,
      notes: insertWorkout.notes || null,
      id, 
      userId, 
      date: insertWorkout.date ? new Date(insertWorkout.date) : new Date() 
    };
    workouts.push(workout);
    this.setInStorage(STORAGE_FILES.WORKOUTS, workouts);
    return workout;
  }

  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const workouts = this.getFromStorage<Workout>(STORAGE_FILES.WORKOUTS);
    const workoutIndex = workouts.findIndex(w => w.id === workoutId);
    if (workoutIndex >= 0) {
      const updatedWorkout = { ...workouts[workoutIndex], ...updates };
      workouts[workoutIndex] = updatedWorkout;
      this.setInStorage(STORAGE_FILES.WORKOUTS, workouts);
      return updatedWorkout;
    }
    return undefined;
  }

  async getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    const workouts = this.getFromStorage<Workout>(STORAGE_FILES.WORKOUTS);
    
    // Fix the endDate to be end of day if it's not already
    const fixedEndDate = new Date(endDate);
    if (fixedEndDate.getHours() !== 23) {
      fixedEndDate.setHours(23, 59, 59, 999);
    }
    
    console.log('Date range filter:', startDate.toISOString(), 'to', fixedEndDate.toISOString());
    
    return workouts.filter(workout => {
      if (workout.userId !== userId) return false;
      
      const workoutDate = new Date(workout.date);
      const inRange = workoutDate >= startDate && workoutDate <= fixedEndDate;
      
      console.log(`Workout ${workout.exerciseType} on ${workoutDate.toISOString()}: ${inRange ? 'INCLUDED' : 'EXCLUDED'}`);
      return inRange;
    });
  }

  async getExercises(): Promise<Exercise[]> {
    return this.getFromStorage<Exercise>(STORAGE_FILES.EXERCISES);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const exercises = this.getFromStorage<Exercise>(STORAGE_FILES.EXERCISES);
    const id = randomUUID();
    const exercise: Exercise = { ...insertExercise, id };
    exercises.push(exercise);
    this.setInStorage(STORAGE_FILES.EXERCISES, exercises);
    return exercise;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const goals = this.getFromStorage<Goal>(STORAGE_FILES.GOALS);
    return this.filterByUserId(goals, userId);
  }

  async createGoal(userId: string, insertGoal: InsertGoal): Promise<Goal> {
    const goals = this.getFromStorage<Goal>(STORAGE_FILES.GOALS);
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      userId, 
      current: 0,
      date: new Date() 
    };
    goals.push(goal);
    this.setInStorage(STORAGE_FILES.GOALS, goals);
    return goal;
  }

  async updateGoal(goalId: string, current: number): Promise<Goal | undefined> {
    const goals = this.getFromStorage<Goal>(STORAGE_FILES.GOALS);
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex >= 0) {
      goals[goalIndex].current = current;
      this.setInStorage(STORAGE_FILES.GOALS, goals);
      return goals[goalIndex];
    }
    return undefined;
  }
}

// Temporarily keeping FileStorage import but switching to DatabaseStorage
import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
