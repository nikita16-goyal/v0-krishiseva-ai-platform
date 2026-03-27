# Krishiseva Authentication Flow

## Overview

Krishiseva implements a complete authentication system with email/password signup and login. Email confirmation is disabled for seamless user experience.

## User Flow

### 1. Landing Page (Home)
- **Unauthenticated users** see: "Login" and "Sign Up" buttons in the header
- **Authenticated users** see: Profile dropdown with their email

### 2. Sign Up Flow
**Path**: `/signup`

```
User fills form:
├─ Full Name
├─ Email Address
├─ Password (min 6 characters)
└─ Confirm Password

↓

Account created in Supabase Auth
↓
User redirected to Home Page
↓
(Can now login or explore features)
```

- Form validation ensures passwords match and are secure
- Account created instantly without email confirmation
- Success message shows, then redirects to home page

### 3. Login Flow
**Path**: `/login`

```
User enters:
├─ Email
└─ Password

↓

Credentials verified against Supabase Auth
↓
Session created (stored as HTTP-only cookie)
↓
User redirected to Home Page
↓
Header updates to show Profile dropdown
```

- Error messages if credentials are incorrect
- Session persists across browser refreshes
- Automatic redirects if already logged in (coming soon)

### 4. Profile Dropdown
**When authenticated**:
- Shows user's email address
- "Sign Out" button clears session
- Redirects to home page after sign out

## Protected Pages

The following pages require authentication and redirect to login if accessed without signing in:

- `/dashboard/upload` - Upload sensor data
- `/dashboard/recommendations` - View crop recommendations
- `/dashboard/analytics` - View soil and weather analytics
- `/dashboard/history` - View analysis history

**Protection Logic**:
```typescript
if (!user) {
  router.push("/login")
}
```

Each page shows a loading spinner while checking authentication status.

## Database Schema

### Profiles Table
```sql
id UUID (references auth.users)
full_name TEXT
created_at TIMESTAMP
```

### Row Level Security (RLS)
All user data is protected with RLS policies:
- Users can only view/edit their own data
- Auth UID is automatically verified
- Trigger auto-creates profile on signup

## Session Management

- **Session Storage**: HTTP-only cookies (secure, cannot be accessed by JavaScript)
- **Token Refresh**: Automatic refresh via Supabase middleware
- **Auth State**: Real-time updates via `useAuth()` hook

## Key Components

### useAuth Hook
`/hooks/useAuth.ts` - Get current user and loading state

```typescript
const { user, isLoading } = useAuth()
```

- Returns `null` if not authenticated
- `isLoading` true while checking auth status
- Automatically syncs across all components

### Header Component
`/components/landing/header.tsx` - Dynamic navigation

- Shows Login/Sign Up for guests
- Shows Profile dropdown for authenticated users

### ProfileDropdown
`/components/landing/profile-dropdown.tsx` - User menu

- Displays user email
- Sign Out button with redirect

## Security Features

✓ **Password Security**: Passwords hashed with bcrypt by Supabase
✓ **Session Security**: HTTP-only cookies, not accessible to JavaScript
✓ **Row Level Security**: Database policies enforce data isolation
✓ **CSRF Protection**: Built into Supabase auth
✓ **No Email Confirmation**: Disabled for faster onboarding (can be re-enabled)

## Environment Variables

Supabase environment variables are automatically set up in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public key for client-side auth

## Testing the Flow

### Sign Up Test
1. Go to home page (guest)
2. Click "Sign Up"
3. Fill in details and submit
4. Should redirect to home page
5. Header should show Profile dropdown

### Login Test
1. Click Profile dropdown → Sign Out
2. Click "Login"
3. Enter credentials
4. Should redirect to home page
5. Profile dropdown should appear

### Protected Pages Test
1. Sign out (click Profile → Sign Out)
2. Try to access `/dashboard/upload`
3. Should redirect to login page
4. Login and access the page successfully

## API Endpoints

### Server Actions (`/app/actions/auth.ts`)

- `signUp(email, password, fullName)` - Creates new account
- `signIn(email, password)` - Authenticates user
- `signOut()` - Clears session
- `getUser()` - Returns current authenticated user

## Email Confirmation (Disabled)

Email confirmation is currently **disabled** for rapid onboarding. To enable it:

1. Go to Supabase Dashboard
2. Authentication → Email Providers
3. Toggle ON "Confirm email"
4. Update signup flow to show confirmation message

## Troubleshooting

### User can't login after signup
- Check if email/password is correct
- Ensure Supabase Auth is enabled
- Check browser console for errors

### Session not persisting
- Check if cookies are enabled in browser
- Clear browser cache/cookies
- Check if middleware is running

### Profile not showing
- Give useAuth hook time to load (check isLoading state)
- Hard refresh the page
- Check browser DevTools Network tab
