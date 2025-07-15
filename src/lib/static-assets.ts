/**
 * Static Asset Handler for Cloudflare Workers
 * Handles serving static assets from the STATIC_ASSETS binding
 */

export async function handleStaticAsset(request: Request, env: any): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Check if this is a static asset request
  if (pathname.startsWith('/images/') || 
      pathname.startsWith('/_next/static/') ||
      pathname === '/favicon.ico' ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml') {
    
    // Check if we have the STATIC_ASSETS binding (used by OpenNext)
    if (env.STATIC_ASSETS && typeof env.STATIC_ASSETS.fetch === 'function') {
      try {
        // Create a new URL for the static asset
        const assetUrl = new URL(pathname, request.url);
        
        // Fetch from the STATIC_ASSETS binding
        const response = await env.STATIC_ASSETS.fetch(assetUrl);
        
        if (response.ok) {
          // Clone the response and add appropriate headers
          const clonedResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
          
          // Add cache headers based on asset type
          if (pathname.startsWith('/images/')) {
            clonedResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (pathname.startsWith('/_next/static/')) {
            clonedResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            clonedResponse.headers.set('Cache-Control', 'public, max-age=86400');
          }
          
          // Add CORS headers for images
          if (pathname.startsWith('/images/')) {
            clonedResponse.headers.set('Access-Control-Allow-Origin', '*');
            clonedResponse.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
          }
          
          return clonedResponse;
        }
      } catch (error) {
        console.error('Error serving static asset from binding:', error);
      }
    }
    
    // If we can't serve from binding, return 404
    return new Response('Static asset not found', { status: 404 });
  }
  
  // Not a static asset request
  return null;
}

/**
 * Middleware function to handle static assets in Cloudflare Workers
 */
export function createStaticAssetMiddleware(env: any) {
  return async (request: Request): Promise<Response | null> => {
    return handleStaticAsset(request, env);
  };
}