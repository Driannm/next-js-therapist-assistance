// src/app/pengaturan/page.tsx
import { db } from "@/db";
import { monthlyTargets, offDays } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PengaturanClient } from "@/components/SettingClient";

export default async function PengaturanPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = Number(session.user.id);
  const now = new Date();

  const [currentTarget, currentOffDays] = await Promise.all([
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
      .select({ dayOfWeek: offDays.dayOfWeek })
      .from(offDays)
      .where(eq(offDays.userId, userId)),
  ]);

  // ── Server Actions ───────────────────────────────────────────

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

    // Upsert: update kalau sudah ada, insert kalau belum
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
      await db.insert(monthlyTargets).values({
        userId: uid,
        month,
        year,
        targetPatients: target,
      });
    }

    revalidatePath("/pengaturan");
    revalidatePath("/");
  }

  async function saveOffDays(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session) return;
    const uid = Number(session.user.id);

    // Ambil semua day values yang dicentang (0–6)
    const selected = formData.getAll("offDay").map(Number);

    // Delete semua off days user ini lalu insert yang baru
    await db.delete(offDays).where(eq(offDays.userId, uid));

    if (selected.length > 0) {
      await db.insert(offDays).values(
        selected.map((day) => ({ userId: uid, dayOfWeek: day }))
      );
    }

    revalidatePath("/pengaturan");
    revalidatePath("/");
  }

  return (
    <PengaturanClient
      currentTarget={currentTarget[0]?.targetPatients ?? null}
      currentOffDays={currentOffDays.map((d) => d.dayOfWeek)}
      monthLabel={now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
      saveTarget={saveTarget}
      saveOffDays={saveOffDays}
    />
  );
}