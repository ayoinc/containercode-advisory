import { CloudflareWorkerAnalytics } from '../lib/cloudflare/worker-analytics';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Analytics tracking
    const startTime = Date.now();
    
    try {
      // Check if this is a container request
      if (url.pathname.startsWith('/api/container/')) {
        return await handleContainerAPI(request, env, ctx);
      }
      
      // Check if container is needed for this request
      const shouldUseContainer = await shouldRouteToContainer(request, env);
      
      if (shouldUseContainer) {
        // Route to container instance
        const containerResponse = await routeToContainer(request, env, ctx);
        
        // Track container performance
        await CloudflareWorkerAnalytics.trackEvent({
          category: 'container',
          action: 'request',
          label: url.pathname,
          value: Date.now() - startTime,
          properties: {
            method: request.method,
            userAgent: request.headers.get('User-Agent'),
            containerUsed: true,
          }
        }, env);
        
        return containerResponse;
      }
      
      // Handle with regular worker
      return await handleWorkerRequest(request, env, ctx);
      
    } catch (error) {
      // Track errors
      await CloudflareWorkerAnalytics.trackEvent({
        category: 'error',
        action: 'container_error',
        label: error.message,
        value: 1,
        properties: {
          pathname: url.pathname,
          stack: error.stack,
        }
      }, env);
      
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};

async function shouldRouteToContainer(request, env) {
  const url = new URL(request.url);
  
  // Route to container for complex operations
  const containerRoutes = [
    '/api/newsletter',
    '/api/generate-content',
    '/api/image-processing',
    '/api/analytics/process',
  ];
  
  return containerRoutes.some(route => url.pathname.startsWith(route));
}

async function routeToContainer(request, env, ctx) {
  // Get or create container instance
  const containerStub = env.CONTAINER_APP;
  
  // Forward request to container
  const response = await containerStub.fetch(request);
  
  // Add container headers
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set('X-Container-Used', 'true');
  modifiedResponse.headers.set('X-Container-ID', containerStub.id);
  
  return modifiedResponse;
}

async function handleContainerAPI(request, env, ctx) {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/container/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      containers: {
        active: await getActiveContainers(env),
        total: await getTotalContainers(env),
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.pathname === '/api/container/analytics') {
    const analytics = await CloudflareWorkerAnalytics.getAnalytics(env);
    return new Response(JSON.stringify(analytics), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Not Found', { status: 404 });
}

async function handleWorkerRequest(request, env, ctx) {
  const url = new URL(request.url);
  
  // Basic request handling for non-container routes
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      worker: 'active',
      timestamp: new Date().toISOString(),
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Serve static files or proxy to origin
  return await fetch(request);
}

async function getActiveContainers(env) {
  try {
    // This would be implemented based on Cloudflare's container API
    // For now, return mock data
    return 1;
  } catch (error) {
    return 0;
  }
}

async function getTotalContainers(env) {
  try {
    // This would be implemented based on Cloudflare's container API
    // For now, return mock data
    return 1;
  } catch (error) {
    return 0;
  }
}