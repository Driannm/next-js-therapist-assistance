"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";

export function Navbar({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initial = userName?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full font-[family-name:var(--font-geist-sans)]">
        <div className="absolute inset-0 bg-[#183528]/80 backdrop-blur-md border-b border-white/10" />

        <div className="relative max-w-lg mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#F4F3ED]">
              <path d="M12 22C6 22 3 17 3 12C3 7 7 3 13 3C19 3 21 7 21 11C21 15.5 17.5 19 13 19C11 19 9.5 18 9.5 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M9.5 18C9.5 18 10 14 13 12C16 10 21 11 21 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span className="text-sm font-bold text-[#F4F3ED] tracking-tight">Therapist</span>
          </div>

          {/* Profile button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition-all duration-150"
            >
              <div className="w-7 h-7 rounded-full bg-[#F4F3ED] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-black text-[#1D4130]">{initial}</span>
              </div>
              <span className="text-sm font-semibold text-[#F4F3ED]/90 max-w-[80px] truncate hidden sm:block">
                {userName ?? "Profil"}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-[#F4F3ED]/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-[#F4F3ED] rounded-2xl border border-white/50 shadow-2xl shadow-black/30 overflow-hidden">
                {/* Profile header */}
                <div className="px-4 py-3.5 border-b border-gray-200/70">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-black text-[#F4F3ED]">{initial}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{userName ?? "—"}</p>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Therapist</p>
                    </div>
                  </div>
                </div>

                {/* Menu */}
                <div className="p-1.5 space-y-0.5">
                <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-white transition-colors duration-150"
                  >
                    <HugeiconsIcon icon={UserCircleIcon} size={16} className="text-gray-400" strokeWidth={2} />
                    Profil Saya
                  </Link>
              </div>

                {/* Logout */}
                <div className="p-1.5 border-t border-gray-200/70">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors duration-150"
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={16} className="text-red-400" strokeWidth={2} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Logout Confirmation Modal ─────────────────────────────── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative w-full max-w-sm bg-[#F4F3ED] rounded-[2rem] p-6 shadow-2xl font-[family-name:var(--font-geist-sans)]">
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
              <HugeiconsIcon icon={Logout01Icon} size={24} className="text-red-500" strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="text-center mb-7">
              <h2 className="text-lg font-bold text-gray-900 mb-1.5">Yakin ingin keluar?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Kamu akan keluar dari akun{" "}
                <span className="font-semibold text-gray-700">{userName}</span>.
                {" "}Login lagi kapan saja.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full h-13 rounded-full bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white font-bold text-sm transition-all duration-150 shadow-md shadow-red-200 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Keluar...
                  </>
                ) : (
                  "Ya, Keluar"
                )}
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="w-full h-13 rounded-full bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-700 font-bold text-sm transition-all duration-150 border border-gray-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}