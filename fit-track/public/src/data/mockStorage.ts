import { Workout, Exercise, Goal, InsertWorkout, InsertExercise, InsertGoal } from "../shared/schema";

// Mock storage class for frontend-only version
export class MockStorage {
  private workouts: Workout[] = [];
  private exercises: Exercise[] = [];
  private goals: Goal[] = [];

  constructor() {
    // Load data from localStorage
    this.loadFromLocalStorage();
    
    // Seed with popular exercises if none exist
    if (this.exercises.length === 0) {
      this.seedExercises();
    }
  }

  private loadFromLocalStorage() {
    try {
      const workoutsData = localStorage.getItem('fittrack_workouts');
      const exercisesData = localStorage.getItem('fittrack_exercises');
      const goalsData = localStorage.getItem('fittrack_goals');

      if (workoutsData) {
        this.workouts = JSON.parse(workoutsData).map((w: any) => ({
          ...w,
          workoutDate: new Date(w.workoutDate),
          createdAt: new Date(w.createdAt),
        }));
      }

      if (exercisesData) {
        this.exercises = JSON.parse(exercisesData);
      }

      if (goalsData) {
        this.goals = JSON.parse(goalsData);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem('fittrack_workouts', JSON.stringify(this.workouts));
      localStorage.setItem('fittrack_exercises', JSON.stringify(this.exercises));
      localStorage.setItem('fittrack_goals', JSON.stringify(this.goals));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private seedExercises() {
    const popularExercises = [
      { name: "Running", caloriesPerMinute: 8, category: "Cardio" },
      { name: "Cycling", caloriesPerMinute: 6, category: "Cardio" },
      { name: "Swimming", caloriesPerMinute: 10, category: "Cardio" },
      { name: "Weight Training", caloriesPerMinute: 5, category: "Strength" },
      { name: "Yoga", caloriesPerMinute: 3, category: "Flexibility" },
      { name: "Walking", caloriesPerMinute: 4, category: "Cardio" },
      { name: "Push-ups", caloriesPerMinute: 8, category: "Strength" },
      { name: "Squats", caloriesPerMinute: 6, category: "Strength" },
      { name: "Jumping Jacks", caloriesPerMinute: 7, category: "Cardio" },
      { name: "Planks", caloriesPerMinute: 4, category: "Core" },
    ];

    popularExercises.forEach((exercise) => {
      this.exercises.push({
        id: this.generateId(),
        ...exercise,
      });
    });

    this.saveToLocalStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Workout methods
  async getWorkouts(userId: string): Promise<Workout[]> {
    return this.workouts.filter(w => w.userId === userId);
  }

  async createWorkout(userId: string, workout: InsertWorkout): Promise<Workout> {
    const newWorkout: Workout = {
      id: this.generateId(),
      userId,
      ...workout,
      workoutDate: typeof workout.workoutDate === 'string' 
        ? new Date(workout.workoutDate) 
        : workout.workoutDate,
      createdAt: new Date(),
    };

    this.workouts.push(newWorkout);
    this.saveToLocalStorage();
    return newWorkout;
  }

  async deleteWorkout(id: string): Promise<boolean> {
    const initialLength = this.workouts.length;
    this.workouts = this.workouts.filter(w => w.id !== id);
    const deleted = this.workouts.length < initialLength;
    if (deleted) {
      this.saveToLocalStorage();
    }
    return deleted;
  }

  // Exercise methods
  async getExercises(): Promise<Exercise[]> {
    return this.exercises;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const newExercise: Exercise = {
      id: this.generateId(),
      ...exercise,
    };

    this.exercises.push(newExercise);
    this.saveToLocalStorage();
    return newExercise;
  }

  // Goal methods
  async getGoals(userId: string): Promise<Goal[]> {
    return this.goals.filter(g => g.userId === userId);
  }

  async createGoal(userId: string, goal: InsertGoal): Promise<Goal> {
    const newGoal: Goal = {
      id: this.generateId(),
      userId,
      current: 0,
      ...goal,
    };

    this.goals.push(newGoal);
    this.saveToLocalStorage();
    return newGoal;
  }

  async updateGoal(id: string, current: number): Promise<Goal | undefined> {
    const goal = this.goals.find(g => g.id === id);
    if (goal) {
      goal.current = current;
      this.saveToLocalStorage();
      return goal;
    }
    return undefined;
  }

  // Stats methods
  async getStats(userId: string): Promise<any> {
    const userWorkouts = await this.getWorkouts(userId);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayWorkouts = userWorkouts.filter(w => 
      w.workoutDate >= todayStart
    ).length;

    const totalCalories = userWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const totalActiveTime = userWorkouts.reduce((sum, w) => sum + w.duration, 0);

    return {
      todayWorkouts,
      caloriesBurned: totalCalories,
      activeTimeMinutes: totalActiveTime,
      weeklyWorkouts: userWorkouts.filter(w => {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return w.workoutDate >= weekAgo;
      }).length,
    };
  }
}

export const mockStorage = new MockStorage();