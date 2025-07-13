import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: HealthCheck;
    external_apis: HealthCheck;
    memory: HealthCheck;
    disk: HealthCheck;
  };
  metadata: {
    environment: string;
    deployment: string;
    region: string;
  };
}

interface HealthCheck {
  status: 'pass' | 'fail' | 'warn';
  responseTime?: number;
  message?: string;
  lastChecked: string;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Run health checks
    const checks = await runHealthChecks();
    
    // Determine overall status
    const overallStatus = determineOverallStatus(checks);
    
    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks,
      metadata: {
        environment: process.env.NODE_ENV || 'development',
        deployment: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'local',
        region: process.env.VERCEL_REGION || 'local'
      }
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: { status: 'fail', message: 'Health check failed', lastChecked: new Date().toISOString() },
        external_apis: { status: 'fail', message: 'Health check failed', lastChecked: new Date().toISOString() },
        memory: { status: 'fail', message: 'Health check failed', lastChecked: new Date().toISOString() },
        disk: { status: 'fail', message: 'Health check failed', lastChecked: new Date().toISOString() }
      },
      metadata: {
        environment: process.env.NODE_ENV || 'development',
        deployment: 'unknown',
        region: 'unknown'
      }
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

async function runHealthChecks() {
  const now = new Date().toISOString();
  
  // Database check (Notion API)
  const databaseCheck = await checkNotionAPI();
  
  // External APIs check
  const externalAPIsCheck = await checkExternalAPIs();
  
  // Memory check
  const memoryCheck = checkMemoryUsage();
  
  // Disk check (basic)
  const diskCheck = checkDiskSpace();

  return {
    database: { ...databaseCheck, lastChecked: now },
    external_apis: { ...externalAPIsCheck, lastChecked: now },
    memory: { ...memoryCheck, lastChecked: now },
    disk: { ...diskCheck, lastChecked: now }
  };
}

async function checkNotionAPI(): Promise<Omit<HealthCheck, 'lastChecked'>> {
  try {
    const startTime = Date.now();
    
    // Simple check to Notion API
    const response = await fetch('https://api.notion.com/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      },
      signal: AbortSignal.timeout(5000)
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        status: responseTime > 2000 ? 'warn' : 'pass',
        responseTime,
        message: `Notion API accessible (${responseTime}ms)`
      };
    } else {
      return {
        status: 'fail',
        responseTime,
        message: `Notion API error: ${response.status}`
      };
    }
  } catch (error) {
    return {
      status: 'fail',
      message: `Notion API unreachable: ${error}`
    };
  }
}

async function checkExternalAPIs(): Promise<Omit<HealthCheck, 'lastChecked'>> {
  try {
    const checks = await Promise.allSettled([
      // Resend API check
      fetch('https://api.resend.com/emails', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        signal: AbortSignal.timeout(3000)
      }),
      
      // DeepSeek API check (if configured)
      process.env.DEEPSEEK_API_KEY ? fetch('https://api.deepseek.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        signal: AbortSignal.timeout(3000)
      }) : Promise.resolve({ ok: true, status: 200 } as Response)
    ]);

    const failedChecks = checks.filter(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && !result.value.ok)
    );

    if (failedChecks.length === 0) {
      return {
        status: 'pass',
        message: 'All external APIs accessible'
      };
    } else if (failedChecks.length < checks.length) {
      return {
        status: 'warn',
        message: `${failedChecks.length}/${checks.length} external APIs failed`
      };
    } else {
      return {
        status: 'fail',
        message: 'All external APIs failed'
      };
    }
  } catch (error) {
    return {
      status: 'fail',
      message: `External API check failed: ${error}`
    };
  }
}

function checkMemoryUsage(): Omit<HealthCheck, 'lastChecked'> {
  try {
    const memoryUsage = process.memoryUsage();
    const usedMemoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMemoryMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const memoryPercentage = (usedMemoryMB / totalMemoryMB) * 100;

    if (memoryPercentage > 90) {
      return {
        status: 'fail',
        message: `High memory usage: ${usedMemoryMB}MB (${memoryPercentage.toFixed(1)}%)`
      };
    } else if (memoryPercentage > 75) {
      return {
        status: 'warn',
        message: `Elevated memory usage: ${usedMemoryMB}MB (${memoryPercentage.toFixed(1)}%)`
      };
    } else {
      return {
        status: 'pass',
        message: `Memory usage normal: ${usedMemoryMB}MB (${memoryPercentage.toFixed(1)}%)`
      };
    }
  } catch (error) {
    return {
      status: 'fail',
      message: `Memory check failed: ${error}`
    };
  }
}

function checkDiskSpace(): Omit<HealthCheck, 'lastChecked'> {
  // In serverless environments, disk space is usually not a concern
  // This is a placeholder for environments where it matters
  return {
    status: 'pass',
    message: 'Disk space check not applicable in serverless environment'
  };
}

function determineOverallStatus(checks: HealthStatus['checks']): HealthStatus['status'] {
  const checkResults = Object.values(checks);
  
  if (checkResults.some(check => check.status === 'fail')) {
    return 'unhealthy';
  } else if (checkResults.some(check => check.status === 'warn')) {
    return 'degraded';
  } else {
    return 'healthy';
  }
}