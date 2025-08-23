import { type User, type InsertUser, type Workout, type InsertWorkout, type Exercise, type InsertExercise, type Goal, type InsertGoal } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private workouts: Map<string, Workout>;
  private exercises: Map<string, Exercise>;
  private goals: Map<string, Goal>;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.exercises = new Map();
    this.goals = new Map();
    
    // Seed with popular exercises
    this.seedExercises();
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
    
    exercises.forEach(exercise => this.exercises.set(exercise.id, exercise));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      workout => workout.userId === userId
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createWorkout(userId: string, insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = { 
      ...insertWorkout,
      notes: insertWorkout.notes || null,
      id, 
      userId, 
      date: insertWorkout.date ? new Date(insertWorkout.date) : new Date() 
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(workoutId: string, updates: Partial<Workout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(workoutId);
    if (workout) {
      const updatedWorkout = { ...workout, ...updates };
      this.workouts.set(workoutId, updatedWorkout);
      return updatedWorkout;
    }
    return undefined;
  }

  async getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    // Fix the endDate to be end of day if it's not already
    const fixedEndDate = new Date(endDate);
    if (fixedEndDate.getHours() !== 23) {
      fixedEndDate.setHours(23, 59, 59, 999);
    }
    
    console.log('Date range filter:', startDate.toISOString(), 'to', fixedEndDate.toISOString());
    
    return Array.from(this.workouts.values()).filter(workout => {
      if (workout.userId !== userId) return false;
      
      const workoutDate = new Date(workout.date);
      const inRange = workoutDate >= startDate && workoutDate <= fixedEndDate;
      
      console.log(`Workout ${workout.exerciseType} on ${workoutDate.toISOString()}: ${inRange ? 'INCLUDED' : 'EXCLUDED'}`);
      return inRange;
    });
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      goal => goal.userId === userId
    );
  }

  async createGoal(userId: string, insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal, 
      id, 
      userId, 
      current: 0,
      date: new Date() 
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(goalId: string, current: number): Promise<Goal | undefined> {
    const goal = this.goals.get(goalId);
    if (goal) {
      goal.current = current;
      this.goals.set(goalId, goal);
    }
    return goal;
  }
}

export const storage = new MemStorage();
