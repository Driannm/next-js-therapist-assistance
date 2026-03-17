// src/app/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardShell } from "@/components/Dashboard/DashboardShell";
import { DashboardData } from "@/components/Dashboard/DashboardData";
import { DashboardSkeleton } from "@/components/Dashboard/DashboardSkeleton";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userName = session.user.name ?? "";
  const userId = Number(session.user.id);

  // "today" timezone-safe (WIB UTC+7)
  const now = new Date();
  const local = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const todayStr = local.toISOString().split("T")[0];

  return (
    // Shell renders immediately — static structure, no loading
    <DashboardShell userName={userName} todayStr={todayStr}>
      <Suspense fallback={<DashboardSkeleton />}>
        {/* DashboardData is async — streams in when DB queries finish */}
        <DashboardData userId={userId} todayStr={todayStr} userName={userName} />
      </Suspense>
    </DashboardShell>
  );
}