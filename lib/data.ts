import { District, DistrictSummary } from "./types";
import districtsData from "./data/districts.json";

/**
 * Returns all districts with full details.
 * Falls back cleanly to pre-computed JSON dataset if Supabase is unconfigured.
 */
export async function getAllDistricts(): Promise<District[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project")) {
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(supabaseUrl, supabaseKey);

      const { data: dbScores } = await client
        .from("scores")
        .select(`
          district_id,
          digital_access_score,
          service_access_score,
          double_gap_flag,
          districts:district_id (id, name, division, population),
          digital_indicators:district_id (internet_usage_pct, smartphone_ownership_pct, digital_skills_pct, gender_gap_pct, source_citation),
          service_indicators:district_id (healthcare_facility_count, education_facility_count, transit_point_count, healthcare_per_capita, education_per_capita, transit_per_capita, source_citation)
        `);

      if (dbScores && dbScores.length > 0) {
        // Map database records to District model
        return dbScores.map((row: any) => ({
          id: row.district_id,
          name: row.districts?.name || row.district_id,
          division: row.districts?.division || "",
          population: row.districts?.population || null,
          digital_access_score: row.digital_access_score,
          service_access_score: row.service_access_score,
          double_gap_flag: row.double_gap_flag,
          digital_breakdown: row.digital_indicators || {
            internet_usage_pct: null,
            smartphone_ownership_pct: null,
            digital_skills_pct: null,
            gender_gap_pct: null,
            source_citation: "BBS ICT Survey 2024-25"
          },
          service_breakdown: row.service_indicators || {
            healthcare_facility_count: null,
            education_facility_count: null,
            transit_point_count: null,
            healthcare_per_capita: null,
            education_per_capita: null,
            transit_per_capita: null,
            source_citation: "OpenStreetMap"
          }
        }));
      }
    }
  } catch (error) {
    console.warn("Supabase query failed, falling back to embedded dataset:", error);
  }

  return districtsData as District[];
}

/**
 * Returns district summary list for lightweight rendering and API list endpoint
 */
export async function getDistrictSummaries(): Promise<DistrictSummary[]> {
  const districts = await getAllDistricts();
  return districts.map((d) => ({
    id: d.id,
    name: d.name,
    division: d.division,
    digital_access_score: d.digital_access_score,
    service_access_score: d.service_access_score,
    double_gap_flag: d.double_gap_flag,
  }));
}

/**
 * Returns a specific district by slug ID
 */
export async function getDistrictById(id: string): Promise<District | null> {
  const normalizedId = id.toLowerCase().trim();
  const districts = await getAllDistricts();
  const district = districts.find(
    (d) => d.id === normalizedId || d.name.toLowerCase() === normalizedId
  );
  return district || null;
}

/**
 * Computes national summary statistics
 */
export async function getNationalStats() {
  const districts = await getAllDistricts();
  const total = districts.length;
  const doubleGapDistricts = districts.filter((d) => d.double_gap_flag);

  const digitalValid = districts.filter((d) => d.digital_access_score !== null);
  const avgDigital =
    digitalValid.reduce((acc, d) => acc + (d.digital_access_score || 0), 0) /
    (digitalValid.length || 1);

  const serviceValid = districts.filter((d) => d.service_access_score !== null);
  const avgService =
    serviceValid.reduce((acc, d) => acc + (d.service_access_score || 0), 0) /
    (serviceValid.length || 1);

  // Group by division
  const divisions = Array.from(new Set(districts.map((d) => d.division)));
  const divisionBreakdown = divisions.map((div) => {
    const inDiv = districts.filter((d) => d.division === div);
    const dgCount = inDiv.filter((d) => d.double_gap_flag).length;
    const avgDig =
      inDiv.reduce((acc, d) => acc + (d.digital_access_score || 0), 0) /
      (inDiv.length || 1);
    const avgSer =
      inDiv.reduce((acc, d) => acc + (d.service_access_score || 0), 0) /
      (inDiv.length || 1);

    return {
      division: div,
      totalDistricts: inDiv.length,
      doubleGapCount: dgCount,
      doubleGapRate: (dgCount / inDiv.length) * 100,
      avgDigital: Math.round(avgDig * 1000) / 1000,
      avgService: Math.round(avgSer * 1000) / 1000,
    };
  });

  return {
    totalDistricts: total,
    doubleGapCount: doubleGapDistricts.length,
    doubleGapPercentage: Math.round((doubleGapDistricts.length / total) * 100),
    avgDigitalScore: Math.round(avgDigital * 1000) / 1000,
    avgServiceScore: Math.round(avgService * 1000) / 1000,
    doubleGapList: doubleGapDistricts.map((d) => ({ id: d.id, name: d.name, division: d.division })),
    divisionBreakdown,
  };
}
