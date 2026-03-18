"use client";

import { useRef, useState, useId } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import {
  CheckIcon,
  ChevronDownIcon,
  CalendarIcon,
  PlusIcon,
  ChevronUpIcon,
  Trash2Icon,
  ClipboardListIcon,
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

// ─── Types ───────────────────────────────────────────────────────────────────

type EntryData = {
  id: string;
  collapsed: boolean;
  orderNo: string;
  customerName: string;
  customerType: string;
  facialTypeId: string;
  nextTreatmentId: string;
  treatmentDate: Date;
  treatmentTime: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toLocalTimeStr(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildEntry(): EntryData {
  const now = new Date();
  return {
    id: Math.random().toString(36).slice(2),
    collapsed: false,
    orderNo: "",
    customerName: "",
    customerType: "",
    facialTypeId: "",
    nextTreatmentId: "",
    treatmentDate: now,
    treatmentTime: toLocalTimeStr(now),
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function SearchableSelect({
  label,
  value,
  setValue,
  options,
  optional,
  placeholder = "Pilih opsi",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: Option[];
  optional?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
        {optional && (
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            opsional
          </span>
        )}
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

function DatePicker({ selected, onSelect }: { selected: Date; onSelect: (d: Date) => void }) {
  const [open, setOpen] = useState(false);
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
          onSelect={(d) => {
            if (d) {
              const next = new Date(d);
              next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
              onSelect(next);
              setOpen(false);
            }
          }}
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

// ─── Single Entry Card ───────────────────────────────────────────────────────

function EntryCard({
  entry,
  index,
  total,
  facialOptions,
  onUpdate,
  onRemove,
  onToggleCollapse,
}: {
  entry: EntryData;
  index: number;
  total: number;
  facialOptions: Option[];
  onUpdate: (id: string, patch: Partial<EntryData>) => void;
  onRemove: (id: string) => void;
  onToggleCollapse: (id: string) => void;
}) {
  const set = (patch: Partial<EntryData>) => onUpdate(entry.id, patch);

  return (
    <div className="bg-[#F4F3ED] rounded-[2rem] shadow-xl overflow-hidden border border-white/50">
      {/* Card header — always visible */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        onClick={() => onToggleCollapse(entry.id)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#183528] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-black text-[#F4F3ED]">{index + 1}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {entryLabel(entry, facialOptions)}
            </p>
            {entry.collapsed && (
              <p className="text-[10px] text-gray-400 font-semibold">
                {entry.treatmentDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} · {entry.treatmentTime}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {total > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(entry.id); }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
            {entry.collapsed
              ? <ChevronDownIcon className="h-4 w-4" />
              : <ChevronUpIcon className="h-4 w-4" />
            }
          </div>
        </div>
      </div>

      {/* Form fields — collapsible */}
      {!entry.collapsed && (
        <div className="px-6 pb-6 space-y-5 border-t border-gray-200/60 pt-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">No. Order</label>
            <Input value={entry.orderNo} onChange={(e) => set({ orderNo: e.target.value })}
              type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Contoh: 10293" required className={inputClass} />
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

          {/* Date & Time */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tanggal & Waktu</label>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">otomatis</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <DatePicker selected={entry.treatmentDate} onSelect={(d) => set({ treatmentDate: d })} />
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

// ─── Main Form ────────────────────────────────────────────────────────────────

export function FormEntry({
  action,
  facials,
}: {
  action: (data: FormData) => Promise<void>;
  facials: Facial[];
}) {
  const [entries, setEntries] = useState<EntryData[]>([buildEntry()]);
  const [submitting, setSubmitting] = useState(false);

  const facialOptions: Option[] = facials.map((f) => ({
    value: String(f.id),
    label: f.name,
  }));

  const updateEntry = (id: string, patch: Partial<EntryData>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const removeEntry = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const toggleCollapse = (id: string) =>
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, collapsed: !e.collapsed } : e))
    );

  const addEntry = () => {
    const newEntry = buildEntry();
    // Collapse all existing entries first
    setEntries((prev) => [
      ...prev.map((e) => ({ ...e, collapsed: true })),
      newEntry,
    ]);
    // Scroll to bottom after render
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
  };

  const handleSubmitAll = async () => {
    // Basic validation
    for (const entry of entries) {
      if (!entry.orderNo || !entry.customerName || !entry.customerType || !entry.facialTypeId) {
        toast.error("Ada data yang belum lengkap", {
          description: "Pastikan No. Order, Nama, Tipe, dan Treatment sudah diisi semua.",
        });
        // Expand the problematic entry
        const incomplete = entries.find(
          (e) => !e.orderNo || !e.customerName || !e.customerType || !e.facialTypeId
        );
        if (incomplete) setEntries((prev) => prev.map((e) => e.id === incomplete.id ? { ...e, collapsed: false } : e));
        return;
      }
    }

    setSubmitting(true);

    try {
      // Submit all entries sequentially
      for (const entry of entries) {
        const fd = new FormData();
        fd.set("orderNo", entry.orderNo);
        fd.set("customerName", entry.customerName);
        fd.set("customerType", entry.customerType);
        fd.set("facialTypeId", entry.facialTypeId);
        fd.set("nextTreatmentId", entry.nextTreatmentId);
        const finalDate = new Date(`${toLocalDateStr(entry.treatmentDate)}T${entry.treatmentTime}:00`);
        fd.set("treatmentDate", finalDate.toISOString());
        await action(fd);
      }

      const count = entries.length;
      toast.success(
        count > 1 ? `${count} treatment tersimpan!` : "Treatment tersimpan!",
        { description: "Data customer berhasil dicatat." }
      );

      // Reset to single blank entry
      setEntries([buildEntry()]);
    } catch {
      toast.error("Gagal menyimpan", { description: "Terjadi kesalahan. Coba lagi." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 max-w-lg mx-auto font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="mb-7">
        <p className="text-xs text-[#F4F3ED]/60 font-medium mb-1 uppercase tracking-widest">Input Data</p>
        <h1 className="text-2xl font-bold text-[#F4F3ED]">Catat Treatment</h1>
        <p className="text-sm text-[#F4F3ED]/60 mt-1">
          {entries.length > 1 ? `${entries.length} treatment akan disimpan sekaligus.` : "Isi data treatment customer."}
        </p>
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
            onUpdate={updateEntry}
            onRemove={removeEntry}
            onToggleCollapse={toggleCollapse}
          />
        ))}
      </div>

      {/* Actions — outside cards */}
      <div className="space-y-3">
        {/* Add entry button */}
        <button
          type="button"
          onClick={addEntry}
          className="w-full h-12 rounded-2xl border-2 border-dashed border-[#F4F3ED]/20 text-[#F4F3ED]/60 hover:border-[#F4F3ED]/40 hover:text-[#F4F3ED]/80 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <PlusIcon className="h-4 w-4" />
          Tambah Entry
        </button>

        <div className="flex gap-3">
          {/* Submit all */}
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={submitting}
            className="flex-1 h-13 rounded-2xl bg-[#F4F3ED] hover:bg-white active:scale-[0.98] text-[#1D4130] text-sm font-bold transition-all duration-150 disabled:opacity-60 shadow-lg flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                Simpan{entries.length > 1 ? ` (${entries.length})` : ""}
              </>
            )}
          </button>

          {/* Rekap link */}
          <Link
            href="/recap"
            className="h-13 px-5 rounded-2xl border border-[#F4F3ED]/20 hover:border-[#F4F3ED]/40 active:scale-[0.98] text-[#F4F3ED]/70 hover:text-[#F4F3ED] text-sm font-bold transition-all duration-150 flex items-center justify-center gap-2"
          >
            <ClipboardListIcon className="h-4 w-4" />
            Rekap
          </Link>
        </div>
      </div>

    </main>
  );
}