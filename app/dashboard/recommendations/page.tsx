'use client'

import { RecommendationPanel } from "@/components/dashboard/recommendation-panel"
import { YieldChart } from "@/components/dashboard/yield-chart"
import { predictedCrops, yieldPredictions } from "@/lib/mock-data"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RecommendationsPage() {
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
          Crop Recommendations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated crop suggestions optimized for your soil and climate conditions.
        </p>
      </div>

      <RecommendationPanel predictedCrops={predictedCrops} />
      <YieldChart data={yieldPredictions} />
    </div>
  )
}
