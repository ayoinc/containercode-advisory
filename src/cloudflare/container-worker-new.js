import { Container, getContainer } from "@cloudflare/containers";

// Define the Container class
export class ContainerCodeApp extends Container {
  defaultPort = 8080; // Port the container is listening on
  sleepAfter = "10m"; // Stop the instance if requests not sent for 10 minutes
  
  // Optional: Custom container configuration
  constructor(state, env) {
    super(state, env);
    this.analytics = {
      requestCount: 0,
      startTime: Date.now(),
    };
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Parse request for session or container routing
      let sessionId = 'default';
      let routingMode = 'default';
      
      // Check for session ID in headers or query params
      if (request.headers.get('X-Session-ID')) {
        sessionId = request.headers.get('X-Session-ID');
      } else if (url.searchParams.get('session')) {
        sessionId = url.searchParams.get('session');
      }
      
      // Determine routing mode from path
      if (url.pathname.startsWith('/container/')) {
        sessionId = url.pathname.split('/')[2] || 'default';
        routingMode = 'named';
      } else if (url.pathname.startsWith('/lb')) {
        sessionId = `lb-${Math.floor(Math.random() * 3)}`;
        routingMode = 'load-balanced';
      } else if (url.pathname.startsWith('/singleton')) {
        sessionId = 'singleton';
        routingMode = 'singleton';
      } else if (url.pathname.startsWith('/health') || url.pathname.startsWith('/api/')) {
        sessionId = 'api';
        routingMode = 'api';
      }
      
      // Get the container instance for the given session ID
      const containerInstance = getContainer(env.CONTAINER_CODE_APP, sessionId);
      
      // Add routing metadata to request headers
      const modifiedRequest = new Request(request, {
        headers: {
          ...request.headers,
          'X-Container-Session': sessionId,
          'X-Routing-Mode': routingMode,
          'X-Original-Path': url.pathname,
          'X-Worker-Timestamp': Date.now().toString(),
        }
      });
      
      // Pass the request to the container instance on its default port
      return await containerInstance.fetch(modifiedRequest);
      
    } catch (error) {
      console.error('Container routing error:', error);
      
      // Fallback response with error details
      return new Response(JSON.stringify({
        error: 'Container Service Error',
        message: error.message,
        timestamp: new Date().toISOString(),
        path: url.pathname,
        method: request.method,
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Error-Source': 'container-worker'
        }
      });
    }
  }
};