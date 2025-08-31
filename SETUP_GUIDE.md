# DSA Daily Boost - Complete Setup Guide

## 🚀 Quick Start

1. **Clone and Install Dependencies**
   ```bash
   cd dsa-daily-boost-main
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env.local` file in the root directory with:
   ```env
   VITE_SUPABASE_URL=https://lsgjhhkbroecvlmiolnc.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzZ2poaGticm9lY3ZsbWlvbG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mjc4NTEsImV4cCI6MjA3MjIwMzg1MX0.wekYdQZERszqA552XY8dW8YjH_2s19Pp6_5eFSARCvk
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   VITE_APP_URL=http://localhost:5173
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in app information:
   - App name: "DSA Daily Boost"
   - User support email: Your email
   - Developer contact information: Your email

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)
5. Copy the Client ID and Client Secret

### Step 4: Update Environment Variables
Replace the placeholder values in your `.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
```

## 🗄️ Supabase Configuration

### Step 1: Enable Google OAuth in Supabase
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Add your Google Client ID and Client Secret
5. Set redirect URL: `https://yourproject.supabase.co/auth/v1/callback`

### Step 2: Configure RLS (Row Level Security)
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS on user_progress table
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);
```

### Step 3: Set up Database Tables
```sql
-- Create user_progress table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0,
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);
```

## 🎯 Features Implemented

### ✅ Google Sign-In
- OAuth 2.0 with PKCE flow
- Secure token handling
- User session management

### ✅ Striver's SDE Sheet Integration
- Real YouTube video links from Striver's channel
- Topic-specific video recommendations
- Direct access to Striver's explanations

### ✅ Fixed Links
- All YouTube links now point to real videos
- LeetCode practice links are functional
- Blog links point to TakeUForward resources

### ✅ Supabase Integration
- User authentication
- Progress tracking
- Real-time data sync
- Secure data access

## 🔧 Troubleshooting

### Google OAuth Issues
- **"redirect_uri_mismatch"**: Check redirect URIs in Google Cloud Console
- **"invalid_client"**: Verify Client ID and Secret
- **"access_denied"**: Check OAuth consent screen configuration

### Supabase Issues
- **"JWT expired"**: Check token refresh configuration
- **"RLS policy violation"**: Verify RLS policies are correctly set
- **"Provider not enabled"**: Enable Google provider in Supabase dashboard

### Development Issues
- **Environment variables not loading**: Restart dev server after adding `.env.local`
- **CORS errors**: Check Supabase CORS settings
- **Build errors**: Ensure all dependencies are installed

## 📱 Production Deployment

### Environment Variables
```env
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_APP_URL=https://yourdomain.com
```

### Build and Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🎉 What's Working Now

1. **Google Sign-In**: Users can authenticate with Google accounts
2. **Striver Videos**: Each topic has direct links to Striver's explanations
3. **Fixed Links**: All resource links are functional and point to real content
4. **Supabase Sync**: User progress is saved and synced across sessions
5. **Responsive UI**: Modern, mobile-friendly interface
6. **Progress Tracking**: Visual progress indicators and completion status

## 🚀 Next Steps

1. **Customize Topics**: Add more DSA topics to the `dsaTopics.ts` file
2. **Add More Providers**: Integrate with other OAuth providers (GitHub, Microsoft)
3. **Enhanced Analytics**: Track user learning patterns and time spent
4. **Social Features**: Add leaderboards and study groups
5. **Mobile App**: Consider building a React Native version

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure Supabase and Google Cloud configurations match
4. Check browser console for error messages

Happy coding! 🎯
