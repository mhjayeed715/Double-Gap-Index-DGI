import { NextResponse } from "next/server";
import { SCORING_CONFIG } from "@/lib/scoring";

/**
 * GET /api/methodology
 * Returns configuration, weighting formulas, and limitations for single-source-of-truth.
 */
export async function GET() {
  return NextResponse.json({
    project: "Double Gap Index (DGI)",
    non_negotiable_rule: "Never blend Digital Access Score and Service Access Score into one composite number.",
    config: SCORING_CONFIG,
  });
}
