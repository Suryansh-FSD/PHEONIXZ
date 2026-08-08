export type LogLevel = "info" | "warn" | "error" | "debug";

export class Logger {
  private scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      scope: this.scope,
      message,
      ...(meta ? { meta } : {}),
    });
  }

  info(message: string, meta?: Record<string, unknown>) {
    console.log(this.formatMessage("info", message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(this.formatMessage("warn", message, meta));
  }

  error(message: string, meta?: Record<string, unknown>) {
    console.error(this.formatMessage("error", message, meta));
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}

export const createLogger = (scope: string) => new Logger(scope);
