# Test Invite User API

## Test Locally First

1. Make sure dev server is running: `npm run dev`
2. Go to http://localhost:3001/adminlogin
3. Login with: admin@pulsebridge.ai / PulseBridge2025!
4. Click "Invite User" button
5. Fill in the form and click "Send Invitation"

## If Still Getting 405 Error

The issue is that pulsebridge.ai hasn't deployed the latest changes yet.

### Option 1: Trigger Manual Deploy on Vercel
1. Go to https://vercel.com/dashboard
2. Find your project (autopilot-web or pulsebridge)
3. Click "Deployments" tab
4. Click "Redeploy" on the latest deployment

### Option 2: Force Push to Trigger Deploy
```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push
```

### Option 3: Check Vercel Deployment Status
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Check deployment status
vercel ls
```

## Debugging

If the API still doesn't work after deployment:

1. Check Vercel deployment logs
2. Verify the route file exists: `src/app/api/admin/invite-user/route.ts`
3. Check for build errors in Vercel dashboard
4. Ensure environment variables are set in Vercel (NEXT_PUBLIC_SUPABASE_URL, etc.)
