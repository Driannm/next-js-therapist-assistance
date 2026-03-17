"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Target01Icon, CheckmarkCircle01Icon } from "hugeicons-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

export function PengaturanClient({
  currentTarget,
  currentOffDates,
  monthLabel,
  saveTarget,
  saveOffDays,
}: {
  currentTarget: number | null;
  currentOffDates: string[];
  monthLabel: string;
  saveTarget: (formData: FormData) => Promise<void>;
  saveOffDays: (formData: FormData) => Promise<void>;
}) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    currentOffDates.map((d) => new Date(d + "T00:00:00"))
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [savingTarget, setSavingTarget] = useState(false);
  const [savingDays, setSavingDays] = useState(false);
  const targetFormRef = useRef<HTMLFormElement>(null);

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const handleSaveTarget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingTarget(true);
    await saveTarget(new FormData(e.currentTarget));
    setSavingTarget(false);
    toast.success("Target berhasil disimpan!");
  };

  const handleSaveDays = async () => {
    setSavingDays(true);
    const fd = new FormData();
    selectedDates.forEach((d) => fd.append("offDate", toDateStr(d)));
    await saveOffDays(fd);
    setSavingDays(false);
    toast.success("Tanggal libur berhasil disimpan!");
  };

  const formatDateStr = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Label untuk trigger button
  const triggerLabel =
    selectedDates.length === 0
      ? "Pilih tanggal libur"
      : `${selectedDates.length} hari dipilih`;

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-lg space-y-6">

        {/* Header */}
        <div>
          <p className="text-[10px] text-[#F4F3ED]/70 font-bold mb-1 uppercase tracking-[0.2em]">
            Pengaturan
          </p>
          <h1 className="text-2xl font-bold text-[#F4F3ED]">Preferensi Kerja</h1>
          <p className="text-sm text-[#F4F3ED]/70 mt-1">
            Atur target dan jadwal libur kamu.
          </p>
        </div>

        {/* ── Target Bulanan ─────────────────────────── */}
        <div className="bg-[#F4F3ED] rounded-[2rem] p-6 shadow-xl border border-white/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
              <Target01Icon size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Target Bulanan
              </p>
              <p className="text-base font-bold text-gray-900 capitalize">{monthLabel}</p>
            </div>
          </div>

          {currentTarget && (
            <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <CheckmarkCircle01Icon size={18} className="text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-800 font-medium">
                Target saat ini:{" "}
                <span className="font-bold text-emerald-600">{currentTarget} pasien</span>
              </p>
            </div>
          )}

          <form ref={targetFormRef} onSubmit={handleSaveTarget} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Jumlah Target Pasien
              </label>
              <input
                name="targetPatients"
                type="number"
                min={1}
                max={999}
                defaultValue={currentTarget ?? ""}
                placeholder="Contoh: 80"
                required
                className="w-full h-14 rounded-full border-none shadow-sm bg-white px-6 text-base font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4130] transition-all"
              />
            </div>
            <SaveButton
              loading={savingTarget}
              label={currentTarget ? "Perbarui Target" : "Simpan Target"}
              color="green"
            />
          </form>
        </div>

        {/* ── Tanggal Libur ──────────────────────────── */}
        <div className="bg-[#F4F3ED] rounded-[2rem] p-6 shadow-xl border border-white/50 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                Hari Libur
              </p>
              <p className="text-base font-bold text-gray-900">Pilih Tanggal</p>
            </div>
          </div>

          <p className="text-xs font-medium text-gray-500 leading-relaxed">
            Pilih tanggal libur spesifik. Hari ini akan ditandai merah pada grafik dashboard.
          </p>

          {/* Date Picker — Popover + Calendar */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-14 rounded-full bg-white shadow-sm flex items-center gap-3 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-100"
              >
                <CalendarIcon className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className={selectedDates.length === 0 ? "text-gray-400" : "text-gray-800"}>
                  {triggerLabel}
                </span>
                {selectedDates.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {selectedDates.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-0 rounded-3xl border border-gray-100 shadow-2xl overflow-hidden"
              align="center"
            >
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates ?? [])}
                locale={id}
                initialFocus
                classNames={{
                  months: "p-3",
                  month: "space-y-3",
                  caption: "flex justify-center items-center relative px-2 py-1",
                  caption_label: "text-sm font-bold text-gray-900 capitalize",
                  nav: "flex items-center gap-1",
                  nav_button:
                    "h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell:
                    "w-9 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-1.5",
                  row: "flex w-full mt-1",
                  cell: "w-9 text-center p-0",
                  day: "h-9 w-9 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors mx-auto flex items-center justify-center",
                  day_selected:
                    "!bg-red-500 !text-white hover:!bg-red-600 font-bold",
                  day_today:
                    "border-2 border-[#1D4130] text-[#1D4130] font-bold",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-200 cursor-not-allowed opacity-40",
                }}
              />

              {/* Footer inside popover */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                <span className="text-xs text-gray-500 font-medium">
                  {selectedDates.length} dipilih
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarOpen(false)}
                  className="text-xs font-bold text-[#1D4130] hover:underline underline-offset-2"
                >
                  Selesai
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Chips tanggal terpilih */}
          {selectedDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[...selectedDates]
                .sort((a, b) => a.getTime() - b.getTime())
                .map((d) => (
                  <div
                    key={toDateStr(d)}
                    className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-red-50 border border-red-100"
                  >
                    <span className="text-[11px] font-bold text-red-600">
                      {formatDateStr(d)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDates((prev) =>
                          prev.filter((x) => toDateStr(x) !== toDateStr(d))
                        )
                      }
                      className="w-5 h-5 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          )}

          <SaveButton
            loading={savingDays}
            label="Simpan Tanggal Libur"
            color="red"
            onClick={handleSaveDays}
          />
        </div>

      </div>
    </main>
  );
}

function SaveButton({
  loading,
  label,
  color,
  onClick,
}: {
  loading: boolean;
  label: string;
  color: "green" | "red";
  onClick?: () => void;
}) {
  const base =
    "w-full h-14 rounded-full font-bold text-sm transition-all duration-150 shadow-md disabled:opacity-70 flex justify-center items-center active:scale-[0.98]";
  const colors =
    color === "green"
      ? "bg-[#1D4130] hover:bg-[#153023] text-[#F4F3ED]"
      : "bg-red-500 hover:bg-red-600 text-white shadow-red-200";

  return (
    <button
      type={onClick ? "button" : "submit"}
      disabled={loading}
      onClick={onClick}
      className={`${base} ${colors}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Menyimpan...
        </span>
      ) : (
        label
      )}
    </button>
  );
}