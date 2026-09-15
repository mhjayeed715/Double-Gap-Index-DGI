import { NextRequest, NextResponse } from "next/server";
import { getDistrictById } from "@/lib/data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/districts/[id]
 * Returns full breakdown for a single district.
 * Spec: 07_API_CONTRACT.md & 09_ERROR_HANDLING.md
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          error: true,
          message: "Invalid district ID parameter",
          code: "INVALID_QUERY_PARAM",
        },
        { status: 400 }
      );
    }

    const district = await getDistrictById(id);

    if (!district) {
      return NextResponse.json(
        {
          error: true,
          message: `District '${id}' not found`,
          code: "DISTRICT_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Return the contract shape
    return NextResponse.json(district);
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: "Internal server error retrieving district",
        code: "DB_CONNECTION_ERROR",
      },
      { status: 500 }
    );
  }
}
