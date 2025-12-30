import { type User, type InsertUser, type Workout, type InsertWorkout, type Exercise, type InsertExercise, type Goal, type InsertGoal, users, workouts, exercises, goals } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import pg from "pg";

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

// Initialize database client
const dbUrl = process.env.EXTERNAL_DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("EXTERNAL_DATABASE_URL, NEON_DATABASE_URL or DATABASE_URL must be set");
}

const client = new pg.Client({ connectionString: dbUrl });
client.connect();

const db = drizzle(client);

export class DatabaseStorage implements IStorage {
  private seeded = false;

  constructor() {
    this.initializeSeeds();
  }

  private async initializeSeeds(): Promise<void> {
    if (this.seeded) return;
    
    try {
      const existingExercises = await db.select().from(exercises).limit(1);
      if (existingExercises.length > 0) {
        this.seeded = true;
        return;
      }
      
      await this.seedExercises();
      await this.seedSampleData();
      this.seeded = true;
    } catch (error) {
      console.error("Failed to initialize seeds:", error);
      this.seeded = true;
    }
  }

  private async seedExercises(): Promise<void> {
    const exercisesToSeed: (InsertExercise & { userId: string })[] = [
      { name: "Running", category: "cardio", caloriesPerMinute: 8, emoji: "🏃‍♂️", userId: "demo-user" },
      { name: "Push-ups", category: "strength", caloriesPerMinute: 5, emoji: "💪", userId: "demo-user" },
      { name: "Yoga", category: "flexibility", caloriesPerMinute: 3, emoji: "🧘‍♀️", userId: "demo-user" },
      { name: "HIIT", category: "cardio", caloriesPerMinute: 12, emoji: "⚡", userId: "demo-user" },
      { name: "Cycling", category: "cardio", caloriesPerMinute: 6, emoji: "🚴‍♂️", userId: "demo-user" },
      { name: "Swimming", category: "cardio", caloriesPerMinute: 10, emoji: "🏊‍♂️", userId: "demo-user" },
      { name: "Weight Training", category: "strength", caloriesPerMinute: 7, emoji: "🏋️‍♂️", userId: "demo-user" },
      { name: "Pilates", category: "flexibility", caloriesPerMinute: 4, emoji: "🤸‍♀️", userId: "demo-user" },
    ];

    for (const exercise of exercisesToSeed) {
      try {
        await db.insert(exercises).values(exercise);
      } catch (error) {
        // Exercise might already exist
      }
    }
  }

  private async seedSampleData(): Promise<void> {
    const demoUserId = "demo-user";
    const now = new Date();
    
    const currentDay = now.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const sampleWorkouts: (InsertWorkout & { userId: string })[] = [
      {
        exerciseType: "Running",
        duration: 30,
        calories: 240,
        intensity: "medium",
        notes: "Morning jog in the park",
        date: new Date(startOfWeek.getTime() + 1 * 24 * 60 * 60 * 1000),
        userId: demoUserId,
      },
      {
        exerciseType: "Yoga",
        duration: 45,
        calories: 135,
        intensity: "low",
        notes: "Relaxing evening session",
        date: new Date(startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
        userId: demoUserId,
      },
      {
        exerciseType: "HIIT",
        duration: 20,
        calories: 240,
        intensity: "high",
        notes: "Intense workout session",
        date: new Date(startOfWeek.getTime() + 5 * 24 * 60 * 60 * 1000),
        userId: demoUserId,
      },
      {
        exerciseType: "Weight Training",
        duration: 40,
        calories: 280,
        intensity: "high",
        notes: "Strength training session",
        date: new Date(startOfWeek.getTime() + 0 * 24 * 60 * 60 * 1000),
        userId: demoUserId,
      },
    ];

    for (const workout of sampleWorkouts) {
      try {
        await db.insert(workouts).values(workout);
      } catch (error) {
        // Workout might already exist
      }
    }

    const sampleGoals: (InsertGoal & { userId: string })[] = [
      { type: "calories", target: 500, userId: demoUserId },
      { type: "workouts", target: 5, userId: demoUserId },
    ];

    for (const goal of sampleGoals) {
      try {
        await db.insert(goals).values(goal);
      } catch (error) {
        // Goal might already exist
      }
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    const result = await db.select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date));
    return result;
  }

  async createWorkout(userId: string, insertWorkout: InsertWorkout): Promise<Workout> {
    const result = await db.insert(workouts).values({
      ...insertWorkout,
      userId,
      date: insertWorkout.date || new Date(),
    }).returning();
    return result[0];
  }

  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const result = await db.update(workouts)
      .set(updates)
      .where(eq(workouts.id, workoutId))
      .returning();
    return result[0];
  }

  async getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    const result = await db.select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.date, startDate),
          lte(workouts.date, endDate)
        )
      );
    return result;
  }

  async getExercises(): Promise<Exercise[]> {
    const result = await db.select().from(exercises).where(eq(exercises.userId, "demo-user"));
    return result;
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const result = await db.insert(exercises).values({
      ...insertExercise,
      userId: "demo-user",
    }).returning();
    return result[0];
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const result = await db.select().from(goals).where(eq(goals.userId, userId));
    return result;
  }

  async createGoal(userId: string, insertGoal: InsertGoal): Promise<Goal> {
    const result = await db.insert(goals).values({
      ...insertGoal,
      userId,
      current: 0,
      date: new Date(),
    }).returning();
    return result[0];
  }

  async updateGoal(goalId: string, current: number): Promise<Goal | undefined> {
    const result = await db.update(goals)
      .set({ current })
      .where(eq(goals.id, goalId))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
