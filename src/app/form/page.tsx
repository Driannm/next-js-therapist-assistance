// src/app/input/page.tsx
import { db } from "@/db";
import { treatments, facialTypes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq } from "drizzle-orm";
import { FormEntry } from "@/components/Form/FormEntry";

export default async function InputPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = Number(session.user.id);

  const [facials, existingOrders] = await Promise.all([
    db.select().from(facialTypes),
    db.select({ orderNo: treatments.orderNo })
      .from(treatments)
      .where(eq(treatments.userId, userId)),
  ]);

  const existingOrderNos = existingOrders.map((o) => o.orderNo);

  async function saveTreatment(formData: FormData) {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    const uid = Number(session.user.id);
    const nextIdRaw = formData.get("nextTreatmentId");
    const nextAppointmentId = nextIdRaw ? Number(nextIdRaw) : null;
    const dateRaw = formData.get("treatmentDate") as string | null;
    const date = dateRaw ? new Date(dateRaw) : new Date();

    await db.insert(treatments).values({
      userId: uid,
      customerName: formData.get("customerName") as string,
      facialTypeId: Number(formData.get("facialTypeId")),
      orderNo: formData.get("orderNo") as string,
      customerType: formData.get("customerType") as "External Client" | "ZEP",
      nextAppointmentId,
      therapistName: session.user.name ?? "Therapist",
      date,
    });

    revalidatePath("/");
    revalidatePath("/rekap");
  }

  return (
    <FormEntry
      action={saveTreatment}
      facials={facials}
      existingOrderNos={existingOrderNos}
    />
  );
}