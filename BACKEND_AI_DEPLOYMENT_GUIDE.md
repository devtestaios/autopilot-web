# 🚀 BACKEND AI DEPLOYMENT GUIDE

**Deploy AI Services to FastAPI Backend**  
**Target**: https://autopilot-api.onrender.com  
**Date**: September 20, 2025  

---

## 📋 **DEPLOYMENT STEPS**

### **Step 1: Add AI Dependencies**
Add to your FastAPI `requirements.txt`:

```bash
# AI Dependencies
anthropic>=0.3.0
openai>=1.0.0
aiohttp>=3.8.0
pydantic>=2.0.0
python-multipart>=0.0.6
```

### **Step 2: Copy AI Service Files**
Copy these files to your FastAPI backend:

1. **`ai_chat_service.py`** - Core AI service with Claude/OpenAI integration
2. **`ai_endpoints.py`** - FastAPI routes for AI functionality

### **Step 3: Update Your Main FastAPI File**
Add this to your main FastAPI application (usually `main.py` or `app.py`):

```python
# Import AI router
from ai_endpoints import ai_router

# Add AI routes to your FastAPI app
app.include_router(ai_router)
```

### **Step 4: Environment Variables on Render**
Set these environment variables in your Render dashboard:

```bash
# Required for AI functionality
ANTHROPIC_API_KEY=your_claude_api_key_here
AI_PROVIDER=claude

# Optional backup
OPENAI_API_KEY=your_openai_api_key_here
```

### **Step 5: Test Deployment**
After deployment, test these endpoints:

```bash
# Test AI chat
POST https://autopilot-api.onrender.com/ai/chat
{
  "message": "Hello, can you help me create a campaign?",
  "page": "dashboard"
}

# Test AI action execution  
POST https://autopilot-api.onrender.com/ai/execute-action
{
  "type": "create_campaign",
  "parameters": {"name": "Test Campaign"}
}
```

---

## 🔧 **AI SERVICE FEATURES**

### **Claude API Integration**
- ✅ Real-time conversational AI
- ✅ Context-aware responses
- ✅ Platform-specific prompts
- ✅ Function calling for actions

### **Platform Control**
- ✅ Campaign management commands
- ✅ Navigation and UI control
- ✅ Performance analysis
- ✅ Budget optimization

### **Safety Features**
- ✅ Fallback to mock responses
- ✅ Error handling and recovery
- ✅ Rate limiting protection
- ✅ Input validation

---

## 📊 **API ENDPOINTS ADDED**

### **1. `/ai/chat` (POST)**
**Purpose**: Main AI conversation endpoint
**Input**: User message, context, conversation history
**Output**: AI response with actions and suggestions

### **2. `/ai/execute-action` (POST)**
**Purpose**: Execute AI-requested platform actions
**Input**: Action type and parameters
**Output**: Action result and status

### **3. `/ai/status` (GET)**
**Purpose**: Check AI service health and configuration
**Output**: Provider status, capabilities, health check

---

## 🎯 **FRONTEND INTEGRATION**

Your frontend AI components will connect to these endpoints:

```typescript
// AI Chat Integration (already implemented in frontend)
const response = await fetch(`${API_BASE}/ai/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    page: currentPage,
    context: platformContext
  })
});
```

---

## ✅ **DEPLOYMENT CHECKLIST**

- [ ] Copy `ai_chat_service.py` to backend
- [ ] Copy `ai_endpoints.py` to backend  
- [ ] Add AI dependencies to `requirements.txt`
- [ ] Update main FastAPI app with AI router
- [ ] Set `ANTHROPIC_API_KEY` in Render environment
- [ ] Set `AI_PROVIDER=claude` in Render environment
- [ ] Deploy to Render
- [ ] Test `/ai/chat` endpoint
- [ ] Test `/ai/execute-action` endpoint
- [ ] Verify frontend AI chat works with real API

---

## 🚀 **POST-DEPLOYMENT TESTING**

### **Test AI Chat**
```bash
curl -X POST https://autopilot-api.onrender.com/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Create a new Google Ads campaign for holiday shopping",
    "page": "campaigns"
  }'
```

### **Expected Response**
```json
{
  "response": "I'll help you create a holiday shopping campaign...",
  "actions": [
    {
      "type": "create_campaign",
      "parameters": {
        "name": "Holiday Shopping Campaign",
        "platform": "google_ads",
        "budget": 1000
      }
    }
  ],
  "suggestions": [
    "Consider seasonal keywords",
    "Set up conversion tracking"
  ]
}
```

---

## 🎉 **SUCCESS CRITERIA**

When deployment is successful:
- ✅ AI chat responds with real Claude AI
- ✅ Platform control commands work
- ✅ Frontend AI widgets connect to live API
- ✅ Natural language processing functional
- ✅ Action execution working

**After deployment, PulseBridge.ai will have full AI functionality with real Claude API integration!** 🤖✨