# Render Service Configuration Checklist

## Issue: Backend returns "Supabase not configured" despite env vars being set

### Check These Settings in Your Render Dashboard:

1. **Service Repository**
   - Go to render.com → Your autopilot service
   - Check "Repository" section
   - Should be: `devtestaios/autopilot-web` (or your GitHub username)
   - Branch: `main`

2. **Root Directory**
   - Check "Root Directory" setting
   - Should be: `backend` (not empty, not `/backend`)
   - This tells Render to deploy from the `/backend` folder

3. **Build Command**
   - Should be: `pip install -r requirements.txt`

4. **Start Command**
   - Should be: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables**
   - Go to "Environment" tab in Render
   - Verify these are set:
     - `SUPABASE_URL` = your_supabase_url
     - `SUPABASE_ANON_KEY` = your_supabase_anon_key

### If Repository/Branch is Wrong:
1. Go to render.com → Your service → Settings
2. Under "Repository", click "Disconnect"
3. Reconnect to the correct repository
4. Set root directory to `backend`
5. Redeploy

### If Environment Variables are Missing:
1. Go to render.com → Your service → Environment
2. Add the missing variables
3. Click "Save Changes" (this will trigger a redeploy)

### Current Backend Location:
The backend code should be in:
```
autopilot-web/backend/main.py
```

NOT in:
```
autopilot-api/
```

### Debug Next Steps:
1. Verify Render configuration matches the checklist above
2. If incorrect, fix the settings and wait for redeploy (3-5 minutes)
3. Test the debug endpoint: `curl https://autopilot-api-1.onrender.com/debug/supabase`