import { Container } from "@cloudflare/containers";

// Keep the old class export for migration compatibility
export class ContainerCodeApp {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    return new Response(JSON.stringify({
      message: 'Old container class deprecated',
      timestamp: new Date().toISOString(),
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Define the Container class with SQLite storage
export class ContainerCodeAppSQLite extends Container {
  defaultPort = 8080; // Port the container is listening on
  sleepAfter = "10m"; // Stop the instance if requests not sent for 10 minutes
  
  // Optional: Custom container configuration
  constructor(state, env) {
    super(state, env);
    this.sql = state.storage.sql;
    this.analytics = {
      requestCount: 0,
      startTime: Date.now(),
    };
    
    // Initialize SQLite tables if needed
    this.initializeSQLite();
  }
  
  async initializeSQLite() {
    if (this.sql) {
      await this.sql.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          requests INTEGER DEFAULT 0,
          start_time INTEGER
        )
      `);
    }
  }
  
  async fetch(request) {
    const url = new URL(request.url);
    
    try {
      // Extract routing information from headers
      const sessionId = request.headers.get('X-Container-Session') || 'default';
      const routingMode = request.headers.get('X-Routing-Mode') || 'default';
      const originalPath = request.headers.get('X-Original-Path') || url.pathname;
      
      // Increment request count
      this.analytics.requestCount++;
      
      // Handle different endpoints
      if (originalPath.startsWith('/health')) {
        return new Response(JSON.stringify({
          status: 'healthy',
          containerId: sessionId,
          routingMode: routingMode,
          timestamp: new Date().toISOString(),
          uptime: Date.now() - this.analytics.startTime,
          requests: this.analytics.requestCount,
          memory: process.memoryUsage ? process.memoryUsage() : null,
          port: this.defaultPort,
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Container-Session': sessionId,
            'X-Routing-Mode': routingMode,
          }
        });
      }
      
      if (originalPath.startsWith('/api/analytics')) {
        return new Response(JSON.stringify({
          analytics: this.analytics,
          containerId: sessionId,
          routingMode: routingMode,
          timestamp: new Date().toISOString(),
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Container-Session': sessionId,
            'X-Routing-Mode': routingMode,
          }
        });
      }
      
      // Default response for all other paths
      return new Response(JSON.stringify({
        message: 'Container Service Active',
        containerId: sessionId,
        routingMode: routingMode,
        path: originalPath,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.analytics.startTime,
        requests: this.analytics.requestCount,
        port: this.defaultPort,
      }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Container-Session': sessionId,
          'X-Routing-Mode': routingMode,
        }
      });
      
    } catch (error) {
      console.error('Container processing error:', error);
      
      return new Response(JSON.stringify({
        error: 'Container Processing Error',
        message: error.message,
        timestamp: new Date().toISOString(),
        containerId: sessionId,
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Error-Source': 'container-instance'
        }
      });
    }
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
      
      // Get the container instance from the binding
      const containerBinding = env.CONTAINER_CODE_APP_SQLITE;
      if (!containerBinding) {
        throw new Error('Container binding not found');
      }
      
      // Create ID for the container instance
      const id = containerBinding.idFromName(sessionId);
      const containerInstance = containerBinding.get(id);
      
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
      
      // Pass the request to the container instance
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
        binding: env.CONTAINER_CODE_APP_SQLITE ? 'found' : 'not found',
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