// src/app/profile/page.tsx
import { db } from "@/db";
import { users, treatments } from "@/db/schema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { ProfileClient } from "@/components/Profile/ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = Number(session.user.id);

  const [user, stats] = await Promise.all([
    db.select({ id: users.id, name: users.name, username: users.username, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1),

    db.select({ total: sql<number>`count(*)::int` })
      .from(treatments)
      .where(eq(treatments.userId, userId)),
  ]);

  if (!user[0]) redirect("/login");

  // ── Server Actions ───────────────────────────────────────────

  async function updateProfile(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };
    const uid = Number(session.user.id);

    const name = (formData.get("name") as string)?.trim();
    const username = (formData.get("username") as string)?.trim().toLowerCase();

    if (!name || !username) return { error: "Nama dan username wajib diisi." };

    // Check if username already taken by another user
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existing[0] && existing[0].id !== uid) {
      return { error: "Username sudah digunakan." };
    }

    await db.update(users).set({ name, username }).where(eq(users.id, uid));
    revalidatePath("/profile");
  }

  async function updatePassword(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Unauthorized" };
    const uid = Number(session.user.id);

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!currentPassword || !newPassword) return { error: "Semua field wajib diisi." };
    if (newPassword.length < 8) return { error: "Password baru minimal 8 karakter." };

    const [user] = await db.select().from(users).where(eq(users.id, uid)).limit(1);
    if (!user) return { error: "User tidak ditemukan." };

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return { error: "Password saat ini tidak sesuai." };

    const hashed = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ password: hashed }).where(eq(users.id, uid));
    revalidatePath("/profile");
  }

  return (
    <ProfileClient
      user={{
        id: user[0].id,
        name: user[0].name,
        username: user[0].username,
        createdAt: user[0].createdAt.toISOString(),
      }}
      totalTreatments={stats[0]?.total ?? 0}
      updateProfile={updateProfile}
      updatePassword={updatePassword}
    />
  );
}