"use client";

import Link from "next/link";
import {
  SparklesIcon,
  ChartLineData01Icon,
  Calendar01Icon,
  StarIcon,
  ArrowRight01Icon,
  Target01Icon,
} from "hugeicons-react";

type ChartDay = { date: string; count: number; label: string; isOffDay: boolean };
type RecentTreatment = { id: number; customerName: string; customerType: string; orderNo: string; date: string; facialTypeName: string };
type Stats = { todayCount: number; monthCount: number; targetPatients: number | null; topFacialToday: string; weekTotal: number };

export function DashboardClient({
  userName,
  todayStr,
  stats,
  chartData,
  recentTreatments,
}: {
  userName: string;
  todayStr: string;
  stats: Stats;
  chartData: ChartDay[];
  recentTreatments: RecentTreatment[];
}) {
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const firstName = userName.split(" ")[0];
  const { monthCount, targetPatients } = stats;
  const hasTarget = targetPatients !== null && targetPatients > 0;
  const progressPct = hasTarget ? Math.min(Math.round((monthCount / targetPatients!) * 100), 100) : 0;
  const isAchieved = hasTarget && monthCount >= targetPatients!;
  const remaining = hasTarget ? Math.max(targetPatients! - monthCount, 0) : null;

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3.5">
        <StatCard label="Treatment Hari Ini" value={stats.todayCount} icon={<Calendar01Icon size={18} />} />
        <StatCard label="Bulan Ini" value={stats.monthCount} icon={<ChartLineData01Icon size={18} />} />

        {/* Target card */}
        <div className="col-span-2 bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm flex-shrink-0">
                <Target01Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 leading-tight">Target Bulan Ini</p>
                {hasTarget ? (
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {monthCount} <span className="text-gray-400 font-medium">/ {targetPatients} pasien</span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Belum diatur</p>
                )}
              </div>
            </div>
            {hasTarget ? (
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0 border ${
                isAchieved ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : progressPct >= 75 ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-white text-gray-500 border-gray-200"
              }`}>
                {isAchieved ? "✓ Tercapai" : progressPct >= 75 ? "Hampir!" : `${remaining} lagi`}
              </span>
            ) : (
              <Link href="/settings" className="text-[10px] font-bold text-[#1D4130] bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                Set Target
              </Link>
            )}
          </div>
          {hasTarget && (
            <div className="space-y-2 mt-4">
              <div className="w-full h-3 bg-white border border-gray-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isAchieved ? "bg-emerald-500" : progressPct >= 75 ? "bg-amber-400" : "bg-[#1D4130]"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between px-1">
                <span className="text-[10px] text-gray-400 font-bold">0</span>
                <span className={`text-[10px] font-bold ${isAchieved ? "text-emerald-500" : "text-[#1D4130]"}`}>{progressPct}%</span>
                <span className="text-[10px] text-gray-400 font-bold">{targetPatients}</span>
              </div>
            </div>
          )}
        </div>

        <StatCard label="Terpopuler Hari Ini" value={stats.topFacialToday} icon={<StarIcon size={18} />} small className="col-span-2" />
      </div>

      {/* Bar chart */}
      <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Grafik Treatment</p>
            <p className="text-base font-bold text-gray-900 mt-1">Minggu Ini</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <SparklesIcon size={14} className="text-[#1D4130]" />
            <span className="text-xs font-bold text-[#1D4130]">{stats.weekTotal} total</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 px-1">
          {[{ color: "bg-[#1D4130]", label: "Hari ini" }, { color: "bg-red-400", label: "Libur" }].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-1.5 h-36">
          {chartData.map((day) => {
            const heightPct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const isToday = day.date === todayStr;
            const isFuture = day.date > todayStr;
            const barColor = isToday ? "bg-[#1D4130]"
              : day.isOffDay ? (day.count > 0 ? "bg-red-400" : "bg-red-200")
              : isFuture ? "bg-gray-200"
              : "bg-gray-300 hover:bg-gray-400";
            const labelColor = isToday ? "text-[#1D4130]"
              : day.isOffDay ? "text-red-500"
              : isFuture ? "text-gray-300"
              : "text-gray-500";
            const dateObj = new Date(day.date + "T00:00:00");

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 h-3">{day.count > 0 ? day.count : ""}</span>
                <div className="relative w-full flex items-end justify-center" style={{ height: "80px" }}>
                  <div
                    className={`w-full max-w-[28px] rounded-full transition-all duration-500 shadow-sm ${barColor}`}
                    style={{ height: `${Math.max(heightPct, day.count > 0 ? 12 : day.isOffDay ? 6 : 4)}%` }}
                  />
                  {day.isOffDay && !isToday && day.count === 0 && (
                    <div className="absolute -top-3 w-1.5 h-1.5 rounded-full bg-red-400" />
                  )}
                </div>
                <div className="flex flex-col items-center text-center leading-[1.2] mt-1">
                  <span className={`text-[10px] font-bold ${labelColor}`}>{dateObj.toLocaleDateString("id-ID", { weekday: "short" })}</span>
                  <span className={`text-[9px] font-bold opacity-60 ${labelColor}`}>{dateObj.getDate()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent treatments */}
      <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl p-5 sm:p-6">
        <div className="flex items-start sm:items-center justify-between mb-5 gap-4">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-gray-500 truncate">Customer Terbaru</p>
            <p className="text-sm sm:text-base font-bold text-gray-900 mt-1 truncate">5 Treatment Terakhir</p>
          </div>
          <Link href="/rekap" className="flex items-center gap-1 text-xs font-bold text-[#1D4130] hover:underline underline-offset-2 transition-colors flex-shrink-0 whitespace-nowrap bg-white/50 px-3 py-1.5 rounded-full">
            Lihat semua <ArrowRight01Icon size={14} />
          </Link>
        </div>

        {recentTreatments.length === 0 ? (
          <div className="py-8 text-center bg-white rounded-[1.5rem] shadow-sm border border-gray-100">
            <p className="text-3xl mb-2">🍃</p>
            <p className="text-xs font-bold text-gray-400">Belum ada data treatment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTreatments.map((t) => {
              const time = new Date(t.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
              const isZEP = t.customerType === "ZEP";
              return (
                <div key={t.id} className="flex items-center justify-between p-3.5 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 gap-3 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-sm font-bold text-[#F4F3ED]">{t.customerName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{t.customerName}</p>
                      <p className="text-[11px] font-semibold text-gray-500 mt-0.5 truncate">{t.facialTypeName || "Tanpa Treatment"}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">#{t.orderNo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase border ${
                      isZEP ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]" : "bg-[#F4F3ED] text-[#1D4130] border-transparent"
                    }`}>
                      {t.customerType}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">{time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

function StatCard({ label, value, icon, small, className = "" }: {
  label: string; value: string | number; icon: React.ReactNode; small?: boolean; className?: string;
}) {
  return (
    <div className={`bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg flex flex-col justify-between min-h-[110px] border border-white/50 ${className}`}>
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">{icon}</div>
      <div className="mt-3">
        <p className={`${small ? "text-base" : "text-2xl"} font-bold text-gray-900 leading-tight truncate`}>{value}</p>
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-1.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}