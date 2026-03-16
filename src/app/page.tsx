// src/app/page.tsx
import { db } from "@/db";
import { treatments, facialTypes, monthlyTargets, offDays } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { desc, gte, and, eq, sql } from "drizzle-orm";
import { DashboardClient } from "@/components/DashboardClient";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = Number(session.user.id);
  const now = new Date();

  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek  = new Date(now); startOfWeek.setDate(now.getDate() - 6); startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    todayTreatments,
    weekTreatments,
    monthTreatments,
    recentTreatments,
    allFacialTypes,
    topFacialToday,
    monthTarget,
    userOffDays,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` })
      .from(treatments)
      .where(and(eq(treatments.userId, userId), gte(treatments.date, startOfToday))),

    db.select({
        date: sql<string>`DATE(${treatments.date})`,
        count: sql<number>`count(*)::int`,
      })
      .from(treatments)
      .where(and(eq(treatments.userId, userId), gte(treatments.date, startOfWeek)))
      .groupBy(sql`DATE(${treatments.date})`)
      .orderBy(sql`DATE(${treatments.date})`),

    db.select({ count: sql<number>`count(*)::int` })
      .from(treatments)
      .where(and(eq(treatments.userId, userId), gte(treatments.date, startOfMonth))),

    db.select({
        id: treatments.id,
        customerName: treatments.customerName,
        customerType: treatments.customerType,
        orderNo: treatments.orderNo,
        date: treatments.date,
        facialTypeId: treatments.facialTypeId,
      })
      .from(treatments)
      .where(eq(treatments.userId, userId))
      .orderBy(desc(treatments.createdAt))
      .limit(5),

    db.select().from(facialTypes),

    db.select({
        facialTypeId: treatments.facialTypeId,
        count: sql<number>`count(*)::int`,
      })
      .from(treatments)
      .where(and(eq(treatments.userId, userId), gte(treatments.date, startOfToday)))
      .groupBy(treatments.facialTypeId)
      .orderBy(desc(sql`count(*)`))
      .limit(1),

    db.select()
      .from(monthlyTargets)
      .where(and(
        eq(monthlyTargets.userId, userId),
        eq(monthlyTargets.month, now.getMonth() + 1),
        eq(monthlyTargets.year, now.getFullYear())
      ))
      .limit(1),

    db.select({ dayOfWeek: offDays.dayOfWeek })
      .from(offDays)
      .where(eq(offDays.userId, userId)),
  ]);

  const facialMap = Object.fromEntries(allFacialTypes.map((f) => [f.id, f.name]));
  const offDaySet = new Set(userOffDays.map((d) => d.dayOfWeek));

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const found = weekTreatments.find((w) => w.date === key);
    return {
      date: key,
      count: found?.count ?? 0,
      label: d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }),
      isOffDay: offDaySet.has(d.getDay()),
    };
  });

  const recentWithNames = recentTreatments.map((t) => ({
    ...t,
    facialTypeName: facialMap[t.facialTypeId] ?? "—",
    date: t.date.toISOString(),
  }));

  const monthCount = monthTreatments[0]?.count ?? 0;

  return (
    <DashboardClient
      userName={session.user.name ?? ""}
      stats={{
        todayCount: todayTreatments[0]?.count ?? 0,
        monthCount,
        targetPatients: monthTarget[0]?.targetPatients ?? null,
        topFacialToday: topFacialToday[0]
          ? (facialMap[topFacialToday[0].facialTypeId] ?? "—")
          : "—",
        weekTotal: weekTreatments.reduce((s, w) => s + w.count, 0),
      }}
      chartData={chartData}
      recentTreatments={recentWithNames}
    />
  );
}