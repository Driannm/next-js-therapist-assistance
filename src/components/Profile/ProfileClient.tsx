"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Check } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserEdit01Icon,
  LockPasswordIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

type User = {
  id: number;
  name: string;
  username: string;
  createdAt: string;
};

export function ProfileClient({
  user,
  totalTreatments,
  updateProfile,
  updatePassword,
}: {
  user: User;
  totalTreatments: number;
  updateProfile: (formData: FormData) => Promise<{ error: string } | void>;
  updatePassword: (formData: FormData) => Promise<{ error: string } | void>;
}) {
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const passwordFormRef = useRef<HTMLFormElement>(null);

  const memberSince = new Date(user.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const passwordRules = [
    { label: "Minimal 8 karakter", valid: newPassword.length >= 8 },
    { label: "Mengandung huruf besar", valid: /[A-Z]/.test(newPassword) },
    { label: "Mengandung angka", valid: /[0-9]/.test(newPassword) },
  ];

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);
    const result = await updateProfile(new FormData(e.currentTarget));
    setSavingProfile(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profil berhasil diperbarui!");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingPassword(true);
    const result = await updatePassword(new FormData(e.currentTarget));
    setSavingPassword(false);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Password berhasil diubah!");
      passwordFormRef.current?.reset();
      setNewPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header + Avatar */}
        <div>
          <p className="text-[10px] text-[#F4F3ED]/60 font-bold uppercase tracking-[0.2em] mb-1">
            Profil
          </p>
          <h1 className="text-2xl font-bold text-[#F4F3ED]">Akun Saya</h1>
        </div>

        {/* Profile card */}
        <div className="bg-[#F4F3ED] rounded-[2rem] p-6 shadow-xl border border-white/50">
          <div className="flex items-center gap-4 mb-5">
            {/* Big avatar */}
            <div className="w-16 h-16 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl font-black text-[#F4F3ED]">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-500 font-medium">@{user.username}</p>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-widest">
                Member sejak {memberSince}
              </p>
            </div>
          </div>

          {/* Total treatment badge */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-[#1D4130]" strokeWidth={2} />
            <p className="text-sm text-gray-700">
              Total{" "}
              <span className="font-bold text-[#1D4130]">{totalTreatments}</span>
              {" "}treatment tercatat
            </p>
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-[#F4F3ED] rounded-[2rem] p-6 shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
              <HugeiconsIcon icon={UserEdit01Icon} size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Edit Profil</p>
              <p className="text-base font-bold text-gray-900">Nama & Username</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Nama Lengkap
              </label>
              <input
                name="name"
                type="text"
                defaultValue={user.name}
                required
                className="w-full h-13 rounded-full border-none shadow-sm bg-white px-5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4130] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold select-none">@</span>
                <input
                  name="username"
                  type="text"
                  defaultValue={user.username}
                  required
                  autoComplete="username"
                  className="w-full h-13 rounded-full border-none shadow-sm bg-white pl-9 pr-5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4130] transition-all"
                />
              </div>
            </div>

            <SaveButton loading={savingProfile} label="Simpan Perubahan" />
          </form>
        </div>

        {/* Change password */}
        <div className="bg-[#F4F3ED] rounded-[2rem] p-6 shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
              <HugeiconsIcon icon={LockPasswordIcon} size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Keamanan</p>
              <p className="text-base font-bold text-gray-900">Ganti Password</p>
            </div>
          </div>

          <form ref={passwordFormRef} onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-13 rounded-full border-none shadow-sm bg-white px-5 pr-12 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4130] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Password Baru
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-13 rounded-full border-none shadow-sm bg-white px-5 pr-12 text-sm font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4130] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password rules */}
              {newPassword.length > 0 && (
                <div className="mt-3 space-y-1.5 px-1">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        rule.valid ? "bg-[#1D4130]" : "bg-gray-200"
                      }`}>
                        {rule.valid && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-xs transition-colors duration-200 ${
                        rule.valid ? "text-[#1D4130] font-semibold" : "text-gray-400"
                      }`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <SaveButton loading={savingPassword} label="Ubah Password" />
          </form>
        </div>

      </div>
    </main>
  );
}

function SaveButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full h-13 rounded-full bg-[#1D4130] hover:bg-[#153023] active:scale-[0.98] text-[#F4F3ED] font-bold text-sm transition-all duration-150 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Menyimpan...
        </>
      ) : label}
    </button>
  );
}