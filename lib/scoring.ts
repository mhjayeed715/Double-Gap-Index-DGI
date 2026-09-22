/**
 * Double Gap Index (DGI) - Scoring Constants and Reference Formulas
 *
 * NOTE: Per 00_MASTER_RULES.md and 03_ARCHITECTURE.md:
 * - This file documents the empirical scoring formulas and thresholds for auditing and UI rendering.
 * - Primary batch computation happens in Python `etl/compute_scores.py`.
 * - The two scores (Digital Access Score, Service Access Score) must NEVER be blended
 *   into one general equity score.
 */

export const SCORING_CONFIG = {
  version: "2.0.0-empirical",
  thresholds: {
    /** Dual-Median Thresholds (P50 empirical baseline: 16 Double Gap districts) */
    digitalMedian: 0.3987,
    serviceMedian: 0.5829,
    /** Dual-P40 Thresholds (Core Priority Cutoff: 9 Core districts) */
    digitalP40: 0.3672,
    serviceP40: 0.5529,
    /** Legacy absolute policy cutoff */
    doubleGapCutoff: 0.40,
  },
  digitalWeights: {
    internetUsage: 0.3333,
    mobileOwnership: 0.3333,
    mobileBanking: 0.3334,
  },
  serviceWeights: {
    hospitalAccess30m: 0.3333,
    educationAccess5km: 0.3333,
    nationalGridElectricity: 0.3334,
  },
  sources: {
    digital: "BBS Population & Housing Census 2022 (Admin 02 Dataset, 100% CAPI Enumeration)",
    service: "HeiGIT Accessibility Models (UN OCHA HDX) & BBS Census 2022",
    administrative: "LGED Point of Interest Repositories (Health: 2,484 facilities, Education: 78,129 points)",
    population: "BBS Population and Housing Census 2022 (National Census, 165.1M enumerated)",
  },
  collinearityDisclosure: {
    internetVsMobileCorrelation: 0.7212,
    note: "Internet usage and mobile ownership correlate r = +0.7212. Documented as not fully independent measures.",
  },
  genderIndicatorPolicy: {
    status: "ContextualUnweighted",
    rationale: "Female usage (r=0.989) and gender parity ratio (r=0.923) are near-collinear with total internet rate. Gender metrics are reported as separate unweighted contextual statistics on each district dossier.",
  },
  limitations: [
    "HeiGIT accessibility indicators model travel-time friction to hospitals (30 min) and schools (5km), cross-referenced with population rasters.",
    "LGED education facility shapefile contains 78,129 points with survey density skew (e.g. Mymensingh has 4,581 schools mapped vs. Panchagarh with 6), so raw point counts are preserved as secondary administrative metrics rather than score drivers.",
    "District-level aggregation masks intra-district inequality between urban centers and remote upazilas/chars.",
    "Scores reflect the official 2022 Census enumeration and 2024/2025 HeiGIT/HDX accessibility layers.",
  ],
} as const;

/**
 * Min-Max normalization helper
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Determines Double Gap status using Dual-Median standard (or custom thresholds)
 */
export function isDoubleGap(
  digitalScore: number | null,
  serviceScore: number | null,
  dThreshold = SCORING_CONFIG.thresholds.digitalMedian,
  sThreshold = SCORING_CONFIG.thresholds.serviceMedian
): boolean {
  if (digitalScore === null || serviceScore === null) return false;
  return digitalScore < dThreshold && serviceScore < sThreshold;
}
