import { createAuthClient } from "better-auth/react";
import { passkeyClient, twoFactorClient } from "better-auth/client/plugins";
import { toast } from "@/hooks/use-toast";

export const client = createAuthClient({
  plugins: [
    twoFactorClient({
      twoFactorPage: "/two-factor",
    }),
    passkeyClient(),
  ],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast({
          title: "Error",
          description: "Too many requests. Please try again later.",
          variant: "destructive",
        });
      }
    },
  },
});

export const { signUp, signIn, signOut, useSession, user } = client;
