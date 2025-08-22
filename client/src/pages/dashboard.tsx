import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Header } from "@/components/header";
import { AddWorkoutForm } from "@/components/add-workout-form";
import { WeeklyProgress } from "@/components/weekly-progress";
import { RecentActivities } from "@/components/recent-activities";
import { FitnessGoals } from "@/components/fitness-goals";
import { ExerciseLibrary } from "@/components/exercise-library";
import { Button } from "@/components/ui/button";
import type { Workout } from "@shared/schema";

export default function Dashboard() {
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const getTodayStats = () => {
    if (!workouts) return { workouts: 0, calories: 0, duration: 0 };

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const todayWorkouts = workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= todayStart && workoutDate < todayEnd;
    });

    return {
      workouts: todayWorkouts.length,
      calories: todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0),
      duration: todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
    };
  };

  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Welcome back, <span className="text-coral-500">Alex</span>! 👋
              </h2>
              <p className="text-slate-600 dark:text-slate-400">Let's crush your fitness goals today</p>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-coral-500/10 to-teal-500/10 dark:from-coral-500/20 dark:to-teal-500/20 px-4 py-2 rounded-xl border border-coral-200 dark:border-coral-800">
              <span className="text-coral-500">🔥</span>
              <span className="text-sm font-medium">🔥 7 day streak!</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-coral-500 to-coral-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">🏃‍♂️</span>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {todayStats.workouts}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Workouts</p>
            <div className="mt-3 flex items-center text-xs">
              <span className="text-success mr-1">↗</span>
              <span className="text-success font-medium">+15%</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">🔥</span>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {todayStats.calories}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calories Burned</p>
            <div className="mt-3 flex items-center text-xs">
              <span className="text-success mr-1">↗</span>
              <span className="text-success font-medium">+8%</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">⏱️</span>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                Today
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {todayStats.duration}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Minutes Active</p>
            <div className="mt-3 flex items-center text-xs">
              <span className="text-success mr-1">↗</span>
              <span className="text-success font-medium">+22%</span>
              <span className="text-slate-500 dark:text-slate-400 ml-1">vs yesterday</span>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up group" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-lg">🏆</span>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                This Week
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">3/4</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Goals Achieved</p>
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-success to-green-600 h-2 rounded-full animate-progress"
                style={{ width: "75%", transformOrigin: "left" }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <WeeklyProgress />
            <RecentActivities />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AddWorkoutForm />
            <FitnessGoals />
            <ExerciseLibrary />
          </div>
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-coral-500/30"
          data-testid="fab-add-workout"
        >
          <Plus size={20} />
        </Button>
      </div>
    </div>
  );
}
