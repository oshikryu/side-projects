import { sql } from "drizzle-orm";
import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
};

export const profile = pgTable("profile", {
  id: uuid().defaultRandom().primaryKey(),
  fullName: text().notNull(),
  ...timestamps,
});

export const shiftPreference = pgTable("shift_preference", {
  id: uuid().defaultRandom().primaryKey(),
  profileId: uuid()
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
  date: date().notNull(),
  ...timestamps,
});
