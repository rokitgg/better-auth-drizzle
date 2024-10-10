import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "@/lib/db/schema";
import { sqliteTable } from "drizzle-orm/sqlite-core";

/**
 * Defines the schema for the "sessions" table in the database.
 * @module db/schema/session
 * @description A session represents a user's login session.
 */

const sessions = sqliteTable("session", (t) => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull(),
  expiresAt: t.text().notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
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
