// src/app/settings/page.tsx
import { db } from "@/db";
import { monthlyTargets, offDates } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PengaturanClient } from "@/components/SettingClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = Number(session.user.id);
  const now = new Date();

  const [currentTarget, currentOffDatesList] = await Promise.all([
    db
      .select()
      .from(monthlyTargets)
      .where(
        and(
          eq(monthlyTargets.userId, userId),
          eq(monthlyTargets.month, now.getMonth() + 1),
          eq(monthlyTargets.year, now.getFullYear())
        )
      )
      .limit(1),

    db
      .select({ date: offDates.date })
      .from(offDates)
      .where(eq(offDates.userId, userId)),
  ]);

  async function saveTarget(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session) return;
    const uid = Number(session.user.id);
    const target = Number(formData.get("targetPatients"));
    if (!target || target < 1) return;

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const existing = await db
      .select()
      .from(monthlyTargets)
      .where(
        and(
          eq(monthlyTargets.userId, uid),
          eq(monthlyTargets.month, month),
          eq(monthlyTargets.year, year)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(monthlyTargets)
        .set({ targetPatients: target })
        .where(eq(monthlyTargets.id, existing[0].id));
    } else {
      await db.insert(monthlyTargets).values({ userId: uid, month, year, targetPatients: target });
    }

    revalidatePath("/settings");
    revalidatePath("/");
  }

  async function saveOffDays(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session) return;
    const uid = Number(session.user.id);

    // Array of "YYYY-MM-DD" strings
    const selected = formData.getAll("offDate").map(String).filter(Boolean);

    // Delete all existing, then insert new ones
    await db.delete(offDates).where(eq(offDates.userId, uid));

    if (selected.length > 0) {
      // Insert one by one to avoid unique constraint conflicts
      for (const dateStr of selected) {
        await db.insert(offDates).values({ userId: uid, date: dateStr });
      }
    }

    revalidatePath("/settings");
    revalidatePath("/");
  }

  return (
    <PengaturanClient
      currentTarget={currentTarget[0]?.targetPatients ?? null}
      currentOffDates={currentOffDatesList.map((d) => String(d.date))}
      monthLabel={now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
      saveTarget={saveTarget}
      saveOffDays={saveOffDays}
    />
  );
}