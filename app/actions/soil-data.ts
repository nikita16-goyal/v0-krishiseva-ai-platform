'use server'

import { createClient } from '@/lib/supabase/server'

export interface SoilDataInput {
  ph: number
  moisture: number
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  field_name?: string
}

export async function uploadSoilData(data: SoilDataInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data: soilData, error } = await supabase
    .from('soil_data')
    .insert({
      user_id: user.id,
      ph: data.ph,
      moisture: data.moisture,
      nitrogen: data.nitrogen,
      phosphorus: data.phosphorus,
      potassium: data.potassium,
      temperature: data.temperature,
      field_name: data.field_name || 'Field 1',
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  return { data: soilData, success: true }
}

export async function getUserSoilData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('soil_data')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return { error: error.message }
  }

  return { data, success: true }
}

export async function getLatestSoilData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('soil_data')
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
