# Render AI Backend Deployment Guide

## Overview
This guide will help you deploy the complete AI-integrated backend to Render, enabling real Claude AI functionality in the PulseBridge.ai platform.

## Current Status
- ✅ Frontend AI integration complete (2,795+ lines of AI code)
- ✅ Backend AI files prepared locally
- 🔄 Backend deployment needed on Render
- ❌ AI endpoints currently not responding (need deployment)

## Files That Need to Be Deployed

### 1. Required Backend Files
Copy these files from your local `backend/` directory to Render:

```
backend/
├── main.py                 # Updated FastAPI app with AI integration
├── ai_endpoints.py         # AI router with chat/action endpoints  
├── ai_chat_service.py      # Claude API service
├── requirements.txt        # Updated dependencies including 'anthropic'
└── test_ai_integration.py  # Testing script (optional)
```

### 2. Key File Contents Summary

**main.py**:
- Includes AI router at `/api/v1` prefix
- Health checks with AI status
- CORS configured for Vercel frontend
- Comprehensive logging

**ai_endpoints.py**:
- `/ai/chat` - Claude AI chat endpoint
- `/ai/execute-action` - AI platform actions
- `/ai/status` - AI service health check

**ai_chat_service.py**:
- Claude API integration with function calling
- OpenAI fallback support
- Error handling and logging

## Deployment Steps

### Step 1: Environment Variables
Set these environment variables in your Render dashboard:

```bash
# Required for AI functionality
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your_claude_api_key_here

# Optional (backup AI provider)
OPENAI_API_KEY=your_openai_api_key_here

# Existing variables (keep these)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Deploy Backend Files
1. **Access Render Dashboard**: Go to your Render service
2. **Update Repository**: Either:
   - Push files to GitHub and trigger auto-deploy, OR
   - Upload files directly to Render

### Step 3: Verify Deployment
After deployment, these endpoints should be available:

```bash
# Health check
GET https://autopilot-api-1.onrender.com/health

# AI status check  
GET https://autopilot-api-1.onrender.com/api/v1/ai/status

# AI chat endpoint
POST https://autopilot-api-1.onrender.com/api/v1/ai/chat
```

## Testing the Deployment

### 1. Basic Health Check
```bash
curl "https://autopilot-api-1.onrender.com/health"
# Expected: {"status": "healthy", "ai_services": {...}}
```

### 2. AI Service Status
```bash
curl "https://autopilot-api-1.onrender.com/api/v1/ai/status"
# Expected: {"status": "healthy", "provider": "claude", ...}
```

### 3. AI Chat Test
```bash
curl -X POST "https://autopilot-api-1.onrender.com/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, test AI integration"}'
# Expected: {"response": "Hello! I'm Claude...", "success": true}
```

### 4. Use Test Script
Run the provided test script:
```bash
python backend/test_ai_integration.py
```

## Troubleshooting

### Issue: AI endpoints returning 404
- **Solution**: Ensure `ai_endpoints.py` and `ai_chat_service.py` are deployed
- **Check**: Router is included in `main.py` with `/api/v1` prefix

### Issue: AI endpoints hanging/timeout
- **Solution**: Check `ANTHROPIC_API_KEY` environment variable is set
- **Check**: Dependencies installed (especially `anthropic` package)

### Issue: "Service Suspended" message
- **Solution**: Use correct URL: `autopilot-api-1.onrender.com` 
- **Check**: Service is active in Render dashboard

### Issue: Import errors in logs
- **Solution**: Ensure `requirements.txt` includes all AI dependencies
- **Check**: Force rebuild to install new packages

## Expected AI Endpoints

After successful deployment:

1. **Chat Endpoint**: `/api/v1/ai/chat`
   - Real Claude AI conversations
   - Platform control capabilities
   - Natural language processing

2. **Action Endpoint**: `/api/v1/ai/execute-action`
   - Campaign management actions
   - Navigation control
   - System operations

3. **Status Endpoint**: `/api/v1/ai/status`
   - Service health monitoring
   - Configuration verification
   - Provider status

## Frontend Integration

Once backend is deployed, the frontend AI features will automatically connect:
- AI Control Chat component will use real Claude API
- AI Dashboard Control will execute real platform actions
- AI insights will provide genuine analysis

## Next Steps After Deployment

1. ✅ **Test AI Chat**: Verify Claude conversations work
2. ✅ **Test AI Actions**: Confirm platform control functions
3. ✅ **Frontend Integration**: Validate end-to-end AI workflow
4. ✅ **Performance Monitoring**: Check response times and reliability

## Support

If you encounter issues:
1. Check Render build logs for errors
2. Verify environment variables are set
3. Test individual endpoints with curl
4. Review FastAPI logs for detailed error messages

---

**Status**: Ready for deployment to enable full AI functionality in PulseBridge.ai platform.