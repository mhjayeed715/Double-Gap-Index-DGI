"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Map, Table, BookOpen, AlertTriangle } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/map", label: "National Map", icon: Map },
    { href: "/gis", label: "GIS Vector", icon: Map },
    { href: "/districts", label: "District Directory", icon: Table },
    { href: "/analysis", label: "ML Analysis", icon: BookOpen },
    { href: "/methodology", label: "Methodology", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white flex-shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.jpeg"
              alt="Double Gap Index (DGI) Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 tracking-tight text-base group-hover:text-cyan-700 transition-colors">
                Double Gap Index
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Bangladesh
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Compounded Digital & Physical Exclusion
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Quick Double Gap Indicator Tag */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>16 Double Gap Districts</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
