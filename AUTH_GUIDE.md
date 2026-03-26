# Authentication Guide - Krishiseva

## Overview

Krishiseva now has a complete authentication system with sign up, login, and logout functionality. All user data is securely stored in Supabase with Row Level Security (RLS) policies to protect privacy.

## User Flow

### 1. New User - Sign Up

1. User visits the homepage and clicks "Sign Up" button
2. Fills in Full Name, Email, Password, and Confirm Password
3. Clicks "Create Account"
4. The form validates:
   - Passwords must match
   - Password must be at least 6 characters
   - Email must be valid
5. Account is created in Supabase Auth
6. User metadata (full_name) is stored with the account
7. User is automatically redirected to login page
8. A user profile is created in the `profiles` table via database trigger

### 2. Existing User - Login

1. User visits the homepage and clicks "Login" button
2. Enters email and password
3. Clicks "Sign In"
4. The form sends credentials to Supabase Auth
5. If credentials are valid:
   - A session is created
   - User is authenticated
   - User is redirected to `/dashboard`
6. If credentials are invalid:
   - Error message is displayed
   - User can retry

### 3. Dashboard Access

1. Only authenticated users can access `/dashboard` and its sub-pages
2. The `ProtectedRoute` component checks user authentication
3. If user is not authenticated:
   - Automatically redirects to `/login`
   - Displays a loading spinner while checking auth status
4. If user is authenticated:
   - Dashboard loads normally
   - User can see sidebar with navigation

### 4. Sign Out

Users can sign out in two ways:

#### Option A: From Landing Page Header
- When logged in, the header shows "Dashboard" and "Sign Out" buttons
- Click "Sign Out" button
- User session is cleared
- User is redirected to login page

#### Option B: From Dashboard Sidebar
- In the bottom of the sidebar, there's a "Sign Out" button
- Click it to sign out
- Session is cleared
- User is redirected to login page

## Frontend Components

### Header Component (`components/landing/header.tsx`)
- Dynamically shows different buttons based on auth state
- Uses `useAuth()` hook to check if user is logged in
- Shows "Login" and "Sign Up" for unauthenticated users
- Shows "Dashboard" and "Sign Out" for authenticated users

### Login Page (`app/login/page.tsx`)
- Client-side form with email and password fields
- Calls `signIn()` server action
- Shows error messages if login fails
- Redirects to dashboard on successful login

### Sign Up Page (`app/signup/page.tsx`)
- Client-side form with Full Name, Email, Password, and Confirm Password
- Client-side validation (matching passwords, minimum length)
- Calls `signUp()` server action
- Shows success message and redirects to login after account creation
- Shows error messages if signup fails

### ProtectedRoute Component (`components/ProtectedRoute.tsx`)
- Wraps protected pages (like dashboard)
- Uses `useAuth()` hook to check authentication status
- Redirects unauthenticated users to `/login`
- Shows loading spinner while checking auth state
- Only renders children if user is authenticated

### Dashboard Sidebar (`components/dashboard/sidebar.tsx`)
- Includes a "Sign Out" button at the bottom
- Has "Back to Home" button to return to homepage
- Sign Out button calls `signOut()` server action

## Backend Server Actions

### Authentication Actions (`app/actions/auth.ts`)

#### `signUp(email: string, password: string, fullName: string)`
```typescript
// Creates a new user account in Supabase Auth
// Stores user metadata (full_name)
// Returns { success: true } or { error: string }
```

#### `signIn(email: string, password: string)`
```typescript
// Authenticates user with email and password
// Creates a session
// Redirects to /dashboard on success
// Throws error if credentials are invalid
```

#### `signOut()`
```typescript
// Clears the user session
// Redirects to /login
```

#### `getUser()`
```typescript
// Returns the currently authenticated user object
// Returns null if no user is authenticated
```

## API Routes

The following API routes support authentication with Supabase:

- `GET/POST /api/soil` - Soil data management
- `GET/POST /api/weather` - Weather data management
- `GET/POST /api/recommendations` - Crop recommendations
- `GET /api/history` - Analysis history

All API routes include authentication checks and use Row Level Security for data protection.

## Hooks

### useAuth() Hook (`hooks/useAuth.ts`)

```typescript
const { user, loading } = useAuth()

// user: Current authenticated user or null
// loading: Boolean indicating if auth state is being checked
```

Features:
- Automatically fetches current user on component mount
- Listens for auth state changes in real-time
- Updates component when user logs in/out
- Handles loading state properly

## Database Schema

### profiles table
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  created_at timestamp,
  updated_at timestamp
)
```

**Row Level Security**: Users can only read/write their own profile

### Session Management
- Sessions are automatically created when user logs in
- Sessions are stored as HTTP-only cookies
- Session tokens are refreshed via middleware

## Security Features

1. **Passwords**: Securely hashed by Supabase Auth (bcrypt)
2. **Sessions**: HTTP-only cookies prevent XSS attacks
3. **Row Level Security**: Users can only access their own data
4. **Email Verification**: (Optional) Can be enabled in Supabase settings
5. **CSRF Protection**: Built into Next.js

## Environment Variables

The following environment variables are automatically set by Supabase integration:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing the Flow

### Test Sign Up:
1. Visit http://localhost:3000
2. Click "Sign Up"
3. Fill in the form with test data
4. Click "Create Account"
5. Wait for redirect to login page
6. You should see a success message

### Test Login:
1. Visit http://localhost:3000/login
2. Enter the email and password from signup
3. Click "Sign In"
4. You should be redirected to /dashboard

### Test Dashboard Access:
1. Visit http://localhost:3000/dashboard directly
2. If not logged in, you'll be redirected to /login
3. If logged in, dashboard loads normally

### Test Sign Out:
1. From dashboard, click "Sign Out" button in sidebar
2. You should be redirected to /login
3. Or from homepage header, click "Sign Out"
4. You should be redirected to /login

## Troubleshooting

### "Failed to sign in" error
- Verify email and password are correct
- Check that the account was created successfully
- Ensure Supabase project is accessible

### User not staying logged in
- Check browser cookies are enabled
- Check that middleware.ts is set up correctly
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set

### Dashboard not loading after login
- Check that ProtectedRoute is wrapping the dashboard layout
- Verify the useAuth hook is working correctly
- Check browser console for errors

### "Redirect to /login" when already logged in
- Try refreshing the page
- Clear browser cookies and login again
- Check that the session middleware is running
