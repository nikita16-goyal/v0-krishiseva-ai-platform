'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface CropDetailsFormProps {
  onClose: () => void
  onSubmit: (details: CropDetails) => void
}

export interface CropDetails {
  numberOfCrops: number
  cropNames: string[]
  landSize: number
  landSizeUnit: 'acres' | 'hectares' | 'sqm'
  budget: number
  region: string
  soilType: string
}

export function CropDetailsForm({ onClose, onSubmit }: CropDetailsFormProps) {
  const [numberOfCrops, setNumberOfCrops] = useState(1)
  const [cropNames, setCropNames] = useState([''])
  const [landSize, setLandSize] = useState(10)
  const [landSizeUnit, setLandSizeUnit] = useState<'acres' | 'hectares' | 'sqm'>('acres')
  const [budget, setBudget] = useState(50000)
  const [region, setRegion] = useState('')
  const [soilType, setSoilType] = useState('loamy')
  const [error, setError] = useState<string | null>(null)

  const handleNumberOfCropsChange = (num: number) => {
    setNumberOfCrops(num)
    setCropNames(prev => {
      const updated = [...prev]
      if (updated.length < num) {
        updated.push(...Array(num - updated.length).fill(''))
      } else {
        updated.splice(num)
      }
      return updated
    })
  }

  const handleCropNameChange = (index: number, value: string) => {
    const updated = [...cropNames]
    updated[index] = value
    setCropNames(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!region.trim()) {
      setError('Please enter your region')
      return
    }

    if (cropNames.some((name, idx) => idx < numberOfCrops && !name.trim())) {
      setError('Please enter all crop names')
      return
    }

    onSubmit({
      numberOfCrops,
      cropNames: cropNames.slice(0, numberOfCrops),
      landSize,
      landSizeUnit,
      budget,
      region,
      soilType,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground">Crop Analysis Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Region */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Region / Location</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g., Maharashtra, Karnataka"
              className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Number of Crops */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Number of Crops to Plant</label>
            <select
              value={numberOfCrops}
              onChange={(e) => handleNumberOfCropsChange(parseInt(e.target.value))}
              className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} Crop{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {/* Crop Names */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground block">Crop Names</label>
            {cropNames.slice(0, numberOfCrops).map((name, idx) => (
              <input
                key={idx}
                type="text"
                value={name}
                onChange={(e) => handleCropNameChange(idx, e.target.value)}
                placeholder={`Crop ${idx + 1} name (e.g., Rice, Wheat)`}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            ))}
          </div>

          {/* Land Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Land Size</label>
              <input
                type="number"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value))}
                min="0.1"
                step="0.1"
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Unit</label>
              <select
                value={landSizeUnit}
                onChange={(e) => setLandSizeUnit(e.target.value as 'acres' | 'hectares' | 'sqm')}
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="sqm">Square Meters</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              min="0"
              step="1000"
              className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {/* Soil Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="loamy">Loamy</option>
              <option value="clayey">Clayey</option>
              <option value="sandy">Sandy</option>
              <option value="laterite">Laterite</option>
              <option value="black">Black</option>
              <option value="alluvial">Alluvial</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Analyze Crops
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
