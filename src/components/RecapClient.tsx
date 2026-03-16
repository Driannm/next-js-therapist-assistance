"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  ArrowLeft01Icon,
  DashboardSquare01Icon,
  ListViewIcon,
  FilterIcon
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
    today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return initialData.filter((row) => {

      if (filter === "all") return true;

      const rowDate = new Date(row.date);
      rowDate.setHours(0,0,0,0);

      if (filter === "today") return rowDate.getTime() === today.getTime();
      if (filter === "yesterday") return rowDate.getTime() === yesterday.getTime();

      return true;
    });

  }, [initialData, filter]);

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-24 flex flex-col items-center">

      <div className="w-full max-w-4xl mb-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#F4F3ED]/20"/>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4F3ED]/70">
            Rekap Data
          </span>
          <div className="h-px flex-1 bg-[#F4F3ED]/20"/>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F4F3ED]">
              Daftar Treatment
            </h1>
            <p className="text-sm text-[#F4F3ED]/70 mt-1">
              Menampilkan {filteredData.length} data
            </p>
          </div>

          <span className="text-xs text-[#F4F3ED]/70">
            {new Date().toLocaleDateString("id-ID", {
              weekday:"long",
              day:"numeric",
              month:"long"
            })}
          </span>
        </div>

      </div>

      {/* FILTER + VIEW */}
      <div className="w-full max-w-4xl mb-6 flex justify-between">

        <div className="flex gap-2 items-center">
          <FilterIcon size={18} className="text-[#F4F3ED]"/>

          {(["all","today","yesterday"] as const).map((f)=>(
            <button
              key={f}
              onClick={()=>setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold
              ${filter===f
              ? "bg-[#F4F3ED] text-[#1D4130]"
              : "text-[#F4F3ED]/70 border border-[#F4F3ED]/30"}`}
            >
              {f==="all" ? "Semua Data" : f==="today" ? "Hari Ini" : "Kemarin"}
            </button>
          ))}

        </div>

        <div className="flex gap-1 bg-[#1D4130] p-1 rounded-full">

          <button
            onClick={()=>setViewMode("card")}
            className={`p-2 rounded-full ${
            viewMode==="card"
            ? "bg-[#F4F3ED] text-[#1D4130]"
            : "text-[#F4F3ED]/70"}`}
          >
            <DashboardSquare01Icon size={18}/>
          </button>

          <button
            onClick={()=>setViewMode("table")}
            className={`p-2 rounded-full ${
            viewMode==="table"
            ? "bg-[#F4F3ED] text-[#1D4130]"
            : "text-[#F4F3ED]/70"}`}
          >
            <ListViewIcon size={18}/>
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-4xl">

        {filteredData.length === 0 && (
          <div className="bg-[#F4F3ED] rounded-3xl p-10 text-center">
            Belum ada data
          </div>
        )}

        {viewMode === "card" && (
          <div className="grid md:grid-cols-2 gap-4">

            {filteredData.map((row)=>(
              <div key={row.id} className="bg-[#F4F3ED] rounded-3xl p-6">

                <p className="font-bold">{row.customerName}</p>
                <p className="text-xs text-gray-400">
                  #{row.orderNo}
                </p>

                <div className="mt-4 text-sm">
                  {new Date(row.date).toLocaleDateString("id-ID")}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      <div className="mt-10">

        <Link href="/dashboard">
          <button className="flex gap-2 items-center bg-[#F4F3ED] px-6 py-3 rounded-full">

            <ArrowLeft01Icon size={18}/>
            Kembali ke Dashboard

          </button>
        </Link>

      </div>

    </main>
  );
}