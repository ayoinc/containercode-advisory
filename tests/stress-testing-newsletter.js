#!/usr/bin/env node
/**
 * Aggressive Newsletter Stress Testing Suite
 * Specialized stress testing for newsletter signup flows
 * Tests concurrent signups, rate limiting, and system resilience
 */

const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

class NewsletterStressTester {
  constructor() {
    this.browser = null;
    this.startTime = performance.now();
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.resultsDir = './stress-test-results';
    this.testResults = [];
    this.performanceMetrics = [];
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🔥';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async setup() {
    await this.log('🔥 Setting up Newsletter Stress Testing Environment');
    
    // Create results directory
    await fs.mkdir(this.resultsDir, { recursive: true });
    
    // Launch browser with optimizations for stress testing
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript-harmony-shipping',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--max-old-space-size=4096'
      ]
    });

    await this.log('✅ Stress testing environment ready', 'success');
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
    await this.log('✅ Stress testing environment cleaned up', 'success');
  }

  async recordResult(testName, data) {
    this.testResults.push({
      testName,
      timestamp: new Date().toISOString(),
      ...data
    });
  }

  async generateEmail(index, testType) {
    const domains = [
      'stress-test.com',
      'load-test.org',
      'performance-test.net',
      'containercode-test.co.uk'
    ];
    
    const domain = domains[index % domains.length];
    const timestamp = Date.now();
    
    return `stress-${testType}-${index}-${timestamp}@${domain}`;
  }

  // BASIC STRESS TESTS

  async basicConcurrentSignups(concurrentUsers = 10) {
    await this.log(`🔥 Starting Basic Concurrent Signups Test (${concurrentUsers} users)`);
    const testStart = performance.now();
    
    try {
      const promises = Array.from({ length: concurrentUsers }, async (_, index) => {
        const page = await this.browser.newPage();
        const email = await this.generateEmail(index, 'basic');
        
        try {
          const startTime = performance.now();
          await page.goto(this.baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
          
          // Find newsletter form
          const emailInput = await page.$('input[type="email"]');
          const submitButton = await page.$('button[type="submit"], input[type="submit"]');
          
          if (emailInput && submitButton) {
            await emailInput.type(email);
            await submitButton.click();
            
            // Wait for response
            await page.waitForTimeout(2000);
            
            // Check for success/error indicators
            const responseTime = performance.now() - startTime;
            const success = await this.checkSubscriptionSuccess(page);
            
            await page.close();
            return { index, email, success, responseTime, error: null };
          } else {
            throw new Error('Newsletter form elements not found');
          }
        } catch (error) {
          await page.close();
          const responseTime = performance.now() - startTime;
          return { index, email, success: false, responseTime, error: error.message };
        }
      });
      
      const results = await Promise.allSettled(promises);
      const successfulRequests = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failedRequests = results.filter(r => r.status === 'rejected' || !r.value.success).length;
      
      const duration = performance.now() - testStart;
      const averageResponseTime = results
        .filter(r => r.status === 'fulfilled')
        .reduce((sum, r) => sum + r.value.responseTime, 0) / results.length;
      
      await this.recordResult('Basic Concurrent Signups', {
        concurrentUsers,
        successfulRequests,
        failedRequests,
        successRate: (successfulRequests / concurrentUsers) * 100,
        duration,
        averageResponseTime,
        throughput: concurrentUsers / (duration / 1000)
      });
      
      await this.log(`✅ Basic Concurrent Test: ${successfulRequests}/${concurrentUsers} successful (${((successfulRequests / concurrentUsers) * 100).toFixed(1)}%)`, 'success');
      
      return successfulRequests >= concurrentUsers * 0.8;
    } catch (error) {
      await this.log(`❌ Basic Concurrent Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // AGGRESSIVE STRESS TESTS

  async aggressiveLoadTest(concurrentUsers = 50, duration = 60000) {
    await this.log(`🔥 Starting Aggressive Load Test (${concurrentUsers} users, ${duration/1000}s)`);
    const testStart = performance.now();
    
    try {
      let totalRequests = 0;
      let successfulRequests = 0;
      let failedRequests = 0;
      const responseTimes = [];
      
      const workerPromises = Array.from({ length: concurrentUsers }, async (_, workerIndex) => {
        const endTime = testStart + duration;
        let requestCount = 0;
        
        while (performance.now() < endTime) {
          const page = await this.browser.newPage();
          const email = await this.generateEmail(totalRequests + requestCount, 'aggressive');
          
          try {
            const startTime = performance.now();
            await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
            
            const emailInput = await page.$('input[type="email"]');
            const submitButton = await page.$('button[type="submit"]');
            
            if (emailInput && submitButton) {
              await emailInput.type(email);
              await submitButton.click();
              
              const responseTime = performance.now() - startTime;
              responseTimes.push(responseTime);
              
              const success = await this.checkSubscriptionSuccess(page);
              if (success) {
                successfulRequests++;
              } else {
                failedRequests++;
              }
            }
            
            requestCount++;
            totalRequests++;
          } catch (error) {
            failedRequests++;
          } finally {
            await page.close();
          }
          
          // Small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return { workerIndex, requestCount };
      });
      
      await Promise.allSettled(workerPromises);
      
      const testDuration = performance.now() - testStart;
      const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      const throughput = totalRequests / (testDuration / 1000);
      
      await this.recordResult('Aggressive Load Test', {
        concurrentUsers,
        plannedDuration: duration,
        actualDuration: testDuration,
        totalRequests,
        successfulRequests,
        failedRequests,
        successRate: (successfulRequests / totalRequests) * 100,
        averageResponseTime,
        throughput,
        responseTimes: {
          min: Math.min(...responseTimes),
          max: Math.max(...responseTimes),
          p95: this.calculatePercentile(responseTimes, 95),
          p99: this.calculatePercentile(responseTimes, 99)
        }
      });
      
      await this.log(`✅ Aggressive Load Test: ${successfulRequests}/${totalRequests} successful (${throughput.toFixed(2)} req/s)`, 'success');
      
      return successfulRequests >= totalRequests * 0.7;
    } catch (error) {
      await this.log(`❌ Aggressive Load Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async burstTrafficTest(burstSize = 30, burstCount = 5, burstInterval = 5000) {
    await this.log(`🔥 Starting Burst Traffic Test (${burstCount} bursts of ${burstSize} requests)`);
    const testStart = performance.now();
    
    try {
      let totalRequests = 0;
      let successfulRequests = 0;
      let failedRequests = 0;
      const burstResults = [];
      
      for (let burstIndex = 0; burstIndex < burstCount; burstIndex++) {
        await this.log(`🔥 Executing burst ${burstIndex + 1}/${burstCount}`);
        const burstStart = performance.now();
        
        const burstPromises = Array.from({ length: burstSize }, async (_, requestIndex) => {
          const page = await this.browser.newPage();
          const email = await this.generateEmail(totalRequests + requestIndex, 'burst');
          
          try {
            const startTime = performance.now();
            await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
            
            const emailInput = await page.$('input[type="email"]');
            const submitButton = await page.$('button[type="submit"]');
            
            if (emailInput && submitButton) {
              await emailInput.type(email);
              await submitButton.click();
              
              const responseTime = performance.now() - startTime;
              const success = await this.checkSubscriptionSuccess(page);
              
              await page.close();
              return { success, responseTime, email };
            } else {
              throw new Error('Form elements not found');
            }
          } catch (error) {
            await page.close();
            return { success: false, responseTime: performance.now() - startTime, error: error.message };
          }
        });
        
        const burstResults = await Promise.allSettled(burstPromises);
        const burstSuccessful = burstResults.filter(r => r.status === 'fulfilled' && r.value.success).length;
        const burstFailed = burstSize - burstSuccessful;
        
        totalRequests += burstSize;
        successfulRequests += burstSuccessful;
        failedRequests += burstFailed;
        
        const burstDuration = performance.now() - burstStart;
        const burstThroughput = burstSize / (burstDuration / 1000);
        
        burstResults.push({
          burstIndex: burstIndex + 1,
          burstSize,
          successful: burstSuccessful,
          failed: burstFailed,
          duration: burstDuration,
          throughput: burstThroughput
        });
        
        await this.log(`   Burst ${burstIndex + 1}: ${burstSuccessful}/${burstSize} successful (${burstThroughput.toFixed(2)} req/s)`);
        
        // Wait before next burst
        if (burstIndex < burstCount - 1) {
          await new Promise(resolve => setTimeout(resolve, burstInterval));
        }
      }
      
      const testDuration = performance.now() - testStart;
      
      await this.recordResult('Burst Traffic Test', {
        burstCount,
        burstSize,
        burstInterval,
        totalRequests,
        successfulRequests,
        failedRequests,
        successRate: (successfulRequests / totalRequests) * 100,
        duration: testDuration,
        burstResults
      });
      
      await this.log(`✅ Burst Traffic Test: ${successfulRequests}/${totalRequests} successful across ${burstCount} bursts`, 'success');
      
      return successfulRequests >= totalRequests * 0.7;
    } catch (error) {
      await this.log(`❌ Burst Traffic Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // RESILIENCE TESTS

  async rateLimitingTest(requestsPerSecond = 5, duration = 30000) {
    await this.log(`🔥 Starting Rate Limiting Test (${requestsPerSecond} req/s for ${duration/1000}s)`);
    const testStart = performance.now();
    
    try {
      let totalRequests = 0;
      let successfulRequests = 0;
      let rateLimitedRequests = 0;
      let errorRequests = 0;
      
      const interval = 1000 / requestsPerSecond;
      const endTime = testStart + duration;
      
      while (performance.now() < endTime) {
        const page = await this.browser.newPage();
        const email = await this.generateEmail(totalRequests, 'ratelimit');
        
        try {
          await page.goto(this.baseUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
          
          const emailInput = await page.$('input[type="email"]');
          const submitButton = await page.$('button[type="submit"]');
          
          if (emailInput && submitButton) {
            await emailInput.type(email);
            await submitButton.click();
            
            // Check response
            const response = await page.waitForResponse(response => 
              response.url().includes('newsletter') || response.url().includes('subscribe'), 
              { timeout: 5000 }
            ).catch(() => null);
            
            if (response) {
              if (response.status() === 429) {
                rateLimitedRequests++;
              } else if (response.status() >= 200 && response.status() < 300) {
                successfulRequests++;
              } else {
                errorRequests++;
              }
            } else {
              errorRequests++;
            }
          }
          
          totalRequests++;
        } catch (error) {
          errorRequests++;
        } finally {
          await page.close();
        }
        
        // Wait for next request
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      
      const testDuration = performance.now() - testStart;
      const actualRequestsPerSecond = totalRequests / (testDuration / 1000);
      
      await this.recordResult('Rate Limiting Test', {
        plannedRequestsPerSecond: requestsPerSecond,
        actualRequestsPerSecond,
        duration: testDuration,
        totalRequests,
        successfulRequests,
        rateLimitedRequests,
        errorRequests,
        rateLimitingWorking: rateLimitedRequests > 0
      });
      
      await this.log(`✅ Rate Limiting Test: ${successfulRequests}/${totalRequests} successful, ${rateLimitedRequests} rate limited`, 'success');
      
      return totalRequests > 0 && successfulRequests >= totalRequests * 0.3;
    } catch (error) {
      await this.log(`❌ Rate Limiting Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async recoveryTest(initialLoad = 20, recoveryDelay = 10000) {
    await this.log(`🔥 Starting Recovery Test (${initialLoad} concurrent, ${recoveryDelay/1000}s recovery)`);
    const testStart = performance.now();
    
    try {
      // Phase 1: Heavy load
      await this.log('   Phase 1: Applying heavy load');
      await this.basicConcurrentSignups(initialLoad);
      
      // Phase 2: Recovery period
      await this.log(`   Phase 2: Recovery period (${recoveryDelay/1000}s)`);
      await new Promise(resolve => setTimeout(resolve, recoveryDelay));
      
      // Phase 3: Test system responsiveness
      await this.log('   Phase 3: Testing system responsiveness');
      const postRecoveryResult = await this.basicConcurrentSignups(10);
      
      const testDuration = performance.now() - testStart;
      
      await this.recordResult('Recovery Test', {
        initialLoad,
        recoveryDelay,
        duration: testDuration,
        recoverySuccessful: postRecoveryResult
      });
      
      await this.log(`✅ Recovery Test: System ${postRecoveryResult ? 'recovered successfully' : 'failed to recover'}`, 
        postRecoveryResult ? 'success' : 'error');
      
      return postRecoveryResult;
    } catch (error) {
      await this.log(`❌ Recovery Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // UTILITY METHODS

  async checkSubscriptionSuccess(page) {
    try {
      // Wait for potential success indicators
      await page.waitForTimeout(1000);
      
      const successIndicators = await page.$$eval('*', elements => 
        elements.map(el => el.textContent.toLowerCase()).filter(text => 
          text.includes('subscribed') || 
          text.includes('success') || 
          text.includes('thank you') ||
          text.includes('confirmed')
        )
      );
      
      return successIndicators.length > 0;
    } catch (error) {
      return false;
    }
  }

  calculatePercentile(values, percentile) {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  // MAIN TEST RUNNER

  async runAllStressTests() {
    await this.log('🚀 Starting Comprehensive Newsletter Stress Testing');
    
    const testSuites = [
      { name: 'Basic Concurrent Signups (10)', test: () => this.basicConcurrentSignups(10) },
      { name: 'Basic Concurrent Signups (25)', test: () => this.basicConcurrentSignups(25) },
      { name: 'Aggressive Load Test (50 users, 60s)', test: () => this.aggressiveLoadTest(50, 60000) },
      { name: 'Burst Traffic Test (30x5)', test: () => this.burstTrafficTest(30, 5, 5000) },
      { name: 'Rate Limiting Test (5 req/s, 30s)', test: () => this.rateLimitingTest(5, 30000) },
      { name: 'Recovery Test (20 initial)', test: () => this.recoveryTest(20, 10000) }
    ];
    
    let totalPassed = 0;
    const suiteResults = [];
    
    for (const suite of testSuites) {
      await this.log(`\n📋 Running ${suite.name}`);
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
      performanceMetrics: this.performanceMetrics
    };
  }

  async generateReport(suiteResults, totalPassed, totalSuites) {
    const totalDuration = performance.now() - this.startTime;
    
    await this.log('\n📊 NEWSLETTER STRESS TEST REPORT');
    await this.log('='.repeat(60));
    await this.log(`Total Test Suites: ${totalSuites}`);
    await this.log(`Passed Suites: ${totalPassed}`);
    await this.log(`Failed Suites: ${totalSuites - totalPassed}`);
    await this.log(`Success Rate: ${((totalPassed / totalSuites) * 100).toFixed(1)}%`);
    await this.log(`Total Duration: ${(totalDuration / 1000 / 60).toFixed(2)} minutes`);
    await this.log('='.repeat(60));
    
    // Suite results
    await this.log('\n📋 Suite Results:');
    suiteResults.forEach(suite => {
      const status = suite.passed ? '✅' : '❌';
      this.log(`${status} ${suite.name}`);
    });
    
    // Performance summary
    if (this.testResults.length > 0) {
      await this.log('\n⚡ Performance Summary:');
      this.testResults.forEach(result => {
        if (result.throughput) {
          this.log(`📈 ${result.testName}: ${result.throughput.toFixed(2)} req/s, ${result.successRate.toFixed(1)}% success rate`);
        }
      });
    }
    
    // Save detailed results
    const reportPath = path.join(this.resultsDir, `newsletter-stress-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify({
      summary: {
        totalSuites,
        passedSuites: totalPassed,
        successRate: (totalPassed / totalSuites) * 100,
        duration: totalDuration
      },
      suiteResults,
      detailedResults: this.testResults,
      performanceMetrics: this.performanceMetrics
    }, null, 2));
    
    await this.log(`\n📄 Detailed report saved to: ${reportPath}`);
    await this.log('\n🔥 NEWSLETTER STRESS TESTING COMPLETE');
    await this.log('='.repeat(60));
  }
}

module.exports = NewsletterStressTester;

// Run if called directly
if (require.main === module) {
  (async () => {
    const stressTester = new NewsletterStressTester();
    
    try {
      await stressTester.setup();
      await stressTester.runAllStressTests();
    } catch (error) {
      console.error('Stress testing failed:', error);
      process.exit(1);
    } finally {
      await stressTester.teardown();
    }
  })();
}