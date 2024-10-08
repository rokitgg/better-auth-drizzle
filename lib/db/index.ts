import { env } from "@/env";

import * as schema from "@/lib/db/schema";

import { drizzle } from "drizzle-orm/connect";

/**
 * Main config for the database connection.
 */

export const db = await drizzle("node-postgres", {
  connection: {
    connectionString: env.POSTGRES_URL,
  },
  schema,
  logger: true,
  casing: "snake_case",
});

export type db = typeof db;

export default db;
