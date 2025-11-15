# Nourish - Senior Software Engineer Interview: Meal Planner Feature

## Company Context
Nourish is a dietician health tech company that connects patients with registered dietitians for personalized nutrition counseling and meal planning.

## Problem Statement
Build a **Weekly Meal Planner** component that allows dietitians to create and manage meal plans for their patients. The meal planner should support drag-and-drop functionality, nutritional tracking, and dietary restrictions.

## Requirements

### Core Features
1. **Weekly Calendar View**
   - Display 7 days with 3 meals per day (Breakfast, Lunch, Dinner)
   - Each meal slot can contain one or more food items
   - Show total calories per meal and per day

2. **Meal Library Sidebar**
   - Searchable list of pre-defined meals/recipes
   - Filter by dietary restrictions (vegetarian, vegan, gluten-free, dairy-free, low-carb)
   - Display nutritional info (calories, protein, carbs, fats) for each meal

3. **Drag & Drop**
   - Drag meals from the library into calendar slots
   - Reorder meals within the calendar
   - Remove meals from calendar

4. **Patient Profile Integration**
   - Display patient's daily calorie target
   - Highlight dietary restrictions
   - Show visual indicator when daily calories are within/outside target range (±200 calories)

### Technical Requirements
- **TypeScript**: Strict typing for all components, props, and state
- **React Hooks**: Use modern React patterns (no class components)
- **State Management**: Choose appropriate approach (Context API, Zustand, Redux, etc.)
- **Performance**: Optimize for re-renders when dragging/dropping
- **Accessibility**: Keyboard navigation support for drag-and-drop
- **Testing**: Write unit tests for critical business logic

## Getting Started

This project includes a complete React/TypeScript setup with:
- ✅ All type definitions (`src/types/`)
- ✅ Mock data and utilities (`src/data/`, `src/utils/`)
- ✅ Component structure and UI (`src/components/`)
- ✅ Context for state management (`src/context/`)
- ⚠️ TODO: Drag and drop implementation

### Setup Instructions

```bash
cd nourish-interview
npm install
npm run dev
```

Open http://localhost:5173 to see the application.

## Your Task

The basic UI and structure are complete. Your main tasks are:

### 1. Implement Drag and Drop (Primary Task)
- Use `@dnd-kit` library (already installed)
- See `src/hooks/useDragAndDrop.ts` for helper functions
- Make meals from the library draggable
- Make calendar slots droppable
- Update the meal plan when a meal is dropped

**Files to modify:**
- `src/hooks/useDragAndDrop.ts` - Complete the hook implementation
- `src/components/MealLibrary.tsx` - Add drag functionality to meals
- `src/components/MealSlot.tsx` - Add drop functionality to slots
- `src/App.tsx` - Wrap with DndContext

### 2. Add Keyboard Navigation (Accessibility)
- Allow keyboard users to navigate and add meals
- Implement keyboard controls for drag and drop
- Add proper ARIA labels

### 3. Performance Optimization
- Prevent unnecessary re-renders during drag operations
- Optimize meal filtering in the library
- Use React.memo where appropriate

### 4. Write Tests (Optional)
```bash
npm test
```

Test files to create:
- `src/utils/nutritionCalculations.test.ts`
- `src/hooks/useDragAndDrop.test.ts`
- `src/components/WeeklyCalendar.test.tsx`

## Part 2: Discussion Questions (15-20 minutes)

1. **Scalability**: How would you handle a meal library with 10,000+ meals? What optimizations would you implement?

2. **Real-time Collaboration**: If two dietitians are editing the same meal plan simultaneously, how would you handle conflicts and show live updates?

3. **Offline Support**: A dietitian needs to create meal plans in areas with poor connectivity. How would you implement offline functionality with sync?

4. **API Design**: Design the REST or GraphQL API endpoints needed to support this feature. What would the request/response formats look like?

5. **Testing Strategy**: What would your testing pyramid look like for this feature? What would you unit test vs integration test vs E2E test?

6. **Accessibility**: Beyond keyboard navigation, what other accessibility considerations are important for this feature?

7. **Performance Monitoring**: How would you instrument this feature to track performance in production? What metrics matter most?

## Bonus Challenges

- Add a "Copy Week" feature to duplicate a meal plan to another week
- Implement meal substitution suggestions when a patient reports not liking a meal
- Add a shopping list generator based on the week's meal plan
- Implement undo/redo functionality for meal plan changes

## Evaluation Criteria

- **Architecture**: Component structure, separation of concerns
- **TypeScript Usage**: Type safety, interfaces, generics where appropriate
- **Code Quality**: Readability, maintainability, following React best practices
- **State Management**: Efficient state updates, avoiding unnecessary re-renders
- **User Experience**: Smooth interactions, loading states, error handling
- **Communication**: Ability to explain technical decisions and trade-offs

## Resources

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [React Context API](https://react.dev/reference/react/useContext)
- [Vitest Testing](https://vitest.dev/)

Good luck! Feel free to ask clarifying questions.
