import { getAllDistricts, getNationalStats } from "@/lib/data";
import Hero from "@/components/Hero";
import ChoroplethMap from "@/components/ChoroplethMap";
import MapcnExplorer from "@/components/MapcnExplorer";
import QuadrantChart from "@/components/QuadrantChart";
import DivisionBarChart from "@/components/DivisionBarChart";
import DistrictTable from "@/components/DistrictTable";
import MLProfiles from "@/components/MLProfiles";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function HomePage() {
  const [districts, stats] = await Promise.all([
    getAllDistricts(),
    getNationalStats(),
  ]);

  return (
    <div className="w-full">
      {/* 1. Hero & High-Level KPIs */}
      <Hero stats={stats} />

      {/* 2. Interactive National Choropleth Map */}
      <ChoroplethMap districts={districts} />

      {/* 3. High-Precision mapcn Vector Map */}
      <MapcnExplorer districts={districts} />

      {/* 4. The Core 2x2 Quadrant Chart */}
      <QuadrantChart districts={districts} />

      {/* 5. bklit-ui Divisional Comparison Bar Chart */}
      <DivisionBarChart divisionStats={stats.divisionBreakdown} />

      {/* 6. Interpretable Machine Learning & Exclusion Profiles */}
      <MLProfiles />

      {/* 7. Sortable, Searchable District Explorer Table */}
      <DistrictTable districts={districts} />
    </div>
  );
}
