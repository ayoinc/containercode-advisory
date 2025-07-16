#!/usr/bin/env node

async function testContainerDeployment() {
  console.log('🧪 Testing Container Deployment...');
  
  const testUrl = process.argv[2] || 'https://containercode-containers.ayoinc.workers.dev';
  
  const testEndpoints = [
    { path: '/health', description: 'Health check endpoint' },
    { path: '/container/test-session', description: 'Named container session' },
    { path: '/lb', description: 'Load balanced container' },
    { path: '/singleton', description: 'Singleton container' },
    { path: '/api/analytics', description: 'Analytics endpoint' },
    { path: '/', description: 'Default container routing' },
  ];
  
  console.log(`🔗 Testing deployment at: ${testUrl}`);
  console.log('═'.repeat(60));
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint.description}`);
      console.log(`   URL: ${testUrl}${endpoint.path}`);
      
      const response = await fetch(`${testUrl}${endpoint.path}`, {
        method: 'GET',
        headers: {
          'X-Session-ID': 'test-session',
          'Content-Type': 'application/json',
        }
      });
      
      const status = response.ok ? '✅' : '❌';
      console.log(`   Status: ${status} ${response.status} ${response.statusText}`);
      
      // Log response headers for debugging
      const containerSession = response.headers.get('X-Container-Session');
      const routingMode = response.headers.get('X-Routing-Mode');
      
      if (containerSession) {
        console.log(`   Container Session: ${containerSession}`);
      }
      if (routingMode) {
        console.log(`   Routing Mode: ${routingMode}`);
      }
      
      // Try to parse response
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        try {
          const data = await response.json();
          console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
        } catch (e) {
          console.log(`   Response: [JSON Parse Error]`);
        }
      } else {
        const text = await response.text();
        console.log(`   Response: ${text.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n═'.repeat(60));
  console.log('🏁 Container deployment test completed');
}

if (require.main === module) {
  testContainerDeployment().catch(console.error);
}

module.exports = testContainerDeployment;