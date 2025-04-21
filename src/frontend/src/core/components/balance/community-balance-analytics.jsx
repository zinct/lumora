"use client";

import { BarChart4 } from "lucide-react";

export function CommunityBalanceAnalytics({ timeframe }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <BarChart4 className="h-16 w-16 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">
        Community balance analytics would render here
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Showing data for the last{" "}
        {timeframe === "week"
          ? "7 days"
          : timeframe === "month"
          ? "30 days"
          : timeframe === "quarter"
          ? "90 days"
          : "12 months"}
      </p>
    </div>
  );
}
