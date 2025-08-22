import { AddWorkoutForm } from "../components/add-workout-form";
import { RecentActivities } from "../components/recent-activities";
import { WeeklyProgress } from "../components/weekly-progress";
import { FitnessGoals } from "../components/fitness-goals";
import { ExerciseLibrary } from "../components/exercise-library";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, Target, Clock, Calendar, Plus, Award, 
  Flame, Zap, Trophy, ArrowUp, ArrowDown, Minus, Filter,
  Download, Settings, Bell, BarChart3, Heart
} from "lucide-react";
import { Button } from "../components/ui/button";

interface Stats {
  todayWorkouts: number;
  caloriesBurned: number;
  activeTimeMinutes: number;
  weeklyGoalProgress: number;
  streak: number;
  totalWorkouts: number;
  avgCaloriesPerWorkout: number;
  personalRecords: number;
  lastWeekComparison: {
    workouts: number;
    calories: number;
    time: number;
  };
}

interface Workout {
  id: string;
  exerciseType: string;
  duration: number;
  calories: number;
  intensity: string;
  workoutDate: Date;
  isPersonalRecord?: boolean;
}

export default function Dashboard() {
  const { data: stats } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ['/api/workouts'],
  });

  const getChangeIndicator = (current: number, previous: number) => {
    if (current > previous) return { icon: ArrowUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" };
    if (current < previous) return { icon: ArrowDown, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" };
    return { icon: Minus, color: "text-gray-500", bg: "bg-gray-50 dark:bg-gray-900/20" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden">
      {/* Beautiful floating gradient orbs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/15 to-orange-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-400/18 to-cyan-500/18 rounded-full blur-3xl animate-pulse delay-2000" />
      
      {/* Main content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Beautiful Enhanced Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    FitTrack Pro
                  </h1>
                  {stats?.streak && stats.streak > 0 && (
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg mt-2">
                      <Flame className="w-4 h-4" />
                      {stats.streak} day fire streak!
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                Transform your fitness journey with beautiful insights ✨
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button className="gradient-primary hover:opacity-90 text-white px-6 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Quick Add Workout
              </Button>
            </div>
          </div>

          {/* Advanced Stats Grid with Gradients */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Today's Workouts */}
            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 gradient-primary rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                {stats?.lastWeekComparison && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getChangeIndicator(stats.todayWorkouts, stats.lastWeekComparison.workouts).bg}`}>
                    {(() => {
                      const indicator = getChangeIndicator(stats.todayWorkouts, stats.lastWeekComparison.workouts);
                      const Icon = indicator.icon;
                      return <Icon className={`w-3 h-3 ${indicator.color}`} />;
                    })()}
                    <span className={`text-xs font-medium ${getChangeIndicator(stats.todayWorkouts, stats.lastWeekComparison.workouts).color}`}>
                      {Math.abs(((stats.todayWorkouts - stats.lastWeekComparison.workouts) / (stats.lastWeekComparison.workouts || 1)) * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Workouts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.todayWorkouts ?? 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Goal: 2 workouts
                </p>
              </div>
            </div>

            {/* Calories with Intensity Indicator */}
            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 gradient-secondary rounded-xl shadow-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">High Intensity</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Calories Burned</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.caloriesBurned ?? 0}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-warning transition-all duration-500"
                      style={{ width: `${Math.min(((stats?.caloriesBurned ?? 0) / 800) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">800 goal</span>
                </div>
              </div>
            </div>

            {/* Active Time with Efficiency */}
            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 gradient-success rounded-xl shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-lg text-xs font-medium">
                  Efficient
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.activeTimeMinutes ?? 0}m
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stats?.avgCaloriesPerWorkout ? `${stats.avgCaloriesPerWorkout} cal/min avg` : 'No data'}
                </p>
              </div>
            </div>

            {/* Weekly Progress with Achievement */}
            <div className="bg-gradient-card backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-800/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                {stats?.personalRecords && stats.personalRecords > 0 && (
                  <div className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {stats.personalRecords} PRs
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Weekly Goal</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {workouts?.length ?? 0}/7
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.min(((workouts?.length ?? 0) / 7) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(((workouts?.length ?? 0) / 7) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* Stunning Add Workout Form */}
            <div className="group relative bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl shadow-xl border border-blue-200/40 dark:border-blue-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative px-6 py-4 border-b border-blue-200/30 dark:border-blue-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Workout</h2>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Log your training session</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                    Quick Setup
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <AddWorkoutForm />
              </div>
            </div>

            {/* Beautiful Recent Activities */}
            <div className="group relative bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-800 dark:to-emerald-900/20 rounded-3xl shadow-xl border border-emerald-200/40 dark:border-emerald-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative px-6 py-4 border-b border-emerald-200/30 dark:border-emerald-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activities</h2>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Your fitness journey</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <RecentActivities />
              </div>
            </div>

            {/* Stunning Weekly Progress */}
            <div className="group relative bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 rounded-3xl shadow-xl border border-purple-200/40 dark:border-purple-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative px-6 py-4 border-b border-purple-200/30 dark:border-purple-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Progress</h2>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Track your gains</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <WeeklyProgress />
              </div>
            </div>

            {/* Gorgeous Fitness Goals */}
            <div className="group relative bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 rounded-3xl shadow-xl border border-orange-200/40 dark:border-orange-700/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative px-6 py-4 border-b border-orange-200/30 dark:border-orange-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fitness Goals</h2>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Achieve greatness</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <FitnessGoals />
              </div>
            </div>
          </div>

          {/* Magnificent Exercise Library */}
          <div className="group relative bg-gradient-to-br from-white to-pink-50/50 dark:from-gray-800 dark:to-pink-900/20 rounded-3xl shadow-xl border border-pink-200/40 dark:border-pink-700/30 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative px-6 py-4 border-b border-pink-200/30 dark:border-pink-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Exercise Library</h2>
                    <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Discover new workouts</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              <ExerciseLibrary />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}