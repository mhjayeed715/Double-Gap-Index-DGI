import Link from "next/link";
import Image from "next/image";
import { BookOpen, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="relative w-7 h-7 rounded-md overflow-hidden border border-slate-700 bg-white flex-shrink-0">
                <Image
                  src="/logo.jpeg"
                  alt="Double Gap Index (DGI) Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-white text-sm tracking-tight">
                Double Gap Index (Bangladesh)
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              An interpretable policy intelligence framework identifying Bangladeshi districts where digital exclusion and physical service access gaps compound simultaneously. Built on verified BBS and OpenStreetMap records.
            </p>
            <div className="mt-3 text-[11px] text-slate-500">
              Core Principle: Digital Access Score and Physical Service Access Score are strictly independent and never blended.
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Platform Views
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/#map-section" className="hover:text-white transition-colors">
                  National Choropleth Map
                </Link>
              </li>
              <li>
                <Link href="/#quadrant-section" className="hover:text-white transition-colors">
                  2x2 Quadrant Matrix
                </Link>
              </li>
              <li>
                <Link href="/#explorer-section" className="hover:text-white transition-colors">
                  District Explorer & CSV
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-white transition-colors flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Full Methodology & Formulas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Data Sources */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Primary Data Citations
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>
                <span className="text-white block font-medium">BBS ICT Survey 2024-25</span>
                District digital access, skills & gender gap
              </li>
              <li>
                <span className="text-white block font-medium">OpenStreetMap (March 2026)</span>
                Healthcare, education & transit density
              </li>
              <li>
                <span className="text-white block font-medium">BBS Census 2022</span>
                District population normalizations
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Double Gap Index (DGI). Free, open-access policy research asset.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/methodology" className="hover:text-slate-300 transition-colors">
              Methodology & Limitations
            </Link>
            <Link
              href="/api/districts"
              target="_blank"
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              Public API (REST)
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
