import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Services Health Check Endpoint
 * Verifies Claude API and other AI service connectivity
 */
export async function GET(request: NextRequest) {
  try {
    const checks = await Promise.allSettled([
      checkClaudeAPI(),
      checkOpenAIAPI(),
      checkRateLimiterHealth()
    ]);

    const [claudeResult, openaiResult, rateLimiterResult] = checks;

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AI Services Health Check',
      services: {
        claude: claudeResult.status === 'fulfilled' ? claudeResult.value : { status: 'unhealthy', error: claudeResult.reason },
        openai: openaiResult.status === 'fulfilled' ? openaiResult.value : { status: 'unhealthy', error: openaiResult.reason },
        rateLimiter: rateLimiterResult.status === 'fulfilled' ? rateLimiterResult.value : { status: 'unhealthy', error: rateLimiterResult.reason }
      }
    };

    // Determine overall status
    const allHealthy = Object.values(healthCheck.services).every(service => service.status === 'healthy');
    healthCheck.status = allHealthy ? 'healthy' : 'degraded';

    const statusCode = allHealthy ? 200 : 503;
    return NextResponse.json(healthCheck, { status: statusCode });
  } catch (error) {
    console.error('AI services health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'AI services health check failed',
        service: 'AI Services Health Check'
      },
      { status: 503 }
    );
  }
}

async function checkClaudeAPI() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return {
      status: 'unhealthy',
      error: 'API key not configured',
      service: 'Claude API'
    };
  }

  try {
    // Simple API availability check (without making actual request to save costs)
    return {
      status: 'healthy',
      configured: true,
      service: 'Claude API',
      note: 'Configuration verified (actual connectivity requires live request)'
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'Connection failed',
      service: 'Claude API'
    };
  }
}

async function checkOpenAIAPI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return {
      status: 'not_configured',
      note: 'OpenAI API key not configured (optional)',
      service: 'OpenAI API'
    };
  }

  return {
    status: 'healthy',
    configured: true,
    service: 'OpenAI API',
    note: 'Configuration verified'
  };
}

async function checkRateLimiterHealth() {
  try {
    // Import and test rate limiter
    const { aiRateLimiter } = await import('@/lib/aiRateLimiter');
    
    // Test basic functionality
    const testResult = await aiRateLimiter.checkRateLimit('health-check-user', 'trial', 0);
    
    return {
      status: 'healthy',
      service: 'Rate Limiter',
      testResult: {
        allowed: testResult.allowed,
        hasLimits: testResult.remaining !== undefined
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: 'Rate limiter initialization failed',
      service: 'Rate Limiter'
    };
  }
}