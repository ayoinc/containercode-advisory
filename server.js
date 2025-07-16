const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8080;
const MESSAGE = process.env.MESSAGE || 'Hello from ContainerCode App!';
const INSTANCE_ID = process.env.CLOUDFLARE_DEPLOYMENT_ID || 'local-dev';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check endpoint
  if (parsedUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      message: MESSAGE,
      instanceId: INSTANCE_ID,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }
  
  // API endpoint
  if (parsedUrl.pathname.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: `API response: ${MESSAGE}`,
      instanceId: INSTANCE_ID,
      path: parsedUrl.pathname,
      method: req.method,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Default response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ContainerCode App</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .info { background: #f5f5f5; padding: 20px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 ContainerCode App</h1>
        <div class="info">
          <h3>Container Info:</h3>
          <p><strong>Message:</strong> ${MESSAGE}</p>
          <p><strong>Instance ID:</strong> ${INSTANCE_ID}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Uptime:</strong> ${Math.floor(process.uptime())} seconds</p>
        </div>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><a href="/health">/health</a> - Health check</li>
          <li><a href="/api/test">/api/test</a> - API test</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ContainerCode App running on port ${PORT}`);
  console.log(`📝 Message: ${MESSAGE}`);
  console.log(`🆔 Instance ID: ${INSTANCE_ID}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
