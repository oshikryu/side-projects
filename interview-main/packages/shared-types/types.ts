export interface Profile {
  id: string;
  fullName: string;
}

export interface Shift {
  id?: string;
  profileId: string;
  date: string;
}

export type ProfileShifts = Record<string, Shift>; // Record<date, Shift>

export interface ScheduleRow {
  profileId: string;
  fullName: string;
  fairnessScore?: number;
  shifts: (Shift | null)[];
}
