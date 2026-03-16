import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { getServerSession } from "next-auth";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Therapist Assistant",
  description: "Made with love for my wife",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="id">
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