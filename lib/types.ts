export interface DigitalBreakdown {
  internet_usage_pct: number | null;
  smartphone_ownership_pct: number | null;
  digital_skills_pct: number | null;
  gender_gap_pct: number | null;
  source_citation: string;
}

export interface ServiceBreakdown {
  healthcare_facility_count?: number | null;
  education_facility_count?: number | null;
  transit_point_count?: number | null;
  healthcare_per_capita: number | null;
  education_per_capita: number | null;
  transit_per_capita: number | null;
  source_citation: string;
}

export interface District {
  id: string;
  name: string;
  division: string;
  population: number | null;
  digital_access_score: number | null;
  service_access_score: number | null;
  double_gap_flag: boolean;
  digital_breakdown: DigitalBreakdown;
  service_breakdown: ServiceBreakdown;
}

export interface DistrictSummary {
  id: string;
  name: string;
  division: string;
  digital_access_score: number | null;
  service_access_score: number | null;
  double_gap_flag: boolean;
}

export type ScoreType = "digital" | "service" | "doublegap";
