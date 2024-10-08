import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * This file is used to define the project's environment variables.
 * @constant env We use t3en'zod' to enforce a validation schema.
 * @throws {Error} - Throws an error if any required environment variables are missing.
 */

const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === "true";
  })
  .default("false");

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    POSTGRES_URL: z
      .string()
      .default(
        "postgresql://postgres:bB5IVa8V1sUCSloM@localhost:5432/local-postgres"
      ),
    DB_MIGRATING: stringBoolean,
    DB_SEEDING: stringBoolean,
  },
  client: {},
  runtimeEnv: {
    // 'development' | 'production'
    NODE_ENV: process.env.NODE_ENV,
    // drizzle-orm / database
    POSTGRES_URL: process.env.POSTGRES_URL,
    DB_MIGRATING: process.env.DB_MIGRATING,
    DB_SEEDING: process.env.DB_SEEDING,
  },
  skipValidation: true,
});
