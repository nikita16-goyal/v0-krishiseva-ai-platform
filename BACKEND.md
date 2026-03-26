# Krishiseva Backend Documentation

## Overview

Krishiseva is an AI-powered agricultural intelligence platform with a Next.js 15 backend, Supabase PostgreSQL database, and Row Level Security (RLS) for data protection.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Email/Password)
- **API**: REST API Routes + Server Actions
- **Security**: Row Level Security (RLS), Authentication middleware

### Key Components

1. **Supabase Setup** (`lib/supabase/`)
   - `client.ts` - Browser-side Supabase client
   - `server.ts` - Server-side Supabase client
   - `middleware.ts` - Token refresh and session handling

2. **Database** (`scripts/`)
   - `001_create_tables.sql` - Core tables (profiles, soil_data, weather_data, crop_recommendations, analysis_history)
   - `002_profile_trigger.sql` - Auto-create profile on user signup

3. **Server Actions** (`app/actions/`)
   - `auth.ts` - Authentication (signUp, signIn, signOut, getUser)
   - `soil-data.ts` - Soil parameter CRUD operations
   - `weather-data.ts` - Weather data CRUD operations
   - `recommendations.ts` - Crop recommendation management
   - `profile.ts` - User profile management

4. **API Routes** (`app/api/`)
   - `GET/POST /api/soil` - Soil data endpoints
   - `GET/POST /api/weather` - Weather data endpoints
   - `GET/POST /api/recommendations` - Crop recommendations
   - `GET/POST /api/history` - Analysis history

5. **Analysis Engine** (`lib/analysis.ts`)
   - Soil parameter analysis with optimal range scoring
   - Weather condition evaluation
   - AI-powered crop recommendation algorithm
   - Risk assessment and yield predictions

## Database Schema

### Tables

#### `profiles`
```sql
- id (UUID, primary key) - References auth.users(id)
- full_name (text)
- email (text)
- farm_location (text)
- farm_size (numeric)
- crops_grown (text array)
- created_at (timestamp)
- updated_at (timestamp)
```

#### `soil_data`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- ph (numeric) - Soil pH (0-14)
- moisture (numeric) - Soil moisture percentage (0-100)
- nitrogen (numeric) - N content (mg/kg)
- phosphorus (numeric) - P content (mg/kg)
- potassium (numeric) - K content (mg/kg)
- temperature (numeric) - Soil temperature (°C)
- field_name (text)
- created_at (timestamp)
```

#### `weather_data`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- temperature (numeric) - Air temperature (°C)
- humidity (numeric) - Humidity percentage (0-100)
- rainfall (numeric) - Rainfall (mm)
- wind_speed (numeric) - Wind speed (km/h)
- uv_index (numeric) - UV index (0-11)
- created_at (timestamp)
```

#### `crop_recommendations`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- soil_data_id (UUID, foreign key)
- weather_data_id (UUID, foreign key)
- recommendations (jsonb) - Array of recommendation objects
- created_at (timestamp)
```

#### `analysis_history`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- soil_data_id (UUID, foreign key)
- weather_data_id (UUID, foreign key)
- analysis_type (text)
- results (jsonb)
- created_at (timestamp)
```

## Setting Up the Database

### Option 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase dashboard
2. Click "SQL Editor" in the sidebar
3. Copy and paste the contents of `scripts/001_create_tables.sql`
4. Click "Run" to execute
5. Repeat for `scripts/002_profile_trigger.sql`

### Option 2: Using Supabase CLI

```bash
# Initialize Supabase project
supabase init

# Run migrations
supabase db push

# Link to remote project
supabase link --project-ref <project-id>

# Push migrations to remote
supabase db push --linked
```

## API Endpoints

### Authentication

#### Sign Up
```bash
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "secure_password",
  "full_name": "John Farmer"
}
```

#### Sign In
```bash
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "secure_password"
}
```

### Soil Data

#### Get Soil Data
```bash
GET /api/soil
Authorization: Bearer <session_token>
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "ph": 7.2,
      "moisture": 35,
      "nitrogen": 25,
      "phosphorus": 15,
      "potassium": 200,
      "temperature": 24,
      "field_name": "Field 1",
      "created_at": "2026-03-26T10:00:00Z"
    }
  ]
}
```

#### Upload Soil Data
```bash
POST /api/soil
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "ph": 7.2,
  "moisture": 35,
  "nitrogen": 25,
  "phosphorus": 15,
  "potassium": 200,
  "temperature": 24,
  "field_name": "Field 1"
}
```

### Weather Data

#### Get Weather Data
```bash
GET /api/weather
Authorization: Bearer <session_token>
```

#### Upload Weather Data
```bash
POST /api/weather
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "temperature": 28,
  "humidity": 65,
  "rainfall": 15,
  "wind_speed": 10,
  "uv_index": 6
}
```

### Crop Recommendations

#### Get Recommendations
```bash
GET /api/recommendations
Authorization: Bearer <session_token>
```

#### Save Recommendations
```bash
POST /api/recommendations
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "soil_data_id": "uuid",
  "weather_data_id": "uuid",
  "recommendations": [
    {
      "crop_name": "Rice",
      "yield_percentage": 85,
      "risk_level": "low",
      "confidence_score": 92,
      "water_requirement": "High",
      "soil_type_suitable": "Clay Loam",
      "notes": "Conditions are favorable for planting"
    }
  ]
}
```

### Analysis History

#### Get Analysis History
```bash
GET /api/history
Authorization: Bearer <session_token>
```

#### Save Analysis
```bash
POST /api/history
Content-Type: application/json
Authorization: Bearer <session_token>

{
  "soil_data_id": "uuid",
  "weather_data_id": "uuid",
  "analysis_type": "crop_suitability",
  "results": {
    "recommended_crops": ["Rice", "Wheat"],
    "confidence": 85
  }
}
```

## Using Server Actions

### Authentication

```typescript
import { signUp, signIn, signOut, getUser } from '@/app/actions/auth'

// Sign up
const result = await signUp('email@example.com', 'password', 'John Doe')
if (result.error) console.error(result.error)

// Sign in
await signIn('email@example.com', 'password')

// Get current user
const user = await getUser()

// Sign out
await signOut()
```

### Soil Data

```typescript
import { 
  uploadSoilData, 
  getUserSoilData, 
  getLatestSoilData 
} from '@/app/actions/soil-data'

// Upload soil data
const result = await uploadSoilData({
  ph: 7.2,
  moisture: 35,
  nitrogen: 25,
  phosphorus: 15,
  potassium: 200,
  temperature: 24,
  field_name: 'Field 1'
})

// Get all soil data
const allData = await getUserSoilData()

// Get latest reading
const latest = await getLatestSoilData()
```

### Crop Recommendations

```typescript
import { 
  saveCropRecommendations,
  getUserRecommendations,
  getLatestRecommendations
} from '@/app/actions/recommendations'

// Save recommendations
await saveCropRecommendations(soilDataId, weatherDataId, [
  {
    crop_name: 'Rice',
    yield_percentage: 85,
    risk_level: 'low',
    confidence_score: 92,
    water_requirement: 'High',
    soil_type_suitable: 'Clay Loam'
  }
])

// Get user recommendations
const recommendations = await getUserRecommendations()

// Get latest
const latest = await getLatestRecommendations()
```

## Analysis Engine

The `lib/analysis.ts` module provides AI-powered crop recommendations:

```typescript
import { 
  analyzeSoil, 
  analyzeWeather, 
  recommendCrops 
} from '@/lib/analysis'

const soilData = {
  ph: 7.2,
  moisture: 35,
  nitrogen: 25,
  phosphorus: 15,
  potassium: 200,
  temperature: 24
}

const weatherData = {
  temperature: 28,
  humidity: 65,
  rainfall: 15,
  wind_speed: 10,
  uv_index: 6
}

// Analyze soil parameters
const soilScores = analyzeSoil(soilData)

// Analyze weather
const weatherScores = analyzeWeather(weatherData)

// Get crop recommendations
const crops = recommendCrops(soilData, weatherData)
// Returns sorted array by yield percentage
```

### Supported Crops

- Rice
- Wheat
- Maize
- Tomato
- Potato
- Sugarcane
- Cotton
- Soybean

Each crop has optimal ranges for:
- pH level
- Soil moisture
- Temperature
- Rainfall
- Soil type

## Security

### Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- **SELECT**: Their own data
- **INSERT**: New records with their user_id
- **UPDATE**: Their own records
- **DELETE**: Their own records

### Authentication

- Email verification required on signup
- Sessions stored in HTTP-only cookies
- Token refresh handled by middleware
- Protected routes require valid session

## Error Handling

All API routes and server actions return consistent error responses:

```typescript
// Success
{ 
  data: [...], 
  success: true 
}

// Error
{ 
  error: "Error message description" 
}
```

## Deployment

### Environment Variables

Required for `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Deploy to Vercel

```bash
git push origin main
```

The app will automatically deploy to Vercel with Supabase integration.

## Future Enhancements

- [ ] Real-time data sync with Supabase subscriptions
- [ ] Email notifications for crop alerts
- [ ] IoT sensor integration
- [ ] Advanced ML-based predictions
- [ ] Weather API integration (OpenWeatherMap, etc.)
- [ ] Mobile app (React Native)
- [ ] Multi-field management
- [ ] Crop yield tracking and analytics
- [ ] Pest and disease detection
- [ ] Market price predictions

## Support

For issues or questions, refer to:
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Krishiseva GitHub: [Your repo URL]
