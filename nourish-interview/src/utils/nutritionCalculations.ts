import { PlannedMeal, DailyNutrition, NutritionalInfo } from '@/types';

/**
 * Calculate total nutrition for a specific day
 */
export function calculateDailyNutrition(
  plannedMeals: PlannedMeal[],
  dayOfWeek: number
): DailyNutrition {
  const mealsForDay = plannedMeals.filter((pm) => pm.dayOfWeek === dayOfWeek);

  const totals = mealsForDay.reduce(
    (acc, plannedMeal) => {
      const nutrition = plannedMeal.meal.nutrition;
      const multiplier = plannedMeal.servings;

      return {
        calories: acc.calories + nutrition.calories * multiplier,
        protein: acc.protein + nutrition.protein * multiplier,
        carbs: acc.carbs + nutrition.carbs * multiplier,
        fats: acc.fats + nutrition.fats * multiplier,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return {
    dayOfWeek,
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein),
    totalCarbs: Math.round(totals.carbs),
    totalFats: Math.round(totals.fats),
    mealsCount: mealsForDay.length,
  };
}

/**
 * Calculate nutrition for a meal with servings multiplier
 */
export function calculateMealNutrition(
  nutrition: NutritionalInfo,
  servings: number
): NutritionalInfo {
  return {
    calories: Math.round(nutrition.calories * servings),
    protein: Math.round(nutrition.protein * servings),
    carbs: Math.round(nutrition.carbs * servings),
    fats: Math.round(nutrition.fats * servings),
  };
}

/**
 * Check if daily calories are within target range (±200 calories)
 */
export function isWithinCalorieTarget(
  actualCalories: number,
  targetCalories: number,
  tolerance: number = 200
): boolean {
  return Math.abs(actualCalories - targetCalories) <= tolerance;
}

/**
 * Get calorie status indicator
 */
export function getCalorieStatus(
  actualCalories: number,
  targetCalories: number
): 'low' | 'on-target' | 'high' {
  const diff = actualCalories - targetCalories;

  if (diff < -200) return 'low';
  if (diff > 200) return 'high';
  return 'on-target';
}
