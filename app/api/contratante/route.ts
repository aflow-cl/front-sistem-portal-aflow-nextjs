import { NextRequest, NextResponse } from "next/server";
import { contratanteService } from "@/app/(private)/modules/contratante/services/contratante.service";
import { appLogger } from "@/core/logging/logger";
import type { ApiResponse } from "@/types";
import type { ContratanteFormData } from "@/app/(private)/modules/contratante/types/contratante";

/**
 * GET /api/contratante
 * Obtener todos los contratantes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let contratantes;

    if (search) {
      contratantes = await contratanteService.search(search);
    } else {
      contratantes = await contratanteService.getAll();
    }

    appLogger.api("GET", "/api/contratante", 200, { count: contratantes.length });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: contratantes,
    });
  } catch (error) {
    appLogger.error("GET /api/contratante error", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al obtener contratantes" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contratante
 * Crear un nuevo contratante
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContratanteFormData = await request.json();

    const newContratante = await contratanteService.create(body);

    appLogger.api("POST", "/api/contratante", 201, { id: newContratante.id });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: newContratante,
        message: "Contratante creado exitosamente",
      },
      { status: 201 }
    );
  } catch (error) {
    appLogger.error("POST /api/contratante error", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al crear contratante" },
      { status: 500 }
    );
  }
}
