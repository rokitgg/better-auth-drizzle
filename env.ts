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
    VERCEL_ENV: z.enum(["development", "production"]).default("development"),
    // database connection
    POSTGRES_URL: z.string(),
    DB_MIGRATING: stringBoolean,
    DB_SEEDING: stringBoolean,

    // github oauth
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),

    // better-auth
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    // 'development' | 'production'
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    // drizzle-orm / database
    POSTGRES_URL: process.env.POSTGRES_URL,
    DB_MIGRATING: process.env.DB_MIGRATING,
    DB_SEEDING: process.env.DB_SEEDING,

    // github oauth
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    // better-auth
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  },
});
