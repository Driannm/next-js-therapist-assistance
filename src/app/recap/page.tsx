import { db } from "@/db";
import { treatments, facialTypes } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { RecapClient } from "@/components/RecapClient";

export default async function RekapPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const userId = Number(session.user.id);

  // ✅ alias untuk next appointment (facial berikutnya)
  const nextFacial = alias(facialTypes, "next_facial");

  const data = await db
    .select({
      id: treatments.id,
      date: treatments.date,
      orderNo: treatments.orderNo,
      customerName: treatments.customerName,
      customerType: treatments.customerType,
      facialTypeName: facialTypes.name,
      nextAppointment: nextFacial.name, // ✅ FIX
    })
    .from(treatments)
    .leftJoin(facialTypes, eq(treatments.facialTypeId, facialTypes.id))
    .leftJoin(nextFacial, eq(treatments.nextAppointmentId, nextFacial.id)) // ✅ JOIN KEDUA
    .where(eq(treatments.userId, userId))
    .orderBy(desc(treatments.createdAt));

  // ✅ serialize date
  const serialized = data.map((row) => ({
    ...row,
    date: row.date.toISOString(),
    nextAppointment: row.nextAppointment ?? null,
  }));

  return <RecapClient initialData={serialized} />;
}