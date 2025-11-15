import { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Meal, DietaryTag } from '@/types';
import { MealCard } from './MealCard';

interface MealLibraryProps {
  meals: Meal[];
  patientRestrictions: DietaryTag[];
}

/**
 * Draggable wrapper for MealCard
 */
function DraggableMealCard({ meal }: { meal: Meal }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `meal-${meal.id}`,
    data: { meal },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <MealCard meal={meal} isDragging={isDragging} />
    </div>
  );
}

/**
 * Sidebar component for browsing and filtering meals
 */
export function MealLibrary({ meals, patientRestrictions }: MealLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<DietaryTag[]>([]);

  // Get all available dietary tags from meals
  const availableTags = useMemo(() => {
    const tags = new Set<DietaryTag>();
    meals.forEach((meal) => {
      meal.dietaryTags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [meals]);

  // Filter meals based on search and dietary filters
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // Search filter
      const matchesSearch =
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Dietary filter - meal must have ALL selected tags
      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.every((filter) => meal.dietaryTags.includes(filter));

      return matchesSearch && matchesFilters;
    });
  }, [meals, searchQuery, selectedFilters]);

  const toggleFilter = (tag: DietaryTag) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="meal-library">
      <div className="library-header">
        <h3>Meal Library</h3>
        <p className="meal-count">{filteredMeals.length} meals</p>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Dietary Filters */}
      <div className="filters">
        <h4>Dietary Filters</h4>
        <div className="filter-tags">
          {availableTags.map((tag) => {
            const isRestriction = patientRestrictions.includes(tag);
            const isSelected = selectedFilters.includes(tag);

            return (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`filter-tag ${isSelected ? 'selected' : ''} ${
                  isRestriction ? 'restriction' : ''
                }`}
                title={isRestriction ? 'Patient restriction' : ''}
              >
                {tag}
                {isRestriction && ' ⚠️'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal List */}
      <div className="meals-list">
        {filteredMeals.length === 0 ? (
          <p className="empty-state">No meals found</p>
        ) : (
          filteredMeals.map((meal) => (
            <div key={meal.id} className="draggable-meal">
              <DraggableMealCard meal={meal} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
