"use client";

import Link from "next/link";
import {
  SparklesIcon,
  ChartLineData01Icon,
  Calendar01Icon,
  StarIcon,
  ArrowRight01Icon,
  PencilEdit01Icon,
  Target01Icon,
} from "hugeicons-react";

type ChartDay = {
  date: string;
  count: number;
  label: string;
  isOffDay: boolean;
};

type RecentTreatment = {
  id: number;
  customerName: string;
  customerType: string;
  orderNo: string;
  date: string;
  facialTypeName: string;
};

type Stats = {
  todayCount: number;
  monthCount: number;
  targetPatients: number | null;
  topFacialToday: string;
  weekTotal: number;
};

export function DashboardClient({
  userName,
  stats,
  chartData,
  recentTreatments,
}: {
  userName: string;
  stats: Stats;
  chartData: ChartDay[];
  recentTreatments: RecentTreatment[];
}) {
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const firstName = userName.split(" ")[0];

  const todayStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { monthCount, targetPatients } = stats;
  const hasTarget = targetPatients !== null && targetPatients > 0;
  const progressPct = hasTarget ? Math.min(Math.round((monthCount / targetPatients!) * 100), 100) : 0;
  const isAchieved = hasTarget && monthCount >= targetPatients!;
  const remaining = hasTarget ? Math.max(targetPatients! - monthCount, 0) : null;

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 max-w-lg mx-auto space-y-6 font-[family-name:var(--font-geist-sans)]">

      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#F4F3ED]/70 font-medium mb-1 capitalize">{todayStr}</p>
          <h1 className="text-2xl font-bold text-[#F4F3ED]">Halo, {firstName} 👋</h1>
          <p className="text-sm text-[#F4F3ED]/70 mt-1">Ini ringkasan hari ini.</p>
        </div>
        <Link
          href="/input"
          className="flex items-center gap-2 bg-[#F4F3ED] hover:bg-white active:scale-[0.97] text-[#1D4130] text-sm font-bold px-5 py-3 rounded-full shadow-lg transition-all duration-150"
        >
          <PencilEdit01Icon size={16} />
          Input
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3.5">
        <StatCard label="Treatment Hari Ini" value={stats.todayCount} icon={<Calendar01Icon size={18} />} />
        <StatCard label="Bulan Ini" value={stats.monthCount} icon={<ChartLineData01Icon size={18} />} />

        {/* Target card — col-span-2 */}
        <div className="col-span-2 bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm flex-shrink-0">
                <Target01Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 leading-tight">Target Bulan Ini</p>
                {hasTarget ? (
                  <p className="text-xs font-bold text-gray-700">{monthCount} / {targetPatients} pasien</p>
                ) : (
                  <p className="text-xs text-gray-400">Belum diset</p>
                )}
              </div>
            </div>
            {hasTarget ? (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                isAchieved ? "bg-emerald-100 text-emerald-600"
                : progressPct >= 75 ? "bg-amber-100 text-amber-600"
                : "bg-gray-100 text-gray-500"
              }`}>
                {isAchieved ? "✓ Tercapai" : progressPct >= 75 ? "Hampir!" : `${remaining} lagi`}
              </span>
            ) : (
              <Link href="/pengaturan" className="text-[10px] font-bold text-[#1D4130] underline underline-offset-2">
                Set target
              </Link>
            )}
          </div>

          {hasTarget && (
            <div className="space-y-1.5">
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isAchieved ? "bg-emerald-500"
                    : progressPct >= 75 ? "bg-amber-400"
                    : "bg-[#1D4130]"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] text-gray-400 font-medium">0</span>
                <span className={`text-[10px] font-bold ${isAchieved ? "text-emerald-500" : "text-[#1D4130]"}`}>
                  {progressPct}%
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{targetPatients}</span>
              </div>
            </div>
          )}
        </div>

        <StatCard label="Terpopuler Hari Ini" value={stats.topFacialToday} icon={<StarIcon size={18} />} small className="col-span-2" />
      </div>

      {/* Bar chart */}
      <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Grafik Treatment</p>
            <p className="text-base font-bold text-gray-900 mt-1">7 Hari Terakhir</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <SparklesIcon size={14} className="text-[#1D4130]" />
            <span className="text-xs font-bold text-[#1D4130]">{stats.weekTotal} total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#1D4130]" />
            <span className="text-[10px] font-semibold text-gray-500">Hari ini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-[10px] font-semibold text-gray-500">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <span className="text-[10px] font-semibold text-gray-500">Libur</span>
          </div>
        </div>

        <div className="flex items-end gap-2 h-32">
          {chartData.map((day) => {
            const heightPct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const isToday = day.date === new Date().toISOString().split("T")[0];

            // Color priority: today → off day → normal
            const barColor = isToday
              ? "bg-[#1D4130]"
              : day.isOffDay
              ? day.count > 0
                ? "bg-red-400"         // libur tapi ada treatment (masuk dadakan)
                : "bg-red-200"         // libur, kosong
              : "bg-gray-300 hover:bg-gray-400";

            const labelColor = isToday
              ? "text-[#1D4130]"
              : day.isOffDay
              ? "text-red-400"
              : "text-gray-400";

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-gray-500">
                  {day.count > 0 ? day.count : ""}
                </span>
                <div className="relative w-full flex items-end" style={{ height: "80px" }}>
                  <div
                    className={`w-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ height: `${Math.max(heightPct, day.count > 0 ? 10 : day.isOffDay ? 6 : 4)}%` }}
                  />
                  {/* Off day indicator dot */}
                  {day.isOffDay && !isToday && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
                  )}
                </div>
                <span className={`text-[10px] font-bold ${labelColor}`}>
                  {day.label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent treatments */}
      <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Customer Terbaru</p>
            <p className="text-base font-bold text-gray-900 mt-1">5 Treatment Terakhir</p>
          </div>
          <Link href="/rekap" className="flex items-center gap-1 text-xs font-bold text-[#1D4130] hover:underline underline-offset-2 transition-colors">
            Lihat semua <ArrowRight01Icon size={14} />
          </Link>
        </div>

        {recentTreatments.length === 0 ? (
          <div className="py-8 text-center bg-white rounded-2xl">
            <p className="text-2xl mb-2">🍃</p>
            <p className="text-sm font-medium text-gray-400">Belum ada data</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTreatments.map((t) => {
              const time = new Date(t.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
              return (
                <div key={t.id} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#F4F3ED]">
                        {t.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{t.customerName}</p>
                      <p className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">{t.facialTypeName}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-0.5">#{t.orderNo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F4F3ED] text-[#1D4130]">
                      {t.customerType}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400">{time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </main>
  );
}

function StatCard({
  label, value, icon, small, className = "",
}: {
  label: string; value: string | number; icon: React.ReactNode; small?: boolean; className?: string;
}) {
  return (
    <div className={`bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg flex flex-col justify-between min-h-[110px] ${className}`}>
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
        {icon}
      </div>
      <div className="mt-3">
        <p className={`${small ? "text-base" : "text-2xl"} font-bold text-gray-900 leading-tight truncate`}>{value}</p>
        <p className="text-[11px] font-semibold text-gray-500 mt-1 leading-tight">{label}</p>
      </div>
    </div>
  );
}