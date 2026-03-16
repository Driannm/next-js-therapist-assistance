"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Target01Icon, Calendar01Icon, CheckmarkCircle01Icon } from "hugeicons-react";

const DAYS = [
  { label: "Min", full: "Minggu",  value: 0 },
  { label: "Sen", full: "Senin",   value: 1 },
  { label: "Sel", full: "Selasa",  value: 2 },
  { label: "Rab", full: "Rabu",    value: 3 },
  { label: "Kam", full: "Kamis",   value: 4 },
  { label: "Jum", full: "Jumat",   value: 5 },
  { label: "Sab", full: "Sabtu",   value: 6 },
];

export function PengaturanClient({
  currentTarget,
  currentOffDays,
  monthLabel,
  saveTarget,
  saveOffDays,
}: {
  currentTarget: number | null;
  currentOffDays: number[];
  monthLabel: string;
  saveTarget: (formData: FormData) => Promise<void>;
  saveOffDays: (formData: FormData) => Promise<void>;
}) {
  const [selectedDays, setSelectedDays] = useState<number[]>(currentOffDays);
  const [savingTarget, setSavingTarget] = useState(false);
  const [savingDays, setSavingDays] = useState(false);
  const targetFormRef = useRef<HTMLFormElement>(null);

  const toggleDay = (val: number) => {
    setSelectedDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val]
    );
  };

  const handleSaveTarget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingTarget(true);
    const fd = new FormData(e.currentTarget);
    await saveTarget(fd);
    setSavingTarget(false);
    toast.success("Target berhasil disimpan!");
  };

  const handleSaveDays = async () => {
    setSavingDays(true);
    const fd = new FormData();
    selectedDays.forEach((d) => fd.append("offDay", String(d)));
    await saveOffDays(fd);
    setSavingDays(false);
    toast.success("Hari libur berhasil disimpan!");
  };

  return (
    <main className="min-h-screen bg-[#183528] px-4 pt-8 pb-28 max-w-lg mx-auto space-y-5 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div>
        <p className="text-xs text-[#F4F3ED]/60 font-medium mb-1 uppercase tracking-widest">
          Pengaturan
        </p>
        <h1 className="text-2xl font-bold text-[#F4F3ED]">Preferensi Kerja</h1>
        <p className="text-sm text-[#F4F3ED]/60 mt-1">
          Atur target dan jadwal libur kamu.
        </p>
      </div>

      {/* ── Target Bulanan ──────────────────────────── */}
      <div className="bg-[#F4F3ED] rounded-[2rem] px-6 py-6 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
            <Target01Icon size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Target Bulanan
            </p>
            <p className="text-sm font-bold text-gray-800 capitalize">{monthLabel}</p>
          </div>
        </div>

        {currentTarget && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
            <CheckmarkCircle01Icon size={16} className="text-emerald-500 flex-shrink-0" />
            <p className="text-sm text-emerald-700 font-semibold">
              Target saat ini: <span className="font-bold">{currentTarget} pasien</span>
            </p>
          </div>
        )}

        <form ref={targetFormRef} onSubmit={handleSaveTarget} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
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
              className="w-full h-14 rounded-2xl border border-gray-200 bg-white px-5 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1D4130]/30 focus:border-[#1D4130] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={savingTarget}
            className="w-full h-13 rounded-2xl bg-[#1D4130] hover:bg-[#153023] active:scale-[0.98] text-[#F4F3ED] font-bold text-sm transition-all duration-150 disabled:opacity-60 shadow-md"
          >
            {savingTarget ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              currentTarget ? "Perbarui Target" : "Simpan Target"
            )}
          </button>
        </form>
      </div>

      {/* ── Hari Libur ──────────────────────────────── */}
      <div className="bg-[#F4F3ED] rounded-[2rem] px-6 py-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#1D4130] shadow-sm">
            <Calendar01Icon size={18} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              Hari Libur
            </p>
            <p className="text-sm font-bold text-gray-800">Jadwal Mingguan</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-5">
          Hari libur akan ditandai merah di grafik treatment dashboard.
        </p>

        {/* Day toggles */}
        <div className="grid grid-cols-7 gap-1.5 mb-5">
          {DAYS.map((day) => {
            const selected = selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`flex flex-col items-center py-3 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                  selected
                    ? "bg-red-500 text-white shadow-md shadow-red-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <span>{day.label}</span>
              </button>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mb-5 min-h-[24px]">
          {selectedDays.length === 0 ? (
            <p className="text-xs text-gray-400">Tidak ada hari libur dipilih.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedDays
                .sort((a, b) => a - b)
                .map((d) => (
                  <span
                    key={d}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100"
                  >
                    {DAYS.find((x) => x.value === d)?.full}
                  </span>
                ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSaveDays}
          disabled={savingDays}
          className="w-full h-13 rounded-2xl bg-[#1D4130] hover:bg-[#153023] active:scale-[0.98] text-[#F4F3ED] font-bold text-sm transition-all duration-150 disabled:opacity-60 shadow-md"
        >
          {savingDays ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            "Simpan Hari Libur"
          )}
        </button>
      </div>

    </main>
  );
}