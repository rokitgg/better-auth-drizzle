import { char } from "drizzle-orm/pg-core";
import { user } from "@/lib/db/schema";

export const id = () => {
  return char({ length: 32 }).primaryKey();
};

export const referencesUserID = () => {
  return char({ length: 32 })
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    });
};
