export type LogLevel = "info" | "warn" | "error" | "debug";

export class Logger {
  private scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  private formatMessage(level: LogLevel, message: string, meta?: Record<string, any>) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      scope: this.scope,
      message,
      ...(meta ? { meta } : {}),
    });
  }

  info(message: string, meta?: Record<string, any>) {
    console.log(this.formatMessage("info", message, meta));
  }

  warn(message: string, meta?: Record<string, any>) {
    console.warn(this.formatMessage("warn", message, meta));
  }

  error(message: string, meta?: Record<string, any>) {
    console.error(this.formatMessage("error", message, meta));
  }

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}

export const createLogger = (scope: string) => new Logger(scope);
