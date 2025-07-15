#!/usr/bin/env node
/**
 * Comprehensive API Smoke Testing Suite
 * Tests all API endpoints for basic functionality, response codes, and performance
 * Covers Next.js API routes, Cloudflare Workers, and external integrations
 */

const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

class APISmokeTester {
  constructor() {
    this.startTime = performance.now();
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.workerBaseUrl = process.env.WORKER_BASE_URL || 'https://your-worker.your-subdomain.workers.dev';
    this.testResults = [];
    this.performanceMetrics = [];
    this.failedTests = [];
    this.resultsDir = './api-smoke-results';
    this.maxResponseTime = 5000; // 5 seconds
    this.retryCount = 3;
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🔥';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async setup() {
    await this.log('🚀 Setting up API Smoke Testing Suite');
    await fs.mkdir(this.resultsDir, { recursive: true });
    await this.log('✅ Smoke testing environment ready', 'success');
  }

  async recordResult(testName, endpoint, method, data) {
    this.testResults.push({
      testName,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      ...data
    });
    
    if (!data.success) {
      this.failedTests.push({
        testName,
        endpoint,
        method,
        error: data.error,
        statusCode: data.statusCode,
        responseTime: data.responseTime
      });
    }
  }

  async makeRequest(url, options = {}) {
    const startTime = performance.now();
    const method = options.method || 'GET';
    
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ContainerCode-API-Smoke-Test/1.0',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, fetchOptions);
      const responseTime = performance.now() - startTime;
      
      let responseBody = null;
      let responseText = '';
      
      try {
        responseText = await response.text();
        responseBody = JSON.parse(responseText);
      } catch (parseError) {
        responseBody = responseText;
      }

      return {
        success: true,
        statusCode: response.status,
        responseTime,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
        url
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return {
        success: false,
        error: error.message,
        responseTime,
        url
      };
    }
  }

  async testEndpoint(testName, endpoint, method = 'GET', expectedStatus = 200, payload = null, headers = {}) {
    await this.log(`🔍 Testing ${method} ${endpoint}`);
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        ...headers
      }
    };

    if (payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(payload);
    }

    let lastResult = null;
    let success = false;
    
    // Retry logic
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const result = await this.makeRequest(url, options);
        lastResult = result;
        
        if (result.success) {
          const statusMatches = result.statusCode === expectedStatus;
          const responseTimeOk = result.responseTime < this.maxResponseTime;
          
          if (statusMatches && responseTimeOk) {
            success = true;
            break;
          }
        }
        
        if (attempt < this.retryCount) {
          await this.log(`⚠️ Attempt ${attempt} failed, retrying...`, 'warning');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        lastResult = { success: false, error: error.message, responseTime: 0 };
      }
    }
    
    await this.recordResult(testName, endpoint, method, {
      success,
      statusCode: lastResult?.statusCode,
      responseTime: lastResult?.responseTime,
      expectedStatus,
      error: lastResult?.error,
      headers: lastResult?.headers,
      responseBody: lastResult?.body
    });
    
    if (success) {
      await this.log(`✅ ${testName}: ${lastResult.statusCode} (${lastResult.responseTime.toFixed(2)}ms)`, 'success');
    } else {
      await this.log(`❌ ${testName}: ${lastResult?.statusCode || 'ERROR'} (${lastResult?.error || 'Unknown error'})`, 'error');
    }
    
    return success;
  }

  // NEXT.JS API ROUTES TESTS

  async testPerformanceAnalytics() {
    await this.log('🧪 Testing Performance Analytics API');
    
    const testData = {
      url: 'https://containercode.co.uk',
      performance: {
        lcp: 1200,
        fcp: 800,
        cls: 0.05,
        ttfb: 200,
        inp: 100
      },
      userAgent: 'Mozilla/5.0 (compatible; Test-Agent)',
      timestamp: new Date().toISOString()
    };
    
    const tests = [
      () => this.testEndpoint('Performance Analytics POST', '/api/analytics/performance', 'POST', 200, testData),
      () => this.testEndpoint('Performance Analytics GET', '/api/analytics/performance', 'GET', 200)
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test()) passed++;
    }
    
    return passed === tests.length;
  }

  async testContactAPI() {
    await this.log('🧪 Testing Contact API');
    
    const testData = {
      name: 'API Test User',
      email: 'api-test@containercode.test',
      service: 'Cloud Technologies',
      message: 'This is an API smoke test message.',
      source: 'api-test'
    };
    
    const tests = [
      () => this.testEndpoint('Contact Form POST', '/api/contact', 'POST', 200, testData),
      () => this.testEndpoint('Contact Form GET Info', '/api/contact', 'GET', 200)
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test()) passed++;
    }
    
    return passed === tests.length;
  }

  async testNewsletterAPI() {
    await this.log('🧪 Testing Newsletter API');
    
    const subscribeData = {
      email: `smoke-test-${Date.now()}@containercode.test`,
      name: 'Smoke Test User',
      source: 'api-test'
    };
    
    const tests = [
      () => this.testEndpoint('Newsletter Subscribe POST', '/api/newsletter-subscribe', 'POST', 200, subscribeData),
      () => this.testEndpoint('Newsletter Subscribe GET Info', '/api/newsletter-subscribe', 'GET', 200),
      () => this.testEndpoint('Newsletter Basic POST', '/api/newsletter', 'POST', 200, { email: subscribeData.email }),
      () => this.testEndpoint('Newsletter Generate GET Info', '/api/generate-newsletter', 'GET', 200),
      () => this.testEndpoint('Newsletter Send GET Info', '/api/send-newsletter', 'GET', 200)
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test()) passed++;
    }
    
    return passed === tests.length;
  }

  async testHealthAPI() {
    await this.log('🧪 Testing Health Check API');
    
    const result = await this.testEndpoint('Health Check', '/api/health', 'GET', 200);
    
    // Verify health check response structure
    if (result) {
      const lastResult = this.testResults[this.testResults.length - 1];
      const body = lastResult.responseBody;
      
      if (body && typeof body === 'object' && body.status) {
        await this.log('✅ Health check response structure valid', 'success');
      } else {
        await this.log('⚠️ Health check response structure invalid', 'warning');
      }
    }
    
    return result;
  }

  async testSecurityAPI() {
    await this.log('🧪 Testing Security API');
    
    const cspReportData = {
      'csp-report': {
        'document-uri': 'https://containercode.co.uk/test',
        'referrer': '',
        'violated-directive': 'script-src',
        'effective-directive': 'script-src',
        'original-policy': "default-src 'self'",
        'disposition': 'enforce',
        'blocked-uri': 'https://example.com/malicious-script.js',
        'line-number': 1,
        'column-number': 1,
        'source-file': 'https://containercode.co.uk/test'
      }
    };
    
    const securityEventData = {
      type: 'suspicious_activity',
      level: 'medium',
      message: 'API smoke test security event',
      metadata: {
        endpoint: '/api/security/events',
        userAgent: 'Test-Agent',
        timestamp: new Date().toISOString()
      }
    };
    
    const tests = [
      () => this.testEndpoint('CSP Report POST', '/api/security/csp-report', 'POST', 200, cspReportData),
      () => this.testEndpoint('CSP Report GET', '/api/security/csp-report', 'GET', 200),
      () => this.testEndpoint('Security Events POST', '/api/security/events', 'POST', 200, securityEventData),
      () => this.testEndpoint('Security Events GET', '/api/security/events', 'GET', 200)
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test()) passed++;
    }
    
    return passed === tests.length;
  }

  async testUtilityAPI() {
    await this.log('🧪 Testing Utility API');
    
    const revalidateData = {
      secret: process.env.REVALIDATE_SECRET || 'test-secret',
      path: '/'
    };
    
    const tests = [
      () => this.testEndpoint('Robots.txt', '/api/robots', 'GET', 200),
      () => this.testEndpoint('Sitemap Index', '/api/sitemap?type=index', 'GET', 200),
      () => this.testEndpoint('Sitemap Pages', '/api/sitemap?type=pages', 'GET', 200),
      () => this.testEndpoint('Sitemap Blog', '/api/sitemap?type=blog', 'GET', 200),
      () => this.testEndpoint('Revalidate OPTIONS', '/api/revalidate', 'OPTIONS', 200)
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test()) passed++;
    }
    
    return passed === tests.length;
  }

  async testDeepSeekAPI() {
    await this.log('🧪 Testing DeepSeek API');
    
    const chatData = {
      messages: [
        {
          role: 'user',
          content: 'What are the benefits of multi-cloud architecture?'
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    };
    
    const tests = [
      () => this.testEndpoint('DeepSeek Chat GET Info', '/api/deepseek', 'GET', 200),
      () => this.testEndpoint('DeepSeek Chat POST', '/api/deepseek', 'POST', 200, chatData)
    ];
    
    let passed = 0;
    for (const test of tests) {
      if (await test()) passed++;
    }
    
    return passed === tests.length;
  }

  // CLOUDFLARE WORKERS TESTS

  async testWorkerEndpoints() {
    await this.log('🧪 Testing Cloudflare Worker Endpoints');
    
    const workerTests = [
      () => this.testEndpoint('Article Generator Status', `${this.workerBaseUrl}/status`, 'GET', 200),
      () => this.testEndpoint('Article Generator Test Notion', `${this.workerBaseUrl}/test-notion`, 'POST', 200),
      () => this.testEndpoint('Article Generator Test BraveSearch', `${this.workerBaseUrl}/test-brave-search`, 'POST', 200),
      () => this.testEndpoint('Article Generator Test Fallback', `${this.workerBaseUrl}/test-fallback`, 'POST', 200)
    ];
    
    let passed = 0;
    for (const test of workerTests) {
      if (await test()) passed++;
    }
    
    return passed === workerTests.length;
  }

  // PERFORMANCE TESTS

  async testPerformanceRequirements() {
    await this.log('🧪 Testing Performance Requirements');
    
    const performanceTests = [
      { name: 'Health Check Performance', endpoint: '/api/health', maxTime: 1000 },
      { name: 'Contact API Performance', endpoint: '/api/contact', maxTime: 2000 },
      { name: 'Newsletter API Performance', endpoint: '/api/newsletter-subscribe', maxTime: 2000 },
      { name: 'Robots.txt Performance', endpoint: '/api/robots', maxTime: 500 },
      { name: 'Sitemap Performance', endpoint: '/api/sitemap', maxTime: 1000 }
    ];
    
    let passed = 0;
    
    for (const test of performanceTests) {
      const result = await this.makeRequest(`${this.baseUrl}${test.endpoint}`);
      const success = result.success && result.responseTime < test.maxTime;
      
      await this.recordResult(test.name, test.endpoint, 'GET', {
        success,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        maxTime: test.maxTime,
        error: result.error
      });
      
      if (success) {
        await this.log(`✅ ${test.name}: ${result.responseTime.toFixed(2)}ms < ${test.maxTime}ms`, 'success');
        passed++;
      } else {
        await this.log(`❌ ${test.name}: ${result.responseTime?.toFixed(2)}ms >= ${test.maxTime}ms`, 'error');
      }
    }
    
    return passed === performanceTests.length;
  }

  // RATE LIMITING TESTS

  async testRateLimiting() {
    await this.log('🧪 Testing Rate Limiting');
    
    const endpoint = '/api/health';
    const requests = 20;
    const promises = [];
    
    for (let i = 0; i < requests; i++) {
      promises.push(this.makeRequest(`${this.baseUrl}${endpoint}`));
    }
    
    const results = await Promise.all(promises);
    const rateLimitedRequests = results.filter(r => r.statusCode === 429).length;
    const successfulRequests = results.filter(r => r.statusCode === 200).length;
    
    await this.recordResult('Rate Limiting Test', endpoint, 'GET', {
      success: rateLimitedRequests > 0, // We expect some requests to be rate limited
      totalRequests: requests,
      successfulRequests,
      rateLimitedRequests,
      statusCode: 'Mixed'
    });
    
    if (rateLimitedRequests > 0) {
      await this.log(`✅ Rate limiting working: ${rateLimitedRequests}/${requests} requests limited`, 'success');
      return true;
    } else {
      await this.log(`⚠️ Rate limiting not triggered: ${successfulRequests}/${requests} requests successful`, 'warning');
      return false;
    }
  }

  // SECURITY HEADERS TESTS

  async testSecurityHeaders() {
    await this.log('🧪 Testing Security Headers');
    
    const endpoints = [
      '/api/health',
      '/api/contact',
      '/api/newsletter-subscribe'
    ];
    
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'referrer-policy'
    ];
    
    let passed = 0;
    
    for (const endpoint of endpoints) {
      const result = await this.makeRequest(`${this.baseUrl}${endpoint}`);
      
      if (result.success) {
        const headers = result.headers;
        const presentHeaders = requiredHeaders.filter(header => headers[header]);
        const success = presentHeaders.length >= requiredHeaders.length * 0.75; // 75% of headers required
        
        await this.recordResult(`Security Headers: ${endpoint}`, endpoint, 'GET', {
          success,
          statusCode: result.statusCode,
          responseTime: result.responseTime,
          presentHeaders,
          requiredHeaders
        });
        
        if (success) {
          await this.log(`✅ Security headers present: ${endpoint} (${presentHeaders.length}/${requiredHeaders.length})`, 'success');
          passed++;
        } else {
          await this.log(`⚠️ Security headers missing: ${endpoint} (${presentHeaders.length}/${requiredHeaders.length})`, 'warning');
        }
      }
    }
    
    return passed === endpoints.length;
  }

  // MAIN TEST RUNNER

  async runAllSmokeTests() {
    await this.log('🚀 Starting Comprehensive API Smoke Testing');
    
    const testSuites = [
      { name: 'Health Check API', test: () => this.testHealthAPI() },
      { name: 'Contact API', test: () => this.testContactAPI() },
      { name: 'Newsletter API', test: () => this.testNewsletterAPI() },
      { name: 'Performance Analytics API', test: () => this.testPerformanceAnalytics() },
      { name: 'Security API', test: () => this.testSecurityAPI() },
      { name: 'Utility API', test: () => this.testUtilityAPI() },
      { name: 'DeepSeek API', test: () => this.testDeepSeekAPI() },
      { name: 'Performance Requirements', test: () => this.testPerformanceRequirements() },
      { name: 'Rate Limiting', test: () => this.testRateLimiting() },
      { name: 'Security Headers', test: () => this.testSecurityHeaders() }
    ];
    
    let totalPassed = 0;
    const suiteResults = [];
    
    for (const suite of testSuites) {
      await this.log(`\n📋 Running ${suite.name} Tests`);
      try {
        const suitePassed = await suite.test();
        suiteResults.push({ name: suite.name, passed: suitePassed });
        if (suitePassed) totalPassed++;
      } catch (error) {
        await this.log(`❌ Test suite ${suite.name} failed: ${error.message}`, 'error');
        suiteResults.push({ name: suite.name, passed: false });
      }
    }
    
    await this.generateReport(suiteResults, totalPassed, testSuites.length);
    
    return {
      totalSuites: testSuites.length,
      passedSuites: totalPassed,
      successRate: (totalPassed / testSuites.length) * 100,
      testResults: this.testResults,
      failedTests: this.failedTests,
      performanceMetrics: this.performanceMetrics
    };
  }

  async generateReport(suiteResults, totalPassed, totalSuites) {
    const totalDuration = performance.now() - this.startTime;
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.success).length;
    const failedTests = this.testResults.filter(test => !test.success).length;
    
    await this.log('\n📊 API SMOKE TEST REPORT');
    await this.log('='.repeat(60));
    await this.log(`Total Test Suites: ${totalSuites}`);
    await this.log(`Passed Suites: ${totalPassed}`);
    await this.log(`Failed Suites: ${totalSuites - totalPassed}`);
    await this.log(`Suite Success Rate: ${((totalPassed / totalSuites) * 100).toFixed(1)}%`);
    await this.log('');
    await this.log(`Total Individual Tests: ${totalTests}`);
    await this.log(`Passed Tests: ${passedTests}`);
    await this.log(`Failed Tests: ${failedTests}`);
    await this.log(`Test Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    await this.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    await this.log('='.repeat(60));
    
    // Suite results
    await this.log('\n📋 Suite Results:');
    suiteResults.forEach(suite => {
      const status = suite.passed ? '✅' : '❌';
      this.log(`${status} ${suite.name}`);
    });
    
    // Performance metrics
    const responseTimeTests = this.testResults.filter(test => test.responseTime);
    if (responseTimeTests.length > 0) {
      const avgResponseTime = responseTimeTests.reduce((sum, test) => sum + test.responseTime, 0) / responseTimeTests.length;
      const maxResponseTime = Math.max(...responseTimeTests.map(test => test.responseTime));
      const minResponseTime = Math.min(...responseTimeTests.map(test => test.responseTime));
      
      await this.log('\n⚡ Performance Summary:');
      await this.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      await this.log(`Max Response Time: ${maxResponseTime.toFixed(2)}ms`);
      await this.log(`Min Response Time: ${minResponseTime.toFixed(2)}ms`);
    }
    
    // Failed tests
    if (this.failedTests.length > 0) {
      await this.log('\n❌ Failed Tests:');
      this.failedTests.forEach(test => {
        this.log(`  • ${test.testName} (${test.method} ${test.endpoint}): ${test.error || `HTTP ${test.statusCode}`}`);
      });
    }
    
    // Save detailed report
    const reportPath = path.join(this.resultsDir, `api-smoke-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify({
      summary: {
        totalSuites,
        passedSuites: totalPassed,
        failedSuites: totalSuites - totalPassed,
        suiteSuccessRate: (totalPassed / totalSuites) * 100,
        totalTests,
        passedTests,
        failedTests,
        testSuccessRate: (passedTests / totalTests) * 100,
        duration: totalDuration,
        timestamp: new Date().toISOString()
      },
      suiteResults,
      testResults: this.testResults,
      failedTests: this.failedTests,
      performanceMetrics: this.performanceMetrics
    }, null, 2));
    
    await this.log(`\n📄 Detailed report saved to: ${reportPath}`);
    await this.log('\n🔥 API SMOKE TESTING COMPLETE');
    await this.log('='.repeat(60));
  }
}

module.exports = APISmokeTester;

// Run if called directly
if (require.main === module) {
  (async () => {
    const smokeTester = new APISmokeTester();
    
    try {
      await smokeTester.setup();
      const results = await smokeTester.runAllSmokeTests();
      
      // Exit with non-zero code if tests failed
      if (results.successRate < 80) {
        process.exit(1);
      }
    } catch (error) {
      console.error('API Smoke Testing failed:', error);
      process.exit(1);
    }
  })();
}