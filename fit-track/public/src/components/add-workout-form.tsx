import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Zap, Clock, Flame, Calendar, FileText, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "../hooks/use-toast";
import { insertWorkoutSchema, type InsertWorkout } from "../shared/schema";
import { mockStorage } from "../data/mockStorage";

const exerciseOptions = [
  { name: "Running", icon: "🏃", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
  { name: "Cycling", icon: "🚴", color: "bg-gradient-to-br from-green-500 to-teal-500" },
  { name: "Swimming", icon: "🏊", color: "bg-gradient-to-br from-blue-400 to-indigo-500" },
  { name: "Weight Training", icon: "🏋️", color: "bg-gradient-to-br from-red-500 to-orange-500" },
  { name: "Yoga", icon: "🧘", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "Hiking", icon: "🥾", color: "bg-gradient-to-br from-emerald-500 to-green-600" },
  { name: "Pilates", icon: "🤸", color: "bg-gradient-to-br from-violet-500 to-purple-600" },
  { name: "Boxing", icon: "🥊", color: "bg-gradient-to-br from-red-600 to-rose-600" },
  { name: "Other", icon: "⚡", color: "bg-gradient-to-br from-gray-500 to-slate-600" }
];

const intensityOptions = [
  { name: "Low", icon: "🌙", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { name: "Moderate", icon: "☀️", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  { name: "High", icon: "🔥", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { name: "Very High", icon: "⚡", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" }
];

export function AddWorkoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertWorkoutSchema),
    defaultValues: {
      exerciseType: "",
      duration: 0,
      caloriesBurned: 0,
      intensity: "Moderate",
      notes: "",
      workoutDate: new Date().toISOString().slice(0, 16),
    },
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: InsertWorkout) => {
      return await mockStorage.createWorkout("mock-user-id", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast({
        title: "Workout Added Successfully! 🎉",
        description: "Your training session has been logged beautifully.",
      });
      form.reset({
        exerciseType: "",
        duration: 0,
        caloriesBurned: 0,
        intensity: "Moderate",
        notes: "",
        workoutDate: new Date().toISOString().slice(0, 16),
      });
      setIsSubmitting(false);
    },
    onError: () => {
      toast({
        title: "Error Adding Workout",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    // Convert the form data to match InsertWorkout type
    const workoutData: InsertWorkout = {
      ...data,
      intensity: data.intensity as "Low" | "Moderate" | "High" | "Very High",
      workoutDate: new Date(data.workoutDate)
    };
    createWorkoutMutation.mutate(workoutData);
  };

  return (
    <div className="space-y-6">
      {/* Beautiful Form Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            New Workout Session
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Log your amazing training session ✨
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Exercise Type - Gorgeous Card Layout */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <Label className="text-sm font-semibold text-gray-900 dark:text-white">Exercise Type</Label>
          </div>
          
          <Select value={form.watch("exerciseType")} onValueChange={(value) => form.setValue("exerciseType", value)}>
            <SelectTrigger className="h-14 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700 rounded-2xl">
              <SelectValue placeholder="Choose your exercise" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {exerciseOptions.map((exercise) => (
                <SelectItem key={exercise.name} value={exercise.name} className="rounded-xl my-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${exercise.color} rounded-lg flex items-center justify-center text-white font-medium shadow-md`}>
                      {exercise.icon}
                    </div>
                    <span className="font-medium">{exercise.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date & Time - Beautiful Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <Label className="text-sm font-semibold text-gray-900 dark:text-white">Date & Time</Label>
          </div>
          <Input
            type="datetime-local"
            {...form.register("workoutDate")}
            className="h-14 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 rounded-2xl text-lg"
          />
        </div>

        {/* Duration & Calories - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <Label className="text-sm font-semibold text-gray-900 dark:text-white">Duration (min)</Label>
            </div>
            <Input
              type="number"
              placeholder="30"
              {...form.register("duration", { valueAsNumber: true })}
              className="h-14 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-700 rounded-2xl text-lg text-center font-bold"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <Label className="text-sm font-semibold text-gray-900 dark:text-white">Calories</Label>
            </div>
            <Input
              type="number"
              placeholder="300"
              {...form.register("caloriesBurned", { valueAsNumber: true })}
              className="h-14 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700 rounded-2xl text-lg text-center font-bold"
            />
          </div>
        </div>

        {/* Intensity - Beautiful Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <Label className="text-sm font-semibold text-gray-900 dark:text-white">Intensity Level</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {intensityOptions.map((intensity) => (
              <button
                key={intensity.name}
                type="button"
                onClick={() => form.setValue("intensity", intensity.name)}
                className={`p-4 rounded-2xl transition-all duration-300 border-2 ${
                  form.watch("intensity") === intensity.name
                    ? `${intensity.bg} border-current ${intensity.color} scale-105 shadow-lg`
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:scale-102"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{intensity.icon}</div>
                  <div className={`text-sm font-bold ${form.watch("intensity") === intensity.name ? intensity.color : "text-gray-600 dark:text-gray-400"}`}>
                    {intensity.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes - Beautiful Textarea */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <Label className="text-sm font-semibold text-gray-900 dark:text-white">Notes (Optional)</Label>
          </div>
          <Textarea
            placeholder="How did this workout feel? Any achievements or observations..."
            {...form.register("notes")}
            className="min-h-[80px] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700 rounded-2xl resize-none"
          />
        </div>

        {/* Submit Button - Gorgeous */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Adding Workout...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              <span>Log This Workout</span>
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}