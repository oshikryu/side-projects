import { DrizzleDBService } from "@/db/types";
import { TRPCError } from "@trpc/server";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import { Schedule } from "effect/index";
import { z } from "zod";
import { DBError } from "../effects/errors";
import {
  createPreferenceEffect,
  queryAllPreferencesEffect,
} from "../effects/shift-preference-effects";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const shiftPreferenceRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ profileId: z.string(), date: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return pipe(
        Effect.retry(createPreferenceEffect(input), {
          schedule: Schedule.exponential(100), // Start with 100ms delay
          times: 3, // Retry up to 3 times
          while: (e) => e._tag === "DBError", // Only retry if it's a DB error
        }),
        Effect.provideService(DrizzleDBService, ctx.db),
        Effect.catchTags({
          DBError: (e: DBError) =>
            Effect.fail(
              new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message,
                cause: e.cause,
              }),
            ),
        }),
        Effect.runPromise,
      );
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return pipe(
      Effect.retry(queryAllPreferencesEffect(), {
        schedule: Schedule.exponential(100), // Start with 100ms delay
        times: 3, // Retry up to 3 times
        while: (e) => e._tag === "DBError", // Only retry if it's a DB error
      }),
      Effect.provideService(DrizzleDBService, ctx.db),
      Effect.catchTags({
        DBError: (e: DBError) =>
          Effect.fail(
            new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: e.message,
              cause: e.cause,
            }),
          ),
      }),
      Effect.runPromise,
    );
  }),
});
