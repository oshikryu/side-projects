import { useState, useReducer, useCallback, useRef, useMemo, useEffect, Reducer } from 'react';

// ============================================
// TYPE DEFINITIONS
// ============================================
export type Priority = 'low' | 'medium' | 'high';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface KanbanState {
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  columnOrder: string[];
  history: KanbanState[];
  historyIndex: number;
}

export interface FocusedCard {
  cardId: string;
  columnId: string;
}

type KanbanAction =
  | { type: 'MOVE_CARD'; payload: { cardId: string; fromColumnId: string; toColumnId: string; toPosition: number } }
  | { type: 'ADD_CARD'; payload: { columnId: string; card: Card } }
  | { type: 'DELETE_CARD'; payload: { cardId: string; columnId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' };

// ============================================
// KANBAN REDUCER
// ============================================
const kanbanReducer: Reducer<KanbanState, KanbanAction> = (state, action) => {
  switch (action.type) {
    case 'MOVE_CARD': {
      const { cardId, fromColumnId, toColumnId, toPosition } = action.payload;

      // Save current state to history before making changes
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(state);

      // Create new state
      const newColumns = { ...state.columns };

      // Remove card from source column
      const fromColumn = { ...newColumns[fromColumnId] };
      fromColumn.cardIds = fromColumn.cardIds.filter(id => id !== cardId);
      newColumns[fromColumnId] = fromColumn;

      // Add card to destination column at specific position
      const toColumn = { ...newColumns[toColumnId] };
      toColumn.cardIds = [...toColumn.cardIds];
      toColumn.cardIds.splice(toPosition, 0, cardId);
      newColumns[toColumnId] = toColumn;

      return {
        ...state,
        columns: newColumns,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    }

    case 'ADD_CARD': {
      const { columnId, card } = action.payload;

      // Save to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(state);

      // Add card to cards object
      const newCards = {
        ...state.cards,
        [card.id]: card
      };

      // Add card ID to column
      const newColumns = { ...state.columns };
      const column = { ...newColumns[columnId] };
      column.cardIds = [...column.cardIds, card.id];
      newColumns[columnId] = column;

      return {
        ...state,
        cards: newCards,
        columns: newColumns,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    }

    case 'DELETE_CARD': {
      const { cardId, columnId } = action.payload;

      // Save to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(state);

      // Remove from cards object
      const newCards = { ...state.cards };
      delete newCards[cardId];

      // Remove from column
      const newColumns = { ...state.columns };
      const column = { ...newColumns[columnId] };
      column.cardIds = column.cardIds.filter(id => id !== cardId);
      newColumns[columnId] = column;

      return {
        ...state,
        cards: newCards,
        columns: newColumns,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    }

    case 'UNDO': {
      if (state.historyIndex < 0) return state;

      // Go back one step in history
      return {
        ...state.history[state.historyIndex],
        history: state.history,
        historyIndex: state.historyIndex - 1
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;

      // Go forward one step in history
      const nextIndex = state.historyIndex + 1;
      return {
        ...state.history[nextIndex],
        history: state.history,
        historyIndex: nextIndex
      };
    }

    default:
      return state;
  }
};

// ============================================
// DRAG AND DROP HOOK
// ============================================
interface DraggedItem {
  card: Card;
  sourceColumnId: string;
}

function useDragAndDrop(dispatch: React.Dispatch<KanbanAction>) {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<number | null>(null);

  const handleDragStart = useCallback((card: Card, sourceColumnId: string) => {
    setDraggedItem({ card, sourceColumnId });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setDragOverColumn(columnId);

    // Calculate position within column
    const columnElement = e.currentTarget;
    const cards = Array.from(columnElement.querySelectorAll('[data-card-id]'));

    let insertPosition = cards.length;

    for (let i = 0; i < cards.length; i++) {
      const cardElement = cards[i];
      const rect = cardElement.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      if (e.clientY < midpoint) {
        insertPosition = i;
        break;
      }
    }

    setDragOverPosition(insertPosition);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    const { card, sourceColumnId } = draggedItem;

    if (sourceColumnId === targetColumnId && dragOverPosition === null) {
      setDraggedItem(null);
      setDragOverColumn(null);
      setDragOverPosition(null);
      return;
    }

    dispatch({
      type: 'MOVE_CARD',
      payload: {
        cardId: card.id,
        fromColumnId: sourceColumnId,
        toColumnId: targetColumnId,
        toPosition: dragOverPosition ?? 0
      }
    });

    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverPosition(null);
  }, [draggedItem, dragOverPosition, dispatch]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverPosition(null);
  }, []);

  return {
    draggedItem,
    dragOverColumn,
    dragOverPosition,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}

// ============================================
// KEYBOARD NAVIGATION HOOK
// ============================================
function useKeyboardNavigation(state: KanbanState, dispatch: React.Dispatch<KanbanAction>) {
  const [focusedCard, setFocusedCard] = useState<FocusedCard | null>(null);
  const [selectedCard, setSelectedCard] = useState<FocusedCard | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!focusedCard) return;

    const { cardId, columnId } = focusedCard;
    const column = state.columns[columnId];
    const currentIndex = column.cardIds.indexOf(cardId);
    const columnIndex = state.columnOrder.indexOf(columnId);

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (e.shiftKey && selectedCard) {
          if (currentIndex > 0) {
            dispatch({
              type: 'MOVE_CARD',
              payload: {
                cardId,
                fromColumnId: columnId,
                toColumnId: columnId,
                toPosition: currentIndex - 1
              }
            });
          }
        } else {
          if (currentIndex > 0) {
            const prevCardId = column.cardIds[currentIndex - 1];
            setFocusedCard({ cardId: prevCardId, columnId });
          }
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (e.shiftKey && selectedCard) {
          if (currentIndex < column.cardIds.length - 1) {
            dispatch({
              type: 'MOVE_CARD',
              payload: {
                cardId,
                fromColumnId: columnId,
                toColumnId: columnId,
                toPosition: currentIndex + 2
              }
            });
          }
        } else {
          if (currentIndex < column.cardIds.length - 1) {
            const nextCardId = column.cardIds[currentIndex + 1];
            setFocusedCard({ cardId: nextCardId, columnId });
          }
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (e.shiftKey && selectedCard) {
          if (columnIndex > 0) {
            const targetColumnId = state.columnOrder[columnIndex - 1];
            dispatch({
              type: 'MOVE_CARD',
              payload: {
                cardId,
                fromColumnId: columnId,
                toColumnId: targetColumnId,
                toPosition: 0
              }
            });
            setFocusedCard({ cardId, columnId: targetColumnId });
          }
        } else {
          if (columnIndex > 0) {
            const targetColumnId = state.columnOrder[columnIndex - 1];
            const targetColumn = state.columns[targetColumnId];
            const targetIndex = Math.min(currentIndex, targetColumn.cardIds.length - 1);
            if (targetIndex >= 0) {
              const targetCardId = targetColumn.cardIds[targetIndex];
              setFocusedCard({ cardId: targetCardId, columnId: targetColumnId });
            }
          }
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (e.shiftKey && selectedCard) {
          if (columnIndex < state.columnOrder.length - 1) {
            const targetColumnId = state.columnOrder[columnIndex + 1];
            dispatch({
              type: 'MOVE_CARD',
              payload: {
                cardId,
                fromColumnId: columnId,
                toColumnId: targetColumnId,
                toPosition: 0
              }
            });
            setFocusedCard({ cardId, columnId: targetColumnId });
          }
        } else {
          if (columnIndex < state.columnOrder.length - 1) {
            const targetColumnId = state.columnOrder[columnIndex + 1];
            const targetColumn = state.columns[targetColumnId];
            const targetIndex = Math.min(currentIndex, targetColumn.cardIds.length - 1);
            if (targetIndex >= 0) {
              const targetCardId = targetColumn.cardIds[targetIndex];
              setFocusedCard({ cardId: targetCardId, columnId: targetColumnId });
            }
          }
        }
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (selectedCard?.cardId === cardId) {
          setSelectedCard(null);
        } else {
          setSelectedCard({ cardId, columnId });
        }
        break;

      case 'Escape':
        e.preventDefault();
        setSelectedCard(null);
        break;

      case 'Delete':
      case 'Backspace':
        if (selectedCard?.cardId === cardId) {
          e.preventDefault();
          if (window.confirm('Delete this card?')) {
            dispatch({
              type: 'DELETE_CARD',
              payload: { cardId, columnId }
            });
            setSelectedCard(null);
            setFocusedCard(null);
          }
        }
        break;

      default:
        break;
    }
  }, [focusedCard, selectedCard, state, dispatch]);

  useEffect(() => {
    if (!focusedCard && state.columnOrder.length > 0) {
      const firstColumnId = state.columnOrder[0];
      const firstColumn = state.columns[firstColumnId];
      if (firstColumn.cardIds.length > 0) {
        setFocusedCard({
          cardId: firstColumn.cardIds[0],
          columnId: firstColumnId
        });
      }
    }
  }, [focusedCard, state]);

  return {
    focusedCard,
    selectedCard,
    setFocusedCard,
    handleKeyDown
  };
}

// ============================================
// OPTIMISTIC UPDATES HOOK
// ============================================
interface PendingUpdate {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  position: number;
}

function useOptimisticUpdates(dispatch: React.Dispatch<KanbanAction>) {
  const pendingUpdates = useRef(new Map<string, PendingUpdate>());
  const [error, setError] = useState<string | null>(null);

  const apiMoveCard = useCallback(async (cardId: string, fromColumnId: string, toColumnId: string, position: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error('Server error: Failed to move card');
    }

    return { success: true };
  }, []);

  const optimisticMove = useCallback(async (cardId: string, fromColumnId: string, toColumnId: string, position: number) => {
    const updateId = `${cardId}-${Date.now()}`;
    const rollbackData = { cardId, fromColumnId, toColumnId, position };
    pendingUpdates.current.set(updateId, rollbackData);

    dispatch({
      type: 'MOVE_CARD',
      payload: {
        cardId,
        fromColumnId,
        toColumnId,
        toPosition: position
      }
    });

    try {
      await apiMoveCard(cardId, fromColumnId, toColumnId, position);
      pendingUpdates.current.delete(updateId);
      setError(null);
    } catch (err) {
      console.error('API call failed, rolling back:', err);

      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardId,
          fromColumnId: toColumnId,
          toColumnId: fromColumnId,
          toPosition: 0
        }
      });

      pendingUpdates.current.delete(updateId);
      setError(`Failed to move card: ${err.message}`);
      setTimeout(() => setError(null), 5000);
    }
  }, [dispatch, apiMoveCard]);

  const isPending = useCallback((cardId: string) => {
    for (const [, data] of pendingUpdates.current) {
      if (data.cardId === cardId) return true;
    }
    return false;
  }, []);

  return {
    optimisticMove,
    isPending,
    error,
    setError
  };
}

// ============================================
// MAIN KANBAN HOOK
// ============================================
export interface ColumnWithCards {
  column: Column;
  cards: Card[];
  columnId: string;
}

export function useKanbanBoard(initialState: KanbanState) {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);
  const [addingCardToColumn, setAddingCardToColumn] = useState<string | null>(null);

  // Initialize custom hooks
  const { optimisticMove, isPending, error, setError } = useOptimisticUpdates(dispatch);

  const {
    draggedItem,
    dragOverColumn,
    dragOverPosition,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop(dispatch);

  const {
    focusedCard,
    selectedCard,
    setFocusedCard,
    handleKeyDown
  } = useKeyboardNavigation(state, dispatch);

  // Setup keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle drop with optimistic updates
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem) return;

    const { card, sourceColumnId } = draggedItem;
    handleDragEnd();

    optimisticMove(
      card.id,
      sourceColumnId,
      targetColumnId,
      dragOverPosition ?? 0
    );
  }, [draggedItem, dragOverPosition, handleDragEnd, optimisticMove]);

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  // Card addition handlers
  const handleShowAddCard = useCallback((columnId: string) => {
    setAddingCardToColumn(columnId);
  }, []);

  const handleCancelAddCard = useCallback(() => {
    setAddingCardToColumn(null);
  }, []);

  const handleSubmitNewCard = useCallback((columnId: string, cardData: Card) => {
    dispatch({
      type: 'ADD_CARD',
      payload: { columnId, card: cardData }
    });
    setAddingCardToColumn(null);
    setFocusedCard({ cardId: cardData.id, columnId });
  }, [setFocusedCard]);

  // Card deletion handler
  const handleDeleteCard = useCallback((columnId: string, cardId: string) => {
    dispatch({
      type: 'DELETE_CARD',
      payload: { cardId, columnId }
    });
  }, []);

  // Card click handler
  const handleCardClick = useCallback((columnId: string, cardId: string) => {
    setFocusedCard({ cardId, columnId });
  }, [setFocusedCard]);

  // Create drag start handler for a specific column
  const createCardDragStartHandler = useCallback((columnId: string) => {
    return (card: Card) => handleDragStart(card, columnId);
  }, [handleDragStart]);

  // Compute columns with cards
  const columns = useMemo<ColumnWithCards[]>(() => {
    return state.columnOrder.map(columnId => {
      const column = state.columns[columnId];
      const cards = column.cardIds.map(cardId => state.cards[cardId]);

      return {
        column,
        cards,
        columnId
      };
    });
  }, [state.columns, state.cards, state.columnOrder]);

  return {
    // State
    state,
    columns,
    addingCardToColumn,

    // Drag and drop
    dragOverColumn,
    handleDragOver,
    handleDrop,
    createCardDragStartHandler,

    // Keyboard navigation
    focusedCard,
    selectedCard,
    handleCardClick,

    // Card operations
    isPending,
    handleShowAddCard,
    handleSubmitNewCard,
    handleCancelAddCard,
    handleDeleteCard,

    // History
    handleUndo,
    handleRedo,
    canUndo: state.historyIndex >= 0,
    canRedo: state.historyIndex < state.history.length - 1,

    // Error handling
    error,
    setError
  };
}
