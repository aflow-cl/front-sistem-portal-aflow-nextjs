import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/data/supabase/auth";
import { appLogger } from "@/core/logging/logger";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
export async function POST(request: NextRequest) {
  try {
    await auth.signOut();
    appLogger.auth("Logout successful");

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    appLogger.error("Logout error", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
