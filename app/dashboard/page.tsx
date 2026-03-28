"use client";

import { MetricCards } from "@/components/dashboard/metric-cards"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { NutrientChart } from "@/components/dashboard/nutrient-chart"
import { YieldChart } from "@/components/dashboard/yield-chart"

import {
  soilData,
  weatherData,
  monthlyTrends,
  soilNutrients,
  yieldPredictions,
} from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time soil and weather analytics with AI-powered crop recommendations.
        </p>
      </div>

      {/* Metric Cards */}
      <MetricCards soilData={soilData} weatherData={weatherData} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={monthlyTrends} />
        <NutrientChart data={soilNutrients} />
      </div>

      {/* Yield + AI Recommendation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <YieldChart data={yieldPredictions} />

        <div style={{ marginTop: "20px" }}>
          <h2 className="text-lg font-semibold mb-2">
            🌾 AI Crop Recommendation
          </h2>

          <iframe
            src="https://099e61d0e9685edfc.gradio.live"
            width="100%"
            height="600px"
            style={{
              border: "none",
              borderRadius: "12px"
            }}
          ></iframe>
        </div>

      </div>

    </div>
  );
}
