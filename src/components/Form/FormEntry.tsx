"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
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
import { CheckIcon, ChevronDownIcon, CalendarIcon } from "lucide-react";
import { id } from "date-fns/locale";

type Facial = { id: number; name: string };
type Option = { value: string; label: string };

const customerTypeOptions: Option[] = [
  { value: "External Client", label: "External Client" },
  { value: "ZEP", label: "ZEP" },
];

const inputClass =
  "w-full h-12 px-4 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1D4130] focus:ring-2 focus:ring-[#1D4130]/10 focus:outline-none transition-all duration-150";

// ─── Helpers ────────────────────────────────────────────────────────────────

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toLocalTimeStr(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}

function buildDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

// ─── Searchable Select ──────────────────────────────────────────────────────

function SearchableSelect({
  label,
  name,
  value,
  setValue,
  options,
  optional,
  placeholder = "Pilih opsi",
}: {
  label: string;
  name: string;
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
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {label}
        </label>
        {optional && (
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            opsional
          </span>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`${inputClass} flex items-center justify-between text-left ${!selected ? "text-gray-400" : "text-gray-900"}`}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronDownIcon className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          align="start"
        >
          <Command>
            <div className="px-3 pt-3 pb-1">
              <CommandInput placeholder="Cari..." className="h-9 text-sm border border-gray-200 rounded-xl px-3 focus:border-[#1D4130] focus:ring-0" />
            </div>
            <CommandEmpty className="py-4 text-center text-sm text-gray-400">Tidak ditemukan.</CommandEmpty>
            <CommandGroup className="max-h-52 overflow-auto p-1.5">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => { setValue(opt.value); setOpen(false); }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm cursor-pointer text-gray-700 data-[selected=true]:bg-[#F4F3ED]"
                >
                  <span>{opt.label}</span>
                  {value === opt.value && <CheckIcon className="h-4 w-4 text-[#1D4130]" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <input type="hidden" name={name} value={value} />
    </div>
  );
}

// ─── Date Picker ─────────────────────────────────────────────────────────────

function DatePicker({
  selected,
  onSelect,
}: {
  selected: Date;
  onSelect: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`${inputClass} flex items-center gap-3 text-left text-gray-900`}
        >
          <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span>
            {selected.toLocaleDateString("id-ID", {
              weekday: "short",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              // Preserve existing time when changing date
              const next = new Date(d);
              next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
              onSelect(next);
              setOpen(false);
            }
          }}
          locale={id}
          initialFocus
          classNames={{
            months: "p-3",
            month: "space-y-3",
            caption: "flex justify-center items-center relative px-2 py-1",
            caption_label: "text-sm font-bold text-gray-900 capitalize",
            nav: "flex items-center gap-1",
            nav_button: "h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "w-9 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-1.5",
            row: "flex w-full mt-1",
            cell: "w-9 text-center p-0",
            day: "h-9 w-9 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors mx-auto flex items-center justify-center",
            day_selected: "!bg-[#1D4130] !text-white hover:!bg-[#153023] font-bold",
            day_today: "border-2 border-[#1D4130] text-[#1D4130] font-bold",
            day_outside: "text-gray-300 opacity-50",
          }}
        />
        {/* Footer: close */}
        <div className="flex justify-end px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-bold text-[#1D4130] hover:underline underline-offset-2"
          >
            Selesai
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Submit Button ────────────────────────────────────────────────────────────

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 h-12 rounded-2xl bg-[#1D4130] hover:bg-[#153023] active:scale-[0.98] text-[#F4F3ED] text-sm font-bold transition-all duration-150 disabled:opacity-60 shadow-md"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Menyimpan...
        </span>
      ) : (
        "Simpan Treatment"
      )}
    </button>
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
  const formRef = useRef<HTMLFormElement>(null);
  const [customerType, setCustomerType] = useState("");
  const [facialType, setFacialType] = useState("");
  const [nextTreatment, setNextTreatment] = useState("");

  // Default to now, user can change
  const [treatmentDate, setTreatmentDate] = useState<Date>(new Date());
  const [treatmentTime, setTreatmentTime] = useState<string>(toLocalTimeStr(new Date()));

  const facialOptions: Option[] = facials.map((f) => ({
    value: String(f.id),
    label: f.name,
  }));

  // The final datetime combining date picker + time input
  const finalDateTime = buildDateTime(toLocalDateStr(treatmentDate), treatmentTime);

  async function handleSubmit(formData: FormData) {
    // Inject the combined datetime
    formData.set("treatmentDate", finalDateTime.toISOString());

    try {
      await action(formData);
      toast.success("Treatment tersimpan!", {
        description: "Data customer berhasil dicatat.",
      });
      const now = new Date();
      formRef.current?.reset();
      setCustomerType("");
      setFacialType("");
      setNextTreatment("");
      setTreatmentDate(now);
      setTreatmentTime(toLocalTimeStr(now));
    } catch {
      toast.error("Gagal menyimpan", {
        description: "Terjadi kesalahan. Coba lagi.",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 max-w-lg mx-auto font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="mb-7">
        <p className="text-xs text-[#F4F3ED]/60 font-medium mb-1 uppercase tracking-widest">Input Data</p>
        <h1 className="text-2xl font-bold text-[#F4F3ED]">Catat Treatment</h1>
        <p className="text-sm text-[#F4F3ED]/60 mt-1">Isi data treatment customer dengan lengkap.</p>
      </div>

      {/* Form card */}
      <div className="bg-[#F4F3ED] rounded-[2rem] px-6 py-7 shadow-xl">
        <form ref={formRef} action={handleSubmit} className="space-y-5">

          <FormField label="No. Order">
            <Input name="orderNo" type="text" inputMode="numeric" pattern="[0-9]*"
              placeholder="Contoh: 10293" required autoFocus className={inputClass} />
          </FormField>

          <FormField label="Nama Customer">
            <Input name="customerName" placeholder="Nama lengkap customer" required className={inputClass} />
          </FormField>

          <SearchableSelect label="Tipe Customer" name="customerType" value={customerType}
            setValue={setCustomerType} options={customerTypeOptions} placeholder="Pilih tipe customer" />

          <SearchableSelect label="Treatment" name="facialTypeId" value={facialType}
            setValue={setFacialType} options={facialOptions} placeholder="Pilih facial treatment" />

          <SearchableSelect label="Next Treatment" name="nextTreatmentId" value={nextTreatment}
            setValue={setNextTreatment} options={facialOptions} optional placeholder="Pilih treatment berikutnya" />

          {/* Date & Time — side by side */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Tanggal & Waktu
              </label>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                otomatis
              </span>
            </div>
            <div className="flex gap-2">
              {/* Date picker */}
              <div className="flex-1">
                <DatePicker
                  selected={treatmentDate}
                  onSelect={(d) => setTreatmentDate(d)}
                />
              </div>

              {/* Time input */}
              <div className="w-28 flex-shrink-0">
                <input
                  type="time"
                  value={treatmentTime}
                  onChange={(e) => setTreatmentTime(e.target.value)}
                  className="w-full h-12 px-3 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:border-[#1D4130] focus:ring-2 focus:ring-[#1D4130]/10 focus:outline-none transition-all text-center font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <SubmitButton />
            <Link
              href="/rekap"
              className="h-12 px-5 rounded-2xl border-2 border-[#1D4130]/20 bg-white hover:bg-gray-50 active:scale-[0.98] text-[#1D4130] text-sm font-bold transition-all duration-150 flex items-center justify-center"
            >
              Lihat Rekap
            </Link>
          </div>
        </form>
      </div>

    </main>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}