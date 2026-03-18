// src/components/DashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar01Icon, ChartLineData01Icon, Target01Icon, StarIcon, SparklesIcon } from "hugeicons-react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-3.5">

        {/* Card 1 */}
        <StatCardSkeleton icon={<Calendar01Icon size={18} />} label="Treatment Hari Ini" />

        {/* Card 2 */}
        <StatCardSkeleton icon={<ChartLineData01Icon size={18} />} label="Bulan Ini" />

        {/* Target card */}
        <div className="col-span-2 bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm flex-shrink-0">
                <Target01Icon size={18} />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Target Bulan Ini</p>
                {/* Only the value is skeletonized */}
                <Skeleton className="h-4 w-28 rounded-full bg-gray-900/30" />
              </div>
            </div>
            {/* Badge skeleton */}
            <Skeleton className="h-7 w-16 rounded-full bg-gray-900/30" />
          </div>
          {/* Progress bar skeleton */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-full rounded-full bg-gray-900/30" />
            <div className="flex justify-between px-1">
              <Skeleton className="h-3 w-4 rounded bg-gray-900/30" />
              <Skeleton className="h-3 w-8 rounded bg-gray-900/30" />
              <Skeleton className="h-3 w-4 rounded bg-gray-900/30" />
            </div>
          </div>
        </div>

        {/* Top treatment card */}
        <div className="col-span-2 bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg flex flex-col justify-between min-h-[110px] border border-white/50">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
            <StarIcon size={18} />
          </div>
          <div className="mt-3 space-y-1.5">
            <Skeleton className="h-5 w-40 rounded-full bg-gray-900/30" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Terpopuler Hari Ini</p>
          </div>
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Grafik Treatment</p>
            <p className="text-base font-bold text-gray-900">Minggu Ini</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <SparklesIcon size={14} className="text-[#1D4130]" />
            {/* Only the count is skeleton */}
            <Skeleton className="h-3.5 w-12 rounded-full bg-gray-900/30" />
          </div>
        </div>

        {/* Legend static */}
        <div className="flex items-center gap-3 mb-6 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1D4130]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Hari ini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Libur</span>
          </div>
        </div>

        {/* Bars skeleton — only bar heights are animated */}
        <div className="flex items-end justify-between gap-1.5 h-36">
          {[45, 70, 30, 85, 55, 20, 60].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="h-3" /> {/* spacer for count label */}
              <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                <Skeleton
                  className="w-full max-w-[28px] rounded-full bg-gray-900/30"
                  style={{ height: `${h}%` }}
                />
              </div>
              <div className="flex flex-col items-center gap-0.5 mt-1">
                <Skeleton className="h-2.5 w-5 rounded bg-gray-900/30" />
                <Skeleton className="h-2 w-3 rounded bg-gray-900/30" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent treatments skeleton */}
      <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Customer Terbaru</p>
            <p className="text-base font-bold text-gray-900 mt-1">5 Treatment Terakhir</p>
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-[1.5rem] border border-gray-100 gap-3">
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* Avatar — static dark circle */}
                <div className="w-10 h-10 rounded-full bg-[#183528]/10 flex-shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Only name, treatment, order are skeleton */}
                  <Skeleton className="h-3.5 w-32 rounded-full bg-gray-900/30" />
                  <Skeleton className="h-3 w-24 rounded-full bg-gray-900/30" />
                  <Skeleton className="h-2.5 w-16 rounded-full bg-gray-900/30" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <Skeleton className="h-5 w-14 rounded-full bg-gray-900/30" />
                <Skeleton className="h-3 w-10 rounded-full bg-gray-900/30" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function StatCardSkeleton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg flex flex-col justify-between min-h-[110px] border border-white/50">
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
        {icon}
      </div>
      <div className="mt-3 space-y-1.5">
        {/* Only the number is skeleton */}
        <Skeleton className="h-7 w-12 rounded-full bg-gray-900/30" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
      </div>
    </div>
  );
}