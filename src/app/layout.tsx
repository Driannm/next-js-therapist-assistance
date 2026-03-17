import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geist = Geist({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#183528",
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
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <head>
        <meta name="apple-mobile-web-app-title" content="TheraMate" />
      </head>
      <body className={`${geist.className} bg-[#183528] antialiased`}>
        <div className="min-h-screen w-full flex justify-center bg-[#0f2018]">
          <div className="relative w-full max-w-[768px] min-h-screen bg-[#183528] flex flex-col md:shadow-[0_0_60px_rgba(0,0,0,0.5)]">

            {session && <Navbar userName={session.user?.name} />}

            <div className="flex-1">
              {children}
            </div>

            {session && <BottomNav />}
          </div>
        </div>

        <Toaster position="top-center" richColors />

        <SpeedInsights />
      </body>
    </html>
  );
}