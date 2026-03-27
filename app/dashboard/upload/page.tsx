'use client'

import { Upload, FileUp } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CropDetailsForm, CropDetails } from "@/components/dashboard/crop-details-form"

export default function UploadPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showCropForm, setShowCropForm] = useState(false)
  const [cropData, setCropData] = useState<CropDetails | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleCropFormSubmit = (details: CropDetails) => {
    setCropData(details)
    setShowCropForm(false)
    // TODO: Send data to AI model for analysis
    console.log("Crop details submitted:", details)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      {showCropForm && (
        <CropDetailsForm 
          onClose={() => setShowCropForm(false)} 
          onSubmit={handleCropFormSubmit}
        />
      )}

      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Upload & Analyze</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter crop details and soil parameters for AI-powered crop recommendations.
        </p>
      </div>

      {/* Crop Details Card */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Crop Analysis</h2>
        {cropData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Region</p>
                <p className="font-medium text-foreground">{cropData.region}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Land Size</p>
                <p className="font-medium text-foreground">{cropData.landSize} {cropData.landSizeUnit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium text-foreground">₹{cropData.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Soil Type</p>
                <p className="font-medium text-foreground capitalize">{cropData.soilType}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Crops to Plant</p>
              <p className="font-medium text-foreground">{cropData.cropNames.join(", ")}</p>
            </div>
            <button
              onClick={() => setShowCropForm(true)}
              className="w-full mt-4 rounded-2xl border border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Update Details
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCropForm(true)}
            className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Enter Crop Details
          </button>
        )}
      </div>

      {/* Upload Zone - Placeholder for files */}
      {cropData && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">
                Drag and drop your files here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Optional: Upload soil reports, crop images, or sensor data
              </p>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FileUp className="h-4 w-4" />
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-foreground">How it Works</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Enter your crop details and farming conditions</li>
          <li>• Our AI analyzes your data for optimal crop recommendations</li>
          <li>• Get insights on yield predictions and risk assessment</li>
          <li>• Receive personalized recommendations for your farm</li>
        </ul>
      </div>
    </div>
  )
}
