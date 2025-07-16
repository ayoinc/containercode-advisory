import { ContainerCodeApp } from './container-class';
import { getRandom } from "@cloudflare/containers";

// Export the Container class for Durable Objects
export { ContainerCodeApp };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Check if this is a container-specific route
      const isContainerRoute = url.pathname.startsWith('/container/') || 
                              url.pathname.startsWith('/lb') || 
                              url.pathname.startsWith('/singleton') ||
                              url.pathname.startsWith('/health') ||
                              url.pathname.startsWith('/api/analytics');

      if (isContainerRoute) {
        // Route to container based on path
        if (url.pathname.startsWith('/container/')) {
          // Route to specific container instance by ID
          const containerId = url.pathname.split('/')[2] || 'default';
          const id = env.CONTAINER_CODE_APP.idFromName(containerId);
          const containerInstance = env.CONTAINER_CODE_APP.get(id);
          return await containerInstance.fetch(request);
        }
        
        if (url.pathname.startsWith('/lb')) {
          // Load balance across 3 container instances
          const containerInstance = await getRandom(env.CONTAINER_CODE_APP, 3);
          return await containerInstance.fetch(request);
        }
        
        if (url.pathname.startsWith('/singleton')) {
          // Route all requests to the same container instance
          const id = env.CONTAINER_CODE_APP.idFromName('singleton');
          const containerInstance = env.CONTAINER_CODE_APP.get(id);
          return await containerInstance.fetch(request);
        }

        // Direct health and API routes to default container
        const id = env.CONTAINER_CODE_APP.idFromName('default');
        const containerInstance = env.CONTAINER_CODE_APP.get(id);
        return await containerInstance.fetch(request);
      }

      // For all other routes, serve the Next.js app using module worker
      // This imports the main Next.js application
      const { default: app } = await import('../app/layout.js');
      
      // If we can't import the Next.js app, fall back to container
      const id = env.CONTAINER_CODE_APP.idFromName('default');
      const containerInstance = env.CONTAINER_CODE_APP.get(id);
      return await containerInstance.fetch(request);
      
    } catch (error) {
      console.error('Container routing error:', error);
      
      // Fallback error response
      return new Response(`Container Service: ${error.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};