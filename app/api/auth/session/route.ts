import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/data/supabase/auth";
import type { ApiResponse } from "@/types";

/**
 * GET /api/auth/session
 * Obtener sesión actual
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "No hay sesión activa" },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: session,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al obtener sesión" },
      { status: 500 }
    );
  }
}
