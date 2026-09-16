"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapGeoJSON,
} from "@/components/ui/map";
import { District } from "@/lib/types";
import { MapPin, Layers, AlertTriangle, ArrowUpRight, Compass } from "lucide-react";

interface GisVectorExplorerProps {
  districts: District[];
}

export default function GisVectorExplorer({ districts }: GisVectorExplorerProps) {
  const [useBlankBasemap, setUseBlankBasemap] = useState(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("sherpur");

  // Representative districts with coordinates [lng, lat]
  const keyDistricts = [
    { id: "dhaka", name: "Dhaka", coords: [90.4125, 23.8103] as [number, number], color: "#0891b2" },
    { id: "sherpur", name: "Sherpur", coords: [90.0167, 25.0167] as [number, number], color: "#e11d48" },
    { id: "chattogram", name: "Chattogram", coords: [91.8365, 22.3569] as [number, number], color: "#0891b2" },
    { id: "kurigram", name: "Kurigram", coords: [89.6500, 25.8054] as [number, number], color: "#e11d48" },
    { id: "sylhet", name: "Sylhet", coords: [91.8687, 24.8949] as [number, number], color: "#0891b2" },
    { id: "bandarban", name: "Bandarban", coords: [92.2189, 22.1953] as [number, number], color: "#e11d48" },
    { id: "khulna", name: "Khulna", coords: [89.5403, 22.8456] as [number, number], color: "#0891b2" },
    { id: "rajshahi", name: "Rajshahi", coords: [88.6042, 24.3745] as [number, number], color: "#0891b2" },
    { id: "barishal", name: "Barishal", coords: [90.3696, 22.7010] as [number, number], color: "#0891b2" },
    { id: "rangpur", name: "Rangpur", coords: [89.2444, 25.7439] as [number, number], color: "#0891b2" },
  ];

  const districtDataMap = new globalThis.Map(districts.map((d) => [d.id, d]));

  return (
    <section id="gis-vector-section" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-600" />
                MapLibre GL • Vector Cartography
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              High-Precision GIS Vector Map
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Interactive geospatial explorer. Toggle between the CARTO tiled basemap (streets & labels) and the transparent data canvas (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">&lt;Map blank&gt;</code>) with GeoJSON boundaries.
            </p>
          </div>

          {/* Basemap Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setUseBlankBasemap(false)}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                !useBlankBasemap
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-600" />
              Tiled Basemap (CARTO)
            </button>
            <button
              onClick={() => setUseBlankBasemap(true)}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                useBlankBasemap
                  ? "bg-slate-900 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              &lt;Map blank&gt; Data Canvas
            </button>
          </div>
        </div>

        {/* Sized Map Container */}
        <div className="relative h-[560px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
          <Map
            key={useBlankBasemap ? "map-blank" : "map-carto"}
            center={[90.3563, 23.8500]}
            zoom={6.15}
            blank={useBlankBasemap}
            theme="light"
            className="w-full h-full"
          >
            <MapControls position="top-right" showZoom showCompass showFullscreen showLocate />

            {/* Authentic Bangladesh 64-district GeoJSON Boundaries */}
            <MapGeoJSON
              id="bangladesh-district-borders"
              data="/data/bangladesh_districts.geojson"
              fillPaint={{
                "fill-color": useBlankBasemap ? "#0284c7" : "#0891b2",
                "fill-opacity": useBlankBasemap ? 0.20 : 0.12,
              }}
              linePaint={{
                "line-color": useBlankBasemap ? "#0284c7" : "#0f766e",
                "line-width": 1.4,
                "line-opacity": 0.85,
              }}
              fillHoverPaint={{
                "fill-color": "#38bdf8",
                "fill-opacity": 0.35,
              }}
              interactive
            />

            {/* Interactive District Markers */}
            {keyDistricts.map((d) => {
              const data = districtDataMap.get(d.id);
              const isDoubleGap = data?.double_gap_flag;

              return (
                <MapMarker
                  key={d.id}
                  longitude={d.coords[0]}
                  latitude={d.coords[1]}
                  onClick={() => setSelectedDistrictId(d.id)}
                >
                  <MarkerContent className="cursor-pointer group">
                    <div
                      className={`relative flex items-center justify-center p-1.5 rounded-full shadow-md transition-transform group-hover:scale-125 ${
                        isDoubleGap
                          ? "bg-rose-600 text-white ring-4 ring-rose-600/30"
                          : "bg-cyan-600 text-white ring-4 ring-cyan-600/30"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                  </MarkerContent>

                  <MarkerTooltip>
                    <div className="text-xs font-semibold px-1 py-0.5">
                      {d.name} {isDoubleGap ? "• Double Gap" : "• Resilient"}
                    </div>
                  </MarkerTooltip>

                  <MarkerPopup>
                    <div className="p-2 text-xs max-w-[200px] text-slate-800">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <strong className="text-sm font-bold text-slate-900">{d.name}</strong>
                        {isDoubleGap ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Critical
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                            Normal
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 my-2 text-[11px]">
                        <div className="p-1 rounded bg-cyan-50 border border-cyan-200">
                          <span className="text-cyan-800 block text-[9px] uppercase font-bold">Digital</span>
                          <span className="font-mono font-bold text-cyan-900">{data?.digital_access_score?.toFixed(2) ?? "N/A"}</span>
                        </div>
                        <div className="p-1 rounded bg-amber-50 border border-amber-200">
                          <span className="text-amber-800 block text-[9px] uppercase font-bold">Service</span>
                          <span className="font-mono font-bold text-amber-900">{data?.service_access_score?.toFixed(2) ?? "N/A"}</span>
                        </div>
                      </div>

                      <Link
                        href={`/district/${d.id}`}
                        className="w-full inline-flex items-center justify-center gap-1 py-1 px-2 rounded bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 mt-1"
                      >
                        Inspect District
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              );
            })}
          </Map>
        </div>

        {/* Map Information Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
              Double Gap Districts (Red Pin)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
              Compensated Districts (Blue Pin)
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by <strong>MapLibre GL</strong> & CARTO Positron vector tiles with authentic BBS/OCHA administrative boundaries
          </div>
        </div>
      </div>
    </section>
  );
}
