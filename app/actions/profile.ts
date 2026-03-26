'use server'

import { createClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return { error: error.message }
  }

  return {
    data: {
      id: user.id,
      email: user.email,
      ...data,
    },
    success: true,
  }
}

export async function updateUserProfile(profileData: {
  full_name?: string
  farm_location?: string
  farm_size?: number
  crops_grown?: string[]
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id)
    .select()

  if (error) {
    return { error: error.message }
  }

  return { data, success: true }
}
