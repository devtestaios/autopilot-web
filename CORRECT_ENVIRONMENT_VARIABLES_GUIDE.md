# 🔧 Correct Environment Variables Configuration

## Current Issue
The backend code expects specific environment variable names, but different names were set in Render.

## Backend Code Expectations (main.py lines 22-24)
```python
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY') or os.getenv('SUPABASE_ANON_KEY')
```

## ✅ CORRECT Environment Variables for Render

### Backend (Render Dashboard)
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_service_role_key_here
```

### Frontend (Vercel Dashboard) 
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
```

## ❌ What Was Set (Incorrect)
- `supabase_anon_key` ❌ (should be `SUPABASE_KEY`)
- `supabase_service_role_key` ❌ (not used by code)

## 🎯 Action Required

### In Render Dashboard:
1. Delete: `supabase_anon_key`
2. Delete: `supabase_service_role_key` 
3. Add: `SUPABASE_URL` = https://your-project-ref.supabase.co
4. Add: `SUPABASE_KEY` = your_service_role_secret_key

### In Vercel Dashboard:
Environment variables should already be correct from previous setup.

## 🔍 Key Differences
- Variable names must be UPPERCASE and match code exactly
- Backend uses `SUPABASE_KEY` (not `SUPABASE_ANON_KEY` or custom names)
- Frontend uses `NEXT_PUBLIC_` prefix for client-side access
- Service role key goes to `SUPABASE_KEY` for backend full access
- Anon public key goes to `NEXT_PUBLIC_SUPABASE_ANON_KEY` for frontend

## ⚡ Next Steps
1. Update Render environment variables to match code expectations
2. Restart Render service
3. Test health endpoint: `curl https://autopilot-api-1.onrender.com/health`
4. Verify database connection successful