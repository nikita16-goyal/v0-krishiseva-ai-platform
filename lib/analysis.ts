export interface SoilAnalysisData {
  ph: number
  moisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
}

export interface WeatherAnalysisData {
  temperature: number
  humidity: number
  rainfall: number
  wind_speed: number
  uv_index: number
}

export interface CropSuitability {
  crop_name: string
  yield_percentage: number
  risk_level: 'low' | 'medium' | 'high'
  confidence_score: number
  water_requirement: string
  soil_type_suitable: string
  notes: string
}

// Analyze soil parameters and return suitability scores
export function analyzeSoil(soil: SoilAnalysisData): Record<string, number> {
  const scores: Record<string, number> = {}

  // pH analysis (optimal ranges for different crops)
  const phScore = Math.max(0, 100 - Math.abs(soil.ph - 7) * 20)

  // Moisture analysis (optimal 30-40%)
  const moistureScore = Math.max(
    0,
    100 - Math.abs(soil.moisture - 35) * 3
  )

  // NPK analysis
  const nScore = Math.min(100, soil.nitrogen * 2)
  const pScore = Math.min(100, soil.phosphorus * 3)
  const kScore = Math.min(100, soil.potassium * 2.5)

  // Temperature analysis
  const tempScore = Math.max(0, 100 - Math.abs(soil.temperature - 25) * 2)

  scores.ph = phScore
  scores.moisture = moistureScore
  scores.nitrogen = nScore
  scores.phosphorus = pScore
  scores.potassium = kScore
  scores.temperature = tempScore

  return scores
}

// Analyze weather conditions
export function analyzeWeather(
  weather: WeatherAnalysisData
): Record<string, number> {
  const scores: Record<string, number> = {}

  // Temperature score (optimal 20-30°C)
  const tempScore = Math.max(0, 100 - Math.abs(weather.temperature - 25) * 3)

  // Humidity score (optimal 60-80%)
  const humidityScore = Math.max(
    0,
    100 - Math.abs(weather.humidity - 70) * 2
  )

  // Rainfall analysis (varies by crop)
  const rainfallScore = Math.min(100, weather.rainfall * 10)

  // Wind speed score (low wind preferred)
  const windScore = Math.max(0, 100 - weather.wind_speed * 5)

  // UV index score (moderate preferred)
  const uvScore = Math.max(0, 100 - Math.abs(weather.uv_index - 5) * 8)

  scores.temperature = tempScore
  scores.humidity = humidityScore
  scores.rainfall = rainfallScore
  scores.wind = windScore
  scores.uv = uvScore

  return scores
}

// Recommend crops based on soil and weather analysis
export function recommendCrops(
  soil: SoilAnalysisData,
  weather: WeatherAnalysisData
): CropSuitability[] {
  const soilScores = analyzeSoil(soil)
  const weatherScores = analyzeWeather(weather)

  // Crop suitability criteria
  const cropsDatabase: Record<string, any> = {
    rice: {
      ph_range: [6, 7.5],
      moisture_range: [50, 70],
      rainfall_min: 60,
      temperature_range: [25, 30],
    },
    wheat: {
      ph_range: [6, 7],
      moisture_range: [30, 40],
      rainfall_min: 40,
      temperature_range: [20, 25],
    },
    maize: {
      ph_range: [5.5, 7],
      moisture_range: [35, 45],
      rainfall_min: 50,
      temperature_range: [25, 30],
    },
    tomato: {
      ph_range: [6, 7],
      moisture_range: [40, 50],
      rainfall_min: 30,
      temperature_range: [20, 28],
    },
    potato: {
      ph_range: [5.5, 6.8],
      moisture_range: [45, 55],
      rainfall_min: 40,
      temperature_range: [15, 20],
    },
    sugarcane: {
      ph_range: [6, 7.5],
      moisture_range: [50, 60],
      rainfall_min: 75,
      temperature_range: [25, 35],
    },
    cotton: {
      ph_range: [6.5, 7.5],
      moisture_range: [30, 40],
      rainfall_min: 50,
      temperature_range: [25, 30],
    },
    soybean: {
      ph_range: [6, 7],
      moisture_range: [35, 45],
      rainfall_min: 45,
      temperature_range: [20, 25],
    },
  }

  const recommendations: CropSuitability[] = []

  for (const [cropName, criteria] of Object.entries(cropsDatabase)) {
    let suitabilityScore = 0
    let riskLevel: 'low' | 'medium' | 'high' = 'medium'

    // pH suitability
    const phInRange =
      soil.ph >= criteria.ph_range[0] && soil.ph <= criteria.ph_range[1]
    const phScore = phInRange ? 20 : 10

    // Moisture suitability
    const moistureInRange =
      soil.moisture >= criteria.moisture_range[0] &&
      soil.moisture <= criteria.moisture_range[1]
    const moistureScore = moistureInRange ? 20 : 10

    // Temperature suitability
    const tempInRange =
      weather.temperature >= criteria.temperature_range[0] &&
      weather.temperature <= criteria.temperature_range[1]
    const tempScore = tempInRange ? 20 : 10

    // Rainfall analysis
    const rainfallSufficient = weather.rainfall >= criteria.rainfall_min
    const rainfallScore = rainfallSufficient ? 20 : 15

    // NPK score
    const npkScore = Math.min(
      20,
      (soilScores.nitrogen + soilScores.phosphorus + soilScores.potassium) / 15
    )

    suitabilityScore =
      phScore + moistureScore + tempScore + rainfallScore + npkScore

    // Determine risk level
    if (suitabilityScore >= 80) {
      riskLevel = 'low'
    } else if (suitabilityScore >= 60) {
      riskLevel = 'medium'
    } else {
      riskLevel = 'high'
    }

    // Water requirement estimation
    const waterReq =
      weather.rainfall >= criteria.rainfall_min
        ? 'Moderate'
        : 'High (irrigation needed)'

    recommendations.push({
      crop_name: cropName.charAt(0).toUpperCase() + cropName.slice(1),
      yield_percentage: Math.max(30, Math.min(100, suitabilityScore * 1.2)),
      risk_level: riskLevel,
      confidence_score: Math.max(0, Math.min(100, suitabilityScore * 1.1)),
      water_requirement: waterReq,
      soil_type_suitable: determineSoilType(soil.ph, soil.moisture),
      notes: generateNotes(cropName, soil, weather),
    })
  }

  // Sort by yield percentage descending
  return recommendations.sort((a, b) => b.yield_percentage - a.yield_percentage)
}

function determineSoilType(ph: number, moisture: number): string {
  if (ph < 5.5) return 'Acidic Loam'
  if (ph > 8) return 'Alkaline Clay'
  if (moisture > 50) return 'Clay Loam'
  if (moisture < 30) return 'Sandy Loam'
  return 'Well-draining Loam'
}

function generateNotes(
  crop: string,
  soil: SoilAnalysisData,
  weather: WeatherAnalysisData
): string {
  const notes: string[] = []

  if (soil.ph < 6) {
    notes.push('Soil is acidic - consider lime application')
  }
  if (soil.nitrogen < 20) {
    notes.push('Low nitrogen - add nitrogen fertilizer')
  }
  if (soil.moisture < 25) {
    notes.push('Irrigation required')
  }
  if (weather.temperature > 35) {
    notes.push('High temperature - ensure adequate water supply')
  }
  if (weather.humidity < 40) {
    notes.push('Low humidity - monitor for pest activity')
  }

  return notes.length > 0
    ? notes.join('; ')
    : 'Conditions are favorable for planting'
}
