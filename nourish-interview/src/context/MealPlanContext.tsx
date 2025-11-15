import { createContext, useContext, useState, ReactNode } from 'react';
import { MealPlan, PlannedMeal, Meal, MealType, PatientProfile } from '@/types';
import { getCurrentWeekStart } from '@/utils/dateHelpers';
import { defaultPatient } from '@/data/mockPatients';

interface MealPlanContextValue {
  mealPlan: MealPlan;
  patient: PatientProfile;
  addMeal: (meal: Meal, dayOfWeek: number, mealType: MealType) => void;
  removeMeal: (plannedMealId: string) => void;
  updateServings: (plannedMealId: string, servings: number) => void;
}

const MealPlanContext = createContext<MealPlanContextValue | undefined>(undefined);

interface MealPlanProviderProps {
  children: ReactNode;
  initialPatient?: PatientProfile;
}

/**
 * Context provider for meal plan state management
 */
export function MealPlanProvider({ children, initialPatient = defaultPatient }: MealPlanProviderProps) {
  const [patient] = useState<PatientProfile>(initialPatient);
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    id: 'plan-1',
    patientId: patient.id,
    weekStartDate: getCurrentWeekStart(),
    plannedMeals: [],
  });

  const addMeal = (meal: Meal, dayOfWeek: number, mealType: MealType) => {
    const newPlannedMeal: PlannedMeal = {
      id: `planned-${Date.now()}-${Math.random()}`,
      meal,
      dayOfWeek,
      mealType,
      servings: 1,
    };

    setMealPlan((prev) => ({
      ...prev,
      plannedMeals: [...prev.plannedMeals, newPlannedMeal],
    }));
  };

  const removeMeal = (plannedMealId: string) => {
    setMealPlan((prev) => ({
      ...prev,
      plannedMeals: prev.plannedMeals.filter((pm) => pm.id !== plannedMealId),
    }));
  };

  const updateServings = (plannedMealId: string, servings: number) => {
    if (servings <= 0) return;

    setMealPlan((prev) => ({
      ...prev,
      plannedMeals: prev.plannedMeals.map((pm) =>
        pm.id === plannedMealId ? { ...pm, servings } : pm
      ),
    }));
  };

  const value: MealPlanContextValue = {
    mealPlan,
    patient,
    addMeal,
    removeMeal,
    updateServings,
  };

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
}

/**
 * Hook to access meal plan context
 */
export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
}
