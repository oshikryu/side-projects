import { MealPlanProvider, useMealPlan } from '@/context/MealPlanContext';
import { PatientHeader } from '@/components/PatientHeader';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { MealLibrary } from '@/components/MealLibrary';
import { MealCard } from '@/components/MealCard';
import { mockMeals } from '@/data/mockMeals';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import './styles/App.css';

/**
 * Main meal planner component
 */
function MealPlannerContent() {
  const { mealPlan, patient, removeMeal, updateServings, addMeal } = useMealPlan();

  // Set up drag and drop functionality
  const { sensors, activeMeal, handleDragStart, handleDragEnd } = useDragAndDrop(
    mockMeals,
    addMeal
  );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="app">
        <header className="app-header">
          <h1>Nourish Meal Planner</h1>
        </header>

        <PatientHeader patient={patient} />

        <div className="main-content">
          <aside className="sidebar">
            <MealLibrary meals={mockMeals} patientRestrictions={patient.dietaryRestrictions} />
          </aside>

          <main className="calendar-section">
            <WeeklyCalendar
              weekStartDate={mealPlan.weekStartDate}
              plannedMeals={mealPlan.plannedMeals}
              patient={patient}
              onRemoveMeal={removeMeal}
              onServingsChange={updateServings}
            />
          </main>
        </div>

        <div className="instructions">
          <h3>Implementation Instructions</h3>
          <ul>
            <li>✅ Basic UI structure and components created</li>
            <li>✅ Drag and drop functionality implemented using @dnd-kit</li>
            <li>✅ Keyboard navigation for accessibility</li>
            <li>⚠️ TODO: Add loading and error states</li>
            <li>⚠️ TODO: Write unit tests for critical functions</li>
            <li>⚠️ TODO: Optimize re-renders during drag operations</li>
          </ul>
        </div>
      </div>

      {/* Drag overlay shows the meal being dragged */}
      <DragOverlay>
        {activeMeal ? <MealCard meal={activeMeal} isDragging={true} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

/**
 * App root with context provider
 */
function App() {
  return (
    <MealPlanProvider>
      <MealPlannerContent />
    </MealPlanProvider>
  );
}

export default App;
