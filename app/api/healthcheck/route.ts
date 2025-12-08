import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

/**
 * GET /api/healthcheck
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json<ApiResponse>({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  });
}
