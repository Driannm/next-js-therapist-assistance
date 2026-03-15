"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Username atau password tidak valid.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F3ED] p-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md bg-[#F4F3ED] rounded-[2rem] p-8 relative">

        {/* Logo Header */}
        <div className="flex justify-center mb-8">
          <div className="h-10 w-12 relative">
            <Image src="/TheraMate.png" alt="TheraMate Logo" layout="fill" objectFit="contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-sm text-gray-500">Welcome back! Please enter your details to continue</p>
        </div>

        {/* Social Logins — Coming Soon */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 bg-white py-3.5 rounded-full text-sm font-medium text-gray-400 shadow-sm cursor-not-allowed select-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" opacity="0.4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" opacity="0.4"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" opacity="0.4"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" opacity="0.4"/>
              </svg>
              Sign in with Google
            </button>
            <span className="absolute -top-2 right-3 bg-amber-100 text-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 tracking-wide">
              Coming Soon
            </span>
          </div>

          <div className="relative">
            <button
              disabled
              className="w-full flex items-center justify-center gap-3 bg-white py-3.5 rounded-full text-sm font-medium text-gray-400 shadow-sm cursor-not-allowed select-none"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#bbb">
                <path d="M16.365 14.39c-.015-3.08 2.506-4.542 2.617-4.606-1.435-2.097-3.65-2.38-4.442-2.42-1.89-.19-3.69 1.11-4.65 1.11-.95 0-2.43-1.09-3.98-1.06-2.02.03-3.89 1.18-4.93 2.98-2.11 3.65-.54 9.04 1.52 12.01 1.01 1.46 2.18 3.1 3.75 3.04 1.5-.06 2.07-.98 3.88-.98 1.8 0 2.33.98 3.88.95 1.59-.03 2.6-1.5 3.59-2.96 1.15-1.68 1.62-3.32 1.65-3.4-.04-.01-3.18-1.22-3.19-4.67zM11.9 4.34c.82-1 1.38-2.39 1.23-3.78-1.18.05-2.62.79-3.46 1.79-.76.88-1.42 2.31-1.24 3.67 1.31.1 2.65-.67 3.47-1.68z"/>
              </svg>
              Sign in with Apple
            </button>
            <span className="absolute -top-2 right-3 bg-amber-100 text-amber-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 tracking-wide">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-medium text-gray-400 tracking-wider">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Username / Email */}
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-gray-800 mb-2 ml-1">
              Username <span className="text-[#1D4130]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                autoComplete="username"
                className="w-full bg-white text-sm py-3.5 pl-11 pr-4 rounded-full border-none focus:ring-2 focus:ring-[#1D4130] focus:outline-none shadow-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 ml-1">
              <label className="text-[13px] font-semibold text-gray-800">
                Password <span className="text-[#1D4130]">*</span>
              </label>
              <Link href="/forgot-password" className="text-[13px] font-semibold text-[#1D4130] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
                className="w-full bg-white text-sm py-3.5 pl-11 pr-12 rounded-full border-none focus:ring-2 focus:ring-[#1D4130] focus:outline-none shadow-sm placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D4130] text-white font-medium py-3.5 rounded-full hover:bg-[#153023] active:scale-[0.98] transition-all focus:ring-4 focus:ring-[#1D4130]/30 shadow-md disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Memverifikasi...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#1D4130] hover:underline underline-offset-2">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}