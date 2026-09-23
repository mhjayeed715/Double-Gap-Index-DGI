import { getAllDistricts } from "@/lib/data";
import DistrictTable from "@/components/DistrictTable";
import Link from "next/link";
import { ArrowLeft, Table as TableIcon, Download, FileSpreadsheet } from "lucide-react";

export const metadata = {
  title: "District Directory & Indicators | Double Gap Index (DGI)",
  description: "Searchable, sortable dataset covering all 64 districts in Bangladesh across digital and physical service indicators with CSV export.",
};

export default async function DistrictsDirectoryPage() {
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
              National District Directory (64 Districts)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              BBS Census 2022 (100% CAPI) & HeiGIT HDX
            </span>
          </div>
        </div>
      </div>

      {/* Main District Table Component */}
      <main className="py-6">
        <DistrictTable districts={districts} />
      </main>
    </div>
  );
}
