import { RecommendationPanel } from "@/components/dashboard/recommendation-panel"
import { YieldChart } from "@/components/dashboard/yield-chart"
import { predictedCrops, yieldPredictions } from "@/lib/mock-data"

export default function RecommendationsPage() {
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
