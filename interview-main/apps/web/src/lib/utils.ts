import { ProfileShifts } from "@nikhil-interview/shared-types";
import { clsx, type ClassValue } from "clsx";
import dayjs, { type Dayjs } from "dayjs";
import { toJS } from "mobx";
import { twMerge } from "tailwind-merge";
import { mobxPrint } from "../lib/utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mobxPrint<T>(mobxVar: T): void {
  console.log(toJS(mobxVar));
}

export const getDatesBetween = (startDate: Dayjs, endDate: Dayjs): Dayjs[] => {
  const dates = [];

  let currentDate = startDate;
  while (currentDate.isBefore(endDate.add(1, "day"))) {
    dates.push(currentDate);
    currentDate = currentDate.add(1, "day");
  }

  return dates;
};

export const addDaysToDate = (date: string, numDays: number) => {
  return dayjs(date).add(numDays, "days").format("YYYY-MM-DD");
};

export const calculateFairnessScore = (
  preferences: ProfileShifts,
  assignments: ProfileShifts,
) => {
  const userPrefs = Object.keys(preferences);
  const assignmentKeys = Object.keys(assignments)
  
  const filteredPrefs = userPrefs.filter((pref) => {
    return assignmentKeys.includes(pref)
  })
  return filteredPrefs.length / userPrefs.length * 100
};
