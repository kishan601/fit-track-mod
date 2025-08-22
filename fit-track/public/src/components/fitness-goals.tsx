import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { useQuery } from "@tanstack/react-query";
import { mockStorage } from "../data/mockStorage";
import { Target, Flame, Clock, Trophy, Star, Award } from "lucide-react";

interface Stats {
  todayWorkouts: number;
  caloriesBurned: number;
  activeTimeMinutes: number;
}

export function FitnessGoals() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: () => mockStorage.getStats("mock-user-id"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const goals = [
    {
      name: "Daily Calories",
      current: stats?.caloriesBurned || 0,
      target: 500,
      icon: Flame,
      gradient: "bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500",
      bgGradient: "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/30 dark:via-orange-900/30 dark:to-yellow-900/30",
      iconBg: "bg-gradient-to-br from-red-500 to-orange-600",
      textColor: "text-red-700 dark:text-red-300",
      progressColor: "bg-gradient-to-r from-red-500 to-orange-500",
      borderColor: "border-red-200/60 dark:border-red-700/60"
    },
    {
      name: "Daily Workouts",
      current: stats?.todayWorkouts || 0,
      target: 2,
      icon: Target,
      gradient: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500",
      bgGradient: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      textColor: "text-blue-700 dark:text-blue-300",
      progressColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
      borderColor: "border-blue-200/60 dark:border-blue-700/60"
    },
    {
      name: "Active Minutes",
      current: stats?.activeTimeMinutes || 0,
      target: 60,
      icon: Clock,
      gradient: "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500",
      bgGradient: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30",
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
      textColor: "text-emerald-700 dark:text-emerald-300",
      progressColor: "bg-gradient-to-r from-emerald-500 to-green-500",
      borderColor: "border-emerald-200/60 dark:border-emerald-700/60"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Beautiful Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Today's Mission
          </h3>
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Crush your goals! 🎯</p>
        </div>
      </div>

      {/* Gorgeous Goal Cards */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);
          const isCompleted = percentage >= 100;
          const IconComponent = goal.icon;
          
          return (
            <div
              key={goal.name}
              className={`group relative ${goal.bgGradient} p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg border ${goal.borderColor} ${
                isCompleted ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
              }`}
            >
              {/* Completion Sparkle Effect */}
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${goal.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${goal.textColor}`}>
                      {goal.name}
                    </h4>
                    <p className={`text-sm ${goal.textColor} opacity-80`}>
                      {goal.current} of {goal.target} {goal.name === 'Active Minutes' ? 'mins' : goal.name === 'Daily Calories' ? 'cal' : 'sessions'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${goal.textColor} ${isCompleted ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                    {Math.round(percentage)}%
                  </div>
                  <div className={`text-xs ${goal.textColor} opacity-70`}>
                    {isCompleted ? 'Complete!' : 'Progress'}
                  </div>
                </div>
              </div>

              {/* Beautiful Progress Bar */}
              <div className="space-y-2">
                <div className="relative h-4 bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                  <div 
                    className={`absolute inset-0 ${goal.progressColor} transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                  
                  {/* Progress Indicator */}
                  {percentage > 10 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Goal Status */}
                <div className="flex justify-between items-center text-xs">
                  <span className={`${goal.textColor} opacity-70`}>
                    {goal.current}/{goal.target}
                  </span>
                  <span className={`font-medium ${isCompleted ? 'text-yellow-600 dark:text-yellow-400' : goal.textColor}`}>
                    {isCompleted ? (
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Goal Achieved!
                      </span>
                    ) : (
                      `${goal.target - goal.current} to go`
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Progress Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              Daily Score
            </span>
          </div>
          <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {goals.filter(goal => (goal.current / goal.target) * 100 >= 100).length}/3
          </div>
          <div className="text-sm text-indigo-600/80 dark:text-indigo-400/80 font-medium">
            Goals completed today
          </div>
        </div>
      </div>
    </div>
  );
}