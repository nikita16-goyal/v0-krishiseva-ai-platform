'use client'

import { MetricCards } from "@/components/dashboard/metric-cards"
import { TrendChart } from "@/components/dashboard/trend-chart"
import { NutrientChart } from "@/components/dashboard/nutrient-chart"
import {
  soilData,
  weatherData,
  monthlyTrends,
  soilNutrients,
} from "@/lib/mock-data"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AnalyticsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Weather & Soil Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Detailed environmental data driving your crop recommendations.
        </p>
      </div>

      <MetricCards soilData={soilData} weatherData={weatherData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={monthlyTrends} />
        <NutrientChart data={soilNutrients} />
      </div>
    </div>
  )
}
