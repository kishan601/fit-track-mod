import { type User, type InsertUser, type Workout, type InsertWorkout, type Exercise, type InsertExercise, type Goal, type InsertGoal } from "@shared/schema";
import { users, workouts, exercises, goals } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  constructor() {
    // Seeding disabled - exercises already exist via db:push
    // this.seedExercises();
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        ...userData,
      })
      .returning();
    return user;
  }

  // Workout management
  async getWorkouts(userId: string): Promise<Workout[]> {
    return await db.select().from(workouts).where(eq(workouts.userId, userId));
  }

  async createWorkout(userId: string, workoutData: InsertWorkout): Promise<Workout> {
    const [workout] = await db
      .insert(workouts)
      .values({
        id: randomUUID(),
        userId,
        ...workoutData,
      })
      .returning();
    return workout;
  }

  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const [workout] = await db
      .update(workouts)
      .set(updates)
      .where(eq(workouts.id, workoutId))
      .returning();
    return workout;
  }

  async getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.date, startDate),
          lte(workouts.date, endDate)
        )
      );
  }

  // Exercise management (global)
  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async createExercise(exerciseData: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values({
        id: randomUUID(),
        ...exerciseData,
      })
      .returning();
    return exercise;
  }

  // Goal management
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async createGoal(userId: string, goalData: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values({
        id: randomUUID(),
        userId,
        current: 0,
        date: new Date(),
        ...goalData,
      })
      .returning();
    return goal;
  }

  async updateGoal(goalId: string, current: number): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set({ current })
      .where(eq(goals.id, goalId))
      .returning();
    return goal;
  }

  // Seed exercises if the table is empty
  private async seedExercises(): Promise<void> {
    try {
      const existingExercises = await db.select().from(exercises);
      if (existingExercises.length > 0) {
        return; // Already seeded
      }

      const defaultExercises: InsertExercise[] = [
        { name: "Running", category: "Cardio", caloriesPerMinute: 8, emoji: "🏃‍♂️" },
        { name: "Cycling", category: "Cardio", caloriesPerMinute: 6, emoji: "🚴‍♂️" },
        { name: "Swimming", category: "Cardio", caloriesPerMinute: 10, emoji: "🏊‍♂️" },
        { name: "Weight Training", category: "Strength", caloriesPerMinute: 7, emoji: "🏋️‍♂️" },
        { name: "Yoga", category: "Flexibility", caloriesPerMinute: 3, emoji: "🧘‍♀️" },
        { name: "HIIT", category: "Cardio", caloriesPerMinute: 12, emoji: "💪" },
        { name: "Walking", category: "Cardio", caloriesPerMinute: 4, emoji: "🚶‍♂️" },
        { name: "Push-ups", category: "Strength", caloriesPerMinute: 8, emoji: "💪" },
        { name: "Squats", category: "Strength", caloriesPerMinute: 6, emoji: "🦵" },
        { name: "Pull-ups", category: "Strength", caloriesPerMinute: 10, emoji: "💪" }
      ];

      for (const exercise of defaultExercises) {
        await this.createExercise(exercise);
      }

      console.log('✅ Default exercises seeded to database');
    } catch (error) {
      console.error('❌ Failed to seed exercises:', error);
    }
  }
}