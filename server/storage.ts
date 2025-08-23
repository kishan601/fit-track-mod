import { 
  users, 
  workouts, 
  exercises, 
  goals,
  type User, 
  type InsertUser, 
  type Workout, 
  type InsertWorkout, 
  type Exercise, 
  type InsertExercise, 
  type Goal, 
  type InsertGoal 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWorkouts(userId: string): Promise<Workout[]>;
  createWorkout(userId: string, workout: InsertWorkout): Promise<Workout>;
  updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout | undefined>;
  getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  
  getExercises(userId: string): Promise<Exercise[]>;
  createExercise(userId: string, exercise: InsertExercise): Promise<Exercise>;
  seedUserExercises(userId: string): Promise<void>;
  
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(userId: string, goal: InsertGoal): Promise<Goal>;
  updateGoal(goalId: string, current: number): Promise<Goal | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Seed initial exercises for new user
    await this.seedUserExercises(user.id);
    
    return user;
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(workouts.date);
  }

  async createWorkout(userId: string, insertWorkout: InsertWorkout): Promise<Workout> {
    const [workout] = await db
      .insert(workouts)
      .values({
        ...insertWorkout,
        userId,
        date: insertWorkout.date ? new Date(insertWorkout.date) : new Date()
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
    const fixedEndDate = new Date(endDate);
    if (fixedEndDate.getHours() !== 23) {
      fixedEndDate.setHours(23, 59, 59, 999);
    }
    
    return await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.date, startDate),
          lte(workouts.date, fixedEndDate)
        )
      );
  }

  async getExercises(userId: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.userId, userId));
  }

  async createExercise(userId: string, insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values({
        ...insertExercise,
        userId
      })
      .returning();
    return exercise;
  }

  async seedUserExercises(userId: string): Promise<void> {
    const defaultExercises = [
      { name: "Running", category: "cardio", caloriesPerMinute: 8, emoji: "🏃‍♂️" },
      { name: "Push-ups", category: "strength", caloriesPerMinute: 5, emoji: "💪" },
      { name: "Yoga", category: "flexibility", caloriesPerMinute: 3, emoji: "🧘‍♀️" },
      { name: "HIIT", category: "cardio", caloriesPerMinute: 12, emoji: "⚡" },
      { name: "Cycling", category: "cardio", caloriesPerMinute: 6, emoji: "🚴‍♂️" },
      { name: "Swimming", category: "cardio", caloriesPerMinute: 10, emoji: "🏊‍♂️" },
      { name: "Weight Training", category: "strength", caloriesPerMinute: 7, emoji: "🏋️‍♂️" },
      { name: "Pilates", category: "flexibility", caloriesPerMinute: 4, emoji: "🤸‍♀️" },
    ];
    
    await db.insert(exercises).values(
      defaultExercises.map(exercise => ({
        ...exercise,
        userId
      }))
    );
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId));
  }

  async createGoal(userId: string, insertGoal: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values({
        ...insertGoal,
        userId,
        current: 0,
        date: new Date()
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
}

export const storage = new DatabaseStorage();