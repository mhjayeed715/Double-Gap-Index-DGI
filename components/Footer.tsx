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
              An interpretable policy intelligence framework identifying Bangladeshi districts where digital exclusion and physical service access gaps compound simultaneously. Evaluates all 64 districts using 100% CAPI enumeration from BBS Census 2022 and travel-time accessibility models.
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
                <a href="#map-section" className="text-xs hover:text-white transition-colors">
                  National Choropleth Map
                </a>
              </li>
              <li>
                <a href="#quadrant-section" className="text-xs hover:text-white transition-colors">
                  2x2 Policy Quadrant Matrix
                </a>
              </li>
              <li>
                <a href="#districts-table-section" className="text-xs hover:text-white transition-colors">
                  64-District Directory
                </a>
              </li>
              <li>
                <a href="#methodology-preview" className="text-xs hover:text-white transition-colors">
                  Methodology &amp; Formulae
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Data Sources */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Data Status &amp; Citations
            </h4>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li>
                <span className="text-white block font-medium">BBS Census 2022 (Admin 02)</span>
                100% CAPI enumeration for digital indicators &amp; electricity
              </li>
              <li>
                <span className="text-white block font-medium">HeiGIT / HDX Models</span>
                Travel-time accessibility models (OpenRouteService &amp; WorldPop)
              </li>
              <li>
                <span className="text-white block font-medium">LGED GIS Registries</span>
                Secondary administrative school &amp; clinic counts
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} Double Gap Index (DGI).</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>
              Made by{" "}
              <a
                href="https://www.jayeed.pro.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-300 transition-colors inline-flex items-center gap-1"
              >
                Jayeed
                <ExternalLink className="w-3 h-3 text-cyan-400/80" />
              </a>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
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
