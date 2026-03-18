"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandInput, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckIcon, ChevronDownIcon, CalendarIcon, PlusIcon,
  ChevronUpIcon, Trash2Icon, ClipboardListIcon, CopyIcon,
  AlertCircleIcon, GripVerticalIcon,
} from "lucide-react";
import { id as idLocale } from "date-fns/locale";

type Facial = { id: number; name: string };
type Option = { value: string; label: string };

const customerTypeOptions: Option[] = [
  { value: "External Client", label: "External Client" },
  { value: "ZEP", label: "ZEP" },
];

const inputClass =
  "w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1D4130] focus:ring-2 focus:ring-[#1D4130]/10 focus:outline-none transition-all duration-150";

const DRAFT_KEY = "theramate_form_draft";

// ─── Types ────────────────────────────────────────────────────────────────────

type EntryData = {
  id: string;
  collapsed: boolean;
  orderNo: string;
  customerName: string;
  customerType: string;
  facialTypeId: string;
  nextTreatmentId: string;
  treatmentDate: string; // "YYYY-MM-DD" — serializable for localStorage
  treatmentTime: string; // "HH:MM"
  orderNoError?: string;
};

type DragState = {
  draggingId: string | null;
  overIdx: number | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toLocalTimeStr(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function buildEntry(defaults?: Partial<EntryData>): EntryData {
  const now = new Date();
  return {
    id: Math.random().toString(36).slice(2),
    collapsed: false,
    orderNo: "",
    customerName: "",
    customerType: defaults?.customerType ?? "",
    facialTypeId: defaults?.facialTypeId ?? "",
    nextTreatmentId: defaults?.nextTreatmentId ?? "",
    treatmentDate: toLocalDateStr(now),
    treatmentTime: toLocalTimeStr(now),
    ...defaults,
    orderNoError: undefined,
  };
}

function entryLabel(entry: EntryData, facialOptions: Option[]) {
  if (entry.customerName) {
    const facial = facialOptions.find((o) => o.value === entry.facialTypeId);
    return `${entry.customerName}${facial ? ` · ${facial.label}` : ""}`;
  }
  if (entry.orderNo) return `Order #${entry.orderNo}`;
  return "Entry baru";
}

function isEntryComplete(entry: EntryData) {
  return !!(entry.orderNo && entry.customerName && entry.customerType && entry.facialTypeId);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SearchableSelect({ label, value, setValue, options, optional, placeholder = "Pilih opsi" }: {
  label: string; value: string; setValue: (v: string) => void;
  options: Option[]; optional?: boolean; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
        {optional && <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">opsional</span>}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={`${inputClass} flex items-center justify-between text-left ${!selected ? "text-gray-400" : "text-gray-900"}`}>
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 rounded-2xl border border-gray-100 shadow-xl overflow-hidden" style={{ width: "var(--radix-popover-trigger-width)" }} align="start">
          <Command>
            <div className="px-3 pt-3 pb-1">
              <CommandInput placeholder="Cari..." className="h-9 text-sm border border-gray-200 rounded-xl px-3 focus:border-[#1D4130] focus:ring-0" />
            </div>
            <CommandEmpty className="py-4 text-center text-sm text-gray-400">Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-52 overflow-auto p-1.5">
              {options.map((opt) => (
                <CommandItem key={opt.value} value={opt.label}
                  onSelect={() => { setValue(opt.value); setOpen(false); }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm cursor-pointer text-gray-700 data-[selected=true]:bg-[#F4F3ED]">
                  <span>{opt.label}</span>
                  {value === opt.value && <CheckIcon className="h-4 w-4 text-[#1D4130]" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DatePicker({ dateStr, onSelect }: { dateStr: string; onSelect: (d: Date) => void }) {
  const [open, setOpen] = useState(false);
  const selected = new Date(dateStr + "T00:00:00");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={`${inputClass} flex items-center gap-3 text-left text-gray-900`}>
          <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span>{selected.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-3xl border border-gray-100 shadow-2xl overflow-hidden" align="start">
        <Calendar mode="single" selected={selected} locale={idLocale} initialFocus
          onSelect={(d) => { if (d) { onSelect(d); setOpen(false); } }}
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
          }}
        />
        <div className="flex justify-end px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={() => setOpen(false)} className="text-xs font-bold text-[#1D4130] hover:underline underline-offset-2">Selesai</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function EntryCard({
  entry, index, total, facialOptions, isDraggingOver,
  onUpdate, onRemove, onToggleCollapse, onDuplicate,
  onDragStart, onDragEnter, onDragEnd,
}: {
  entry: EntryData; index: number; total: number;
  facialOptions: Option[]; isDraggingOver: boolean;
  onUpdate: (id: string, patch: Partial<EntryData>) => void;
  onRemove: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnter: (idx: number) => void;
  onDragEnd: () => void;
}) {
  const set = (patch: Partial<EntryData>) => onUpdate(entry.id, patch);
  const complete = isEntryComplete(entry);

  return (
    <div
      className={`rounded-[2rem] shadow-xl overflow-hidden border transition-all duration-200 ${
        isDraggingOver ? "border-[#1D4130]/40 scale-[1.01]" : "border-white/50"
      } ${entry.collapsed && complete ? "bg-[#1D4130]" : "bg-[#F4F3ED]"}`}
      draggable
      onDragStart={() => onDragStart(entry.id)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
        onClick={() => onToggleCollapse(entry.id)}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Drag handle */}
          <div
            className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVerticalIcon className={`h-4 w-4 ${entry.collapsed && complete ? "text-[#F4F3ED]/40" : "text-gray-300"}`} />
          </div>

          {/* Index badge */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
            entry.collapsed && complete ? "bg-[#F4F3ED]/20" : "bg-[#183528]"
          }`}>
            {complete && entry.collapsed
              ? <CheckIcon className="h-3.5 w-3.5 text-[#F4F3ED]" strokeWidth={3} />
              : <span className={`text-xs font-black ${entry.collapsed && complete ? "text-[#F4F3ED]" : "text-[#F4F3ED]"}`}>{index + 1}</span>
            }
          </div>

          <div className="min-w-0">
            <p className={`text-sm font-bold truncate ${entry.collapsed && complete ? "text-[#F4F3ED]" : "text-gray-900"}`}>
              {entryLabel(entry, facialOptions)}
            </p>
            {entry.collapsed && (
              <p className={`text-[10px] font-semibold mt-0.5 ${entry.collapsed && complete ? "text-[#F4F3ED]/60" : "text-gray-400"}`}>
                {new Date(entry.treatmentDate + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" })} · {entry.treatmentTime}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Duplicate */}
          <button type="button" onClick={(e) => { e.stopPropagation(); onDuplicate(entry.id); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              entry.collapsed && complete ? "text-[#F4F3ED]/50 hover:text-[#F4F3ED] hover:bg-white/10" : "text-gray-400 hover:text-[#1D4130] hover:bg-gray-100"
            }`}
            title="Duplikasi entry"
          >
            <CopyIcon className="h-3.5 w-3.5" />
          </button>

          {/* Remove */}
          {total > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(entry.id); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                entry.collapsed && complete ? "text-[#F4F3ED]/50 hover:text-red-300 hover:bg-white/10" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Chevron */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            entry.collapsed && complete ? "text-[#F4F3ED]/60" : "text-gray-400 hover:bg-gray-100"
          }`}>
            {entry.collapsed ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronUpIcon className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Form body */}
      {!entry.collapsed && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-200/60 pt-5">
          {/* Order No with duplicate warning */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">No. Order</label>
            <Input value={entry.orderNo}
              onChange={(e) => set({ orderNo: e.target.value, orderNoError: undefined })}
              type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Contoh: 10293" required
              className={`${inputClass} ${entry.orderNoError ? "!border-red-400 !ring-red-100" : ""}`}
            />
            {entry.orderNoError && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircleIcon className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-500 font-medium">{entry.orderNoError}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Customer</label>
            <Input value={entry.customerName} onChange={(e) => set({ customerName: e.target.value })}
              placeholder="Nama lengkap customer" required className={inputClass} />
          </div>

          <SearchableSelect label="Tipe Customer" value={entry.customerType}
            setValue={(v) => set({ customerType: v })} options={customerTypeOptions} placeholder="Pilih tipe customer" />

          <SearchableSelect label="Treatment" value={entry.facialTypeId}
            setValue={(v) => set({ facialTypeId: v })} options={facialOptions} placeholder="Pilih facial treatment" />

          <SearchableSelect label="Next Treatment" value={entry.nextTreatmentId}
            setValue={(v) => set({ nextTreatmentId: v })} options={facialOptions} optional placeholder="Pilih treatment berikutnya" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tanggal & Waktu</label>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">otomatis</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker dateStr={entry.treatmentDate} onSelect={(d) => set({ treatmentDate: toLocalDateStr(d) })} />
              </div>
              <div className="w-28 flex-shrink-0">
                <input type="time" value={entry.treatmentTime} onChange={(e) => set({ treatmentTime: e.target.value })}
                  className="w-full h-12 px-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:border-[#1D4130] focus:ring-2 focus:ring-[#1D4130]/10 focus:outline-none transition-all text-center font-semibold" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function FormEntry({
  action,
  facials,
  existingOrderNos,
}: {
  action: (data: FormData) => Promise<void>;
  facials: Facial[];
  existingOrderNos: string[];
}) {
  const [entries, setEntries] = useState<EntryData[]>(() => {
    // Restore draft from localStorage on first render
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as EntryData[];
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [buildEntry()];
  });

  const [submitting, setSubmitting] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [drag, setDrag] = useState<DragState>({ draggingId: null, overIdx: null });

  const facialOptions: Option[] = facials.map((f) => ({ value: String(f.id), label: f.name }));
  const existingSet = new Set(existingOrderNos);

  // ── Draft: detect if restored ──────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as EntryData[];
        if (Array.isArray(parsed) && parsed.length > 0 &&
          parsed.some((e) => e.orderNo || e.customerName)) {
          setShowDraftBanner(true);
        }
      }
    } catch {}
  }, []);

  // ── Draft: auto-save on every change ──────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  // ── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "Enter") {
        e.preventDefault();
        handleSubmitAll();
      }
      if (mod && e.key === "d") {
        e.preventDefault();
        addEntry();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ── Warn before leave if data exists ──────────────────────
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      const hasData = entries.some((en) => en.orderNo || en.customerName);
      if (hasData) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [entries]);

  // ── Duplicate order number detection (debounced) ───────────
  const orderNoTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const updateEntry = useCallback((id: string, patch: Partial<EntryData>) => {
    setEntries((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));

      // Debounced duplicate check on orderNo change
      if ("orderNo" in patch && patch.orderNo) {
        clearTimeout(orderNoTimers.current[id]);
        orderNoTimers.current[id] = setTimeout(() => {
          const orderNo = patch.orderNo!.trim();
          // Check against DB existing
          const inDb = existingSet.has(orderNo);
          // Check duplicates within current entries
          const inForm = updated.filter((e) => e.orderNo.trim() === orderNo).length > 1;
          const error = inDb
            ? "Order No. sudah ada di database."
            : inForm
            ? "Order No. duplikat dalam form ini."
            : undefined;
          setEntries((cur) => cur.map((e) => e.id === id ? { ...e, orderNoError: error } : e));
        }, 500);
      }

      return updated;
    });
  }, [existingSet]);

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const toggleCollapse = (id: string) =>
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, collapsed: !e.collapsed } : e));

  const duplicateEntry = (id: string) => {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      const src = prev[idx];
      const clone = buildEntry({
        customerType: src.customerType,
        facialTypeId: src.facialTypeId,
        nextTreatmentId: src.nextTreatmentId,
        treatmentDate: src.treatmentDate,
        treatmentTime: src.treatmentTime,
      });
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
  };

  const addEntry = () => {
    // Get last entry's type/facial as smart default
    const last = entries[entries.length - 1];
    const newEntry = buildEntry({
      customerType: last.customerType,
      facialTypeId: last.facialTypeId,
    });
    setEntries((prev) => [
      ...prev.map((e) => ({ ...e, collapsed: true })),
      newEntry,
    ]);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
  };

  // ── Drag to reorder ────────────────────────────────────────
  const onDragStart = (id: string) => setDrag({ draggingId: id, overIdx: null });
  const onDragEnter = (idx: number) => setDrag((d) => ({ ...d, overIdx: idx }));
  const onDragEnd = () => {
    if (drag.draggingId !== null && drag.overIdx !== null) {
      setEntries((prev) => {
        const from = prev.findIndex((e) => e.id === drag.draggingId);
        const to = drag.overIdx!;
        if (from === to) return prev;
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    }
    setDrag({ draggingId: null, overIdx: null });
  };

  // ── Progress ───────────────────────────────────────────────
  const completedCount = entries.filter(isEntryComplete).length;

  // ── Submit all ─────────────────────────────────────────────
  const handleSubmitAll = async () => {
    // Check for any errors or incomplete
    const firstIncomplete = entries.find((e) => !isEntryComplete(e));
    if (firstIncomplete) {
      toast.error("Ada data yang belum lengkap", {
        description: "Pastikan No. Order, Nama, Tipe, dan Treatment sudah diisi semua.",
      });
      setEntries((prev) => prev.map((e) =>
        e.id === firstIncomplete.id ? { ...e, collapsed: false } : e
      ));
      return;
    }
    const hasErrors = entries.some((e) => e.orderNoError);
    if (hasErrors) {
      toast.error("Ada Order No. yang bermasalah", {
        description: "Periksa kembali nomor order yang ditandai merah.",
      });
      setEntries((prev) => prev.map((e) =>
        e.orderNoError ? { ...e, collapsed: false } : e
      ));
      return;
    }

    setSubmitting(true);
    try {
      for (const entry of entries) {
        const fd = new FormData();
        fd.set("orderNo", entry.orderNo);
        fd.set("customerName", entry.customerName);
        fd.set("customerType", entry.customerType);
        fd.set("facialTypeId", entry.facialTypeId);
        fd.set("nextTreatmentId", entry.nextTreatmentId);
        const finalDate = new Date(`${entry.treatmentDate}T${entry.treatmentTime}:00`);
        fd.set("treatmentDate", finalDate.toISOString());
        await action(fd);
      }

      const count = entries.length;
      toast.success(count > 1 ? `${count} treatment tersimpan!` : "Treatment tersimpan!", {
        description: "Data customer berhasil dicatat.",
      });

      // Clear draft
      localStorage.removeItem(DRAFT_KEY);
      setShowDraftBanner(false);
      setEntries([buildEntry()]);
    } catch {
      toast.error("Gagal menyimpan", { description: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setSubmitting(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftBanner(false);
    setEntries([buildEntry()]);
  };

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 max-w-lg mx-auto font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="mb-5">
        <p className="text-xs text-[#F4F3ED]/60 font-medium mb-1 uppercase tracking-widest">Input Data</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#F4F3ED]">Catat Treatment</h1>
            <p className="text-sm text-[#F4F3ED]/60 mt-1">
              {entries.length > 1
                ? `${completedCount}/${entries.length} entry selesai`
                : "Isi data treatment customer."}
            </p>
          </div>
          {/* Progress bar for multi-entry */}
          {entries.length > 1 && (
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] font-bold text-[#F4F3ED]/50 uppercase tracking-wider">
                {Math.round((completedCount / entries.length) * 100)}%
              </span>
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F4F3ED] rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / entries.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Draft banner */}
      {showDraftBanner && (
        <div className="mb-4 flex items-center justify-between px-4 py-3 bg-amber-500/20 border border-amber-400/30 rounded-2xl">
          <p className="text-xs font-semibold text-amber-200">Draft tersimpan ditemukan</p>
          <div className="flex items-center gap-3">
            <button onClick={clearDraft} className="text-xs font-bold text-amber-300 hover:text-amber-100 transition-colors">
              Hapus
            </button>
            <button onClick={() => setShowDraftBanner(false)} className="text-xs font-bold text-amber-200 hover:text-white transition-colors">
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="mb-4 flex items-center gap-3 text-[10px] text-[#F4F3ED]/30 font-medium">
        <span><kbd className="font-mono">⌘ Enter</kbd> simpan</span>
        <span>·</span>
        <span><kbd className="font-mono">⌘ D</kbd> tambah entry</span>
      </div>

      {/* Entry cards */}
      <div className="space-y-3 mb-4">
        {entries.map((entry, i) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            index={i}
            total={entries.length}
            facialOptions={facialOptions}
            isDraggingOver={drag.overIdx === i && drag.draggingId !== entry.id}
            onUpdate={updateEntry}
            onRemove={removeEntry}
            onToggleCollapse={toggleCollapse}
            onDuplicate={duplicateEntry}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button type="button" onClick={addEntry}
          className="w-full h-12 rounded-2xl border-2 border-dashed border-[#F4F3ED]/20 text-[#F4F3ED]/60 hover:border-[#F4F3ED]/40 hover:text-[#F4F3ED]/80 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold">
          <PlusIcon className="h-4 w-4" />
          Tambah Entry
        </button>

        <div className="flex gap-3">
          <button type="button" onClick={handleSubmitAll} disabled={submitting}
            className="flex-1 h-13 rounded-2xl bg-[#F4F3ED] hover:bg-white active:scale-[0.98] text-[#1D4130] text-sm font-bold transition-all duration-150 disabled:opacity-60 shadow-lg flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Menyimpan...
              </>
            ) : `Simpan${entries.length > 1 ? ` (${entries.length})` : ""}`}
          </button>

          <Link href="/rekap"
            className="h-13 px-5 rounded-2xl border border-[#F4F3ED]/20 hover:border-[#F4F3ED]/40 active:scale-[0.98] text-[#F4F3ED]/70 hover:text-[#F4F3ED] text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2">
            <ClipboardListIcon className="h-4 w-4" />
            Rekap
          </Link>
        </div>
      </div>

    </main>
  );
}