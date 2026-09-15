"use client";

import Link from "next/link";
import { ArrowDown, AlertOctagon, Smartphone, Building2, Layers } from "lucide-react";

interface HeroProps {
  stats: {
    totalDistricts: number;
    doubleGapCount: number;
    doubleGapPercentage: number;
    avgDigitalScore: number;
    avgServiceScore: number;
  };
}

export default function Hero({ stats }: HeroProps) {
  return (
    <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Policy Header Tag */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white tracking-wide uppercase text-[10px]">
            <Layers className="w-3 h-3 text-cyan-400" />
            National Policy Index
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
            BBS ICT 2024-25 • OSM Facility Data • Census 2022
          </span>
        </div>

        {/* Headline */}
        <div className="max-w-4xl mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Mapping Where Digital Exclusion and Physical Service Exclusion Compound in Bangladesh
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            A district with weak clinics but good internet can partly cope via telemedicine. A district with no internet but nearby facilities gets care in person.
            <strong className="text-slate-900 font-semibold"> Double Gap districts have neither</strong> — no digital workaround and no physical access.
          </p>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Districts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Coverage</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.totalDistricts}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              All 64 districts across 8 divisions
            </p>
          </div>

          {/* Double Gap Critical Count */}
          <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none hazard-pattern opacity-40 rounded-bl-xl" />
            <div className="flex items-center justify-between text-rose-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Double Gap Zone
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-800">
                {stats.doubleGapPercentage}% of nation
              </span>
            </div>
            <div className="text-3xl font-extrabold text-rose-700 tracking-tight">
              {stats.doubleGapCount} <span className="text-sm font-normal text-rose-600">districts</span>
            </div>
            <p className="text-xs text-rose-700/80 mt-1 font-medium">
              Below 0.40 threshold on BOTH axes
            </p>
          </div>

          {/* Average Digital Access */}
          <div className="bg-cyan-50/40 p-5 rounded-xl border border-cyan-200 shadow-sm">
            <div className="flex items-center justify-between text-cyan-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                National Digital Score
              </span>
              <span className="text-[10px] text-cyan-700 font-mono">0.0 – 1.0</span>
            </div>
            <div className="text-3xl font-bold text-cyan-900 tracking-tight">
              {stats.avgDigitalScore.toFixed(2)}
            </div>
            <p className="text-xs text-cyan-800/80 mt-1">
              Internet, smartphone, skills & gender parity
            </p>
          </div>

          {/* Average Service Access */}
          <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200 shadow-sm">
            <div className="flex items-center justify-between text-amber-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                National Service Score
              </span>
              <span className="text-[10px] text-amber-700 font-mono">0.0 – 1.0</span>
            </div>
            <div className="text-3xl font-bold text-amber-900 tracking-tight">
              {stats.avgServiceScore.toFixed(2)}
            </div>
            <p className="text-xs text-amber-800/80 mt-1">
              Healthcare, education & transit per capita
            </p>
          </div>
        </div>

        {/* Action Controls & Methodology Note */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/80 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Link
              href="#map-section"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              Explore National Map
              <ArrowDown className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="#quadrant-section"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              View 2x2 Quadrant Chart
            </Link>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Strict policy rule: the two scores are <strong>never blended</strong> into one number.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
