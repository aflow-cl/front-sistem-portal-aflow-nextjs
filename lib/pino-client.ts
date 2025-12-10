import pino from "pino";

/**
 * Client-side logger configuration using Pino
 * For production, configure appropriate log levels and transports
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino({
  level: isDevelopment ? "debug" : "info",
  browser: {
    asObject: true,
  },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
});

/**
 * Structured logging helpers
 */
export const log = {
  info: (msg: string, data?: object) => logger.info(data, msg),
  error: (msg: string, error?: Error | object) => logger.error(error, msg),
  warn: (msg: string, data?: object) => logger.warn(data, msg),
  debug: (msg: string, data?: object) => logger.debug(data, msg),
};
