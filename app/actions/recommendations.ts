'use server'

import { createClient } from '@/lib/supabase/server'

export interface CropRecommendation {
  crop_name: string
  yield_percentage: number
  risk_level: string
  confidence_score: number
  water_requirement: string
  soil_type_suitable: string
}

export async function saveCropRecommendations(
  soilDataId: string,
  weatherDataId: string,
  recommendations: CropRecommendation[]
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('crop_recommendations')
    .insert({
      user_id: user.id,
      soil_data_id: soilDataId,
      weather_data_id: weatherDataId,
      recommendations,
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  return { data, success: true }
}

export async function getUserRecommendations() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('crop_recommendations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return { error: error.message }
  }

  return { data, success: true }
}

export async function getLatestRecommendations() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('crop_recommendations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    return { error: error.message }
  }

  return { data, success: true }
}
