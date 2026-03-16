"use client"

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export function Navbar({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-rose-100/60">
      <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-rose-400" />
          <span className="text-sm font-bold text-stone-700 tracking-tight">
            Therapist
          </span>
        </div>

        {/* Profile button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-stone-200 hover:border-rose-200 hover:bg-rose-50 transition-all duration-150"
          >
            <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <span className="text-sm font-medium text-stone-600 max-w-[80px] truncate hidden sm:block">
              {userName ?? "Profil"}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-100/50 overflow-hidden">
              {/* Profile info */}
              <div className="px-4 py-3 border-b border-stone-100">
                <p className="text-xs text-stone-400 font-medium uppercase tracking-widest mb-0.5">
                  Logged in as
                </p>
                <p className="text-sm font-semibold text-stone-700 truncate">
                  {userName ?? "—"}
                </p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <DropdownLink href="/settings" icon={<Settings className="h-4 w-4" />} onClick={() => setOpen(false)}>
                  Pengaturan
                </DropdownLink>

                {/* Dark mode toggle */}
                <button
                  onClick={() => setDarkMode((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-colors duration-150"
                >
                  <span className="flex items-center gap-3">
                    {darkMode
                      ? <Moon className="h-4 w-4 text-stone-400" />
                      : <Sun className="h-4 w-4 text-stone-400" />
                    }
                    <span className="font-medium">
                      {darkMode ? "Dark Mode" : "Light Mode"}
                    </span>
                  </span>
                  <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${darkMode ? "bg-rose-400" : "bg-stone-200"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>
              </div>

              <div className="p-1.5 border-t border-stone-100">
                <Link
                  href="/api/auth/signout"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-50 transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

function DropdownLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors duration-150"
    >
      <span className="text-stone-400">{icon}</span>
      {children}
    </Link>
  );
}