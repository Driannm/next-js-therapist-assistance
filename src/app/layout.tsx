import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { getServerSession } from "next-auth";

const geist = Geist({ subsets: ["latin"] });

// 1. TAMBAHKAN VIEWPORT INI UNTUK MENCEGAH PINCH-TO-ZOOM
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdf8f6", // Warna menyesuaikan background body kamu
};

export const metadata: Metadata = {
  title: "Therapist Assistant",
  description: "Made with love for my wife",
  appleWebApp: {
    title: "TheraMate",
    capable: true,
    statusBarStyle: "default",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="id">
      {/* Meta title untuk Apple Home Screen bisa dipindah ke appleWebApp di atas, tapi dibiarkan aman */}
      <meta name="apple-mobile-web-app-title" content="TheraMate" />
      <body className={`${geist.className} bg-[#fdf8f6] antialiased`}>
        {session && <Navbar userName={session.user?.name} />}
        {children}
        {session && <BottomNav />}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}