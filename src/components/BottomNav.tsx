"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine, ClipboardList } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Input",
    icon: PenLine,
  },
  {
    href: "/recap",
    label: "Rekap",
    icon: ClipboardList,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-5 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-2 px-3 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-lg shadow-stone-200/60">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-rose-400 text-white shadow-md shadow-rose-200"
                  : "text-stone-400 hover:text-stone-600 hover:bg-stone-100/80"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}