import { NextResponse } from "next/server";
import { createLogger } from "./logger";

const logger = createLogger("ApiHandler");

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function apiError(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function withErrorHandler(handler: (...args: unknown[]) => Promise<unknown>) {
  return async (req: unknown, res: unknown) => {
    try {
      return await handler(req, res);
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      logger.error("API Route Execution Failure", { error: errorObj.message, stack: errorObj.stack });

      if (err instanceof AppError) {
        return apiError(err.message, err.statusCode, err.details);
      }

      return apiError(errorObj.message || "Internal Server Error", 500);
    }
  };
}
