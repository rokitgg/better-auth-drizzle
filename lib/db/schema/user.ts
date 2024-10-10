import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { account, session } from "@/lib/db/schema";
import { sqliteTable } from "drizzle-orm/sqlite-core";

/**
 * Defines the schema for the "users" table in the database.
 * @module db/schema/user
 * @description A user represents an entity who can sign in to the application.
 */

const users = sqliteTable("user", (t) => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull(),
  emailVerified: t.integer(),
  image: t.text(),
  createdAt: t.text().notNull(),
  updatedAt: t.text().notNull(),
}));

export const userRelations = relations(users, ({ many }) => ({
  // addresses: many(address),
  // orders: many(order)
  // oauth: many(oauth),
  accounts: many(account),
  sessions: many(session),
}));

export type User = typeof users.$inferSelect;

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users);
// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users);

// Overriding the fields, for example the timestamps
export const createUserSchema = insertUserSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export default users;
