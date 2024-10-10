import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { account, session } from "@/lib/db/schema";
import { id } from "@/lib/db/utils";

/**
 * Defines the schema for the "users" table in the database.
 * @module db/schema/user
 * @description A user represents an entity who can sign in to the application.
 */

const users = pgTable("user", (t) => ({
  id: id(),
  name: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 255 }).notNull(),
  emailVerified: t.boolean().default(false),
  image: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
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
