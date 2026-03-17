// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#183528] flex flex-col items-center justify-center px-6 font-[family-name:var(--font-geist-sans)]">

      {/* Illustration */}
      <div className="mb-8">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="60" cy="60" r="56" stroke="#F4F3ED" strokeOpacity="0.1" strokeWidth="1.5" />
          {/* Inner circle */}
          <circle cx="60" cy="60" r="40" fill="#F4F3ED" fillOpacity="0.06" />
          {/* 404 leaf icon */}
          <path
            d="M60 80C46 80 38 70 38 60C38 50 46 42 58 42C70 42 74 50 74 58C74 67 67 74 58 74C54 74 51 72 51 72"
            stroke="#F4F3ED"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M51 72C51 72 52 64 58 61C64 58 74 60 74 60"
            stroke="#F4F3ED"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Question mark */}
          <path
            d="M56.5 67V66.2C56.5 64.6 57.4 63.1 58.8 62.3C60.4 61.4 61.5 59.7 61.5 57.8C61.5 55 59.2 52.8 56.5 52.8C53.8 52.8 51.5 55 51.5 57.8"
            stroke="#F4F3ED"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="56.5" cy="70.5" r="1.5" fill="#F4F3ED" fillOpacity="0.7" />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center mb-10">
        <p className="text-[#F4F3ED]/40 text-xs font-bold uppercase tracking-[0.3em] mb-3">
          Error 404
        </p>
        <h1 className="text-3xl font-bold text-[#F4F3ED] mb-3 leading-tight">
          Halaman Tidak<br />Ditemukan
        </h1>
        <p className="text-sm text-[#F4F3ED]/60 leading-relaxed max-w-xs">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="w-full h-13 rounded-full bg-[#F4F3ED] hover:bg-white active:scale-[0.98] text-[#1D4130] font-bold text-sm text-center flex items-center justify-center transition-all duration-150 shadow-lg"
        >
          Kembali
        </Link>
      </div>

    </main>
  );
}