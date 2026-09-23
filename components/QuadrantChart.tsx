"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { District } from "@/lib/types";
import { AlertOctagon, Info, ArrowUpRight, Search } from "lucide-react";

interface QuadrantChartProps {
  districts: District[];
  threshold?: number;
  digitalThreshold?: number;
  serviceThreshold?: number;
}

export default function QuadrantChart({
  districts,
  threshold,
  digitalThreshold = 0.3987,
  serviceThreshold = 0.5829,
}: QuadrantChartProps) {
  const effectiveDigitalThreshold = threshold !== undefined ? threshold : digitalThreshold;
  const effectiveServiceThreshold = threshold !== undefined && threshold !== 0.40 ? threshold : serviceThreshold;

  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const divisions = useMemo(() => {
    const set = new Set<string>();
    districts.forEach((d) => set.add(d.division));
    return Array.from(set).sort();
  }, [districts]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDivision =
        selectedDivision === "all" || d.division === selectedDivision;
      const matchesSearch =
        searchQuery === "" ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.division.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [districts, selectedDivision, searchQuery]);

  // SVG dimensions for chart
  const width = 720;
  const height = 480;
  const padding = { top: 35, right: 35, bottom: 55, left: 65 };

  // Scales (0.0 to 1.0)
  const scaleX = (val: number) => padding.left + val * (width - padding.left - padding.right);
  const scaleY = (val: number) => height - padding.bottom - val * (height - padding.top - padding.bottom);

  const thresholdX = scaleX(effectiveDigitalThreshold);
  const thresholdY = scaleY(effectiveServiceThreshold);

  return (
    <section id="quadrant-section" className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Core Matrix Visualization
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The Double Gap 2x2 Quadrant Matrix
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Plotting Digital Access Score (X-axis) against Physical Service Access Score (Y-axis).
              Districts in the bottom-left zone experience compounding deprivation.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Find district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 shadow-sm w-44"
              />
            </div>

            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              aria-label="Filter by division"
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:border-cyan-500 shadow-sm"
            >
              <option value="all">All Divisions (64)</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart + Callout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main SVG Scatter Plot */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm overflow-x-auto relative">
            {/* Viewport Floating Watermark */}
            <div className="absolute top-4 right-4 pointer-events-none select-none px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-mono font-bold tracking-wider rounded border border-emerald-600 shadow-xs uppercase z-10">
              Empirical Pilot: Census 2022 & HeiGIT
            </div>

            <div className="min-w-[640px]">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto select-none"
                role="img"
                aria-label="Quadrant scatter plot of Digital Access versus Service Access"
              >
                {/* 1. Shaded Bottom-Left Double Gap Quadrant */}
                <rect
                  x={padding.left}
                  y={thresholdY}
                  width={thresholdX - padding.left}
                  height={height - padding.bottom - thresholdY}
                  fill="#fff1f2"
                  fillOpacity={0.85}
                  stroke="#fecdd3"
                  strokeWidth="1"
                />

                {/* Shaded Top-Right High Access Quadrant */}
                <rect
                  x={thresholdX}
                  y={padding.top}
                  width={width - padding.right - thresholdX}
                  height={thresholdY - padding.top}
                  fill="#f0fdf4"
                  fillOpacity={0.5}
                />

                {/* Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((val) => (
                  <g key={`grid-${val}`}>
                    <line
                      x1={scaleX(val)}
                      y1={padding.top}
                      x2={scaleX(val)}
                      y2={height - padding.bottom}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1={padding.left}
                      y1={scaleY(val)}
                      x2={width - padding.right}
                      y2={scaleY(val)}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                    />
                  </g>
                ))}

                {/* Threshold Lines (Cutoff at 0.40) */}
                <line
                  x1={thresholdX}
                  y1={padding.top}
                  x2={thresholdX}
                  y2={height - padding.bottom}
                  stroke="#e11d48"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <line
                  x1={padding.left}
                  y1={thresholdY}
                  x2={width - padding.right}
                  y2={thresholdY}
                  stroke="#e11d48"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />

                {/* Quadrant Watermark Labels (Positioned in corners away from data clusters) */}
                <text
                  x={padding.left + 14}
                  y={thresholdY + 22}
                  fill="#be123c"
                  opacity="0.35"
                  fontSize="11"
                  fontWeight="800"
                  className="select-none uppercase tracking-wider font-mono"
                >
                  Q3: DOUBLE GAP HAZARD
                </text>
                <text
                  x={width - padding.right - 14}
                  y={padding.top + 22}
                  textAnchor="end"
                  fill="#15803d"
                  opacity="0.35"
                  fontSize="11"
                  fontWeight="800"
                  className="select-none uppercase tracking-wider font-mono"
                >
                  Q1: DUAL RESILIENCE
                </text>
                <text
                  x={padding.left + 14}
                  y={padding.top + 22}
                  fill="#0369a1"
                  opacity="0.35"
                  fontSize="11"
                  fontWeight="800"
                  className="select-none uppercase tracking-wider font-mono"
                >
                  Q2: PHYSICAL BACKUP
                </text>
                <text
                  x={width - padding.right - 14}
                  y={thresholdY + 22}
                  textAnchor="end"
                  fill="#b45309"
                  opacity="0.35"
                  fontSize="11"
                  fontWeight="800"
                  className="select-none uppercase tracking-wider font-mono"
                >
                  Q4: DIGITAL WORKAROUND
                </text>

                {/* Axis Labels */}
                <text
                  x={width / 2}
                  y={height - 15}
                  textAnchor="middle"
                  fill="#475569"
                  fontSize="12"
                  fontWeight="700"
                >
                  Digital Access Score → (BBS Census 2022: Internet, Mobile, MFS)
                </text>
                <text
                  x={-height / 2}
                  y={18}
                  textAnchor="middle"
                  transform="rotate(-90)"
                  fill="#475569"
                  fontSize="12"
                  fontWeight="700"
                >
                  Service Access Score → (HeiGIT / BBS: Hospitals, Schools, Grid Power)
                </text>

                {/* Axis Tick Marks */}
                {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
                  <g key={`tick-${val}`}>
                    <text
                      x={scaleX(val)}
                      y={height - padding.bottom + 18}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {val.toFixed(1)}
                    </text>
                    <text
                      x={padding.left - 10}
                      y={scaleY(val) + 4}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                ))}

                {/* Plot District Points */}
                {filteredDistricts.map((d) => {
                  if (d.digital_access_score === null || d.service_access_score === null) return null;

                  const cx = scaleX(d.digital_access_score);
                  const cy = scaleY(d.service_access_score);
                  const isHovered = hoveredDistrict?.id === d.id;
                  const isDoubleGap = d.double_gap_flag;

                  // Label specific iconic districts directly
                  const shouldLabelDirectly = [
                    "dhaka", "sherpur", "chattogram", "kurigram",
                    "bandarban", "khulna", "rajshahi", "sylhet", "sunamganj"
                  ].includes(d.id);

                  return (
                    <g
                      key={d.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDistrict(d)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onClick={() => {
                        window.location.href = `/district/${d.id}`;
                      }}
                    >
                      {/* Pulse ring on hover */}
                      {isHovered && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="14"
                          fill="none"
                          stroke={isDoubleGap ? "#e11d48" : "#0891b2"}
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      )}

                      {/* Main Data Point */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 7 : isDoubleGap ? 5.5 : 4.5}
                        fill={isDoubleGap ? "#e11d48" : "#0284c7"}
                        stroke={isHovered ? "#0f172a" : "#ffffff"}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        className="transition-all duration-150"
                      />

                      {/* Direct Labels */}
                      {(shouldLabelDirectly || isHovered) && (
                        <text
                          x={cx + (cx > width - 100 ? -8 : 8)}
                          y={cy - 5}
                          textAnchor={cx > width - 100 ? "end" : "start"}
                          fontSize={isHovered ? "12" : "10"}
                          fontWeight={isHovered ? "700" : "600"}
                          fill={isDoubleGap ? "#9f1239" : "#0f172a"}
                          className="pointer-events-none select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]"
                        >
                          {d.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Column: Dynamic Inspector & Policy Takeaway */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Active Inspector Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  Point Inspector
                </span>
                {hoveredDistrict && (
                  <span className="text-[11px] font-medium text-slate-500">
                    {hoveredDistrict.division}
                  </span>
                )}
              </div>

              {hoveredDistrict ? (
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">
                      {hoveredDistrict.name}
                    </h3>
                    {hoveredDistrict.double_gap_flag ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Double Gap
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        Compensated
                      </span>
                    )}
                  </div>

                  <div className="mb-2 px-2 py-1 bg-slate-100 rounded border border-slate-200 text-[10px] text-slate-700">
                    Empirical pilot: Census 2022 &amp; HeiGIT.
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="p-2.5 rounded bg-cyan-50 border border-cyan-200">
                      <div className="text-[10px] uppercase font-bold text-cyan-800">
                        Digital Axis (X)
                      </div>
                      <div className="text-xl font-extrabold text-cyan-900">
                        {hoveredDistrict.digital_access_score?.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
                      <div className="text-[10px] uppercase font-bold text-amber-800">
                        Service Axis (Y)
                      </div>
                      <div className="text-xl font-extrabold text-amber-900">
                        {hoveredDistrict.service_access_score?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {hoveredDistrict.double_gap_flag ? (
                      <span className="text-rose-700 font-medium">
                        Facing compounding exclusion. Lacks both digital connectivity and physical public services. High priority for integrated intervention.
                      </span>
                    ) : hoveredDistrict.digital_access_score! >= effectiveDigitalThreshold && hoveredDistrict.service_access_score! < effectiveServiceThreshold ? (
                      <span className="text-amber-800">
                        Service exclusion exists, but digital connectivity allows potential remote workarounds (telemedicine, online education).
                      </span>
                    ) : hoveredDistrict.digital_access_score! < effectiveDigitalThreshold && hoveredDistrict.service_access_score! >= effectiveServiceThreshold ? (
                      <span className="text-sky-800">
                        Digital exclusion exists, but physical public infrastructure provides an in-person safety net.
                      </span>
                    ) : (
                      <span className="text-emerald-800">
                        High compounded resilience. Both digital connectivity and physical services exceed the baseline threshold.
                      </span>
                    )}
                  </p>

                  <Link
                    href={`/district/${hoveredDistrict.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    View District Detail & Citations
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <AlertOctagon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">Hover any point on the chart</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Inspect where each district falls relative to dual-median cutoffs (DAS &lt; 0.40, SAS &lt; 0.58).
                  </p>
                </div>
              )}
            </div>

            {/* Explanatory Policy Quadrant Guide */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-xs text-slate-600 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span>The 4 Quadrant Regimes</span>
              </h4>
              <div className="space-y-2">
                <div className="p-2 rounded bg-rose-50 border border-rose-200">
                  <strong className="text-rose-800 font-semibold block">1. Double Gap (Bottom-Left)</strong>
                  <span className="text-rose-700">No physical access AND no digital access. Zero workaround capacity.</span>
                </div>
                <div className="p-2 rounded bg-amber-50 border border-amber-200">
                  <strong className="text-amber-800 font-semibold block">2. Digital Workaround (Bottom-Right)</strong>
                  <span className="text-amber-700">Poor clinics/schools, but smartphone/internet enables remote services.</span>
                </div>
                <div className="p-2 rounded bg-sky-50 border border-sky-200">
                  <strong className="text-sky-800 font-semibold block">3. Physical Safety Net (Top-Left)</strong>
                  <span className="text-sky-700">Low internet, but hospitals and schools are accessible physically.</span>
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                  <strong className="text-emerald-800 font-semibold block">4. High Resilience (Top-Right)</strong>
                  <span className="text-emerald-700">Above baseline across digital access and physical infrastructure.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
