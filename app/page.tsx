"use client";

import React, { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  const [viewMode, setViewMode] = useState<"landing" | "dashboard">("dashboard");

  if (viewMode === "landing") {
    return <LandingPage onEnterDashboard={() => setViewMode("dashboard")} />;
  }

  return <AppShell />;
}
