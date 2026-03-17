// src/components/DashboardData.tsx
// Async server component — fetches all DB data, then renders DashboardClient

import { db } from "@/db";
import { treatments, facialTypes, monthlyTargets, offDates } from "@/db/schema";
import { desc, gte, and, eq, sql, lte } from "drizzle-orm";
import { DashboardClient } from "@/components/Dashboard/DashboardClient";

// Returns a proper UTC Date representing midnight WIB (UTC+7) for a given "YYYY-MM-DD"
function getStartOfLocalDay(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  // midnight WIB = 17:00 UTC previous day
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 7 * 60 * 60 * 1000);
}

export async function DashboardData({
  userId,
  todayStr,
  userName,
}: {
  userId: number;
  todayStr: string;
  userName: string;
}) {
  const startOfToday = getStartOfLocalDay(todayStr);
  const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const todayDate = new Date(todayStr + "T00:00:00");
  const dayOfWeek = todayDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const mondayStr = (() => {
    const d = new Date(todayStr + "T00:00:00");
    d.setDate(d.getDate() - daysToMonday);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  })();

  const startOfWeek = getStartOfLocalDay(mondayStr);

  const now = new Date();
  const startOfMonth = getStartOfLocalDay(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  );

  const [
    todayTreatments,
    weekTreatments,
    monthTreatments,
    recentTreatments,
    allFacialTypes,
    topFacialToday,
    monthTarget,
    userOffDates,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` })
      .from(treatments)
      .where(and(
        eq(treatments.userId, userId),
        gte(treatments.date, startOfToday),
        lte(treatments.date, startOfTomorrow),
      )),

    db.select({
        date: sql<string>`to_char(${treatments.date} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(treatments)
      .where(and(eq(treatments.userId, userId), gte(treatments.date, startOfWeek)))
      .groupBy(sql`to_char(${treatments.date} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${treatments.date} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`),

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
      .where(and(
        eq(treatments.userId, userId),
        gte(treatments.date, startOfToday),
        lte(treatments.date, startOfTomorrow),
      ))
      .groupBy(treatments.facialTypeId)
      .orderBy(desc(sql`count(*)`))
      .limit(1),

    db.select()
      .from(monthlyTargets)
      .where(and(
        eq(monthlyTargets.userId, userId),
        eq(monthlyTargets.month, now.getMonth() + 1),
        eq(monthlyTargets.year, now.getFullYear()),
      ))
      .limit(1),

    db.select({ date: offDates.date })
      .from(offDates)
      .where(eq(offDates.userId, userId)),
  ]);

  const facialMap = Object.fromEntries(allFacialTypes.map((f) => [f.id, f.name]));
  const offDateSet = new Set(userOffDates.map((d) => String(d.date)));

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayStr + "T00:00:00");
    d.setDate(d.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    const found = weekTreatments.find((w) => w.date === key);
    return {
      date: key,
      count: found?.count ?? 0,
      label: d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }),
      isOffDay: offDateSet.has(key),
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
      userName={userName}
      todayStr={todayStr}
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