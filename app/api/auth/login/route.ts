import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/data/supabase/auth";
import { appLogger } from "@/core/logging/logger";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/login
 * Autenticación de usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const session = await auth.signIn(email, password);

    if (!session) {
      appLogger.warn("Login failed", { email });
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    appLogger.auth("Login successful", { email, userId: session.user.id });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: session,
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    appLogger.error("Login error", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
