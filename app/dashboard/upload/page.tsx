'use client'

import { Upload, FileUp } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UploadPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Upload Data</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload soil reports, crop images, or sensor data for AI analysis.
        </p>
      </div>

      {/* Upload Zone - Placeholder for AI agent integration */}
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
              Supports CSV, JSON, PNG, JPG formats
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

      {/* Recent Uploads Placeholder */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Recent Uploads</h3>
        <p className="text-sm text-muted-foreground">
          No uploads yet. Upload sensor data or crop images to get started.
        </p>
      </div>
    </div>
  )
}
