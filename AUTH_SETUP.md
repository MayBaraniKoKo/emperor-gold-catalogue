# Supabase Authentication Setup Guide

## What is Supabase Authentication?

Supabase has **built-in authentication** - you don't need to create auth tables! It handles user registration, login, and session management automatically.

## Enable Authentication (2 Steps)

### Step 1: Go to Supabase Authentication Settings
https://app.supabase.com/project/khqrubyyndipqjyerrqg/auth/providers

### Step 2: Enable Email Auth Provider
1. Look for **Email** provider
2. Click to expand it
3. Make sure **"Confirm email"** is set based on your needs:
   - **OFF** = Users can sign up and login immediately (recommended for development)
   - **ON** = Users must confirm their email before logging in (recommended for production)

For your development/GoDaddy launch, I recommend turning **Confirm email OFF** for convenience.

## Test Authentication

After enabling email provider:

### Sign Up (Create Account)
1. Go to http://localhost:8082 (or your dev server)
2. Click "Create Account"
3. Enter:
   - Email: `admin@united42.com`
   - Password: `Password123!`
4. Click "Sign Up"
5. You should see a success message and be redirected to admin

### Sign In (Login)
1. Use the same email and password
2. Click "Sign In"
3. You should be logged in

## Common Issues

### "Invalid login credentials" after sign up
- Make sure you're waiting a moment after sign up before trying to sign in
- If email confirmation is ON, check your email for the confirmation link first

### "Database access denied" errors
- This means the auth user was created but can't access the database
- Go to Step 3 below to set authentication roles

## Step 3 (OPTIONAL): Configure Auth Roles for Admin Access

If you want to restrict admin features to authenticated users, add this SQL to your Supabase SQL Editor:

```sql
-- Allow authenticated users to access admin data
ALTER ROLE authenticated SET app.role = 'authenticated';

-- Create a simple auth check function
CREATE OR REPLACE FUNCTION public.auth_check()
RETURNS text AS $$
BEGIN
  RETURN auth.uid()::text;
END;
$$ LANGUAGE plpgsql;
```

## Your Authentication is Now Working!

The app handles authentication automatically:
- Sign up creates a new user
- Sign in authenticates existing users
- Sessions are stored in localStorage
- Protected routes redirect to /login if not authenticated

## Production Notes for GoDaddy

1. **Email Confirmation**: Enable for production (users must confirm email)
2. **Custom Domain**: You can add custom SMTP for production emails
3. **Rate Limiting**: Supabase protects against brute force attacks by default
4. **Session Duration**: Default is 1 hour (adjustable in settings)

## Need Help?

Check your Supabase dashboard:
- Users: https://app.supabase.com/project/khqrubyyndipqjyerrqg/auth/users
- Logs: https://app.supabase.com/project/khqrubyyndipqjyerrqg/logs/auth

All auth logs appear there if something goes wrong.
