import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Zap, Dumbbell, Heart, Clock, Flame, Star, Trophy, Activity } from "lucide-react";
import { type Exercise } from "../shared/schema";
import { mockStorage } from "../data/mockStorage";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "cardio":
      return <Zap className="w-5 h-5 text-white" />;
    case "strength":
      return <Dumbbell className="w-5 h-5 text-white" />;
    case "flexibility":
      return <Heart className="w-5 h-5 text-white" />;
    default:
      return <Activity className="w-5 h-5 text-white" />;
  }
};

const getCategoryStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case "cardio":
      return {
        gradient: "bg-gradient-to-br from-red-500 to-orange-500",
        bgGradient: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
        textColor: "text-red-700 dark:text-red-300",
        borderColor: "border-red-200/50 dark:border-red-700/50"
      };
    case "strength":
      return {
        gradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
        bgGradient: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
        textColor: "text-blue-700 dark:text-blue-300",
        borderColor: "border-blue-200/50 dark:border-blue-700/50"
      };
    case "flexibility":
      return {
        gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
        bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
        textColor: "text-purple-700 dark:text-purple-300",
        borderColor: "border-purple-200/50 dark:border-purple-700/50"
      };
    default:
      return {
        gradient: "bg-gradient-to-br from-green-500 to-teal-500",
        bgGradient: "bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20",
        textColor: "text-green-700 dark:text-green-300",
        borderColor: "border-green-200/50 dark:border-green-700/50"
      };
  }
};

export function ExerciseLibrary() {
  const { data: exercises = [], isLoading } = useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: () => mockStorage.getExercises(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  const popularExercises = exercises.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Beautiful Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Exercise Library
            </h3>
            <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Discover amazing workouts! 💪</p>
          </div>
        </div>
      </div>

      {/* Stunning Exercise Cards */}
      <div className="space-y-3">
        {popularExercises.map((exercise) => {
          const styles = getCategoryStyles(exercise.category);
          const categoryIcon = getCategoryIcon(exercise.category);
          
          return (
            <div
              key={exercise.name}
              className={`group relative ${styles.bgGradient} p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg border ${styles.borderColor} hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 ${styles.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {categoryIcon}
                  </div>
                  
                  {/* Exercise Info */}
                  <div className="space-y-1">
                    <h4 className={`text-lg font-bold ${styles.textColor}`}>
                      {exercise.name}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles.textColor} bg-white/50 dark:bg-black/20`}>
                        <span className="capitalize">{exercise.category}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${styles.textColor} opacity-80`}>
                        <Flame className="w-3 h-3" />
                        <span>{exercise.caloriesPerMinute} cal/min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calories Badge */}
                <div className="text-right">
                  <div className={`text-2xl font-bold ${styles.textColor}`}>
                    {exercise.caloriesPerMinute}
                  </div>
                  <div className={`text-xs ${styles.textColor} opacity-70 font-medium`}>
                    cal/min
                  </div>
                </div>
              </div>

              {/* Intensity Indicator */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/30 dark:border-black/20">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        level <= Math.ceil(exercise.caloriesPerMinute / 3)
                          ? styles.gradient.replace('bg-gradient-to-br', 'bg-gradient-to-r')
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  size="sm"
                  className={`text-xs ${styles.gradient} text-white hover:opacity-90 transition-all duration-300 rounded-xl shadow-md`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Quick Add
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Button
          variant="outline"
          className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300 hover:scale-105 transition-all duration-300 rounded-2xl px-6"
        >
          <Trophy className="w-4 h-4 mr-2" />
          View All Exercises
        </Button>
      </div>
    </div>
  );
}