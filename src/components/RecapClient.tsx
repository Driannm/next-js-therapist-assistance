"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  DashboardSquare01Icon,
  ListViewIcon,
  FilterIcon,
  ArrowLeft01Icon,
} from "hugeicons-react";

type TreatmentData = {
  id: number;
  date: Date | string;
  orderNo: string;
  customerName: string;
  customerType: string;
  facialTypeName: string | null;
  nextAppointment: string | null;
};

export function RecapClient({ initialData }: { initialData: TreatmentData[] }) {
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [filter, setFilter] = useState<"all" | "today" | "yesterday">("all");

  const filteredData = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    return initialData.filter((row) => {
      if (filter === "all") return true;
      const rowDate = new Date(row.date); rowDate.setHours(0, 0, 0, 0);
      if (filter === "today") return rowDate.getTime() === today.getTime();
      if (filter === "yesterday") return rowDate.getTime() === yesterday.getTime();
      return true;
    });
  }, [initialData, filter]);

  const filters = [
    { key: "all", label: "Semua" },
    { key: "today", label: "Hari Ini" },
    { key: "yesterday", label: "Kemarin" },
  ] as const;

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-[#F4F3ED]/60 font-bold uppercase tracking-[0.2em] mb-1">
              Rekap Data
            </p>
            <h1 className="text-2xl font-bold text-[#F4F3ED]">Daftar Treatment</h1>
            <p className="text-sm text-[#F4F3ED]/60 mt-1">
              {filteredData.length} treatment ditemukan
            </p>
          </div>
          <span className="text-xs font-semibold text-[#F4F3ED]/50 text-right pt-1 capitalize">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>

        {/* Filter + View toggle */}
        <div className="flex items-center justify-between gap-3">
          {/* Filter pills */}
          <div className="flex items-center gap-2">
            <FilterIcon size={16} className="text-[#F4F3ED]/50 flex-shrink-0" />
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 ${
                    filter === f.key
                      ? "bg-[#F4F3ED] text-[#1D4130]"
                      : "text-[#F4F3ED]/60 border border-[#F4F3ED]/20 hover:border-[#F4F3ED]/40"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex gap-0.5 bg-[#1D4130] p-1 rounded-full flex-shrink-0">
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-full transition-all duration-150 ${
                viewMode === "card" ? "bg-[#F4F3ED] text-[#1D4130]" : "text-[#F4F3ED]/60"
              }`}
            >
              <DashboardSquare01Icon size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-full transition-all duration-150 ${
                viewMode === "table" ? "bg-[#F4F3ED] text-[#1D4130]" : "text-[#F4F3ED]/60"
              }`}
            >
              <ListViewIcon size={16} />
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredData.length === 0 && (
          <div className="bg-[#F4F3ED] rounded-[2rem] px-6 py-14 text-center shadow-xl">
            <p className="text-3xl mb-3">🍃</p>
            <p className="text-sm font-bold text-gray-500">Belum ada data treatment</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter !== "all" ? "Coba ganti filter ke Semua Data" : "Tambahkan treatment pertama kamu"}
            </p>
          </div>
        )}

        {/* Card view */}
        {viewMode === "card" && filteredData.length > 0 && (
          <div className="space-y-3">
            {filteredData.map((row) => {
              const isZEP = row.customerType === "ZEP";
              const time = new Date(row.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
              const dateStr = new Date(row.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

              return (
                <div key={row.id} className="bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg border border-white/50">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-sm font-bold text-[#F4F3ED]">
                          {row.customerName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{row.customerName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{row.orderNo}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 border ${
                      isZEP ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]" : "bg-white text-[#1D4130] border-gray-200"
                    }`}>
                      {row.customerType}
                    </span>
                  </div>

                  <div className="h-px bg-gray-200 mb-3" />

                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                    <DataItem label="Tanggal" value={`${dateStr}, ${time}`} className="col-span-2" />
                    <DataItem label="Treatment" value={row.facialTypeName ?? "—"} />
                    <DataItem label="Next Treatment" value={row.nextAppointment ?? "—"} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table view */}
        {viewMode === "table" && filteredData.length > 0 && (
          <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Tanggal", "Order", "Nama", "Tipe", "Treatment", "Next"].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, i) => {
                    const isZEP = row.customerType === "ZEP";
                    return (
                      <tr key={row.id} className={`border-b border-gray-100 last:border-0 hover:bg-white/60 transition-colors ${i % 2 === 1 ? "bg-white/30" : ""}`}>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(row.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">#{row.orderNo}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{row.customerName}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-full border ${
                            isZEP ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]" : "bg-white text-[#1D4130] border-gray-200"
                          }`}>
                            {row.customerType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{row.facialTypeName ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{row.nextAppointment ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-[#F4F3ED]/60 hover:text-[#F4F3ED] transition-colors"
          >
            <ArrowLeft01Icon size={16} />
            Kembali ke Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}

function DataItem({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
    </div>
  );
}