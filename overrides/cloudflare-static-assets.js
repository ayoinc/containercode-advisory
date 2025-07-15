/**
 * Custom wrapper for Cloudflare Workers that handles static assets
 * This override ensures that images and static assets are properly served from the ASSETS binding
 */

export const override = {
  name: "cloudflare-static-assets",
  wrapper: (handler) => {
    return async (request, env, ctx) => {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Handle static assets first, before passing to Next.js
      if (pathname.startsWith("/images/") || 
          pathname.startsWith("/_next/static/") ||
          pathname === "/favicon.ico" ||
          pathname === "/robots.txt" ||
          pathname === "/sitemap.xml" ||
          pathname === "/apple-icon.svg" ||
          pathname === "/icon.svg") {
        
        try {
          // Try to fetch from the ASSETS binding
          const response = await env.ASSETS?.fetch(request);
          
          if (response && response.ok) {
            // Clone the response and add appropriate headers
            const newResponse = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
            
            // Add cache headers based on asset type
            if (pathname.startsWith("/images/")) {
              newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
              newResponse.headers.set('Access-Control-Allow-Origin', '*');
              newResponse.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
            } else if (pathname.startsWith("/_next/static/")) {
              newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
            } else {
              newResponse.headers.set('Cache-Control', 'public, max-age=86400');
            }
            
            // Add content type if not already set
            if (!newResponse.headers.get('Content-Type')) {
              if (pathname.endsWith('.svg')) {
                newResponse.headers.set('Content-Type', 'image/svg+xml');
              } else if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
                newResponse.headers.set('Content-Type', 'image/jpeg');
              } else if (pathname.endsWith('.png')) {
                newResponse.headers.set('Content-Type', 'image/png');
              } else if (pathname.endsWith('.webp')) {
                newResponse.headers.set('Content-Type', 'image/webp');
              } else if (pathname.endsWith('.ico')) {
                newResponse.headers.set('Content-Type', 'image/x-icon');
              }
            }
            
            return newResponse;
          }
        } catch (error) {
          console.error('Error serving static asset:', pathname, error);
        }
        
        // If we can't serve the asset, return 404
        return new Response(`Static asset not found: ${pathname}`, { 
          status: 404,
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      }
      
      // For all other requests, pass to the original handler
      return handler(request, env, ctx);
    };
  },
};