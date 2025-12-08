import { NextRequest, NextResponse } from "next/server";
import { contratanteService } from "@/app/(private)/modules/contratante/services/contratante.service";
import { appLogger } from "@/core/logging/logger";
import type { ApiResponse } from "@/types";
import type { ContratanteFormData } from "@/app/(private)/modules/contratante/types/contratante";

/**
 * GET /api/contratante/[id]
 * Obtener un contratante por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contratante = await contratanteService.getById(params.id);

    if (!contratante) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Contratante no encontrado" },
        { status: 404 }
      );
    }

    appLogger.api("GET", `/api/contratante/${params.id}`, 200);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: contratante,
    });
  } catch (error) {
    appLogger.error(`GET /api/contratante/${params.id} error`, error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al obtener contratante" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contratante/[id]
 * Actualizar un contratante
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Partial<ContratanteFormData> = await request.json();

    const updatedContratante = await contratanteService.update(params.id, body);

    if (!updatedContratante) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Contratante no encontrado" },
        { status: 404 }
      );
    }

    appLogger.api("PUT", `/api/contratante/${params.id}`, 200);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedContratante,
      message: "Contratante actualizado exitosamente",
    });
  } catch (error) {
    appLogger.error(`PUT /api/contratante/${params.id} error`, error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al actualizar contratante" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contratante/[id]
 * Eliminar un contratante
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await contratanteService.delete(params.id);

    if (!success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Contratante no encontrado" },
        { status: 404 }
      );
    }

    appLogger.api("DELETE", `/api/contratante/${params.id}`, 200);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Contratante eliminado exitosamente",
    });
  } catch (error) {
    appLogger.error(`DELETE /api/contratante/${params.id} error`, error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al eliminar contratante" },
      { status: 500 }
    );
  }
}
