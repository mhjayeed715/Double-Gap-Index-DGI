import { NextResponse } from "next/server";
import { getDistrictSummaries } from "@/lib/data";

/**
 * GET /api/districts
 * Returns summary list of all districts with their scores.
 * Spec: 07_API_CONTRACT.md
 */
export async function GET() {
  try {
    const districts = await getDistrictSummaries();
    return NextResponse.json({ districts });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: "Failed to load districts",
        code: "DB_CONNECTION_ERROR",
      },
      { status: 500 }
    );
  }
}
