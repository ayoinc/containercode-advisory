export class ContainerCodeApp {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    
    try {
      // Handle different container routes
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          container: 'active',
          durableObject: this.state.id.toString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/container/info') {
        return new Response(JSON.stringify({
          id: this.state.id.toString(),
          timestamp: new Date().toISOString(),
          requests: await this.getRequestCount(),
          memory: process.memoryUsage(),
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname.startsWith('/api/')) {
        return await this.handleApiRequest(request);
      }

      // Default response
      return new Response(`Hello from Container ${this.state.id.toString()}! Path: ${url.pathname}`, {
        headers: { 'Content-Type': 'text/plain' }
      });

    } catch (error) {
      return new Response(`Container Error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  async handleApiRequest(request) {
    const url = new URL(request.url);
    
    // Track request count
    await this.incrementRequestCount();
    
    if (url.pathname === '/api/analytics') {
      return new Response(JSON.stringify({
        container_id: this.state.id.toString(),
        requests: await this.getRequestCount(),
        timestamp: new Date().toISOString(),
        method: request.method,
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('API endpoint not found', { status: 404 });
  }

  async getRequestCount() {
    const count = await this.state.storage.get('requestCount') || 0;
    return count;
  }

  async incrementRequestCount() {
    const count = await this.getRequestCount();
    await this.state.storage.put('requestCount', count + 1);
    return count + 1;
  }
}