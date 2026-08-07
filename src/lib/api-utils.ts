import { NextResponse } from "next/server";
import { createLogger } from "./logger";

const logger = createLogger("ApiHandler");

export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function apiError(message: string, status = 500, details?: any) {
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

export function withErrorHandler(handler: Function) {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res);
    } catch (err: any) {
      logger.error("API Route Execution Failure", { error: err.message, stack: err.stack });

      if (err instanceof AppError) {
        return apiError(err.message, err.statusCode, err.details);
      }

      return apiError(err.message || "Internal Server Error", 500);
    }
  };
}
