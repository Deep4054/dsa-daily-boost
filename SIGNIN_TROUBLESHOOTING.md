# Sign-In Troubleshooting Guide

## Common Sign-In Issues and Solutions

### 1. **Port Mismatch Issue**
**Problem**: App URL doesn't match the actual development server port
**Solution**: ✅ Fixed - Updated `.env.local` to use `http://localhost:5173`

### 2. **Google OAuth Configuration**
**Problem**: Google OAuth redirect URI not properly configured
**Solutions**:
- Ensure your Google Cloud Console OAuth 2.0 client has these redirect URIs:
  - `http://localhost:5173` (for development)
  - `https://lsgjhhkbroecvlmiolnc.supabase.co/auth/v1/callback` (for Supabase)

### 3. **Supabase Configuration**
**Problem**: Supabase auth provider not properly configured
**Solutions**:
1. Go to your Supabase dashboard: https://lsgjhhkbroecvlmiolnc.supabase.co
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google Client ID: `251902222844-m0108n3eh8q1d7cgsc9dmga59dus1re7.apps.googleusercontent.com`
5. Set redirect URL: `https://lsgjhhkbroecvlmiolnc.supabase.co/auth/v1/callback`

### 4. **Browser Issues**
**Problems**: Cookies, localStorage, or popup blockers
**Solutions**:
- Clear browser cache and cookies
- Disable popup blockers for localhost
- Try incognito/private browsing mode
- Check browser console for errors

### 5. **Network Issues**
**Problems**: Firewall or network restrictions
**Solutions**:
- Check if you can access https://lsgjhhkbroecvlmiolnc.supabase.co directly
- Temporarily disable firewall/antivirus
- Try different network connection

## Step-by-Step Debugging

### Step 1: Check Environment Variables
```bash
# In your terminal, run:
npm run dev
```
- Verify the app starts on `http://localhost:5173`
- Check browser console for any environment variable errors

### Step 2: Test Supabase Connection
1. Open browser console (F12)
2. Click "Sign in with Google"
3. Look for these console messages:
   - "Starting Google OAuth..."
   - "OAuth response: ..." 
4. If you see errors, note the exact error message

### Step 3: Verify Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services > Credentials
4. Find your OAuth 2.0 Client ID
5. Verify these redirect URIs are added:
   - `http://localhost:5173`
   - `https://lsgjhhkbroecvlmiolnc.supabase.co/auth/v1/callback`

### Step 4: Check Supabase Auth Settings
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Authentication > Settings
4. Verify Site URL is set to: `http://localhost:5173`
5. Go to Authentication > Providers
6. Ensure Google is enabled with correct Client ID

## Common Error Messages and Solutions

### "Invalid redirect URI"
- **Cause**: Redirect URI in Google Console doesn't match
- **Fix**: Add exact URLs to Google Console OAuth settings

### "Provider not enabled"
- **Cause**: Google provider not enabled in Supabase
- **Fix**: Enable Google provider in Supabase dashboard

### "Network error" or "Failed to fetch"
- **Cause**: Network connectivity or CORS issues
- **Fix**: Check internet connection, try different browser

### "Popup blocked"
- **Cause**: Browser blocking OAuth popup
- **Fix**: Allow popups for localhost, try different browser

## Quick Test Commands

```bash
# 1. Start the development server
npm run dev

# 2. Open browser to http://localhost:5173
# 3. Open browser console (F12)
# 4. Click "Sign in with Google"
# 5. Check console for error messages
```

## If Still Not Working

1. **Share the exact error message** from browser console
2. **Verify your Google Cloud Console setup** matches the guide
3. **Check Supabase dashboard** for any configuration issues
4. **Try a different browser** or incognito mode
5. **Check if the Supabase project is active** and not paused

## Contact Information
If you continue having issues, please share:
- Exact error message from browser console
- Screenshots of Google Cloud Console OAuth settings
- Screenshots of Supabase Auth provider settings