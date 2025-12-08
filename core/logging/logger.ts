import pino from "pino";
import { env } from "@/lib/env";

/**
 * Configuración de Pino Logger para AFLOW Portal
 */
const logger = pino({
  level: env.logging.level,
  browser: {
    asObject: true,
  },
  ...(env.nodeEnv === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  }),
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        node_version: process.version,
      };
    },
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

/**
 * Logger wrapper con métodos específicos del dominio
 */
export const appLogger = {
  info: (message: string, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.info(meta, message);
  },
  
  error: (message: string, error?: Error | unknown, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    const errorMeta = error instanceof Error 
      ? { ...meta, error: error.message, stack: error.stack }
      : { ...meta, error };
    logger.error(errorMeta, message);
  },
  
  warn: (message: string, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.warn(meta, message);
  },
  
  debug: (message: string, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.debug(meta, message);
  },
  
  // Métodos específicos del dominio
  auth: (action: string, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.info({ ...meta, context: "AUTH" }, `Auth: ${action}`);
  },
  
  api: (method: string, path: string, status: number, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.info(
      { ...meta, method, path, status, context: "API" },
      `API ${method} ${path} - ${status}`
    );
  },
  
  db: (operation: string, table: string, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.info(
      { ...meta, operation, table, context: "DATABASE" },
      `DB ${operation} on ${table}`
    );
  },
  
  user: (action: string, userId?: string, meta?: Record<string, any>) => {
    if (!env.logging.enabled) return;
    logger.info(
      { ...meta, userId, context: "USER" },
      `User action: ${action}`
    );
  },
};

export default appLogger;
