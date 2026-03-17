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
  nextAppointment: string | null; // ✅ nama facial berikutnya
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
      if (filter === "yesterday")
        return rowDate.getTime() === yesterday.getTime();

      return true;
    });
  }, [initialData, filter]);

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 flex flex-col items-center">
      
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

      {/* FILTER */}
      <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2 items-center overflow-x-auto">
          <FilterIcon size={20} className="text-[#F4F3ED]" />

          {(["all", "today", "yesterday"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold ${
                filter === f
                  ? "bg-[#F4F3ED] text-[#1D4130]"
                  : "text-[#F4F3ED]/70 border border-[#F4F3ED]/30"
              }`}
            >
              {f === "all"
                ? "Semua Data"
                : f === "today"
                ? "Hari Ini"
                : "Kemarin"}
            </button>
          ))}
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex gap-1 bg-[#1D4130] p-1 rounded-full">
          <button
            onClick={() => setViewMode("card")}
            className={viewMode === "card" ? "bg-white p-2 rounded-full" : "p-2"}
          >
            <DashboardSquare01Icon size={18} />
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={viewMode === "table" ? "bg-white p-2 rounded-full" : "p-2"}
          >
            <ListViewIcon size={18} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-4xl">

        {filteredData.length === 0 && (
          <div className="bg-white rounded-xl p-6 text-center">
            Belum ada data
          </div>
        )}

        {/* CARD */}
        {viewMode === "card" && filteredData.length > 0 && (
          <div className="grid gap-4">
            {filteredData.map((row) => (
              <div key={row.id} className="bg-white p-4 rounded-xl">
                <p className="font-bold">{row.customerName}</p>
                <p className="text-xs">#{row.orderNo}</p>

                <p>
                  Tanggal:{" "}
                  {new Date(row.date).toLocaleDateString("id-ID")}
                </p>

                <p>Facial: {row.facialTypeName ?? "—"}</p>

                <p>
                  Next Treatment: {row.nextAppointment ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TABLE */}
        {viewMode === "table" && filteredData.length > 0 && (
          <table className="w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Order</th>
                <th>Nama</th>
                <th>Facial</th>
                <th>Next</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td>
                    {new Date(row.date).toLocaleDateString("id-ID")}
                  </td>
                  <td>#{row.orderNo}</td>
                  <td>{row.customerName}</td>
                  <td>{row.facialTypeName ?? "—"}</td>
                  <td>{row.nextAppointment ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BACK */}
      <div className="mt-8">
        <Link href="/">Kembali</Link>
      </div>
    </main>
  );
}