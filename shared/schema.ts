import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  exerciseType: text("exercise_type").notNull(),
  duration: integer("duration").notNull(), // in minutes
  calories: integer("calories").notNull(),
  intensity: text("intensity").notNull(), // low, medium, high
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  caloriesPerMinute: integer("calories_per_minute").notNull(),
  emoji: text("emoji").notNull(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // calories, workouts, activeTime
  target: integer("target").notNull(),
  current: integer("current").notNull().default(0),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  userId: true,
  date: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  userId: true,
  current: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
