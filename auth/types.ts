import type { auth } from "@/auth/server";
import { type client } from "@/auth/client";

export type Session = typeof auth.$Infer.Session;

export type SocialProvider = Parameters<
  typeof client.signIn.social
>[0]["provider"];
