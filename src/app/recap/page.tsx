// src/app/rekap/page.tsx
import { db } from "@/db";
import { treatments, facialTypes } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { desc, eq, count, and, gte, lte, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { RecapClient } from "@/components/RecapClient";

const PER_PAGE = 10;

export default async function RekapPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; from?: string; to?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { page: pageParam, from, to } = await searchParams;

  const userId = Number(session.user.id);
  const page = Math.max(1, Number(pageParam) || 1);
  const offset = (page - 1) * PER_PAGE;

  const nextFacial = alias(facialTypes, "next_facial");

  // ── Build date filter ───────────────────────────────────────
  const dateConditions = [eq(treatments.userId, userId)];
  if (from) {
    dateConditions.push(
      gte(treatments.date, new Date(from + "T00:00:00+07:00"))
    );
  }
  if (to) {
    dateConditions.push(
      lte(treatments.date, new Date(to + "T23:59:59+07:00"))
    );
  }
  const whereClause = and(...dateConditions);

  // ── Parallel: data page + total count ──────────────────────
  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: treatments.id,
        date: treatments.date,
        orderNo: treatments.orderNo,
        customerName: treatments.customerName,
        customerType: treatments.customerType,
        facialTypeName: facialTypes.name,
        nextAppointment: nextFacial.name,
        therapistName: treatments.therapistName,
      })
      .from(treatments)
      .leftJoin(facialTypes, eq(treatments.facialTypeId, facialTypes.id))
      .leftJoin(nextFacial, eq(treatments.nextAppointmentId, nextFacial.id))
      .where(whereClause)
      .orderBy(desc(treatments.createdAt))
      .limit(PER_PAGE)
      .offset(offset),

    db
      .select({ count: count() })
      .from(treatments)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const serialized = data.map((row) => ({
    ...row,
    date: row.date instanceof Date
      ? row.date.toISOString()
      : new Date(row.date as string).toISOString(),
    nextAppointment: row.nextAppointment ?? null,
  }));

  return (
    <RecapClient
      initialData={serialized}
      currentPage={page}
      totalPages={totalPages}
      total={total}
      initialFrom={from ?? ""}
      initialTo={to ?? ""}
    />
  );
}