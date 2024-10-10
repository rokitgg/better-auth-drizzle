import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:eMNRWlYLncsyNqB5@localhost:5432/local",
  },
  verbose: true,
  strict: true,
});
