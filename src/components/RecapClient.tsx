"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DashboardSquare01Icon,
  ListViewIcon,
  FilterIcon,
  ArrowLeft01Icon,
  Copy01Icon,
  PencilEdit01Icon,
  CheckmarkCircle01Icon,
} from "hugeicons-react";
import { CalendarIcon, XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { id as idLocale } from "date-fns/locale";

type TreatmentData = {
  id: number;
  date: string;
  orderNo: string;
  customerName: string;
  customerType: string;
  facialTypeName: string | null;
  nextAppointment: string | null;
  therapistName: string;
};

type QuickFilter = "all" | "today" | "yesterday" | "custom";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateForCopy(isoStr: string) {
  const d = new Date(isoStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function formatDateDisplay(isoStr: string) {
  return new Date(isoStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function buildCopyRow(row: TreatmentData) {
  return [
    formatDateForCopy(row.date),
    row.customerName,
    row.facialTypeName ?? "",
    row.orderNo,
    row.customerType,
    "",
    row.nextAppointment ?? "",
    row.therapistName,
  ].join("\t");
}

// ─── Date Button ─────────────────────────────────────────────────────────────

function DateButton({ value, onChange, placeholder, minDate, maxDate }: {
  value: string; onChange: (v: string) => void;
  placeholder: string; minDate?: Date; maxDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value + "T00:00:00") : undefined;
  const display = selected
    ? selected.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={`w-full h-10 rounded-xl bg-white border flex items-center gap-2 px-3 transition-all hover:border-[#1D4130]/40 focus:outline-none ${value ? "text-gray-800 border-[#1D4130]/30" : "text-gray-400 border-gray-200"}`}>
          <CalendarIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate text-xs font-semibold">{display}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-3xl border border-gray-100 shadow-2xl overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={selected}
          locale={idLocale}
          initialFocus
          disabled={(d) => {
            const today = new Date(); today.setHours(23, 59, 59, 999);
            if (d > today) return true;
            if (minDate) { const min = new Date(minDate); min.setHours(0,0,0,0); if (d < min) return true; }
            if (maxDate) { const max = new Date(maxDate); max.setHours(23,59,59,999); if (d > max) return true; }
            return false;
          }}
          onSelect={(d) => { if (d) { onChange(toYMD(d)); setOpen(false); } }}
          classNames={{
            months: "p-3", month: "space-y-3",
            caption: "flex justify-center items-center relative px-2 py-1",
            caption_label: "text-sm font-bold text-gray-900 capitalize",
            nav: "flex items-center gap-1",
            nav_button: "h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",
            nav_button_previous: "absolute left-1", nav_button_next: "absolute right-1",
            table: "w-full border-collapse", head_row: "flex",
            head_cell: "w-9 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-1.5",
            row: "flex w-full mt-1", cell: "w-9 text-center p-0",
            day: "h-9 w-9 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors mx-auto flex items-center justify-center",
            day_selected: "!bg-[#1D4130] !text-white hover:!bg-[#153023] font-bold",
            day_today: "border-2 border-[#1D4130] text-[#1D4130] font-bold",
            day_outside: "text-gray-300 opacity-50",
            day_disabled: "text-gray-200 cursor-not-allowed opacity-40",
          }}
        />
        {value && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors">Hapus</button>
            <button type="button" onClick={() => setOpen(false)} className="text-xs font-bold text-[#1D4130] hover:underline underline-offset-2">Selesai</button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ row, onClose, onCopy, copied }: {
  row: TreatmentData; onClose: () => void;
  onCopy: (row: TreatmentData) => void; copied: boolean;
}) {
  const isZEP = row.customerType === "ZEP";
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-[#F4F3ED] rounded-[2rem] overflow-hidden shadow-2xl font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#F4F3ED]">{row.customerName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{row.customerName}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{row.orderNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="h-px bg-gray-200 mx-6" />
        <div className="px-6 py-4 space-y-3">
          <DetailField label="Tanggal" value={`${formatDateDisplay(row.date)}, ${formatTime(row.date)}`} />
          <DetailField label="Tipe Customer" value={
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${isZEP ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]" : "bg-white text-[#1D4130] border-gray-200"}`}>{row.customerType}</span>
          } />
          <DetailField label="Treatment" value={row.facialTypeName ?? "—"} />
          <DetailField label="Next Treatment" value={row.nextAppointment ?? "—"} />
          <DetailField label="Therapist" value={row.therapistName} />
        </div>
        <div className="px-6 pb-6 pt-2 flex gap-2">
          <button onClick={() => onCopy(row)} className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-2xl text-sm font-bold transition-all duration-150 ${copied ? "bg-emerald-500 text-white" : "bg-[#1D4130] hover:bg-[#153023] text-[#F4F3ED]"}`}>
            {copied ? <><CheckmarkCircle01Icon size={16} /> Tersalin!</> : <><Copy01Icon size={16} /> Copy Baris</>}
          </button>
          <button onClick={onClose} className="h-11 px-4 rounded-2xl border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number; totalPages: number; onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center text-[#F4F3ED]/60 hover:text-[#F4F3ED] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[#F4F3ED]/40 text-sm">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              p === currentPage
                ? "bg-[#F4F3ED] text-[#1D4130]"
                : "text-[#F4F3ED]/60 hover:text-[#F4F3ED] hover:bg-white/10"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-full flex items-center justify-center text-[#F4F3ED]/60 hover:text-[#F4F3ED] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function RecapClient({
  initialData,
  currentPage,
  totalPages,
  total,
  initialFrom,
  initialTo,
}: {
  initialData: TreatmentData[];
  currentPage: number;
  totalPages: number;
  total: number;
  initialFrom: string;
  initialTo: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(
    initialFrom || initialTo ? "custom" : "all"
  );
  const [customFrom, setCustomFrom] = useState(initialFrom);
  const [customTo, setCustomTo] = useState(initialTo);
  const [showDatePicker, setShowDatePicker] = useState(!!(initialFrom || initialTo));
  const [selectedRow, setSelectedRow] = useState<TreatmentData | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Navigate with URL params (server re-fetches)
  const navigate = (page: number, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    router.push(pathname + (qs ? `?${qs}` : ""));
  };

  // Client-side quick filters (today/yesterday) applied on top of server data
  const displayData = useMemo(() => {
    if (quickFilter === "all" || quickFilter === "custom") return initialData;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    return initialData.filter((row) => {
      const d = new Date(row.date); d.setHours(0, 0, 0, 0);
      if (quickFilter === "today") return d.getTime() === today.getTime();
      if (quickFilter === "yesterday") return d.getTime() === yesterday.getTime();
      return true;
    });
  }, [initialData, quickFilter]);

  const handleCopyRow = (row: TreatmentData) => {
    navigator.clipboard.writeText(buildCopyRow(row));
    setCopiedId(row.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(displayData.map(buildCopyRow).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const applyCustomFilter = () => {
    setShowDatePicker(false);
    navigate(1, customFrom, customTo);
  };

  const filterButtons = [
    { key: "all", label: "Semua" },
    { key: "today", label: "Hari Ini" },
    { key: "yesterday", label: "Kemarin" },
    { key: "custom", label: "Pilih Tanggal" },
  ] as const;

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-[#F4F3ED]/60 font-bold uppercase tracking-[0.2em] mb-1">Rekap Data</p>
            <h1 className="text-2xl font-bold text-[#F4F3ED]">Daftar Treatment</h1>
            <p className="text-sm text-[#F4F3ED]/60 mt-1">
              {total} treatment{quickFilter !== "all" && quickFilter !== "custom" ? ` · halaman ${currentPage}` : ""}{totalPages > 1 ? ` · hal. ${currentPage}/${totalPages}` : ""}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#F4F3ED]/50 text-right pt-1 capitalize">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>

        {/* Filter + View toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FilterIcon size={16} className="text-[#F4F3ED]/50 flex-shrink-0" />
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {filterButtons.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setQuickFilter(f.key);
                    if (f.key === "custom") {
                      setShowDatePicker(true);
                    } else {
                      setShowDatePicker(false);
                      // Clear server-side date filter when switching away from custom
                      if (quickFilter === "custom") navigate(1);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                    quickFilter === f.key
                      ? "bg-[#F4F3ED] text-[#1D4130]"
                      : "text-[#F4F3ED]/60 border border-[#F4F3ED]/20 hover:border-[#F4F3ED]/40"
                  }`}
                >
                  {f.key === "custom" && <CalendarIcon className="h-3 w-3" />}
                  {f.label}
                  {f.key === "custom" && customFrom && customTo && (
                    <span className="bg-[#1D4130] text-[#F4F3ED] px-1.5 py-0.5 rounded-full text-[9px] font-black">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-0.5 bg-[#1D4130] p-1 rounded-full flex-shrink-0">
            <button onClick={() => setViewMode("card")} className={`p-2 rounded-full transition-all duration-150 ${viewMode === "card" ? "bg-[#F4F3ED] text-[#1D4130]" : "text-[#F4F3ED]/60"}`}>
              <DashboardSquare01Icon size={16} />
            </button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-full transition-all duration-150 ${viewMode === "table" ? "bg-[#F4F3ED] text-[#1D4130]" : "text-[#F4F3ED]/60"}`}>
              <ListViewIcon size={16} />
            </button>
          </div>
        </div>

        {/* Custom date range */}
        {quickFilter === "custom" && showDatePicker && (
          <div className="bg-[#F4F3ED] rounded-2xl p-4 flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Dari</label>
              <DateButton
                value={customFrom}
                onChange={(v) => { setCustomFrom(v); if (customTo && v > customTo) setCustomTo(""); }}
                placeholder="Pilih tanggal"
                maxDate={customTo ? new Date(customTo + "T00:00:00") : undefined}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Sampai</label>
              <DateButton
                value={customTo}
                onChange={setCustomTo}
                placeholder="Pilih tanggal"
                minDate={customFrom ? new Date(customFrom + "T00:00:00") : undefined}
              />
            </div>
            <button
              onClick={applyCustomFilter}
              disabled={!customFrom || !customTo}
              className="h-10 px-4 rounded-xl bg-[#1D4130] text-[#F4F3ED] text-xs font-bold flex-shrink-0 hover:bg-[#153023] disabled:opacity-40 transition-colors"
            >
              Terapkan
            </button>
          </div>
        )}

        {/* Copy all */}
        {displayData.length > 0 && (
          <button
            onClick={handleCopyAll}
            className={`w-full h-11 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-150 border ${
              copiedAll ? "bg-emerald-500 text-white border-transparent" : "bg-white/10 text-[#F4F3ED] border-[#F4F3ED]/20 hover:bg-white/15"
            }`}
          >
            {copiedAll
              ? <><CheckmarkCircle01Icon size={16} /> {displayData.length} baris tersalin!</>
              : <><Copy01Icon size={16} /> Copy Halaman Ini ({displayData.length} baris)</>
            }
          </button>
        )}

        {/* Empty */}
        {displayData.length === 0 && (
          <div className="bg-[#F4F3ED] rounded-[2rem] px-6 py-14 text-center shadow-xl">
            <p className="text-sm font-bold text-gray-500">Belum ada data treatment</p>
            <p className="text-xs text-gray-400 mt-1">
              {quickFilter !== "all" ? "Coba ganti filter" : "Tambahkan treatment pertama kamu"}
            </p>
          </div>
        )}

        {/* Card view */}
        {viewMode === "card" && displayData.length > 0 && (
          <div className="space-y-3">
            {displayData.map((row) => {
              const isZEP = row.customerType === "ZEP";
              const isCopied = copiedId === row.id;
              return (
                <div key={row.id} className="bg-[#F4F3ED] rounded-[1.5rem] p-4 shadow-lg border border-white/50">
                  <button className="w-full flex items-start justify-between gap-3 mb-3 text-left" onClick={() => setSelectedRow(row)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-sm font-bold text-[#F4F3ED]">{row.customerName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{row.customerName}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{row.orderNo}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 border ${isZEP ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]" : "bg-white text-[#1D4130] border-gray-200"}`}>
                      {row.customerType}
                    </span>
                  </button>
                  <div className="h-px bg-gray-200 mb-3" />
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-3">
                    <DataItem label="Tanggal" value={`${formatDateDisplay(row.date)}, ${formatTime(row.date)}`} className="col-span-2" />
                    <DataItem label="Treatment" value={row.facialTypeName ?? "—"} />
                    <DataItem label="Next Treatment" value={row.nextAppointment ?? "—"} />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => handleCopyRow(row)} className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all duration-150 ${isCopied ? "bg-emerald-500 text-white" : "bg-white text-[#1D4130] border border-gray-200 hover:border-[#1D4130]/30"}`}>
                      {isCopied ? <><CheckmarkCircle01Icon size={14} /> Tersalin</> : <><Copy01Icon size={14} /> Copy</>}
                    </button>
                    <button onClick={() => setSelectedRow(row)} className="h-9 px-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#1D4130] hover:border-[#1D4130]/30 transition-colors flex items-center gap-1.5 text-xs font-bold">
                      <PencilEdit01Icon size={14} />
                      Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table view */}
        {viewMode === "table" && displayData.length > 0 && (
          <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Tanggal", "Order", "Nama", "Tipe", "Treatment", "Next", ""].map((h, i) => (
                      <th key={i} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, i) => {
                    const isZEP = row.customerType === "ZEP";
                    const isCopied = copiedId === row.id;
                    return (
                      <tr key={row.id} className={`border-b border-gray-100 last:border-0 hover:bg-white/60 transition-colors cursor-pointer ${i % 2 === 1 ? "bg-white/30" : ""}`}>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap" onClick={() => setSelectedRow(row)}>{formatDateDisplay(row.date)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500" onClick={() => setSelectedRow(row)}>#{row.orderNo}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap" onClick={() => setSelectedRow(row)}>{row.customerName}</td>
                        <td className="px-4 py-3 whitespace-nowrap" onClick={() => setSelectedRow(row)}>
                          <span className={`inline-flex text-[9px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${isZEP ? "bg-[#1D4130] text-[#F4F3ED] border-[#1D4130]" : "bg-white text-[#1D4130] border-gray-200"}`}>{row.customerType}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap" onClick={() => setSelectedRow(row)}>{row.facialTypeName ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap" onClick={() => setSelectedRow(row)}>{row.nextAppointment ?? "—"}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleCopyRow(row)} className={`h-7 px-2.5 rounded-lg flex items-center gap-1 text-[10px] font-bold transition-all ${isCopied ? "bg-emerald-500 text-white" : "bg-white border border-gray-200 text-[#1D4130] hover:border-[#1D4130]/30"}`}>
                            {isCopied ? <CheckmarkCircle01Icon size={12} /> : <Copy01Icon size={12} />}
                            {isCopied ? "OK" : "Copy"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => navigate(p, customFrom, customTo)}
          />
        )}

        {/* Back */}
        <div className="flex justify-center pt-2">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-[#F4F3ED]/60 hover:text-[#F4F3ED] transition-colors">
            <ArrowLeft01Icon size={16} />
            Kembali ke Dashboard
          </Link>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedRow && (
        <DetailModal
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
          onCopy={(row) => handleCopyRow(row)}
          copied={copiedId === selectedRow.id}
        />
      )}
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