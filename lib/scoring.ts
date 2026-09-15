/**
 * Double Gap Index (DGI) - Scoring Constants and Reference Formulas
 *
 * NOTE: Per 00_MASTER_RULES.md and 03_ARCHITECTURE.md:
 * - This file documents the scoring formulas and thresholds for auditing and UI rendering.
 * - Primary batch computation happens in Python `etl/compute_scores.py`.
 * - The two scores (Digital Access Score, Service Access Score) must NEVER be blended
 *   into one general equity score.
 */

export const SCORING_CONFIG = {
  version: "1.0.0",
  thresholds: {
    /** Cutoff below which a score is considered in the exclusion zone */
    doubleGapCutoff: 0.40,
  },
  digitalWeights: {
    internetUsage: 0.25,
    smartphoneOwnership: 0.25,
    digitalSkills: 0.25,
    inverseGenderGap: 0.25,
  },
  serviceWeights: {
    healthcarePerCapita: 0.333,
    educationPerCapita: 0.333,
    transitPerCapita: 0.334,
  },
  sources: {
    digital: "BBS ICT Survey 2024-25",
    service: "OpenStreetMap, extracted March 2026",
    population: "BBS Population and Housing Census 2022",
  },
  limitations: [
    "OSM completeness varies: urban districts (Dhaka, Chattogram) have higher mapping coverage than rural upazilas.",
    "District-level aggregation masks intra-district variation between urban centers and rural villages.",
    "Scores are a single temporal snapshot (2022-2025/26 data rounds) and do not yet model time-series trends.",
    "The 0.40 Double Gap threshold is an explicit policy cutoff reflecting severe compounded deprivation."
  ]
} as const;

/**
 * Min-Max normalization helper
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Determines Double Gap status
 */
export function isDoubleGap(
  digitalScore: number | null,
  serviceScore: number | null,
  cutoff = SCORING_CONFIG.thresholds.doubleGapCutoff
): boolean {
  if (digitalScore === null || serviceScore === null) return false;
  return digitalScore < cutoff && serviceScore < cutoff;
}
