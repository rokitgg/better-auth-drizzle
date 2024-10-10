import { relations } from "drizzle-orm";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { user } from "@/lib/db/schema";

/**
 * Defines the schema for the "accounts" table in the database.
 * @module db/schema/account
 * @description [...]
 */

const accounts = sqliteTable("account", (t) => ({
  id: t.text().primaryKey(),
  userId: t.text().notNull(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  accessToken: t.text(),
  refreshToken: t.text(),
  expiresAt: t.text(),
  password: t.text(),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  // addresses: many(address),
  user: one(user, {
    fields: [accounts.userId],
    references: [user.id],
    relationName: "account-belongs-to-user",
  }),
}));

export type Account = typeof accounts.$inferSelect;

// Schema for inserting a user - can be used to validate API requests
export const insertAccountSchema = createInsertSchema(accounts);
// Schema for selecting a user - can be used to validate API responses
export const selectAccountSchema = createSelectSchema(accounts);

export default accounts;
