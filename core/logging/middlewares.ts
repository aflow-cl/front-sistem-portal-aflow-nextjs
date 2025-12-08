import { NextRequest, NextResponse } from "next/server";
import { appLogger } from "./logger";

/**
 * Middleware de logging para rutas API
 */
export function withLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const start = Date.now();
    const { method, url } = req;
    const path = new URL(url).pathname;

    try {
      appLogger.info(`Incoming request`, {
        method,
        path,
        context: "API_REQUEST",
      });

      const response = await handler(req);
      const duration = Date.now() - start;

      appLogger.api(method, path, response.status, { duration });

      return response;
    } catch (error) {
      const duration = Date.now() - start;
      
      appLogger.error(`Request failed`, error, {
        method,
        path,
        duration,
        context: "API_ERROR",
      });

      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware para logging de errores
 */
export function logError(
  context: string,
  error: unknown,
  meta?: Record<string, any>
) {
  const message = error instanceof Error ? error.message : "Unknown error";
  appLogger.error(`Error in ${context}: ${message}`, error, meta);
}

/**
 * Middleware para logging de acciones de usuario
 */
export function logUserAction(
  action: string,
  userId?: string,
  meta?: Record<string, any>
) {
  appLogger.user(action, userId, meta);
}

/**
 * Middleware para logging de operaciones de base de datos
 */
export function logDbOperation(
  operation: string,
  table: string,
  meta?: Record<string, any>
) {
  appLogger.db(operation, table, meta);
}
