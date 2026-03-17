"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft01Icon,
  DashboardSquare01Icon,
  ListViewIcon,
  FilterIcon,
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return initialData.filter((row) => {
      if (filter === "all") return true;

      const rowDate = new Date(row.date);
      rowDate.setHours(0, 0, 0, 0);

      if (filter === "today") return rowDate.getTime() === today.getTime();
      if (filter === "yesterday") return rowDate.getTime() === yesterday.getTime();

      return true;
    });
  }, [initialData, filter]);

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F4F3ED]">
              Daftar Treatment
            </h1>
            <p className="text-sm text-[#F4F3ED]/70 mt-1">
              Menampilkan {filteredData.length} data
            </p>
          </div>

          <span className="text-xs font-semibold text-[#F4F3ED]/70 text-right">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </div>

      {/* FILTER + VIEW TOGGLE (Responsive) */}
      <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Bagian Filter (Bisa di-scroll horizontal di HP) */}
        <div className="flex gap-2 items-center w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <FilterIcon size={20} className="text-[#F4F3ED] flex-shrink-0 mr-1" />

          {(["all", "today", "yesterday"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 transition-colors ${
                filter === f
                  ? "bg-[#F4F3ED] text-[#1D4130] shadow-md"
                  : "bg-transparent text-[#F4F3ED]/70 border border-[#F4F3ED]/30 hover:bg-[#F4F3ED]/10"
              }`}
            >
              {f === "all" ? "Semua Data" : f === "today" ? "Hari Ini" : "Kemarin"}
            </button>
          ))}
        </div>

        {/* View Toggle (Pindah ke kanan di Desktop, tetap di kiri/kanan di Mobile) */}
        <div className="flex gap-1 bg-[#1D4130] p-1 rounded-full border border-[#F4F3ED]/10 self-end sm:self-auto flex-shrink-0">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-full transition-colors ${
              viewMode === "card"
                ? "bg-[#F4F3ED] text-[#1D4130] shadow-sm"
                : "text-[#F4F3ED]/70 hover:text-[#F4F3ED]"
            }`}
          >
            <DashboardSquare01Icon size={18} variant={viewMode === "card" ? "solid" : "stroke"} />
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-full transition-colors ${
              viewMode === "table"
                ? "bg-[#F4F3ED] text-[#1D4130] shadow-sm"
                : "text-[#F4F3ED]/70 hover:text-[#F4F3ED]"
            }`}
          >
            <ListViewIcon size={18} variant={viewMode === "table" ? "solid" : "stroke"} />
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="w-full max-w-4xl">
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-[#F4F3ED] rounded-[2rem] p-10 text-center shadow-xl border border-white/50">
            <p className="text-4xl mb-3">🍃</p>
            <p className="text-base font-bold text-gray-900">Belum ada data</p>
            <p className="text-sm text-gray-500 mt-1">
              Tidak ada riwayat treatment untuk filter yang dipilih.
            </p>
          </div>
        )}

        {/* 1. TAMPILAN CARD */}
        {viewMode === "card" && filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((row) => (
              <div
                key={row.id}
                className="bg-[#F4F3ED] rounded-[2rem] p-6 shadow-lg border border-white/50 space-y-4"
              >
                {/* Header Card (Avatar, Nama, Tipe) */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-sm font-bold text-[#F4F3ED]">
                        {row.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base leading-tight">
                        {row.customerName}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                        #{row.orderNo}
                      </p>
                    </div>
                  </div>
                  <CustomerTypeBadge type={row.customerType} />
                </div>

                <div className="h-px bg-gray-200/60" />

                {/* Grid Info Detail */}
                <div className="grid grid-cols-2 gap-y-4">
                  <DataItem
                    label="Tanggal"
                    value={new Date(row.date).toLocaleDateString("id-ID")}
                  />
                  <DataItem
                    label="Treatment"
                    value={row.facialTypeName ?? "—"}
                  />
                  <DataItem
                    label="Next Appt"
                    value={row.nextAppointment || "—"}
                    className="col-span-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. TAMPILAN TABLE */}
        {viewMode === "table" && filteredData.length > 0 && (
          <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl border border-white/50 overflow-hidden">
            {/* Wrapper agar tabel bisa digeser di HP */}
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-sm text-left whitespace-nowrap min-w-[600px]">
                <thead className="bg-white/40">
                  <tr>
                    {["Tanggal", "No Order", "Nama", "Tipe", "Facial", "Next Appt"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 last:border-0 hover:bg-white/40 transition-colors ${
                        i % 2 === 0 ? "bg-transparent" : "bg-white/20"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-600 text-xs">
                        {new Date(row.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">
                        #{row.orderNo}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {row.customerName}
                      </td>
                      <td className="px-6 py-4">
                        <CustomerTypeBadge type={row.customerType} />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {row.facialTypeName ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-400 text-xs">
                        {row.nextAppointment || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* BACK BUTTON */}
      <div className="w-full max-w-4xl mt-10">
        <Link href="/">
          <button className="flex items-center justify-center gap-2 bg-[#F4F3ED] hover:bg-white active:scale-[0.97] text-[#1D4130] text-sm font-bold px-8 py-3.5 rounded-full shadow-lg transition-all duration-150 w-full sm:w-auto">
            <ArrowLeft01Icon size={18}/>
            Kembali ke Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}

// --- KOMPONEN PENDUKUNG ---

// Komponen Badge Monokrom Elegan
function CustomerTypeBadge({ type }: { type: string }) {
  const isZEP = type === "ZEP";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border ${
        isZEP
          ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]"
          : "bg-white text-gray-600 border-gray-200"
      }`}
    >
      {type}
    </span>
  );
}

// Komponen Item Detail Card
function DataItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
        {label}
      </p>
      <p className="text-gray-900 font-bold text-sm">{value}</p>
    </div>
  );
}