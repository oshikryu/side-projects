import { profile } from "@/db/schema";
import { DrizzleDBService } from "@/db/types";
import type { Profile } from "@nikhil-interview/shared-types";
import { desc } from "drizzle-orm";
import * as Effect from "effect/Effect";
import { DBError } from "./errors";

export const queryAllProfilesEffect = Effect.fn("queryAllProfiles")(
  function* () {
    const db = yield* DrizzleDBService;

    const profiles = yield* Effect.tryPromise({
      try: () =>
        db.query.profile.findMany({
          orderBy: [desc(profile.fullName)],
        }),
      catch: (error) =>
        new DBError({
          cause: error,
          operation: "findMany",
          message:
            "An error occurred while querying profiles. Please try again or tell Nikhil if the issue persists.",
        }),
    });

    return profiles.reduce(
      (acc, profile) => {
        acc[profile.id] = {
          id: profile.id,
          fullName: profile.fullName,
        };

        return acc;
      },
      {} as Record<string, Profile>,
    );
  },
);
