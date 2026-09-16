"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { District, ScoreType } from "@/lib/types";
import { BANGLADESH_DISTRICTS_MAP } from "@/lib/data/map_coordinates";
import { Layers, Info, Filter, ArrowUpRight, AlertTriangle } from "lucide-react";

interface ChoroplethMapProps {
  districts: District[];
}

// Fine-tuned label coordinates and area-proportional font sizing to eliminate overlap
const DISTRICT_LABEL_CONFIG: Record<
  string,
  { dx?: number; dy?: number; fontSize?: number }
> = {
  // Dense / small districts - compact font and non-overlapping centroid offsets
  narayanganj: { dx: 5, dy: 3, fontSize: 5.6 },
  dhaka: { dx: -6, dy: -2, fontSize: 6.0 },
  munshiganj: { dx: -2, dy: 6, fontSize: 5.6 },
  gazipur: { dx: 0, dy: -6, fontSize: 6.4 },
  narsingdi: { dx: 6, dy: -2, fontSize: 6.0 },
  manikganj: { dx: -6, dy: 0, fontSize: 6.2 },
  shariatpur: { dx: 5, dy: 1, fontSize: 5.8 },
  madaripur: { dx: -5, dy: 0, fontSize: 5.8 },
  jhalokati: { dx: 4, dy: -2, fontSize: 5.6 },
  pirojpur: { dx: -4, dy: 2, fontSize: 6.0 },
  meherpur: { dx: -4, dy: -2, fontSize: 5.6 },
  chuadanga: { dx: 4, dy: 3, fontSize: 5.8 },
  feni: { dx: 4, dy: -2, fontSize: 5.8 },
  joypurhat: { dx: 0, dy: 0, fontSize: 5.8 },
  magura: { dx: 0, dy: 0, fontSize: 6.0 },
  narail: { dx: 0, dy: 0, fontSize: 6.0 },
  rajbari: { dx: 0, dy: 0, fontSize: 6.0 },
  sherpur: { dx: 3, dy: 0, fontSize: 6.2 },
  jamalpur: { dx: -3, dy: 0, fontSize: 6.4 },
  chandpur: { dx: 3, dy: 0, fontSize: 6.2 },
  lakshmipur: { dx: -2, dy: 0, fontSize: 6.4 },
  gopalganj: { dx: -3, dy: 0, fontSize: 6.4 },
  kushtia: { dx: 0, dy: 0, fontSize: 6.4 },
  jhenaidah: { dx: 0, dy: 0, fontSize: 6.4 },

  // Large expansive districts - comfortable 8.0px font
  chattogram: { fontSize: 8.0 },
  rangamati: { fontSize: 8.2 },
  bandarban: { fontSize: 8.0 },
  khagrachhari: { fontSize: 7.8 },
  coxs_bazar: { fontSize: 7.8 },
  khulna: { fontSize: 8.0 },
  bagerhat: { fontSize: 7.8 },
  dinajpur: { fontSize: 8.0 },
  mymensingh: { fontSize: 8.0 },
  sunamganj: { fontSize: 8.0 },
  sylhet: { fontSize: 8.0 },
};

export default function ChoroplethMap({ districts }: ChoroplethMapProps) {
  const [activeMetric, setActiveMetric] = useState<ScoreType>("doublegap");
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("sherpur");

  // Map district data by ID
  const districtMap = useMemo(() => {
    const map = new Map<string, District>();
    districts.forEach((d) => map.set(d.id, d));
    return map;
  }, [districts]);

  // Unique divisions for filtering
  const divisions = useMemo(() => {
    const set = new Set<string>();
    districts.forEach((d) => set.add(d.division));
    return Array.from(set).sort();
  }, [districts]);

  // Currently active district object (hovered or selected or Sherpur default)
  const activeDistrict = useMemo(() => {
    if (hoveredDistrictId && districtMap.has(hoveredDistrictId)) {
      return districtMap.get(hoveredDistrictId)!;
    }
    if (selectedDistrictId && districtMap.has(selectedDistrictId)) {
      return districtMap.get(selectedDistrictId)!;
    }
    return districtMap.get("sherpur") || districts[0];
  }, [hoveredDistrictId, selectedDistrictId, districtMap, districts]);

  // Active feature geometry for top-layer highlight overlay
  const activeFeatureId = hoveredDistrictId || selectedDistrictId;
  const activeFeature = useMemo(() => {
    if (!activeFeatureId) return null;
    return BANGLADESH_DISTRICTS_MAP.find((f) => f.id === activeFeatureId) || null;
  }, [activeFeatureId]);

  // Dynamic theme colors for active outline and text (replaces harsh black with professional theme accent)
  const themeColors = useMemo(() => {
    if (activeMetric === "doublegap") {
      return {
        stroke: "#be123c", // refined rose-700
        glow: "rgba(244, 63, 94, 0.40)", // rose-500 aura
        text: "#881337", // rose-900
      };
    }
    if (activeMetric === "digital") {
      return {
        stroke: "#0284c7", // sky-600 ocean cyan
        glow: "rgba(56, 189, 248, 0.40)", // sky-400 aura
        text: "#0369a1", // sky-700
      };
    }
    return {
      stroke: "#d97706", // amber-600 warm gold
      glow: "rgba(251, 191, 36, 0.40)", // amber-400 aura
      text: "#92400e", // amber-800
    };
  }, [activeMetric]);

  // Color determination function
  const getDistrictColor = (districtId: string) => {
    const d = districtMap.get(districtId);
    if (!d) return "#f1f5f9"; // missing: slate-100

    if (activeMetric === "doublegap") {
      if (d.double_gap_flag) {
        return "#e11d48"; // rose-600
      }
      return "#e2e8f0"; // slate-200
    }

    if (activeMetric === "digital") {
      const score = d.digital_access_score;
      if (score === null) return "#cbd5e1";
      if (score >= 0.70) return "#0891b2"; // cyan-600
      if (score >= 0.50) return "#06b6d4"; // cyan-500
      if (score >= 0.40) return "#67e8f9"; // cyan-300
      if (score >= 0.30) return "#a5f3fc"; // cyan-200
      return "#cffafe"; // cyan-100
    }

    if (activeMetric === "service") {
      const score = d.service_access_score;
      if (score === null) return "#cbd5e1";
      if (score >= 0.70) return "#b45309"; // amber-700
      if (score >= 0.50) return "#d97706"; // amber-600
      if (score >= 0.40) return "#f59e0b"; // amber-500
      if (score >= 0.30) return "#fbbf24"; // amber-400
      return "#fde68a"; // amber-200
    }

    return "#cbd5e1";
  };

  return (
    <section id="map-section" className="py-6 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                National Geographic View
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Interactive Bangladesh District Choropleth Map
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Inspect all 64 districts across Bangladesh. Toggle between the two independent scores or highlight the compounding Double Gap hazard zone.
            </p>
          </div>

          {/* Metric Selector Toggles */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setActiveMetric("doublegap")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeMetric === "doublegap"
                  ? "bg-rose-600 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Double Gap Flag
            </button>
            <button
              onClick={() => setActiveMetric("digital")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeMetric === "digital"
                  ? "bg-cyan-700 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              Digital Access Score
            </button>
            <button
              onClick={() => setActiveMetric("service")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeMetric === "service"
                  ? "bg-amber-600 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              Service Access Score
            </button>
          </div>
        </div>

        {/* Division Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">Filter by Division:</span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedDivision("all")}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedDivision === "all"
                    ? "bg-slate-900 text-white font-medium"
                    : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                All (64)
              </button>
              {divisions.map((div) => (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    selectedDivision === div
                      ? "bg-slate-900 text-white font-medium"
                      : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {div.replace(" Division", "")}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            Click any district to view detailed sub-indicator drill-down
          </div>
        </div>

        {/* Map Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: SVG Map */}
          <div className="lg:col-span-8 bg-slate-50/60 rounded-2xl border border-slate-200 p-4 sm:p-6 relative shadow-inner flex flex-col items-center">
            {/* SVG Choropleth */}
            <div className="w-full max-w-[580px] aspect-[800/1000] relative">
              <svg
                viewBox="0 0 800 1000"
                className="w-full h-full drop-shadow-sm select-none"
                role="img"
                aria-label="Bangladesh District Choropleth Map"
              >
                <defs>
                  {/* Diagonal hazard pattern for Double Gap districts */}
                  <pattern
                    id="map-hazard"
                    width="10"
                    height="10"
                    patternTransform="rotate(45 0 0)"
                    patternUnits="userSpaceOnUse"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="10"
                      stroke="#881337"
                      strokeWidth="2"
                    />
                  </pattern>
                </defs>

                {/* 1. Base District Polygons Layer */}
                <g id="district-polygons">
                  {BANGLADESH_DISTRICTS_MAP.map((feature) => {
                    const districtData = districtMap.get(feature.id);
                    const isFilteredOut =
                      selectedDivision !== "all" &&
                      districtData?.division !== selectedDivision;
                    const isHovered = (hoveredDistrictId || selectedDistrictId) === feature.id;
                    const fillColor = getDistrictColor(feature.id);

                    return (
                      <path
                        key={feature.id}
                        d={feature.d}
                        fill={fillColor}
                        fillOpacity={isFilteredOut ? 0.15 : isHovered ? 1.0 : 0.88}
                        stroke="#ffffff"
                        strokeWidth={0.8}
                        strokeOpacity={0.95}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="cursor-pointer transition-colors duration-150"
                        onMouseEnter={() => setHoveredDistrictId(feature.id)}
                        onMouseLeave={() => setHoveredDistrictId(null)}
                        onClick={() => setSelectedDistrictId(feature.id)}
                      />
                    );
                  })}
                </g>

                {/* 2. Active / Hovered District Outline Overlay (Rendered ON TOP of all polygons) */}
                {activeFeature && (
                  <g id="active-district-outline" className="pointer-events-none">
                    {/* Soft luminous aura */}
                    <path
                      d={activeFeature.d}
                      fill="none"
                      stroke={themeColors.glow}
                      strokeWidth={4.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* Crisp accent border (replaces harsh black outline with professional executive theme stroke) */}
                    <path
                      d={activeFeature.d}
                      fill="none"
                      stroke={themeColors.stroke}
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* 3. District Name Labels Layer (With SVG white halo, area-calibrated font size, and zero dot clutter) */}
                <g id="district-labels" className="pointer-events-none select-none">
                  {BANGLADESH_DISTRICTS_MAP.map((feature) => {
                    const districtData = districtMap.get(feature.id);
                    const isFilteredOut =
                      selectedDivision !== "all" &&
                      districtData?.division !== selectedDivision;
                    const isHovered = (hoveredDistrictId || selectedDistrictId) === feature.id;
                    const isDoubleGap = districtData?.double_gap_flag;

                    const cfg = DISTRICT_LABEL_CONFIG[feature.id] || {};
                    const baseSize = cfg.fontSize || 6.8;
                    const currentSize = isHovered ? baseSize + 0.8 : baseSize;
                    const posX = feature.cx + (cfg.dx || 0);
                    const posY = feature.cy + (cfg.dy || 0);

                    return (
                      <text
                        key={feature.id}
                        x={posX}
                        y={posY}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={currentSize}
                        fontWeight={isHovered ? "700" : isFilteredOut ? "500" : "600"}
                        fill={
                          isHovered
                            ? themeColors.text
                            : isDoubleGap && activeMetric === "doublegap"
                            ? "#9f1239"
                            : "#334155"
                        }
                        opacity={isFilteredOut ? 0.25 : 0.95}
                        style={{
                          paintOrder: "stroke fill",
                          stroke: "#ffffff",
                          strokeWidth: isHovered ? "2.6px" : "2.0px",
                          strokeLinejoin: "round",
                          strokeLinecap: "round",
                          letterSpacing: "-0.015em",
                        }}
                      >
                        {feature.name}
                      </text>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Dynamic Map Legend */}
            <div className="w-full mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Map Legend:</span>
                {activeMetric === "doublegap" && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-rose-600 border border-rose-700 inline-block" />
                      <span className="text-slate-800 font-medium">Double Gap Flagged (37)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-slate-200 border border-slate-300 inline-block" />
                      <span className="text-slate-600">Single Gap / Resilient (27)</span>
                    </div>
                  </div>
                )}

                {activeMetric === "digital" && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[11px]">Low (&lt;0.3)</span>
                    <span className="w-5 h-3 bg-cyan-100 rounded-sm" />
                    <span className="w-5 h-3 bg-cyan-200 rounded-sm" />
                    <span className="w-5 h-3 bg-cyan-300 rounded-sm" />
                    <span className="w-5 h-3 bg-cyan-500 rounded-sm" />
                    <span className="w-5 h-3 bg-cyan-700 rounded-sm" />
                    <span className="text-slate-800 font-semibold text-[11px]">High (&gt;0.7)</span>
                  </div>
                )}

                {activeMetric === "service" && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[11px]">Low (&lt;0.3)</span>
                    <span className="w-5 h-3 bg-amber-200 rounded-sm" />
                    <span className="w-5 h-3 bg-amber-400 rounded-sm" />
                    <span className="w-5 h-3 bg-amber-500 rounded-sm" />
                    <span className="w-5 h-3 bg-amber-600 rounded-sm" />
                    <span className="w-5 h-3 bg-amber-700 rounded-sm" />
                    <span className="text-slate-800 font-semibold text-[11px]">High (&gt;0.7)</span>
                  </div>
                )}
              </div>

              <div className="text-slate-400 text-[11px]">
                Threshold: &lt; 0.40 on both axes
              </div>
            </div>
          </div>

          {/* Right: Live District Inspector / Hover Card */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  District Inspector
                </span>
                {activeDistrict && (
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {activeDistrict.id}
                  </span>
                )}
              </div>

              {activeDistrict && (
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {activeDistrict.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {activeDistrict.division} • Pop: {activeDistrict.population?.toLocaleString() || "N/A"}
                      </p>
                    </div>

                    {activeDistrict.double_gap_flag ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Double Gap
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Compensated
                      </span>
                    )}
                  </div>

                  {/* Two Separate Scores Cards */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="p-3 rounded-lg bg-cyan-50/70 border border-cyan-200">
                      <div className="text-[11px] font-medium text-cyan-800 uppercase tracking-wider">
                        Digital Score
                      </div>
                      <div className="text-2xl font-extrabold text-cyan-950 mt-0.5">
                        {activeDistrict.digital_access_score !== null
                          ? activeDistrict.digital_access_score.toFixed(2)
                          : "N/A"}
                      </div>
                      <div className="text-[10px] text-cyan-700 mt-1">
                        Internet: {activeDistrict.digital_breakdown.internet_usage_pct ?? "N/A"}%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                      <div className="text-[11px] font-medium text-amber-800 uppercase tracking-wider">
                        Service Score
                      </div>
                      <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
                        {activeDistrict.service_access_score !== null
                          ? activeDistrict.service_access_score.toFixed(2)
                          : "N/A"}
                      </div>
                      <div className="text-[10px] text-amber-700 mt-1">
                        Health/100k: {activeDistrict.service_breakdown.healthcare_per_capita ?? "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Key Indicators Snapshot */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Smartphone Ownership:</span>
                      <span className="font-medium text-slate-800">
                        {activeDistrict.digital_breakdown.smartphone_ownership_pct !== null
                          ? `${activeDistrict.digital_breakdown.smartphone_ownership_pct}%`
                          : "Data unavailable"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Digital Skills:</span>
                      <span className="font-medium text-slate-800">
                        {activeDistrict.digital_breakdown.digital_skills_pct !== null
                          ? `${activeDistrict.digital_breakdown.digital_skills_pct}%`
                          : <span className="text-slate-400 italic">Data unavailable</span>}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Education Density:</span>
                      <span className="font-medium text-slate-800">
                        {activeDistrict.service_breakdown.education_per_capita ?? "N/A"} / 100k
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Transit Points:</span>
                      <span className="font-medium text-slate-800">
                        {activeDistrict.service_breakdown.transit_per_capita ?? "N/A"} / 100k
                      </span>
                    </div>
                  </div>

                  {/* Action Link to Full Drill-Down */}
                  <Link
                    href={`/district/${activeDistrict.id}`}
                    className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Open Full District Analysis
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
