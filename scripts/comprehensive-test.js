require('dotenv').config();
const fs = require('fs');

// Test configuration
const TEST_RESULTS_FILE = 'comprehensive-test-results.json';
const RESULTS = {
  timestamp: new Date().toISOString(),
  success: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  const fetch = (await import('node-fetch')).default;
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const requestOptions = { ...defaultOptions, ...options };
  
  console.log(`\n🔍 Testing: ${requestOptions.method} ${url}`);
  console.log(`📤 Request:`, {
    headers: requestOptions.headers,
    body: requestOptions.body ? JSON.parse(requestOptions.body) : 'No body'
  });
  
  try {
    const response = await fetch(url, requestOptions);
    const responseText = await response.text();
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }
    
    console.log(`📥 Response Status: ${response.status}`);
    console.log(`📥 Response:`, responseData);
    
    return {
      success: response.ok,
      status: response.status,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.log(`❌ Request failed:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test functions
async function testNotionBlogPosts() {
  const url = 'http://localhost:3000/api/notion/blog-posts';
  const result = await makeRequest(url);
  
  return {
    name: 'Notion Blog Posts API',
    url,
    ...result
  };
}

async function testNotionServices() {
  const url = 'http://localhost:3000/api/notion/services';
  const result = await makeRequest(url);
  
  return {
    name: 'Notion Services API',
    url,
    ...result
  };
}

async function testContactForm() {
  const url = 'http://localhost:3000/api/contact';
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    company: 'Test Company',
    service: 'Cloud Solutions',
    message: 'This is a test message from the comprehensive API test.'
  };
  
  const result = await makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  return {
    name: 'Contact Form API',
    url,
    requestData: testData,
    ...result
  };
}

async function testDeepSeekAPI() {
  const url = 'http://localhost:3000/api/ai/deepseek';
  const testData = {
    messages: [
      {
        role: 'user',
        content: 'What are the main benefits of containerization in DevOps?'
      }
    ]
  };
  
  const result = await makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  return {
    name: 'DeepSeek AI API',
    url,
    requestData: testData,
    ...result
  };
}

async function testPexelsAPI() {
  const url = 'http://localhost:3000/api/images/pexels?query=cloud computing&per_page=5';
  const result = await makeRequest(url);
  
  return {
    name: 'Pexels Images API',
    url,
    ...result
  };
}

async function testNewsletterSubscription() {
  const url = 'http://localhost:3000/api/newsletter/subscribe';
  const testData = {
    email: 'test@example.com',
    name: 'Test Subscriber',
    interests: ['Cloud', 'DevOps']
  };
  
  const result = await makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  return {
    name: 'Newsletter Subscription API',
    url,
    requestData: testData,
    ...result
  };
}

async function testPerformanceAnalytics() {
  const url = 'http://localhost:3000/api/analytics/performance';
  const testData = {
    page: '/test-page',
    metrics: {
      loadTime: 1500,
      firstPaint: 800,
      domContentLoaded: 1200,
      userAgent: 'Test User Agent',
      timestamp: new Date().toISOString()
    }
  };
  
  const result = await makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  return {
    name: 'Performance Analytics API',
    url,
    requestData: testData,
    ...result
  };
}

async function testBraveSearchAPI() {
  const url = 'http://localhost:3000/api/search/brave?q=kubernetes deployment best practices&count=3';
  const result = await makeRequest(url);
  
  return {
    name: 'Brave Search API',
    url,
    ...result
  };
}

async function testHealthCheck() {
  const url = 'http://localhost:3000/api/health';
  const result = await makeRequest(url);
  
  return {
    name: 'Health Check API',
    url,
    ...result
  };
}

async function testNewsletterAutomation() {
  const url = 'http://localhost:3000/api/newsletter/automation';
  const result = await makeRequest(url);
  
  return {
    name: 'Newsletter Automation API',
    url,
    ...result
  };
}

async function testContentGeneration() {
  const url = 'http://localhost:3000/api/content/generate';
  const testData = {
    topic: 'Best practices for Docker security',
    type: 'blog-post',
    keywords: ['Docker', 'security', 'containerization']
  };
  
  const result = await makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  return {
    name: 'Content Generation API',
    url,
    requestData: testData,
    ...result
  };
}

async function testImageOptimization() {
  const url = 'http://localhost:3000/api/images/optimize';
  const testData = {
    imageUrl: 'https://example.com/test-image.jpg',
    width: 800,
    height: 600,
    quality: 85
  };
  
  const result = await makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  return {
    name: 'Image Optimization API',
    url,
    requestData: testData,
    ...result
  };
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Comprehensive API Integration Tests');
  console.log('=' .repeat(60));
  
  const tests = [
    testHealthCheck,
    testNotionServices,
    testNotionBlogPosts,
    testContactForm,
    testDeepSeekAPI,
    testPexelsAPI,
    testBraveSearchAPI,
    testNewsletterSubscription,
    testPerformanceAnalytics,
    testNewsletterAutomation,
    testContentGeneration,
    testImageOptimization
  ];
  
  for (const test of tests) {
    try {
      const result = await test();
      RESULTS.tests.push(result);
      
      if (result.success) {
        RESULTS.success++;
        console.log(`✅ ${result.name} - PASSED`);
      } else {
        RESULTS.failed++;
        console.log(`❌ ${result.name} - FAILED`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
        if (result.status) {
          console.log(`   Status: ${result.status}`);
        }
      }
      
      console.log('-'.repeat(40));
      
      // Add delay between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      RESULTS.failed++;
      RESULTS.tests.push({
        name: test.name || 'Unknown Test',
        success: false,
        error: error.message
      });
      console.log(`❌ ${test.name || 'Unknown Test'} - ERROR: ${error.message}`);
    }
  }
  
  // Generate summary
  const total = RESULTS.success + RESULTS.failed;
  const successRate = ((RESULTS.success / total) * 100).toFixed(1);
  
  console.log('\n🎯 TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`📊 Total Tests: ${total}`);
  console.log(`✅ Passed: ${RESULTS.success}`);
  console.log(`❌ Failed: ${RESULTS.failed}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  // Save detailed results
  fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(RESULTS, null, 2));
  console.log(`\n💾 Detailed results saved to: ${TEST_RESULTS_FILE}`);
  
  // Environment validation
  console.log('\n🔧 ENVIRONMENT VALIDATION');
  console.log('=' .repeat(60));
  const envVars = [
    'NOTION_TOKEN',
    'NOTION_DATABASE_SERVICES', 
    'NOTION_DATABASE_BLOG_POSTS',
    'NOTION_DATABASE_NEWSLETTERS',
    'NOTION_DATABASE_SUBSCRIBERS',
    'NOTION_DATABASE_GENERATED_ARTICLES',
    'DEEPSEEK_API_KEY',
    'PEXELS_API_KEY',
    'RESEND_API_KEY',
    'BRAVE_API_KEY'
  ];
  
  envVars.forEach(envVar => {
    const value = process.env[envVar];
    const status = value ? '✅' : '❌';
    const displayValue = value ? `${value.substring(0, 10)}...` : 'Not set';
    console.log(`${status} ${envVar}: ${displayValue}`);
  });
  
  console.log('\n🏁 Tests completed!');
  
  if (RESULTS.failed > 0) {
    console.log('\n⚠️  Some tests failed. Check the detailed results for more information.');
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});
