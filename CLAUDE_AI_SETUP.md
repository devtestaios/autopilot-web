# Claude AI Integration Setup

## Getting Your Anthropic API Key

1. **Sign up at Anthropic:** https://console.anthropic.com/
2. **Get API access:** Create an account and navigate to API Keys
3. **Generate a key:** Create a new API key for your project
4. **Add to environment:** Update your `.env.local` file

## Environment Configuration

Replace `your_anthropic_api_key_here` in `.env.local` with your actual API key:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://autopilot-api.onrender.com

# Anthropic Claude AI Integration  
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

## Features

The AI assistant now provides:

✅ **Real Claude AI responses** for marketing questions  
✅ **Campaign optimization advice** based on actual AI analysis  
✅ **Contextual suggestions** that adapt to conversation flow  
✅ **Fallback system** - if Claude API is unavailable, falls back to simulated responses  
✅ **Conversation memory** - sends recent message history for context  

## Usage

1. Open the dashboard: https://pulsebridge.ai/dashboard
2. Click the blue AI assistant button (bottom-left)
3. Ask marketing questions like:
   - "Analyze my campaign performance"
   - "How can I improve my ROAS?"
   - "Generate ad copy for holiday campaigns"
   - "What targeting strategies work best?"

## API Endpoint

The integration uses a custom Next.js API route at `/api/chat` that:
- Sends requests to Claude-3-Sonnet model
- Includes marketing-specific system prompt
- Handles errors gracefully with fallbacks
- Generates contextual follow-up suggestions

## Cost Considerations

- Claude API charges per token (input + output)
- Typical conversation: ~$0.01-0.05 per exchange
- Monitor usage in Anthropic console
- Consider rate limiting for production use

---

**Status:** ✅ Ready for testing with real API key
**Model:** Claude-3-Sonnet (balanced performance/cost)
**Fallback:** Simulated responses if API unavailable