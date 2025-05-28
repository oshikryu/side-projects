import { shiftPreference } from "@/db/schema";
import { DrizzleDBService, type SelectShiftPreference } from "@/db/types";
import type { ProfileShifts } from "@interview-main/shared-types";
import { asc } from "drizzle-orm";
import * as Effect from "effect/Effect";
import { DBError } from "./errors";

export const queryAllPreferencesEffect = Effect.fn("queryAllPreferences")(
  function* () {
    const db = yield* DrizzleDBService;

    const shiftPreferences = yield* Effect.tryPromise<
      SelectShiftPreference[],
      DBError
    >({
      try: () =>
        db.query.shiftPreference.findMany({
          orderBy: [asc(shiftPreference.createdAt)],
        }),
      catch: (error) =>
        new DBError({
          cause: error,
          operation: "findMany",
          message:
            "An error occurred while querying shift preferences. Please try again or tell if the issue persists.",
        }),
    });

    return shiftPreferences.reduce(
      (acc, sp) => {
        acc[sp.profileId] = acc[sp.profileId] || {};

        acc[sp.profileId][sp.date] = {
          id: sp.id,
          profileId: sp.profileId,
          date: sp.date,
        };

        return acc;
      },
      {} as Record<string, ProfileShifts>,
    );
  },
);

export const createPreferenceEffect = Effect.fn("createPreferenceEffect")(
  function* (input: { profileId: string; date: string }) {
    const db = yield* DrizzleDBService;

    yield* Effect.tryPromise({
      try: () =>
        db.insert(shiftPreference).values({
          profileId: input.profileId,
          date: input.date,
        }),
      catch: (error) =>
        new DBError({
          cause: error,
          operation: "insert",
          message:
            "An error occurred while creating shift preference. Please try again or tell if the issue persists.",
        }),
    });
  },
);
