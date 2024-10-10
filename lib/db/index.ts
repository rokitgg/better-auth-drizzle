import { env } from "@/env";

import * as schema from "@/lib/db/schema";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Main config for the database connection.
 */

const globalForDb = globalThis as unknown as {
  connection: postgres.Sql | undefined;
};

/**
 * Caches the database connection in development.
 * This avoids creating a new connection on every HMR update.
 */

export const connection =
  globalForDb.connection ??
  postgres("postgresql://postgres:eMNRWlYLncsyNqB5@localhost:5432/local", {
    max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
    onnotice: env.DB_SEEDING
      ? () => {
          // No operation needed during seeding
        }
      : undefined,
  });

if (env.NODE_ENV !== "production") globalForDb.connection = connection;

export const db = drizzle(connection, {
  schema,
  logger: true,
  casing: "camelCase",
});

export type db = typeof db;

export default db;
