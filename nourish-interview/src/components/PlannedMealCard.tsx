import { PlannedMeal } from '@/types';
import { calculateMealNutrition } from '@/utils/nutritionCalculations';

interface PlannedMealCardProps {
  plannedMeal: PlannedMeal;
  onRemove: (id: string) => void;
  onServingsChange: (id: string, servings: number) => void;
}

/**
 * Display a planned meal in the calendar with servings control
 */
export function PlannedMealCard({
  plannedMeal,
  onRemove,
  onServingsChange,
}: PlannedMealCardProps) {
  const { meal, servings } = plannedMeal;
  const totalNutrition = calculateMealNutrition(meal.nutrition, servings);

  return (
    <div className="planned-meal-card">
      <div className="meal-header">
        <h5>{meal.name}</h5>
        <button
          onClick={() => onRemove(plannedMeal.id)}
          className="remove-btn"
          aria-label="Remove meal"
        >
          ×
        </button>
      </div>

      <div className="servings-control">
        <label htmlFor={`servings-${plannedMeal.id}`}>Servings:</label>
        <input
          id={`servings-${plannedMeal.id}`}
          type="number"
          min="0.5"
          max="10"
          step="0.5"
          value={servings}
          onChange={(e) => onServingsChange(plannedMeal.id, parseFloat(e.target.value))}
          className="servings-input"
        />
      </div>

      <div className="nutrition-info">
        <div className="calories">{totalNutrition.calories} cal</div>
        <div className="macros-mini">
          <span>P: {totalNutrition.protein}g</span>
          <span>C: {totalNutrition.carbs}g</span>
          <span>F: {totalNutrition.fats}g</span>
        </div>
      </div>

      {meal.dietaryTags.length > 0 && (
        <div className="tags-mini">
          {meal.dietaryTags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-mini">
              {tag}
            </span>
          ))}
          {meal.dietaryTags.length > 2 && (
            <span className="tag-mini">+{meal.dietaryTags.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
}
