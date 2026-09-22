import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Double Gap Index (DGI) — Compounded Exclusion in Bangladesh",
  description:
    "An interpretable policy intelligence framework identifying Bangladeshi districts where digital exclusion and physical service access gaps compound simultaneously.",
  keywords: [
    "Double Gap Index",
    "Bangladesh",
    "Digital Exclusion",
    "Service Exclusion",
    "UNDP",
    "Policy Analytics",
    "BBS ICT Survey",
    "Interpretable Machine Learning",
  ],
  authors: [{ name: "Double Gap Index Team" }],
  icons: {
    icon: [
      { url: "/logo.jpeg" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body
        className="font-sans bg-white text-slate-900 antialiased min-h-[100dvh] flex flex-col selection:bg-cyan-100 selection:text-cyan-900"
        suppressHydrationWarning
      >
        <SmoothScroll>
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-950 px-4 py-2 text-xs text-center flex flex-wrap items-center justify-center gap-2">
            <span className="font-bold uppercase tracking-wider bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded text-[10px] border border-emerald-300/60">
              Empirical Pilot
            </span>
            <span>
              Recomputed from <strong>BBS Census 2022 Admin 02</strong> (100% CAPI enumeration, N=165.1M) & <strong>HeiGIT HDX accessibility models</strong>. Dual-median policy baseline (16 districts).
            </span>
          </div>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
