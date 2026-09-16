import { getAllDistricts } from "@/lib/data";
import GisVectorExplorer from "@/components/GisVectorExplorer";
import Link from "next/link";
import { ArrowLeft, Map as MapIcon, Globe, Layers } from "lucide-react";

export const metadata = {
  title: "High-Precision GIS Vector Map | Double Gap Index (DGI)",
  description: "MapLibre GL and CARTO vector basemap explorer for 64 districts in Bangladesh with interactive GeoJSON overlays.",
};

export default async function GisPage() {
  const districts = await getAllDistricts();

  return (
    <div className="w-full bg-slate-50/50 min-h-screen">
      {/* Sub-header Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              High-Precision GIS Vector Map
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1 rounded-lg transition-colors shadow-xs"
            >
              <MapIcon className="w-3.5 h-3.5 text-cyan-600" />
              Switch to Choropleth Map →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Vector Map Component */}
      <main className="py-6">
        <GisVectorExplorer districts={districts} />
      </main>
    </div>
  );
}
