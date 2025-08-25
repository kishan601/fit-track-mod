import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    isGuest?: boolean;
  }
}

export interface AuthenticatedRequest extends Request {
  userId: string;
  isGuest: boolean;
  user?: any;
}

// Generate a guest user ID for new sessions
export function generateGuestId(): string {
  return `guest_${randomUUID()}`;
}

// Middleware to ensure user has an ID (guest or registered)
export async function ensureUserSession(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    let userId = req.session.userId;
    let isGuest = req.session.isGuest ?? true;

    // If no session exists, create a guest session
    if (!userId) {
      userId = generateGuestId();
      req.session.userId = userId;
      req.session.isGuest = true;
      isGuest = true;
      
      // Create guest user in Railway PostgreSQL database
      try {
        await storage.createUser({
          id: userId,
          username: `guest_${userId.split('_')[1]?.substring(0, 8)}`, // Make username unique but short
          password: 'guest_password' // Guest users don't need real passwords
        });
        console.log(`Created guest user in database: ${userId}`);
      } catch (error) {
        // Guest user might already exist, that's fine
        console.log('Guest user already exists:', userId);
      }
    }

    // For registered users, verify they still exist in the database
    if (!isGuest) {
      const user = await storage.getUser(userId);
      if (!user) {
        // User was deleted, create new guest session
        userId = generateGuestId();
        req.session.userId = userId;
        req.session.isGuest = true;
        isGuest = true;
        
        // Create new guest user in Railway PostgreSQL database  
        try {
          await storage.createUser({
            id: userId,
            username: `guest_${userId.split('_')[1]?.substring(0, 8)}`,
            password: 'guest_password' // Guest users don't need real passwords
          });
          console.log(`Created replacement guest user in database: ${userId}`);
        } catch (error) {
          console.log('Guest user creation failed:', userId);
        }
      }
    }

    // Attach user info to request
    (req as AuthenticatedRequest).userId = userId;
    (req as AuthenticatedRequest).isGuest = isGuest;
    
    if (!isGuest) {
      const user = await storage.getUser(userId);
      (req as AuthenticatedRequest).user = user;
    }

    next();
  } catch (error) {
    console.error('Session middleware error:', error);
    res.status(500).json({ message: "Session error" });
  }
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Convert guest user to registered user
export async function convertGuestToUser(
  guestId: string,
  username: string,
  password: string
): Promise<{ user: any; success: boolean; error?: string }> {
  try {
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return { user: null, success: false, error: "Username already exists" };
    }

    // Create new registered user
    const hashedPassword = await hashPassword(password);
    const newUser = await storage.createUser({
      username,
      password: hashedPassword,
    });

    // Transfer guest data to new user
    const guestWorkouts = await storage.getWorkouts(guestId);
    const guestGoals = await storage.getGoals(guestId);

    // Transfer workouts
    for (const workout of guestWorkouts) {
      await storage.createWorkout(newUser.id, {
        exerciseType: workout.exerciseType,
        duration: workout.duration,
        calories: workout.calories,
        intensity: workout.intensity,
        notes: workout.notes,
        date: workout.date,
      });
    }

    // Transfer goals
    for (const goal of guestGoals) {
      const newGoal = await storage.createGoal(newUser.id, {
        type: goal.type,
        target: goal.target,
      });
      // Update the current progress
      await storage.updateGoal(newGoal.id, goal.current);
    }

    return { user: newUser, success: true };
  } catch (error) {
    console.error('Error converting guest to user:', error);
    return { user: null, success: false, error: "Registration failed" };
  }
}