import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSchema, insertExerciseSchema, insertGoalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Workouts endpoints
  app.get("/api/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      const workouts = await storage.getWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      console.log('Received workout data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(userId, validatedData);
      res.json(workout);
    } catch (error: any) {
      console.error('Workout validation/creation error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid workout data", 
          errors: error.errors 
        });
      }
      res.status(400).json({ message: "Invalid workout data" });
    }
  });

  app.patch("/api/workouts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { id } = req.params;
      const updates = req.body;
      const workout = await storage.updateWorkout(id, updates);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
    } catch (error) {
      res.status(400).json({ message: "Failed to update workout" });
    }
  });

  app.get("/api/workouts/weekly", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      const now = new Date();
      
      // Get start of current week (Monday) - more robust timezone handling
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Sunday should be 6 days from Monday
      
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - daysFromMonday);
      startDate.setHours(0, 0, 0, 0);
      
      // Get end of current week (Sunday)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      
      console.log(`Weekly range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      
      const workouts = await storage.getWorkoutsByDateRange(userId, startDate, endDate);
      console.log(`Found workouts: ${workouts.length}`);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly workouts" });
    }
  });

  // Exercises endpoints
  app.get("/api/exercises", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      const exercises = await storage.getExercises(userId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      const validatedData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(userId, validatedData);
      res.json(exercise);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise data" });
    }
  });

  // Goals endpoints
  app.get("/api/goals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      const goals = await storage.getGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const userId = req.user!.id;
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(userId, validatedData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { current } = req.body;
      const goal = await storage.updateGoal(id, current);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Failed to update goal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
