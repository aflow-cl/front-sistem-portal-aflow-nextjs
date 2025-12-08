import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/data/supabase/auth";
import { getPermittedModules } from "@/lib/permissions";
import { ROUTES } from "@/lib/constants";
import { appLogger } from "@/core/logging/logger";
import type { ApiResponse, MenuItem, MenuGroup } from "@/types";

/**
 * GET /api/menu
 * Obtener menú dinámico basado en el rol del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const user = await auth.getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const permittedModules = getPermittedModules(user.role);

    // Definir todos los módulos disponibles
    const allModules: MenuItem[] = [
      {
        id: "dashboard",
        label: "Dashboard",
        path: ROUTES.DASHBOARD,
        group: "principal",
        order: 1,
      },
      {
        id: "cotizacion",
        label: "Cotización",
        path: ROUTES.MODULES.COTIZACION,
        group: "operaciones",
        order: 1,
      },
      {
        id: "comex",
        label: "Comex",
        path: ROUTES.MODULES.COMEX,
        group: "operaciones",
        order: 2,
      },
      {
        id: "guardia",
        label: "Guardia",
        path: ROUTES.MODULES.GUARDIA,
        group: "operaciones",
        order: 3,
      },
      {
        id: "finanzas",
        label: "Finanzas",
        path: ROUTES.MODULES.FINANZAS,
        group: "gestion",
        order: 1,
      },
      {
        id: "clientes",
        label: "Clientes",
        path: ROUTES.MODULES.CLIENTES,
        group: "gestion",
        order: 2,
      },
      {
        id: "contratante",
        label: "Contratante",
        path: ROUTES.MODULES.CONTRATANTE,
        group: "gestion",
        order: 3,
      },
      {
        id: "micuenta",
        label: "Mi Cuenta",
        path: ROUTES.MODULES.MI_CUENTA,
        group: "usuario",
        order: 1,
      },
    ];

    // Filtrar módulos según permisos
    const allowedItems = allModules.filter(
      (module) =>
        module.id === "dashboard" || permittedModules.includes(module.id)
    );

    // Agrupar módulos
    const groups = [
      {
        id: "principal",
        label: "Principal",
        order: 1,
        items: allowedItems.filter((item) => item.group === "principal"),
      },
      {
        id: "operaciones",
        label: "Operaciones",
        order: 2,
        items: allowedItems.filter((item) => item.group === "operaciones"),
      },
      {
        id: "gestion",
        label: "Gestión",
        order: 3,
        items: allowedItems.filter((item) => item.group === "gestion"),
      },
      {
        id: "usuario",
        label: "Usuario",
        order: 4,
        items: allowedItems.filter((item) => item.group === "usuario"),
      },
    ].filter((group) => group.items.length > 0);

    appLogger.info("Menu generated", { userId: user.id, role: user.role, modulesCount: allowedItems.length });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        groups,
        items: allowedItems,
      },
    });
  } catch (error) {
    appLogger.error("Menu generation error", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al generar el menú" },
      { status: 500 }
    );
  }
}
