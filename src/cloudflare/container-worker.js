import { ContainerCodeApp } from './container-class';
import { getRandom } from "@cloudflare/containers";

// Export the Container class for Durable Objects
export { ContainerCodeApp };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
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
      
      // Default route to container
      const id = env.CONTAINER_CODE_APP.idFromName('default');
      const containerInstance = env.CONTAINER_CODE_APP.get(id);
      return await containerInstance.fetch(request);
      
    } catch (error) {
      return new Response(`Error: ${error.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};