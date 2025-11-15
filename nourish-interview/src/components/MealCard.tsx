import { Meal } from '@/types';

interface MealCardProps {
  meal: Meal;
  isDragging?: boolean;
}

/**
 * Display meal information in a card format
 * Used in the meal library sidebar
 */
export function MealCard({ meal, isDragging = false }: MealCardProps) {
  return (
    <div className={`meal-card ${isDragging ? 'dragging' : ''}`}>
      {meal.imageUrl && (
        <div className="meal-image">
          <img src={meal.imageUrl} alt={meal.name} />
        </div>
      )}
      <div className="meal-info">
        <h4>{meal.name}</h4>
        <p className="description">{meal.description}</p>

        <div className="nutrition-summary">
          <span className="calories">{meal.nutrition.calories} cal</span>
          <span className="prep-time">{meal.prepTime} min</span>
        </div>

        <div className="macros">
          <span>P: {meal.nutrition.protein}g</span>
          <span>C: {meal.nutrition.carbs}g</span>
          <span>F: {meal.nutrition.fats}g</span>
        </div>

        {meal.dietaryTags.length > 0 && (
          <div className="tags">
            {meal.dietaryTags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
