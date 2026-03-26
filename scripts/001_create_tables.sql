-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  email text,
  phone text,
  farm_name text,
  farm_location text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create soil data table
create table if not exists public.soil_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  field_name text not null,
  soil_type text,
  ph_level numeric,
  nitrogen numeric,
  phosphorus numeric,
  potassium numeric,
  organic_matter numeric,
  moisture_content numeric,
  temperature numeric,
  recorded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create weather data table
create table if not exists public.weather_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  location text not null,
  temperature numeric,
  humidity numeric,
  rainfall numeric,
  wind_speed numeric,
  weather_condition text,
  recorded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create crop recommendations table
create table if not exists public.crop_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  field_id uuid references public.soil_data(id) on delete cascade,
  recommended_crop text not null,
  predicted_yield numeric,
  confidence_score numeric,
  risk_level text,
  recommendation_reason text,
  generated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create analysis history table
create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  analysis_type text not null,
  input_data jsonb,
  output_data jsonb,
  analyzed_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.soil_data enable row level security;
alter table public.weather_data enable row level security;
alter table public.crop_recommendations enable row level security;
alter table public.analysis_history enable row level security;

-- Profiles policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Soil data policies
create policy "soil_data_select_own" on public.soil_data for select using (auth.uid() = user_id);
create policy "soil_data_insert_own" on public.soil_data for insert with check (auth.uid() = user_id);
create policy "soil_data_update_own" on public.soil_data for update using (auth.uid() = user_id);
create policy "soil_data_delete_own" on public.soil_data for delete using (auth.uid() = user_id);

-- Weather data policies
create policy "weather_data_select_own" on public.weather_data for select using (auth.uid() = user_id);
create policy "weather_data_insert_own" on public.weather_data for insert with check (auth.uid() = user_id);
create policy "weather_data_update_own" on public.weather_data for update using (auth.uid() = user_id);
create policy "weather_data_delete_own" on public.weather_data for delete using (auth.uid() = user_id);

-- Crop recommendations policies
create policy "crop_recommendations_select_own" on public.crop_recommendations for select using (auth.uid() = user_id);
create policy "crop_recommendations_insert_own" on public.crop_recommendations for insert with check (auth.uid() = user_id);
create policy "crop_recommendations_update_own" on public.crop_recommendations for update using (auth.uid() = user_id);
create policy "crop_recommendations_delete_own" on public.crop_recommendations for delete using (auth.uid() = user_id);

-- Analysis history policies
create policy "analysis_history_select_own" on public.analysis_history for select using (auth.uid() = user_id);
create policy "analysis_history_insert_own" on public.analysis_history for insert with check (auth.uid() = user_id);
create policy "analysis_history_update_own" on public.analysis_history for update using (auth.uid() = user_id);
create policy "analysis_history_delete_own" on public.analysis_history for delete using (auth.uid() = user_id);
