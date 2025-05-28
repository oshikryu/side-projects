import { Context } from "effect/index";
import type { db } from ".";
import type { profile, shiftPreference } from "./schema";

// Profiles
export type InsertProfile = typeof profile.$inferInsert;
export type SelectProfile = typeof profile.$inferSelect;

// Preferences
export type InsertShiftPreference = typeof shiftPreference.$inferInsert;
export type SelectShiftPreference = typeof shiftPreference.$inferSelect;

// Effect DrizzleDBService
export type DrizzleDB = typeof db;
export class DrizzleDBService extends Context.Tag("DrizzleDBService")<
  DrizzleDBService,
  DrizzleDB
>() {}
