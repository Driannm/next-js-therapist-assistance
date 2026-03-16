"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardSquare01Icon,
  File02Icon,
  Setting07Icon,
} from "hugeicons-react";
import { Plus } from "lucide-react";

const navItems = [
  { href: "/",           label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/recap",      label: "Rekap",     icon: File02Icon },
  { href: "/settings",   label: "Pengaturan",icon: Setting07Icon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex items-center justify-center gap-3 px-4 pointer-events-none">

      {/* Pill group - Solid Cream Color (Tidak Transparan) */}
      <nav className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-[#F4F3ED] border border-white/60 shadow-xl">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              // Transisi halus saat label muncul/hilang
              className={`flex items-center justify-center gap-1.5 rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
                active
                  ? "bg-[#1D4130] text-[#F4F3ED] px-4 py-2.5 shadow-md" // Aktif: Background Hijau Tua
                  : "text-gray-400 hover:text-gray-800 px-3 py-2.5"     // Inaktif: Teks abu-abu
              }`}
            >
              <Icon size={18} />
              
              {/* Teks hanya muncul di menu yang aktif (Bikin Navigasi Ramping!) */}
              {active && (
                <span className="text-[11px] font-bold tracking-wide whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Floating + button - Dikecilkan ukurannya (Sleek) dan Warna Dibalik */}
      <Link
        href="/form"
        className="pointer-events-auto w-12 h-12 rounded-full bg-[#1D4130] flex items-center justify-center shadow-xl border border-[#183528] hover:bg-[#153023] active:scale-95 transition-all duration-150 flex-shrink-0"
      >
        <Plus className="h-5 w-5 text-[#F4F3ED]" strokeWidth={2.5} />
      </Link>

    </div>
  );
}