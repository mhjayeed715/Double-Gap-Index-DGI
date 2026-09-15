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
        <div className="max-w-6xl mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Mapping Compounded Digital and Physical Service Exclusion Across Bangladesh
          </h1>
          <p className="mt-5 text-base sm:text-xl text-slate-600 leading-relaxed max-w-4xl font-normal">
            A district with weak clinics but reliable connectivity can cope through telemedicine and digital workarounds. A district with no internet but nearby facilities gets care in person.
            <strong className="text-slate-900 font-semibold"> Double Gap districts suffer from both</strong> — leaving 78 million citizens without either a digital lifeline or physical infrastructure.
          </p>
        </div>

        {/* Core Metric Cards - Unified Cohesive Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Total Districts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">National Coverage</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {stats.totalDistricts}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              All 64 administrative districts
            </p>
          </div>

          {/* Double Gap Critical Count */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200/90 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Double Gap Zone
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {stats.doubleGapPercentage}% of nation
              </span>
            </div>
            <div className="text-4xl font-black text-rose-700 tracking-tight">
              {stats.doubleGapCount} <span className="text-lg font-medium text-rose-600">districts</span>
            </div>
            <p className="text-xs text-rose-700/80 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Deprived on both digital & physical axes
            </p>
          </div>

          {/* Average Digital Access */}
          <div className="bg-white p-6 rounded-2xl border border-cyan-200/90 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between text-cyan-800 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-cyan-600" />
                Digital Access
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                Avg: 0.0 – 1.0
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {stats.avgDigitalScore.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              Internet, smartphone, skills & gender parity
            </p>
          </div>

          {/* Average Service Access */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200/90 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between text-amber-800 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                Physical Service
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                Avg: 0.0 – 1.0
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900 tracking-tight">
              {stats.avgServiceScore.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Healthcare, education & transit per 100k
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#map-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
            >
              Explore National Map
              <ArrowDown className="w-4 h-4" />
            </Link>
            <Link
              href="#quadrant-section"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              View Quadrant Matrix
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-slate-600 text-sm font-medium hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
            >
              Read Methodology & Citations →
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Strict policy rule: the two scores are <strong>never blended</strong> into one number.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
