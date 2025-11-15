import { useDroppable } from '@dnd-kit/core';
import { MealType, PlannedMeal } from '@/types';
import { PlannedMealCard } from './PlannedMealCard';

interface MealSlotProps {
  dayOfWeek: number;
  mealType: MealType;
  plannedMeals: PlannedMeal[];
  onRemoveMeal: (id: string) => void;
  onServingsChange: (id: string, servings: number) => void;
}

/**
 * A droppable slot for meals in the weekly calendar
 */
export function MealSlot({
  dayOfWeek,
  mealType,
  plannedMeals,
  onRemoveMeal,
  onServingsChange,
}: MealSlotProps) {
  const mealsForSlot = plannedMeals.filter(
    (pm) => pm.dayOfWeek === dayOfWeek && pm.mealType === mealType
  );

  const totalCalories = mealsForSlot.reduce(
    (sum, pm) => sum + pm.meal.nutrition.calories * pm.servings,
    0
  );

  // Set up droppable zone
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${dayOfWeek}-${mealType}`,
    data: { dayOfWeek, mealType },
  });

  return (
    <div
      ref={setNodeRef}
      className={`meal-slot ${isOver ? 'drop-target' : ''}`}
      style={{
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
        border: isOver ? '2px dashed #3b82f6' : undefined,
      }}
    >
      <div className="meal-slot-content">
        {mealsForSlot.length === 0 ? (
          <div className="empty-slot">
            <p>Drop meal here</p>
          </div>
        ) : (
          <>
            <div className="slot-header">
              <span className="meal-count">{mealsForSlot.length} meal(s)</span>
              <span className="slot-calories">{Math.round(totalCalories)} cal</span>
            </div>
            <div className="planned-meals">
              {mealsForSlot.map((plannedMeal) => (
                <PlannedMealCard
                  key={plannedMeal.id}
                  plannedMeal={plannedMeal}
                  onRemove={onRemoveMeal}
                  onServingsChange={onServingsChange}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
