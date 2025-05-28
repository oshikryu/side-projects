import { relations } from "drizzle-orm/relations";
import { profile, shiftPreference } from "./schema";

export const shiftPreferenceRelations = relations(
  shiftPreference,
  ({ one }) => ({
    profile: one(profile, {
      fields: [shiftPreference.profileId],
      references: [profile.id],
    }),
  }),
);

export const profileRelations = relations(profile, ({ many }) => ({
  shiftPreferences: many(shiftPreference),
}));
