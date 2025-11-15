/**
 * Core type definitions for the Nourish Meal Planner
 */

export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
}

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-carb'
  | 'keto'
  | 'paleo';

export interface Meal {
  id: string;
  name: string;
  description: string;
  nutrition: NutritionalInfo;
  dietaryTags: DietaryTag[];
  prepTime: number; // minutes
  imageUrl?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface PlannedMeal {
  id: string;
  meal: Meal;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  mealType: MealType;
  servings: number;
}

export interface PatientProfile {
  id: string;
  name: string;
  dailyCalorieTarget: number;
  dietaryRestrictions: DietaryTag[];
}

export interface MealPlan {
  id: string;
  patientId: string;
  weekStartDate: Date;
  plannedMeals: PlannedMeal[];
}

export interface DailyNutrition {
  dayOfWeek: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  mealsCount: number;
}
