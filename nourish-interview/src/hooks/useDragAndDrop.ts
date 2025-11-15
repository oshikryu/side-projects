import { useState } from 'react';
import {
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { Meal, MealType } from '@/types';

/**
 * Custom hook for handling drag and drop logic
 *
 * TODO: Implement the following:
 * 1. Set up DndContext with sensors (mouse, touch, keyboard)
 * 2. Handle drag start, drag over, and drag end events
 * 3. Parse droppable IDs to extract dayOfWeek and mealType
 * 4. Integrate with MealPlanContext to add meals
 *
 * Example droppable ID format: "slot-{dayOfWeek}-{mealType}"
 * Example draggable ID format: "meal-{mealId}"
 */

interface DroppableData {
  dayOfWeek: number;
  mealType: MealType;
}

/**
 * Parse droppable ID to extract day and meal type
 */
export function parseDroppableId(id: string): DroppableData | null {
  const match = id.match(/^slot-(\d+)-(breakfast|lunch|dinner)$/);
  if (!match) return null;

  return {
    dayOfWeek: parseInt(match[1], 10),
    mealType: match[2] as MealType,
  };
}

/**
 * Parse draggable ID to extract meal ID
 */
export function parseDraggableId(id: string): string | null {
  const match = id.match(/^meal-(.+)$/);
  return match ? match[1] : null;
}

/**
 * Handle drag end event
 * This is a utility function that can be used with the onDragEnd callback
 */
export function handleDragEnd(
  event: DragEndEvent,
  meals: Meal[],
  onAddMeal: (meal: Meal, dayOfWeek: number, mealType: MealType) => void
) {
  const { active, over } = event;

  if (!over) return;

  const mealId = parseDraggableId(active.id as string);
  const dropTarget = parseDroppableId(over.id as string);

  if (!mealId || !dropTarget) return;

  const meal = meals.find((m) => m.id === mealId);
  if (!meal) return;

  onAddMeal(meal, dropTarget.dayOfWeek, dropTarget.mealType);
}

/**
 * Main drag and drop hook
 * Manages sensors, drag state, and event handlers
 */
export function useDragAndDrop(
  meals: Meal[],
  onAddMeal: (meal: Meal, dayOfWeek: number, mealType: MealType) => void
) {
  const [activeMeal, setActiveMeal] = useState<Meal | null>(null);

  // Set up sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay for touch devices
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  /**
   * Handle drag start - track which meal is being dragged
   */
  function handleDragStart(event: DragStartEvent) {
    const mealId = parseDraggableId(event.active.id as string);
    if (!mealId) return;

    const meal = meals.find((m) => m.id === mealId);
    if (meal) {
      setActiveMeal(meal);
    }
  }

  /**
   * Handle drag end - add meal to the plan if dropped on valid slot
   */
  function handleDragEndEvent(event: DragEndEvent) {
    const { active, over } = event;

    setActiveMeal(null); // Clear active meal

    if (!over) return;

    const mealId = parseDraggableId(active.id as string);
    const dropTarget = parseDroppableId(over.id as string);

    if (!mealId || !dropTarget) return;

    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return;

    onAddMeal(meal, dropTarget.dayOfWeek, dropTarget.mealType);
  }

  return {
    sensors,
    activeMeal,
    handleDragStart,
    handleDragEnd: handleDragEndEvent,
  };
}
