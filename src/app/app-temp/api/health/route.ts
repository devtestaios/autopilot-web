import { NextRequest, NextResponse } from 'next/server';

/**
 * Basic Health Check Endpoint
 * Used by load balancers and monitoring systems
 */
export async function GET(request: NextRequest) {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'PulseBridge.ai API',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      checks: {
        api: 'healthy',
        memory: getMemoryUsage(),
        disk: 'healthy' // TODO: Implement disk space check
      }
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        service: 'PulseBridge.ai API'
      },
      { status: 503 }
    );
  }
}

function getMemoryUsage() {
  const usage = process.memoryUsage();
  const formatBytes = (bytes: number) => Math.round(bytes / 1024 / 1024);
  
  return {
    rss: `${formatBytes(usage.rss)}MB`,
    heapTotal: `${formatBytes(usage.heapTotal)}MB`,
    heapUsed: `${formatBytes(usage.heapUsed)}MB`,
    external: `${formatBytes(usage.external)}MB`,
    status: usage.heapUsed / usage.heapTotal < 0.9 ? 'healthy' : 'warning'
  };
}