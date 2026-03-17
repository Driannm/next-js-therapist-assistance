// src/app/page.tsx
import { db } from "@/db";
import { treatments, facialTypes, monthlyTargets, offDates } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { desc, gte, and, eq, sql, lte } from "drizzle-orm";
import { DashboardClient } from "@/components/DashboardClient";

// ── Timezone-safe "today" di WIB (UTC+7) ──────────────────────
// Server mungkin jalan di UTC, jadi kita hitung offset manual
function getLocalDateStr(date: Date, offsetHours = 7): string {
  const local = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
  return local.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getStartOfLocalDay(dateStr: string): Date {
  // dateStr = "YYYY-MM-DD", returns UTC Date that represents midnight WIB
  return new Date(dateStr + "T00:00:00+07:00");
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = Number(session.user.id);
  const now = new Date();

  // ── "Hari ini" dalam WIB ─────────────────────────────────────
  const todayStr = getLocalDateStr(now); // e.g. "2026-03-17"
  const startOfToday = getStartOfLocalDay(todayStr);
  const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  // ── Minggu ini: mulai dari Senin terdekat ke belakang ────────
  const todayDate = new Date(todayStr + "T00:00:00");
  const dayOfWeek = todayDate.getDay(); // 0=Sun,1=Mon,...,6=Sat
  // Selisih ke Senin: kalau hari ini Senin(1) = 0, Selasa(2) = 1, dst
  // Minggu(0) dianggap akhir minggu jadi = 6 hari setelah Senin sebelumnya
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const mondayStr = (() => {
    const d = new Date(todayStr + "T00:00:00");
    d.setDate(d.getDate() - daysToMonday);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD" of this week's Monday
  })();

  const startOfWeek = getStartOfLocalDay(mondayStr);

  // ── Bulan ini ────────────────────────────────────────────────
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
    // Today count — pakai range [startOfToday, startOfTomorrow)
    db.select({ count: sql<number>`count(*)::int` })
      .from(treatments)
      .where(and(
        eq(treatments.userId, userId),
        gte(treatments.date, startOfToday),
        lte(treatments.date, startOfTomorrow)
      )),

    // Week chart — dari Senin sampai sekarang
    db.select({
        // DATE() di postgres, tapi kita adjust timezone ke WIB dulu
        date: sql<string>`to_char(${treatments.date} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(treatments)
      .where(and(
        eq(treatments.userId, userId),
        gte(treatments.date, startOfWeek)
      ))
      .groupBy(sql`to_char(${treatments.date} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${treatments.date} AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD')`),

    // Month count
    db.select({ count: sql<number>`count(*)::int` })
      .from(treatments)
      .where(and(
        eq(treatments.userId, userId),
        gte(treatments.date, startOfMonth)
      )),

    // Recent 5
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

    // Top facial today
    db.select({
        facialTypeId: treatments.facialTypeId,
        count: sql<number>`count(*)::int`,
      })
      .from(treatments)
      .where(and(
        eq(treatments.userId, userId),
        gte(treatments.date, startOfToday),
        lte(treatments.date, startOfTomorrow)
      ))
      .groupBy(treatments.facialTypeId)
      .orderBy(desc(sql`count(*)`))
      .limit(1),

    // Monthly target
    db.select()
      .from(monthlyTargets)
      .where(and(
        eq(monthlyTargets.userId, userId),
        eq(monthlyTargets.month, now.getMonth() + 1),
        eq(monthlyTargets.year, now.getFullYear())
      ))
      .limit(1),

    // Off dates
    db.select({ date: offDates.date })
      .from(offDates)
      .where(eq(offDates.userId, userId)),
  ]);

  const facialMap = Object.fromEntries(allFacialTypes.map((f) => [f.id, f.name]));

  // Off date set (string "YYYY-MM-DD")
  const offDateSet = new Set(userOffDates.map((d) => String(d.date)));

  // ── Chart: Senin s/d Minggu minggu ini (7 hari) ──────────────
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayStr + "T00:00:00");
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
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
      userName={session.user.name ?? ""}
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