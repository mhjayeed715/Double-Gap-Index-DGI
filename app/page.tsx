import { getAllDistricts, getNationalStats } from "@/lib/data";
import Hero from "@/components/Hero";
import QuadrantChart from "@/components/QuadrantChart";
import DivisionBarChart from "@/components/DivisionBarChart";
import Link from "next/link";
import {
  Map,
  Compass,
  Table,
  BrainCircuit,
  ArrowRight,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sparkles,
  Building2,
  Smartphone,
} from "lucide-react";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function HomePage() {
  const [districts, stats] = await Promise.all([
    getAllDistricts(),
    getNationalStats(),
  ]);

  // Top 8 most vulnerable districts (both scores lowest)
  const sortedByVulnerability = [...districts]
    .filter((d) => d.double_gap_flag && d.digital_access_score !== null && d.service_access_score !== null)
    .sort((a, b) => {
      const sumA = (a.digital_access_score || 0) + (a.service_access_score || 0);
      const sumB = (b.digital_access_score || 0) + (b.service_access_score || 0);
      return sumA - sumB;
    })
    .slice(0, 8);

  return (
    <div className="w-full bg-slate-50/40">
      {/* 1. Hero & High-Level Policy KPIs */}
      <Hero stats={stats} />

      {/* 2. The Core 2x2 Quadrant Chart (Foundational Statistical Signature) */}
      <div className="py-4">
        <QuadrantChart districts={districts} />
      </div>

      {/* 3. bklit-ui Divisional Comparison Bar Chart */}
      <div className="py-4">
        <DivisionBarChart divisionStats={stats.divisionBreakdown} />
      </div>

      {/* 4. Executive Vulnerability Spotlight: Top Acute Deprivation Districts */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center gap-1.5 shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Priority Intervention Spotlight
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Most Severely Deprived Districts
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Districts in acute double deprivation where both digital infrastructure and physical facilities are in the lowest national tiers.
              </p>
            </div>

            <Link
              href="/districts"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
            >
              View Full 64-District Table
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedByVulnerability.map((d, index) => (
              <Link
                key={d.id}
                href={`/district/${d.id}`}
                className="group bg-slate-50/70 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      #{index + 1} Acute Need
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Double Gap
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {d.division} • Pop: {d.population?.toLocaleString() || "N/A"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-cyan-50/60 p-2 rounded-lg border border-cyan-100">
                    <div className="text-[10px] text-cyan-800 font-semibold flex items-center gap-1">
                      <Smartphone className="w-2.5 h-2.5" /> Digital
                    </div>
                    <div className="text-sm font-extrabold text-cyan-950 mt-0.5">
                      {d.digital_access_score?.toFixed(2)}
                    </div>
                  </div>

                  <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    <div className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                      <Building2 className="w-2.5 h-2.5" /> Service
                    </div>
                    <div className="text-sm font-extrabold text-amber-950 mt-0.5">
                      {d.service_access_score?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-900">
                  <span>Explore indicators</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Executive Tool Portals & Deep-Dive Hub */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                Platform Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Deep-Dive Explorers & Analysis Portals
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Explore the index through specialized tools designed for spatial planners, policy makers, and researchers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portal 1: Geographic Observatory */}
            <Link
              href="/map"
              className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Map className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                    Area-Wise Precision
                  </span>
                  <span className="text-[11px] text-slate-400">All 64 Districts</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  National Geographic Map
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Interactive choropleth map with authentic district area boundaries, live hover inspector, metric switches (Digital, Service, Double Gap flag), and division filters.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-cyan-700 group-hover:gap-2 transition-all">
                <span>Launch Geographic Map</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>

            {/* Portal 2: District Table Directory */}
            <Link
              href="/districts"
              className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Table className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Raw Data & Export
                  </span>
                  <span className="text-[11px] text-slate-400">CSV Supported</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                  District Rankings Directory
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Sortable and searchable data table detailing all 64 districts across household internet usage, smartphone penetration, clinic densities, school densities, and transit access.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-slate-900 group-hover:gap-2 transition-all">
                <span>Browse District Directory</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>

            {/* Portal 3: Machine Learning Archetypes */}
            <Link
              href="/analysis"
              className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Interpretable AI
                  </span>
                  <span className="text-[11px] text-slate-400">SHAP-Aligned</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Exclusion Archetypes & Policy Clusters
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Unsupervised clustering isolating 4 distinct policy regimes (Compounded Double Gap, Digital Workaround, Physical Backup, Dual Resilience) with actionable intervention strategies.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-indigo-700 group-hover:gap-2 transition-all">
                <span>Explore ML Clusters</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>

            {/* Portal 4: GIS Vector Map */}
            <Link
              href="/gis"
              className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Vector Cartography
                  </span>
                  <span className="text-[11px] text-slate-400">MapLibre GL & CARTO</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  High-Precision GIS Vector Map
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Explore streets, highways, and geographic landmarks using high-resolution vector tiles with interactive district markers and blank GeoJSON boundary toggles.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
                <span>Open GIS Vector Map</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
