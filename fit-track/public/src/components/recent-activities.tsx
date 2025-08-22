import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import { Clock, Flame, Calendar, Trash2, Activity, Star, Trophy, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Workout } from "../shared/schema";
import { mockStorage } from "../data/mockStorage";

const getExerciseIcon = (exerciseType: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Running': '🏃',
    'Cycling': '🚴',
    'Swimming': '🏊',
    'Weight Training': '🏋️',
    'Yoga': '🧘',
    'Hiking': '🥾',
    'Pilates': '🤸',
    'Boxing': '🥊',
    'Walking': '🚶',
    'HIIT': '⚡',
    'Dancing': '💃',
    'Basketball': '🏀',
    'Cardio': '❤️',
    'Strength': '💪'
  };
  return iconMap[exerciseType] || '⚡';
};

const getIntensityStyles = (intensity: string) => {
  switch (intensity.toLowerCase()) {
    case 'low':
      return {
        gradient: 'bg-gradient-to-br from-blue-400 to-cyan-500',
        bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200/60 dark:border-blue-700/60',
        icon: '🌙'
      };
    case 'moderate':
      return {
        gradient: 'bg-gradient-to-br from-green-400 to-emerald-500',
        bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-200/60 dark:border-green-700/60',
        icon: '☀️'
      };
    case 'high':
      return {
        gradient: 'bg-gradient-to-br from-orange-400 to-red-500',
        bgGradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30',
        textColor: 'text-orange-700 dark:text-orange-300',
        borderColor: 'border-orange-200/60 dark:border-orange-700/60',
        icon: '🔥'
      };
    case 'very high':
      return {
        gradient: 'bg-gradient-to-br from-red-500 to-pink-600',
        bgGradient: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-200/60 dark:border-red-700/60',
        icon: '⚡'
      };
    default:
      return {
        gradient: 'bg-gradient-to-br from-gray-400 to-slate-500',
        bgGradient: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-200/60 dark:border-gray-700/60',
        icon: '◯'
      };
  }
};

export function RecentActivities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => mockStorage.getWorkouts("mock-user-id"),
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      await mockStorage.deleteWorkout(workoutId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Workout Deleted Successfully! ✨",
        description: "The workout has been removed from your history.",
      });
    },
    onError: () => {
      toast({
        title: "Error Deleting Workout",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-2xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-purple-500 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Workouts Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start logging your workouts to see them here! 💪
        </p>
      </div>
    );
  }

  const recentWorkouts = workouts
    .sort((a, b) => new Date(b.workoutDate).getTime() - new Date(a.workoutDate).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Beautiful Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Activities
            </h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Your fitness journey 🚀</p>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {recentWorkouts.length} recent workouts
        </div>
      </div>

      {/* Stunning Activity Cards */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto recent-activities-scroll">
        {recentWorkouts.map((workout) => {
          const intensityStyles = getIntensityStyles(workout.intensity);
          const exerciseIcon = getExerciseIcon(workout.exerciseType);
          
          return (
            <div
              key={workout.id}
              className={`group relative ${intensityStyles.bgGradient} p-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] shadow-lg border ${intensityStyles.borderColor} hover:shadow-xl`}
            >
              {/* Workout Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${intensityStyles.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{exerciseIcon}</span>
                  </div>
                  
                  <div>
                    <h4 className={`text-lg font-bold ${intensityStyles.textColor}`}>
                      {workout.exerciseType}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${intensityStyles.textColor} opacity-80`}>
                        {formatDistanceToNow(new Date(workout.workoutDate), { addSuffix: true })}
                      </span>
                      <span className={`text-xs ${intensityStyles.textColor} px-2 py-1 rounded-full bg-white/40 dark:bg-black/20 font-medium`}>
                        {intensityStyles.icon} {workout.intensity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                  className="w-8 h-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 rounded-xl opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Workout Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className={`flex items-center justify-center gap-1 text-xl font-bold ${intensityStyles.textColor} mb-1`}>
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className={`text-xs ${intensityStyles.textColor} opacity-70 font-medium`}>
                    minutes
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`flex items-center justify-center gap-1 text-xl font-bold ${intensityStyles.textColor} mb-1`}>
                    <Flame className="w-4 h-4" />
                    <span>{workout.caloriesBurned}</span>
                  </div>
                  <div className={`text-xs ${intensityStyles.textColor} opacity-70 font-medium`}>
                    calories
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`flex items-center justify-center gap-1 text-xl font-bold ${intensityStyles.textColor} mb-1`}>
                    <Star className="w-4 h-4" />
                    <span>{Math.round(workout.caloriesBurned / workout.duration)}</span>
                  </div>
                  <div className={`text-xs ${intensityStyles.textColor} opacity-70 font-medium`}>
                    cal/min
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {workout.notes && (
                <div className="mt-3 pt-3 border-t border-white/30 dark:border-black/20">
                  <p className={`text-sm ${intensityStyles.textColor} opacity-90 italic`}>
                    "{workout.notes}"
                  </p>
                </div>
              )}

              {/* Date Badge */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${intensityStyles.textColor} bg-white/40 dark:bg-black/20`}>
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(workout.workoutDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      {recentWorkouts.length > 3 && (
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-medium">
                {recentWorkouts.length} recent sessions
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">
                {recentWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0)} total calories
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}