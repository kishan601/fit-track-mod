import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSchema, insertExerciseSchema, insertGoalSchema } from "@shared/schema";
import { ensureUserSession, convertGuestToUser, verifyPassword, type AuthenticatedRequest } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/register", ensureUserSession, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const authReq = req as AuthenticatedRequest;
      const result = await convertGuestToUser(authReq.userId, username, password);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }
      
      // Update session to registered user
      req.session.userId = result.user.id;
      req.session.isGuest = false;
      
      res.json({ 
        message: "Registration successful", 
        user: { id: result.user.id, username: result.user.username }
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", ensureUserSession, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Update session to registered user
      req.session.userId = user.id;
      req.session.isGuest = false;
      
      res.json({ 
        message: "Login successful", 
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/user", ensureUserSession, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      
      if (authReq.isGuest) {
        return res.json({ 
          isGuest: true, 
          userId: authReq.userId,
          user: null
        });
      }
      
      const user = await storage.getUser(authReq.userId);
      res.json({ 
        isGuest: false, 
        userId: authReq.userId,
        user: user ? { id: user.id, username: user.username } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user info" });
    }
  });
  
  // Workouts endpoints
  app.get("/api/workouts", ensureUserSession, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const workouts = await storage.getWorkouts(authReq.userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.post("/api/workouts", ensureUserSession, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const validatedData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(authReq.userId, validatedData);
      res.json(workout);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid workout data" });
    }
  });

  app.patch("/api/workouts/:id", ensureUserSession, async (req, res) => {
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

  app.get("/api/workouts/weekly", ensureUserSession, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.userId;
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
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const validatedData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(validatedData);
      res.json(exercise);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise data" });
    }
  });

  // Goals endpoints
  app.get("/api/goals", ensureUserSession, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.userId;
      const goals = await storage.getGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", ensureUserSession, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.userId;
      const validatedData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(userId, validatedData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  app.patch("/api/goals/:id", ensureUserSession, async (req, res) => {
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
