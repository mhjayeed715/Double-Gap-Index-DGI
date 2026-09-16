import { getAllDistricts } from "@/lib/data";
import ChoroplethMap from "@/components/ChoroplethMap";
import Link from "next/link";
import { ArrowLeft, Compass, ShieldAlert, Sparkles } from "lucide-react";

export const metadata = {
  title: "National Geographic Map | Double Gap Index (DGI)",
  description: "Exact area-wise choropleth map of all 64 districts in Bangladesh, showing compounded digital and physical service exclusion.",
};

export default async function MapPage() {
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
              Geographic Observatory
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              37 Double Gap Districts Identified
            </span>
            <Link
              href="/gis"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1 rounded-lg transition-colors shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-600" />
              Switch to GIS Vector Map →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Map Component with Exact Geographic Boundaries */}
      <main className="py-6">
        <ChoroplethMap districts={districts} />
      </main>
    </div>
  );
}
