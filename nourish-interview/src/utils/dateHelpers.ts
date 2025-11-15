import { startOfWeek, addDays, format } from 'date-fns';

/**
 * Get the start of the current week (Sunday)
 */
export function getCurrentWeekStart(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 0 });
}

/**
 * Get an array of dates for the current week
 */
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

/**
 * Get day name from day index (0-6)
 */
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

/**
 * Format date for display
 */
export function formatDate(date: Date, formatStr: string = 'MMM d'): string {
  return format(date, formatStr);
}
