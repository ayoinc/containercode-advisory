// Simple container worker for testing
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Simple routing without container binding
      const response = {
        message: 'Simple Container Worker Active',
        path: url.pathname,
        timestamp: new Date().toISOString(),
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        environment: {
          NODE_ENV: env.NODE_ENV,
          CONTAINER_MODE: env.CONTAINER_MODE,
          ANALYTICS_ENABLED: env.ANALYTICS_ENABLED,
        },
        bindings: {
          CACHE: env.CACHE ? 'available' : 'not available',
          ANALYTICS_DB: env.ANALYTICS_DB ? 'available' : 'not available',
          ANALYTICS: env.ANALYTICS ? 'available' : 'not available',
          CONTAINER_CODE_APP: env.CONTAINER_CODE_APP ? 'available' : 'not available',
        }
      };
      
      return new Response(JSON.stringify(response, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'X-Worker-Type': 'simple-container',
        }
      });
      
    } catch (error) {
      console.error('Simple container error:', error);
      
      return new Response(JSON.stringify({
        error: 'Simple Container Error',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        path: url.pathname,
        method: request.method,
      }, null, 2), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Error-Source': 'simple-container'
        }
      });
    }
  }
};