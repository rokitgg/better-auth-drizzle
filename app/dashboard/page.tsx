import { auth } from "@/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserCard from "./user-card";

export default async function DashboardPage() {
  const [session, activeSessions] = await Promise.all([
    auth.api.getSession({
      headers: headers(),
    }),
    auth.api.listSessions({
      headers: headers(),
    }),
  ]).catch(() => {
    redirect("/sign-in");
  });
  return (
    <div className="w-full">
      <div className="flex gap-4 flex-col">
        <UserCard session={session} activeSessions={activeSessions} />
        {/* <OrganizationCard session={JSON.parse(JSON.stringify(session))} /> */}
      </div>
    </div>
  );
}
