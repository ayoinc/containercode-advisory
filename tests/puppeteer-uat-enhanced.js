#!/usr/bin/env node
/**
 * Enhanced Puppeteer UAT Testing Suite
 * Comprehensive User Acceptance Testing with aggressive stress testing
 * Integration with existing Playwright tests and newsletter automation
 */

const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');
const fs = require('fs').promises;
const path = require('path');

class PuppeteerUATSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.startTime = performance.now();
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    this.screenshotDir = './screenshots/uat-tests';
    this.performanceMetrics = [];
    this.stressTestResults = [];
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🧪';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async setup() {
    await this.log('🚀 Setting up Enhanced Puppeteer UAT Suite');
    
    // Create screenshot directory
    await fs.mkdir(this.screenshotDir, { recursive: true });
    
    // Launch browser with enhanced options
    this.browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === 'production',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
      slowMo: 50 // Slight delay for better stability
    });

    this.page = await this.browser.newPage();
    
    // Set viewport and user agent
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent('Mozilla/5.0 (compatible; ContainerCode-UAT-Bot/1.0; +https://containercode.co.uk)');
    
    // Enable request interception for performance monitoring
    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      request.continue();
    });

    // Monitor console logs
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.log(`Console Error: ${msg.text()}`, 'error');
      }
    });

    // Monitor failed requests
    this.page.on('requestfailed', (request) => {
      this.log(`Request Failed: ${request.url()}`, 'error');
    });

    await this.log('✅ Puppeteer setup completed', 'success');
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
    await this.log('✅ Puppeteer teardown completed', 'success');
  }

  async captureScreenshot(testName, suffix = '') {
    const filename = `${testName}${suffix ? `-${suffix}` : ''}-${Date.now()}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    return filepath;
  }

  async recordTest(testName, passed, duration, details = {}) {
    this.testResults.push({
      testName,
      passed,
      duration,
      details,
      timestamp: new Date().toISOString()
    });
  }

  async measurePerformance(testName, operation) {
    const startTime = performance.now();
    
    // Enable performance monitoring
    await this.page.tracing.start({ screenshots: true, path: `./performance/${testName}-trace.json` });
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      await this.page.tracing.stop();
      
      // Get performance metrics
      const metrics = await this.page.metrics();
      const timing = JSON.parse(await this.page.evaluate(() => JSON.stringify(performance.timing)));
      
      this.performanceMetrics.push({
        testName,
        duration,
        metrics,
        timing,
        timestamp: new Date().toISOString()
      });
      
      return { result, duration, metrics };
    } catch (error) {
      await this.page.tracing.stop();
      throw error;
    }
  }

  // COMPREHENSIVE UAT TESTS

  async testHomepageUAT() {
    await this.log('🧪 Testing Homepage UAT Requirements');
    const testStart = performance.now();
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      
      // Test 1: Value Proposition Visibility
      await this.page.waitForSelector('h1', { timeout: 5000 });
      const mainHeading = await this.page.$eval('h1', el => el.textContent);
      const hasValueProp = mainHeading.includes('Transforming') || mainHeading.includes('Cloud');
      
      // Test 2: Service Offering Visibility
      const services = await this.page.$$eval('[data-testid="service-card"], .service-card, h3', 
        elements => elements.map(el => el.textContent).filter(text => 
          text.includes('Multi-Cloud') || 
          text.includes('Cybersecurity') || 
          text.includes('DevOps')
        )
      );
      
      // Test 3: Contact Information Accessibility
      const contactElements = await this.page.$$eval('a[href*="mailto"], a[href*="tel"]', 
        elements => elements.map(el => ({ href: el.href, text: el.textContent }))
      );
      
      // Test 4: Trust Indicators
      const trustIndicators = await this.page.$$eval('*', elements => 
        elements.map(el => el.textContent).filter(text => 
          text.includes('ISO 27001') || 
          text.includes('AWS Partner') || 
          text.includes('Success')
        )
      );
      
      // Test 5: CTA Buttons
      const ctaButtons = await this.page.$$eval('[data-testid="cta-button"], .cta-button, a[href*="contact"]', 
        elements => elements.length
      );
      
      await this.captureScreenshot('homepage-uat');
      
      const duration = performance.now() - testStart;
      const passed = hasValueProp && services.length >= 3 && contactElements.length >= 2 && ctaButtons >= 1;
      
      await this.recordTest('Homepage UAT', passed, duration, {
        valueProposition: hasValueProp,
        servicesFound: services.length,
        contactElements: contactElements.length,
        trustIndicators: trustIndicators.length,
        ctaButtons
      });
      
      await this.log(`✅ Homepage UAT: ${passed ? 'PASSED' : 'FAILED'} (${duration.toFixed(2)}ms)`, 
        passed ? 'success' : 'error');
      
      return passed;
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.recordTest('Homepage UAT', false, duration, { error: error.message });
      await this.log(`❌ Homepage UAT failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testNewsletterFlowUAT() {
    await this.log('🧪 Testing Newsletter Flow UAT');
    const testStart = performance.now();
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      
      // Find newsletter subscription form
      await this.page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Test different email formats
      const testEmails = [
        'test@example.com',
        'user+test@company.co.uk',
        'newsletter@containercode.test'
      ];
      
      let subscriptionSuccesses = 0;
      
      for (const email of testEmails) {
        try {
          // Find newsletter input (might be multiple on page)
          const emailInputs = await this.page.$$('input[type="email"]');
          const newsletterInput = emailInputs.find(async (input) => {
            const placeholder = await input.evaluate(el => el.placeholder);
            return placeholder?.toLowerCase().includes('newsletter') || 
                   placeholder?.toLowerCase().includes('subscribe');
          }) || emailInputs[emailInputs.length - 1]; // Use last email input as fallback
          
          if (newsletterInput) {
            await newsletterInput.click({ clickCount: 3 }); // Select all
            await newsletterInput.type(email);
            
            // Find subscribe button
            const subscribeButton = await this.page.$('[data-testid="subscribe-button"], button[type="submit"]');
            if (subscribeButton) {
              await subscribeButton.click();
              
              // Wait for response
              await this.page.waitForTimeout(2000);
              
              // Check for success indicators
              const successIndicators = await this.page.$$eval('*', elements => 
                elements.map(el => el.textContent).filter(text => 
                  text.includes('subscribed') || 
                  text.includes('success') || 
                  text.includes('thank you')
                )
              );
              
              if (successIndicators.length > 0) {
                subscriptionSuccesses++;
                await this.log(`✅ Newsletter subscription successful for ${email}`, 'success');
              }
            }
          }
        } catch (emailError) {
          await this.log(`⚠️ Newsletter subscription failed for ${email}: ${emailError.message}`, 'warning');
        }
      }
      
      await this.captureScreenshot('newsletter-flow-uat');
      
      const duration = performance.now() - testStart;
      const passed = subscriptionSuccesses >= 1;
      
      await this.recordTest('Newsletter Flow UAT', passed, duration, {
        totalEmails: testEmails.length,
        successfulSubscriptions: subscriptionSuccesses,
        successRate: (subscriptionSuccesses / testEmails.length) * 100
      });
      
      await this.log(`✅ Newsletter Flow UAT: ${passed ? 'PASSED' : 'FAILED'} (${subscriptionSuccesses}/${testEmails.length} successful)`, 
        passed ? 'success' : 'error');
      
      return passed;
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.recordTest('Newsletter Flow UAT', false, duration, { error: error.message });
      await this.log(`❌ Newsletter Flow UAT failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testContactFormUAT() {
    await this.log('🧪 Testing Contact Form UAT');
    const testStart = performance.now();
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      
      // Scroll to contact form
      await this.page.evaluate(() => {
        const contactSection = document.querySelector('[data-testid="contact-section"]') || 
                             document.querySelector('#contact') ||
                             document.querySelector('form');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      
      await this.page.waitForTimeout(1000);
      
      // Fill contact form
      const formData = {
        name: 'UAT Test User',
        email: 'uat-test@containercode.test',
        message: 'This is a comprehensive UAT test of the contact form functionality. Testing multi-line message content and special characters: £$€@#%'
      };
      
      // Find form fields
      const nameInput = await this.page.$('input[name="name"], input[placeholder*="name" i]');
      const emailInput = await this.page.$('input[name="email"], input[type="email"]');
      const messageInput = await this.page.$('textarea[name="message"], textarea[placeholder*="message" i]');
      const submitButton = await this.page.$('button[type="submit"], input[type="submit"]');
      
      if (nameInput && emailInput && messageInput && submitButton) {
        await nameInput.type(formData.name);
        await emailInput.type(formData.email);
        await messageInput.type(formData.message);
        
        await this.captureScreenshot('contact-form-filled');
        
        // Submit form
        await submitButton.click();
        
        // Wait for response
        await this.page.waitForTimeout(3000);
        
        // Check for success indicators
        const successIndicators = await this.page.$$eval('*', elements => 
          elements.map(el => el.textContent).filter(text => 
            text.includes('sent') || 
            text.includes('received') || 
            text.includes('thank you') ||
            text.includes('success')
          )
        );
        
        await this.captureScreenshot('contact-form-result');
        
        const duration = performance.now() - testStart;
        const passed = successIndicators.length > 0;
        
        await this.recordTest('Contact Form UAT', passed, duration, {
          formData,
          successIndicators: successIndicators.length,
          fieldsFound: { nameInput: !!nameInput, emailInput: !!emailInput, messageInput: !!messageInput, submitButton: !!submitButton }
        });
        
        await this.log(`✅ Contact Form UAT: ${passed ? 'PASSED' : 'FAILED'}`, 
          passed ? 'success' : 'error');
        
        return passed;
      } else {
        throw new Error('Contact form elements not found');
      }
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.recordTest('Contact Form UAT', false, duration, { error: error.message });
      await this.log(`❌ Contact Form UAT failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testServiceNavigationUAT() {
    await this.log('🧪 Testing Service Navigation UAT');
    const testStart = performance.now();
    
    try {
      await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
      
      const services = [
        'Multi-Cloud Technologies',
        'Cybersecurity Excellence',
        'DevOps & DevSecOps',
        'Digital Transformation',
        'Software Engineering',
        'Managed IT Support'
      ];
      
      let navigationSuccesses = 0;
      
      for (const service of services) {
        try {
          await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
          
          // Find service section
          const serviceLink = await this.page.$x(`//a[contains(text(), "${service}")]`);
          if (serviceLink.length > 0) {
            await serviceLink[0].click();
            await this.page.waitForTimeout(2000);
            
            // Check if navigation was successful
            const currentUrl = this.page.url();
            const pageTitle = await this.page.title();
            
            if (currentUrl !== this.baseUrl || pageTitle.includes(service)) {
              navigationSuccesses++;
              await this.log(`✅ Service navigation successful: ${service}`, 'success');
            }
          }
        } catch (serviceError) {
          await this.log(`⚠️ Service navigation failed for ${service}: ${serviceError.message}`, 'warning');
        }
      }
      
      await this.captureScreenshot('service-navigation-uat');
      
      const duration = performance.now() - testStart;
      const passed = navigationSuccesses >= services.length * 0.8; // 80% success rate
      
      await this.recordTest('Service Navigation UAT', passed, duration, {
        totalServices: services.length,
        successfulNavigations: navigationSuccesses,
        successRate: (navigationSuccesses / services.length) * 100
      });
      
      await this.log(`✅ Service Navigation UAT: ${passed ? 'PASSED' : 'FAILED'} (${navigationSuccesses}/${services.length})`, 
        passed ? 'success' : 'error');
      
      return passed;
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.recordTest('Service Navigation UAT', false, duration, { error: error.message });
      await this.log(`❌ Service Navigation UAT failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testMobileResponsivenessUAT() {
    await this.log('🧪 Testing Mobile Responsiveness UAT');
    const testStart = performance.now();
    
    try {
      const viewports = [
        { width: 375, height: 667, name: 'iPhone SE' },
        { width: 414, height: 896, name: 'iPhone 11' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1024, height: 768, name: 'iPad Landscape' }
      ];
      
      let responsiveSuccesses = 0;
      
      for (const viewport of viewports) {
        try {
          await this.page.setViewport(viewport);
          await this.page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
          
          // Check key elements visibility
          const keyElements = await this.page.$$eval('h1, nav, form, footer', elements => 
            elements.map(el => ({
              tag: el.tagName,
              visible: el.offsetWidth > 0 && el.offsetHeight > 0,
              text: el.textContent?.substring(0, 50)
            }))
          );
          
          const visibleElements = keyElements.filter(el => el.visible);
          
          if (visibleElements.length >= 3) {
            responsiveSuccesses++;
            await this.log(`✅ Mobile responsiveness successful: ${viewport.name}`, 'success');
          }
          
          await this.captureScreenshot(`mobile-responsive-${viewport.name}`);
        } catch (viewportError) {
          await this.log(`⚠️ Mobile responsiveness failed for ${viewport.name}: ${viewportError.message}`, 'warning');
        }
      }
      
      // Reset viewport
      await this.page.setViewport({ width: 1920, height: 1080 });
      
      const duration = performance.now() - testStart;
      const passed = responsiveSuccesses >= viewports.length * 0.75; // 75% success rate
      
      await this.recordTest('Mobile Responsiveness UAT', passed, duration, {
        totalViewports: viewports.length,
        successfulViewports: responsiveSuccesses,
        successRate: (responsiveSuccesses / viewports.length) * 100
      });
      
      await this.log(`✅ Mobile Responsiveness UAT: ${passed ? 'PASSED' : 'FAILED'} (${responsiveSuccesses}/${viewports.length})`, 
        passed ? 'success' : 'error');
      
      return passed;
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.recordTest('Mobile Responsiveness UAT', false, duration, { error: error.message });
      await this.log(`❌ Mobile Responsiveness UAT failed: ${error.message}`, 'error');
      return false;
    }
  }

  // AGGRESSIVE STRESS TESTING

  async stressTestNewsletterSignup() {
    await this.log('🔥 Starting Aggressive Newsletter Signup Stress Test');
    const testStart = performance.now();
    
    try {
      const concurrentRequests = 20;
      const testEmails = Array.from({ length: concurrentRequests }, (_, i) => 
        `stress-test-${i}-${Date.now()}@containercode.test`
      );
      
      const promises = testEmails.map(async (email, index) => {
        try {
          const page = await this.browser.newPage();
          await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
          
          // Find newsletter input
          const emailInput = await page.$('input[type="email"]');
          if (emailInput) {
            await emailInput.type(email);
            const subscribeButton = await page.$('button[type="submit"]');
            if (subscribeButton) {
              await subscribeButton.click();
              await page.waitForTimeout(1000);
            }
          }
          
          await page.close();
          return { email, success: true, index };
        } catch (error) {
          return { email, success: false, error: error.message, index };
        }
      });
      
      const results = await Promise.allSettled(promises);
      const successfulRequests = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      
      const duration = performance.now() - testStart;
      const passed = successfulRequests >= concurrentRequests * 0.8; // 80% success rate
      
      this.stressTestResults.push({
        testName: 'Newsletter Signup Stress Test',
        concurrentRequests,
        successfulRequests,
        successRate: (successfulRequests / concurrentRequests) * 100,
        duration,
        passed
      });
      
      await this.log(`🔥 Newsletter Stress Test: ${passed ? 'PASSED' : 'FAILED'} (${successfulRequests}/${concurrentRequests})`, 
        passed ? 'success' : 'error');
      
      return passed;
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.log(`❌ Newsletter Stress Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async stressTestPageLoad() {
    await this.log('🔥 Starting Page Load Stress Test');
    const testStart = performance.now();
    
    try {
      const concurrentLoads = 15;
      const pages = [];
      
      // Create multiple pages
      for (let i = 0; i < concurrentLoads; i++) {
        pages.push(await this.browser.newPage());
      }
      
      const loadPromises = pages.map(async (page, index) => {
        try {
          const loadStart = performance.now();
          await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
          const loadTime = performance.now() - loadStart;
          
          return { index, success: true, loadTime };
        } catch (error) {
          return { index, success: false, error: error.message };
        }
      });
      
      const results = await Promise.allSettled(loadPromises);
      const successfulLoads = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const averageLoadTime = results
        .filter(r => r.status === 'fulfilled' && r.value.success)
        .reduce((sum, r) => sum + r.value.loadTime, 0) / successfulLoads;
      
      // Close all pages
      await Promise.all(pages.map(page => page.close()));
      
      const duration = performance.now() - testStart;
      const passed = successfulLoads >= concurrentLoads * 0.9 && averageLoadTime < 5000; // 90% success rate, <5s avg
      
      this.stressTestResults.push({
        testName: 'Page Load Stress Test',
        concurrentLoads,
        successfulLoads,
        successRate: (successfulLoads / concurrentLoads) * 100,
        averageLoadTime,
        duration,
        passed
      });
      
      await this.log(`🔥 Page Load Stress Test: ${passed ? 'PASSED' : 'FAILED'} (${successfulLoads}/${concurrentLoads}, avg: ${averageLoadTime.toFixed(2)}ms)`, 
        passed ? 'success' : 'error');
      
      return passed;
    } catch (error) {
      const duration = performance.now() - testStart;
      await this.log(`❌ Page Load Stress Test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // MAIN TEST RUNNER

  async runComprehensiveUAT() {
    await this.log('🚀 Starting Comprehensive Puppeteer UAT Suite');
    
    const testSuites = [
      { name: 'Homepage UAT', test: () => this.testHomepageUAT() },
      { name: 'Newsletter Flow UAT', test: () => this.testNewsletterFlowUAT() },
      { name: 'Contact Form UAT', test: () => this.testContactFormUAT() },
      { name: 'Service Navigation UAT', test: () => this.testServiceNavigationUAT() },
      { name: 'Mobile Responsiveness UAT', test: () => this.testMobileResponsivenessUAT() },
      { name: 'Newsletter Signup Stress Test', test: () => this.stressTestNewsletterSignup() },
      { name: 'Page Load Stress Test', test: () => this.stressTestPageLoad() }
    ];
    
    let totalPassed = 0;
    const suiteResults = [];
    
    for (const suite of testSuites) {
      await this.log(`\n📋 Running ${suite.name}`);
      const suitePassed = await suite.test();
      suiteResults.push({ name: suite.name, passed: suitePassed });
      if (suitePassed) totalPassed++;
    }
    
    await this.generateComprehensiveReport(suiteResults, totalPassed, testSuites.length);
    
    return {
      totalSuites: testSuites.length,
      passedSuites: totalPassed,
      successRate: (totalPassed / testSuites.length) * 100,
      testResults: this.testResults,
      stressTestResults: this.stressTestResults,
      performanceMetrics: this.performanceMetrics
    };
  }

  async generateComprehensiveReport(suiteResults, totalPassed, totalSuites) {
    const totalDuration = performance.now() - this.startTime;
    const passedTests = this.testResults.filter(test => test.passed).length;
    const failedTests = this.testResults.filter(test => !test.passed).length;
    
    await this.log('\n📊 COMPREHENSIVE UAT REPORT');
    await this.log('='.repeat(60));
    await this.log(`Total Test Suites: ${totalSuites}`);
    await this.log(`Passed Suites: ${totalPassed}`);
    await this.log(`Failed Suites: ${totalSuites - totalPassed}`);
    await this.log(`Suite Success Rate: ${((totalPassed / totalSuites) * 100).toFixed(1)}%`);
    await this.log('');
    await this.log(`Individual Tests: ${this.testResults.length}`);
    await this.log(`Passed Tests: ${passedTests}`);
    await this.log(`Failed Tests: ${failedTests}`);
    await this.log(`Test Success Rate: ${((passedTests / this.testResults.length) * 100).toFixed(1)}%`);
    await this.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    await this.log('='.repeat(60));
    
    // Suite results
    await this.log('\n📋 Suite Results:');
    suiteResults.forEach(suite => {
      const status = suite.passed ? '✅' : '❌';
      this.log(`${status} ${suite.name}`);
    });
    
    // Stress test results
    if (this.stressTestResults.length > 0) {
      await this.log('\n🔥 Stress Test Results:');
      this.stressTestResults.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        this.log(`${status} ${test.testName}: ${test.successRate.toFixed(1)}% (${test.successfulRequests || test.successfulLoads}/${test.concurrentRequests || test.concurrentLoads})`);
      });
    }
    
    // Performance metrics
    if (this.performanceMetrics.length > 0) {
      await this.log('\n⚡ Performance Metrics:');
      this.performanceMetrics.forEach(metric => {
        this.log(`📈 ${metric.testName}: ${metric.duration.toFixed(2)}ms`);
      });
    }
    
    // Failed tests
    const failedTestsList = this.testResults.filter(test => !test.passed);
    if (failedTestsList.length > 0) {
      await this.log('\n❌ Failed Tests:');
      failedTestsList.forEach(test => {
        this.log(`  • ${test.testName}: ${test.details?.error || 'Unknown error'}`);
      });
    }
    
    await this.log('\n📋 UAT TESTING COMPLETE');
    await this.log('='.repeat(60));
  }
}

module.exports = PuppeteerUATSuite;

// Run if called directly
if (require.main === module) {
  (async () => {
    const uatSuite = new PuppeteerUATSuite();
    
    try {
      await uatSuite.setup();
      await uatSuite.runComprehensiveUAT();
    } catch (error) {
      console.error('UAT Suite failed:', error);
      process.exit(1);
    } finally {
      await uatSuite.teardown();
    }
  })();
}