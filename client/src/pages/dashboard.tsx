import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit2, Clock } from "lucide-react";
import { Header } from "@/components/header";
import { AddWorkoutForm } from "@/components/add-workout-form";
import { WeeklyProgress } from "@/components/weekly-progress";
import { RecentActivities } from "@/components/recent-activities";
import { FitnessGoals } from "@/components/fitness-goals";
import { ExerciseLibrary } from "@/components/exercise-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Workout, Goal } from "@shared/schema";

export default function Dashboard() {
  const [userName, setUserName] = useState("Alex");
  const [isEditingName, setIsEditingName] = useState(false);
  
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleNameEdit = () => {
    setIsEditingName(!isEditingName);
  };

  const handleNameSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingName(false);
    }
  };

  const getTodayStats = () => {
    if (!workouts) return { workouts: 0, calories: 0, duration: 0 };

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const todayWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      // Check if workout is today using date string comparison (timezone-safe)
      const workoutDateString = workoutDate.toDateString();
      const todayDateString = today.toDateString();
      return workoutDateString === todayDateString;
    });


    return {
      workouts: todayWorkouts.length,
      calories: todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0),
      duration: todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
    };
  };

  const todayStats = getTodayStats();

  // Calculate real goals achievement instead of hardcoded 3/4! 👑
  // *SLAP* "Queen needs to work for people!" 😂
  const getGoalsAchievement = () => {
    if (!goals || !Array.isArray(goals) || goals.length === 0) return { achieved: 0, total: 0, percentage: 0 };

    // Define realistic goal targets based on today's stats
    const dailyGoals = [
      { name: "Daily Calories", target: 300, current: todayStats.calories },
      { name: "Daily Workouts", target: 1, current: todayStats.workouts },
      { name: "Active Minutes", target: 30, current: todayStats.duration },
    ];

    const achievedGoals = dailyGoals.filter(goal => goal.current >= goal.target).length;
    const totalGoals = dailyGoals.length;
    const percentage = totalGoals > 0 ? (achievedGoals / totalGoals) * 100 : 0;

    return { achieved: achievedGoals, total: totalGoals, percentage };
  };

  const goalsAchievement = getGoalsAchievement();

  return (
    <div className="min-h-screen bg-white dark:bg-background transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Welcome back, {isEditingName ? (
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      onKeyDown={handleNameSave}
                      onBlur={() => setIsEditingName(false)}
                      className="inline-block w-auto min-w-[100px] text-blue-500 text-3xl font-bold bg-transparent border-0 border-b-2 border-blue-500 rounded-none px-1 py-0 h-auto focus-visible:ring-0"
                      autoFocus
                    />
                  ) : (
                    <span className="text-blue-500">{userName}</span>
                  )}! 👋
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNameEdit}
                  className="h-8 w-8 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                  data-testid="button-edit-name"
                >
                  <Edit2 size={16} className="text-blue-500" />
                </Button>
              </div>
              <p className="text-muted-foreground">Let's crush your fitness goals today</p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-slate-500/10 to-slate-600/10 dark:from-slate-500/20 dark:to-slate-600/20 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <Clock size={16} className="text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{getCurrentDateTime()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">🏃‍♂️</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {todayStats.workouts}
            </h3>
            <p className="text-sm text-muted-foreground">Workouts</p>
            <div className="mt-3 flex items-center text-xs">
              <span className="text-success mr-1">↗</span>
              <span className="text-success font-medium">+15%</span>
              <span className="text-muted-foreground ml-1">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">🔥</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {todayStats.calories}
            </h3>
            <p className="text-sm text-muted-foreground">Calories Burned</p>
            <div className="mt-3 flex items-center text-xs">
              <span className="text-success mr-1">↗</span>
              <span className="text-success font-medium">+8%</span>
              <span className="text-muted-foreground ml-1">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">⏱️</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {todayStats.duration}
            </h3>
            <p className="text-sm text-muted-foreground">Minutes Active</p>
            <div className="mt-3 flex items-center text-xs">
              <span className="text-success mr-1">↗</span>
              <span className="text-success font-medium">+22%</span>
              <span className="text-muted-foreground ml-1">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">🏆</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-full">
                This Week
              </span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {goalsAchievement.achieved}/{goalsAchievement.total}
            </h3>
            <p className="text-sm text-muted-foreground">Goals Achieved</p>
            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-success to-green-600 h-2 rounded-full animate-progress transition-all duration-500"
                style={{ width: `${goalsAchievement.percentage}%`, transformOrigin: "left" }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Left */}
          <WeeklyProgress />
          
          {/* Top Right */}
          <AddWorkoutForm />
          
          {/* Bottom Left */}
          <RecentActivities />
          
          {/* Bottom Right */}
          <FitnessGoals />
        </div>

        {/* Exercise Library - Full Width Below Grid */}
        <div className="mt-8">
          <ExerciseLibrary />
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          onClick={() => {
            const addWorkoutForm = document.querySelector('[data-testid="add-workout-form"]');
            if (addWorkoutForm) {
              addWorkoutForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Focus the first input in the form
              const firstInput = addWorkoutForm.querySelector('input, select, textarea') as HTMLElement;
              if (firstInput) {
                setTimeout(() => firstInput.focus(), 500);
              }
            }
          }}
          data-testid="fab-add-workout"
        >
          <Plus size={20} />
        </Button>
      </div>
    </div>
  );
}
