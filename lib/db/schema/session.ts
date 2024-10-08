import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "@/lib/db/schema";

/**
 * Defines the schema for the "sessions" table in the database.
 * @module db/schema/session
 * @description A session represents a user's login session.
 */

const sessions = pgTable("session", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  expiresAt: t.timestamp().notNull(),
  ipAddress: t.text().notNull(),
  userAgent: t.text().notNull(),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(user, {
    fields: [sessions.userId],
    references: [user.id],
    relationName: "session-belongs-to-user",
  }),
}));

export type Session = typeof sessions.$inferSelect;

// Schema for inserting a user - can be used to validate API requests
export const insertSessionSchema = createInsertSchema(sessions);
// Schema for selecting a user - can be used to validate API responses
export const selectSessionSchema = createSelectSchema(sessions);

export default sessions;
