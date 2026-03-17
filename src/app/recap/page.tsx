import { db } from "@/db";
import { treatments, facialTypes } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { desc, eq } from "drizzle-orm";
import { RecapClient } from "@/components/RecapClient";

export default async function RekapPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const userId = Number(session.user.id);

  const data = await db
    .select({
      id: treatments.id,
      date: treatments.date,
      orderNo: treatments.orderNo,
      customerName: treatments.customerName,
      customerType: treatments.customerType,
      facialTypeName: facialTypes.name,
      nextAppointment: facialTypes.name,
    })
    .from(treatments)
    .leftJoin(facialTypes, eq(treatments.facialTypeId, facialTypes.id))
    .where(eq(treatments.userId, userId))           // ← hanya data milik user ini
    .orderBy(desc(treatments.createdAt));

  // Serialize dates ke string supaya bisa di-pass ke Client Component
  const serialized = data.map((row) => ({
    ...row,
    date: row.date.toISOString(),
    nextAppointment: row.nextAppointment
      ? row.nextAppointment
      : null,
  }));

  return <RecapClient initialData={serialized} />;
}