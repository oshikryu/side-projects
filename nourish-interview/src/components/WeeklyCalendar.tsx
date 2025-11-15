import { useMemo } from 'react';
import { MealType, PlannedMeal, PatientProfile } from '@/types';
import { MealSlot } from './MealSlot';
import { getDayName, formatDate, getWeekDates } from '@/utils/dateHelpers';
import { calculateDailyNutrition, getCalorieStatus } from '@/utils/nutritionCalculations';

interface WeeklyCalendarProps {
  weekStartDate: Date;
  plannedMeals: PlannedMeal[];
  patient: PatientProfile;
  onRemoveMeal: (id: string) => void;
  onServingsChange: (id: string, servings: number) => void;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];
const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6]; // Sunday - Saturday

/**
 * Weekly calendar grid showing all meals for the week
 */
export function WeeklyCalendar({
  weekStartDate,
  plannedMeals,
  patient,
  onRemoveMeal,
  onServingsChange,
}: WeeklyCalendarProps) {
  const weekDates = useMemo(() => getWeekDates(weekStartDate), [weekStartDate]);

  // Calculate daily nutrition for each day
  const dailyNutrition = useMemo(() => {
    return DAYS_OF_WEEK.map((day) => calculateDailyNutrition(plannedMeals, day));
  }, [plannedMeals]);

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <h3>Weekly Meal Plan</h3>
        <p className="week-range">
          {formatDate(weekDates[0], 'MMM d')} - {formatDate(weekDates[6], 'MMM d, yyyy')}
        </p>
      </div>

      <div className="calendar-grid">
        {/* Header row with days */}
        <div className="calendar-row header-row">
          <div className="meal-type-label"></div>
          {DAYS_OF_WEEK.map((day) => {
            const nutrition = dailyNutrition[day];
            const status = getCalorieStatus(nutrition.totalCalories, patient.dailyCalorieTarget);

            return (
              <div key={day} className="day-header">
                <div className="day-name">{getDayName(day)}</div>
                <div className="day-date">{formatDate(weekDates[day])}</div>
                <div className={`day-calories ${status}`}>
                  <strong>{nutrition.totalCalories}</strong> / {patient.dailyCalorieTarget} cal
                </div>
                {status === 'low' && <span className="status-indicator">⬇️ Low</span>}
                {status === 'high' && <span className="status-indicator">⬆️ High</span>}
                {status === 'on-target' && <span className="status-indicator">✓ On target</span>}
              </div>
            );
          })}
        </div>

        {/* Meal type rows */}
        {MEAL_TYPES.map((mealType) => (
          <div key={mealType} className="calendar-row meal-row">
            <div className="meal-type-label">
              <span>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
            </div>
            {DAYS_OF_WEEK.map((day) => (
              <MealSlot
                key={`${day}-${mealType}`}
                dayOfWeek={day}
                mealType={mealType}
                plannedMeals={plannedMeals}
                onRemoveMeal={onRemoveMeal}
                onServingsChange={onServingsChange}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
