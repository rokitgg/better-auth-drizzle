/**
 * This index file is used to export all the schema files from our database.
 * You can import any schema easily using 'import { table } from '@/lib/db/schema'
 */

export { default as user, userRelations } from "@/lib/db/schema/user";
export { default as session, sessionRelations } from "@/lib/db/schema/session";
export { default as account, accountRelations } from "@/lib/db/schema/account";
