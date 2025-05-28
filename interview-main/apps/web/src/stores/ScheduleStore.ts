import {
  type Profile,
  type ProfileShifts,
  type ScheduleRow,
  type Shift,
} from "@nikhil-interview/shared-types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { makeAutoObservable } from "mobx";
import { getDatesBetween, calculateFairnessScore, mobxPrint } from "../lib/utils";

dayjs.extend(duration);

class ScheduleStore {
  // These are mutable
  public profiles: Record<string, Profile> = {}; // Record<profileId, profile>
  public assignments: Record<string, ProfileShifts> = {}; // Record<profileId, Record<date, shift assignment>>
  public preferences: Record<string, ProfileShifts> = {}; // Record<profileId, Record<date, shift preference>>
  public startDate = "";
  public endDate = "";

  constructor() {
    makeAutoObservable(this);
  }

  setInitialData(data: {
    profiles: Record<string, Profile>;
    assignments: Record<string, ProfileShifts>;
    preferences: Record<string, ProfileShifts>;
    startDate: string;
    endDate: string;
  }) {
    this.profiles = data.profiles;
    this.assignments = data.assignments;
    this.preferences = data.preferences;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
  }

  // Modifying this.assignments will automatically recompute this!
  getScheduleRow(profileId: string): ScheduleRow | null {
    const profile = this.profiles[profileId];
    const preferences = this.preferences[profileId];
    const assignments = this.assignments[profileId];
    if (!profile || !preferences || !assignments) return null;

    const periodLength = dayjs(this.endDate).diff(this.startDate, "day") + 1;
    const shiftsArr: (Shift | null)[] = Array(periodLength).fill(null);

    Object.entries(assignments).forEach(([date, shift]) => {
      const shiftDate = dayjs(date);
      const shiftIdx = dayjs.duration(shiftDate.diff(this.startDate)).asDays();
      if (shiftIdx >= 0 && shiftIdx < periodLength) {
        shiftsArr[shiftIdx] = shift;
      }
    });

    return {
      profileId: profile.id,
      fullName: profile.fullName,
      fairnessScore: calculateFairnessScore(preferences, assignments), // TODO: implement this
      shifts: shiftsArr, // ex: [shift1, null, shift2, ...]
    };
  }

  addAssignment(profileId: string, shiftIdx: number): void {
    const dates = getDatesBetween(dayjs(this.startDate), dayjs(this.endDate));
    const dateKey = dates[shiftIdx]
    this.assignments[profileId][dateKey] = {
      profileId,
      date: dateKey,
    }
  }

  removeAssignment(profileId: string, shiftIdx: number, date: string): void {
    delete this.assignments[profileId][date]
  }
}

const scheduleStore = new ScheduleStore();
export default scheduleStore;
