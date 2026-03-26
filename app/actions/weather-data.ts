'use server'

import { createClient } from '@/lib/supabase/server'

export interface WeatherDataInput {
  temperature: number
  humidity: number
  rainfall: number
  wind_speed: number
  uv_index: number
}

export async function uploadWeatherData(data: WeatherDataInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data: weatherData, error } = await supabase
    .from('weather_data')
    .insert({
      user_id: user.id,
      temperature: data.temperature,
      humidity: data.humidity,
      rainfall: data.rainfall,
      wind_speed: data.wind_speed,
      uv_index: data.uv_index,
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  return { data: weatherData, success: true }
}

export async function getUserWeatherData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('weather_data')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    return { error: error.message }
  }

  return { data, success: true }
}

export async function getLatestWeatherData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('weather_data')
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
