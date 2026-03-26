# Email Confirmation Guide

## Current Behavior

By default, Supabase requires users to confirm their email address before they can sign in. This is a security feature to verify email ownership.

When a user signs up:
1. Their account is created in Supabase
2. A confirmation email is sent to their email address
3. They must click the confirmation link in the email
4. Only after confirmation can they sign in

If they try to sign in before confirming their email, they'll see: **"Email not confirmed"**

## Why This Matters

This is a **security best practice** but can affect the user experience during development and testing.

---

## Option 1: Disable Email Confirmation (Development Only)

If you want to allow instant login without email verification (not recommended for production):

### Steps:
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers** → **Email**
3. Find the toggle for **"Confirm email"**
4. Toggle it **OFF**
5. Save changes

### Result:
Users can sign up and immediately sign in without confirming their email.

---

## Option 2: Keep Email Confirmation (Recommended for Production)

This is the current setup. Users see a friendly message after signing up:

> "Check your email for a confirmation link. Please confirm your email to activate your account."

### How Users Can Confirm:
1. Check their email inbox
2. Click the confirmation link in the email from Krishiseva
3. They'll be redirected to the app
4. They can now sign in with their credentials

### Testing Tips:
- Use a real email address you can access
- Check spam/promotions folder if email doesn't appear in inbox
- The confirmation link expires after 24 hours

---

## Option 3: Custom Email Templates (Advanced)

You can customize the confirmation email in Supabase:

1. Go to **Authentication** → **Email Templates**
2. Edit the "Confirm signup" template
3. Customize the message and link styling

---

## Troubleshooting

### Email not received?
- Check spam/promotions folder
- Verify email address is spelled correctly during signup
- Wait a few seconds (emails can be slightly delayed)
- Check your Supabase email logs in the dashboard

### Confirmation link not working?
- Link expires after 24 hours - sign up again if it's been more than 24 hours
- Make sure you're using the correct `NEXT_PUBLIC_SITE_URL`

### Want to test without real email?
- Use temporary email services like Mailinator or 10minutemail
- Or disable email confirmation temporarily (Option 1 above)

---

## Environment Variable

Make sure `NEXT_PUBLIC_SITE_URL` is set correctly for email confirmation links to work:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # For local development
NEXT_PUBLIC_SITE_URL=https://yourdomain.com # For production
```
