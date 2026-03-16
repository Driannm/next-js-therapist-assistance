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
  { href: "/settings", label: "Pengaturan",icon: Setting07Icon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex items-center justify-center gap-3 px-5 pointer-events-none">

      {/* Pill group */}
      <nav className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/15 shadow-2xl">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full text-[10px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Floating + button */}
      <Link
        href="/form"
        className="pointer-events-auto w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl hover:bg-gray-100 active:scale-95 transition-all duration-150 flex-shrink-0"
      >
        <Plus className="h-6 w-6 text-[#183528]" strokeWidth={2.5} />
      </Link>

    </div>
  );
}