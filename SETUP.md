# Quick Setup Guide

Follow these steps to get your DR Muhid Lab platform running:

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** in your Supabase dashboard
3. Copy all contents from `supabase/schema.sql`
4. Paste and run the SQL in the editor
5. Verify tables were created in **Table Editor**

## 3. Configure Google OAuth

### In Google Cloud Console:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
6. Copy **Client ID** and **Client Secret**

### In Supabase Dashboard:
1. Go to **Authentication > Providers**
2. Enable **Google**
3. Paste Client ID and Client Secret
4. Save

## 4. Set Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials from **Settings > API**

3. Fill in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

## 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 6. Create Admin User

1. Sign in with your Google account (first time)
2. Go to Supabase **SQL Editor**
3. Run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```
4. Refresh the page - you're now an admin!

## 7. Configure URL Settings

In Supabase **Authentication > URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: Add `http://localhost:3000/**`

## Done! 🎉

- **Admin**: Access at `/admin`
- **Customer**: Access at `/dashboard`

## Common Issues

**OAuth not working?**
- Check redirect URL matches exactly in Google Cloud Console
- Verify Google provider is enabled in Supabase

**Database errors?**
- Confirm schema.sql ran successfully
- Check RLS policies are enabled

**Admin access denied?**
- Verify you ran the UPDATE query with your email
- Check `profiles` table has your user with role='admin'
