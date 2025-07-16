const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 8080;

// Simple analytics tracking
let requestCount = 0;
const startTime = Date.now();

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  // Increment request counter
  requestCount++;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  try {
    // Health check endpoint
    if (path === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - startTime,
        requests: requestCount,
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0'
      }));
      return;
    }
    
    // Container info endpoint
    if (path === '/container/info') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        container_id: process.env.HOSTNAME || 'unknown',
        timestamp: new Date().toISOString(),
        requests: requestCount,
        uptime: Date.now() - startTime,
        memory: process.memoryUsage(),
        env: process.env.NODE_ENV || 'development'
      }));
      return;
    }
    
    // Analytics endpoint
    if (path.startsWith('/api/analytics')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        container_id: process.env.HOSTNAME || 'unknown',
        requests: requestCount,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: path,
        uptime: Date.now() - startTime
      }));
      return;
    }
    
    // Load balancer test endpoint
    if (path === '/lb') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Load balancer response',
        container_id: process.env.HOSTNAME || 'unknown',
        timestamp: new Date().toISOString(),
        requests: requestCount
      }));
      return;
    }
    
    // Default response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from Container ${process.env.HOSTNAME || 'unknown'}!
Path: ${path}
Method: ${req.method}
Requests: ${requestCount}
Uptime: ${Date.now() - startTime}ms
Timestamp: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server Error: ${error.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Container server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});