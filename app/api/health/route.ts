import { NextRequest, NextResponse } from "next/server";
import { dbClient } from "@/db/supabase";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        status: "OK",
        service: "PHEONIXZ Autonomous Product Analyst API",
        version: "1.0.0",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          configured: dbClient.isConfigured,
          status: "connected",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "FAIL", error: "System health check failed" },
      { status: 500 }
    );
  }
}
