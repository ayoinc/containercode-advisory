# Testing Procedures and Best Practices

## Overview

This document outlines comprehensive testing procedures and best practices for the ContainerCode newsletter automation system. It covers all testing levels from unit tests to end-to-end testing, including specialized testing for AI integration and queue-based processing.

## Testing Strategy

### Testing Pyramid

```
       /\     E2E Tests (10%)
      /  \    - Puppeteer UAT
     /    \   - Full workflow tests
    /      \  - Cross-browser testing
   /________\ 
  /          \ Integration Tests (20%)
 /            \ - API integration
/              \ - Database integration
________________ - Third-party services
                 
                 Unit Tests (70%)
                 - Pure functions
                 - Component logic
                 - Utility functions
```

### Testing Environments

1. **Development**: Local development environment
2. **Testing**: Isolated testing environment with test data
3. **Staging**: Production-like environment for final validation
4. **Production**: Live environment with monitoring

## Test Categories

### 1. Unit Tests

#### Location
- `tests/unit/`
- Co-located with source files (e.g., `utils.test.js`)

#### Framework
- **Jest** for JavaScript/Node.js
- **React Testing Library** for React components

#### Coverage Requirements
- **Minimum**: 80% code coverage
- **Target**: 90% code coverage
- **Critical paths**: 100% coverage

#### Best Practices

```javascript
// Example unit test structure
describe('SubscriberSegmentation', () => {
  let segmentation;
  
  beforeEach(() => {
    segmentation = new SubscriberSegmentation(mockEnv);
  });
  
  describe('calculateEngagementScore', () => {
    it('should calculate correct engagement score for active subscriber', () => {
      const subscriber = {
        emailsSent: 10,
        emailOpens: 8,
        emailClicks: 3,
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        behaviorData: {
          websiteVisits: 5,
          pageViews: 20,
          downloadedResources: ['whitepaper1', 'guide1']
        }
      };
      
      const score = segmentation.calculateEngagementScore(subscriber);
      
      expect(score).toBeGreaterThan(70);
      expect(score).toBeLessThanOrEqual(100);
    });
    
    it('should handle missing data gracefully', () => {
      const subscriber = {
        emailsSent: 0,
        emailOpens: 0,
        emailClicks: 0
      };
      
      const score = segmentation.calculateEngagementScore(subscriber);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
```

### 2. Integration Tests

#### Location
- `tests/integration/`

#### Types
- **API Integration**: Test API endpoints with real dependencies
- **Database Integration**: Test database operations
- **Third-party Services**: Test external API integrations
- **Queue Integration**: Test message queue processing

#### Example Integration Test

```javascript
// tests/integration/newsletter-api.test.js
describe('Newsletter API Integration', () => {
  let testServer;
  let testDb;
  
  beforeAll(async () => {
    testServer = await startTestServer();
    testDb = await setupTestDatabase();
  });
  
  afterAll(async () => {
    await cleanupTestDatabase();
    await testServer.close();
  });
  
  describe('POST /api/newsletter-subscribe', () => {
    it('should create subscriber and send confirmation email', async () => {
      const subscriberData = {
        email: 'test@example.com',
        name: 'Test User',
        preferences: {
          topics: ['AI', 'cloud'],
          frequency: 'weekly'
        }
      };
      
      const response = await request(testServer)
        .post('/api/newsletter-subscribe')
        .send(subscriberData)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.subscriberId).toBeDefined();
      
      // Verify database record
      const subscriber = await testDb.getSubscriber(response.body.subscriberId);
      expect(subscriber.email).toBe(subscriberData.email);
      
      // Verify email was queued
      const emailQueue = await testDb.getQueueMessages('email');
      expect(emailQueue).toHaveLength(1);
      expect(emailQueue[0].type).toBe('confirmation');
    });
  });
});
```

### 3. End-to-End Tests

#### Location
- `tests/e2e/`
- `tests/puppeteer-uat-enhanced.js`

#### Framework
- **Puppeteer** for browser automation
- **Playwright** for cross-browser testing

#### Test Scenarios

```javascript
// tests/e2e/newsletter-flow.test.js
describe('Complete Newsletter Flow', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI === 'true',
      slowMo: 50
    });
  });
  
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://test.containercode.club');
  });
  
  afterEach(async () => {
    await page.close();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  it('should complete full newsletter subscription flow', async () => {
    // Step 1: Navigate to newsletter signup
    await page.click('[data-testid="newsletter-signup-button"]');
    
    // Step 2: Fill form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.selectOption('[data-testid="frequency-select"]', 'weekly');
    
    // Step 3: Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Step 4: Verify success message
    await page.waitForSelector('[data-testid="success-message"]');
    const successText = await page.textContent('[data-testid="success-message"]');
    expect(successText).toContain('Successfully subscribed');
    
    // Step 5: Verify confirmation email is sent
    const emailSent = await waitForEmailInQueue('confirmation', 'test@example.com');
    expect(emailSent).toBe(true);
  });
});
```

### 4. Performance Tests

#### Location
- `tests/performance/`
- `tests/stress-testing-newsletter.js`

#### Types
- **Load Testing**: Normal expected load
- **Stress Testing**: Beyond normal capacity
- **Spike Testing**: Sudden load increases
- **Volume Testing**: Large amounts of data

#### Example Performance Test

```javascript
// tests/performance/newsletter-load.test.js
describe('Newsletter Performance Tests', () => {
  it('should handle 1000 concurrent subscriptions', async () => {
    const concurrentSubscriptions = 1000;
    const subscriptionPromises = [];
    
    const startTime = Date.now();
    
    for (let i = 0; i < concurrentSubscriptions; i++) {
      const promise = subscribeToNewsletter({
        email: `test${i}@example.com`,
        name: `Test User ${i}`
      });
      subscriptionPromises.push(promise);
    }
    
    const results = await Promise.allSettled(subscriptionPromises);
    const endTime = Date.now();
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    expect(successful).toBeGreaterThan(950); // 95% success rate
    expect(endTime - startTime).toBeLessThan(30000); // Under 30 seconds
    
    console.log({
      totalRequests: concurrentSubscriptions,
      successful,
      failed,
      duration: endTime - startTime,
      successRate: successful / concurrentSubscriptions
    });
  });
});
```

### 5. API Tests

#### Location
- `tests/api/`
- `tests/api-smoke-testing.js`

#### Test Categories
- **Smoke Tests**: Basic API functionality
- **Contract Tests**: API contract compliance
- **Security Tests**: Authentication and authorization
- **Error Handling**: Error scenarios

#### Example API Test

```javascript
// tests/api/newsletter-api.test.js
describe('Newsletter API Tests', () => {
  describe('Authentication', () => {
    it('should require authentication for protected endpoints', async () => {
      const response = await request(app)
        .post('/api/send-newsletter')
        .send({ campaignId: 'test' })
        .expect(401);
      
      expect(response.body.error.code).toBe('AUTHENTICATION_REQUIRED');
    });
    
    it('should accept valid API key', async () => {
      const response = await request(app)
        .get('/api/subscribers/segments')
        .set('Authorization', `Bearer ${validApiKey}`)
        .expect(200);
      
      expect(response.body.segments).toBeDefined();
    });
  });
  
  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = [];
      
      // Send 110 requests (over the 100/minute limit)
      for (let i = 0; i < 110; i++) {
        requests.push(
          request(app)
            .get('/api/subscribers/segments')
            .set('Authorization', `Bearer ${validApiKey}`)
        );
      }
      
      const responses = await Promise.allSettled(requests);
      const rateLimited = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 429
      ).length;
      
      expect(rateLimited).toBeGreaterThan(0);
    });
  });
});
```

### 6. AI Integration Tests

#### Location
- `tests/ai/`

#### Special Considerations
- **Timeout Handling**: AI requests can take several minutes
- **Error Handling**: External AI services may fail
- **Content Quality**: Validate generated content
- **Rate Limiting**: Respect AI service limits

#### Example AI Test

```javascript
// tests/ai/deepseek-integration.test.js
describe('DeepSeek Integration Tests', () => {
  jest.setTimeout(300000); // 5 minutes for AI processing
  
  it('should generate article with DeepSeek', async () => {
    const request = {
      topic: 'AI in Enterprise Cloud Computing',
      targetAudience: 'enterprise',
      wordCount: 1000
    };
    
    const jobId = await startArticleGeneration(request);
    
    // Wait for completion with timeout
    const result = await waitForJobCompletion(jobId, 300000);
    
    expect(result.status).toBe('completed');
    expect(result.result.title).toBeDefined();
    expect(result.result.content).toBeDefined();
    expect(result.result.content.length).toBeGreaterThan(500);
    
    // Validate content quality
    expect(result.result.content).toMatch(/enterprise/i);
    expect(result.result.content).toMatch(/cloud/i);
    expect(result.result.content).toMatch(/AI|artificial intelligence/i);
    
    // Validate British English
    expect(result.result.content).toMatch(/colour|favour|realise/i);
  });
  
  it('should handle DeepSeek API errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(fetch, 'fetch').mockRejectedValue(new Error('API Error'));
    
    const request = {
      topic: 'Test Topic',
      targetAudience: 'enterprise',
      wordCount: 500
    };
    
    const jobId = await startArticleGeneration(request);
    const result = await waitForJobCompletion(jobId, 60000);
    
    expect(result.status).toBe('failed');
    expect(result.error).toMatch(/API Error/);
  });
});
```

### 7. Queue Processing Tests

#### Location
- `tests/queue/`

#### Test Scenarios
- **Message Processing**: Verify correct message handling
- **Error Handling**: Dead letter queue processing
- **Retry Logic**: Failed message retries
- **Concurrency**: Multiple workers processing

#### Example Queue Test

```javascript
// tests/queue/article-queue.test.js
describe('Article Queue Processing', () => {
  let mockQueue;
  let processor;
  
  beforeEach(() => {
    mockQueue = new MockQueue();
    processor = new QueueProcessor(mockEnv);
  });
  
  it('should process article generation message', async () => {
    const message = {
      type: 'article_generation',
      payload: {
        topic: 'Test Topic',
        targetAudience: 'enterprise'
      }
    };
    
    await mockQueue.send(message);
    
    const result = await processor.handleMessage({
      messages: [{ body: message }],
      queue: 'article-processing'
    });
    
    expect(result[0].success).toBe(true);
    expect(result[0].jobId).toBeDefined();
  });
  
  it('should handle processing errors', async () => {
    const invalidMessage = {
      type: 'invalid_type',
      payload: {}
    };
    
    await mockQueue.send(invalidMessage);
    
    const result = await processor.handleMessage({
      messages: [{ body: invalidMessage }],
      queue: 'article-processing'
    });
    
    expect(result[0].success).toBe(false);
    expect(result[0].error).toBeDefined();
  });
});
```

## Test Data Management

### Test Data Strategy

1. **Fixtures**: Static test data files
2. **Factories**: Dynamic test data generation
3. **Mocks**: Simulated external services
4. **Snapshots**: Expected output comparisons

### Example Test Data Factory

```javascript
// tests/factories/subscriber-factory.js
class SubscriberFactory {
  static create(overrides = {}) {
    return {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: `test${Math.random().toString(36).substr(2, 5)}@example.com`,
      name: 'Test User',
      company: 'Test Company',
      industry: 'Technology',
      jobTitle: 'Developer',
      signupDate: new Date(),
      emailOpens: 5,
      emailClicks: 2,
      emailsSent: 10,
      preferences: {
        topics: ['AI', 'cloud'],
        frequency: 'weekly',
        contentType: 'technical'
      },
      behaviorData: {
        websiteVisits: 3,
        pageViews: 15,
        downloadedResources: ['guide1'],
        webinarAttendance: 1,
        eventAttendance: 0
      },
      engagementScore: 75,
      segment: 'technical-professionals',
      tags: ['active', 'technical'],
      ...overrides
    };
  }
  
  static createBatch(count, overrides = {}) {
    return Array.from({ length: count }, (_, i) => 
      this.create({ ...overrides, email: `test${i}@example.com` })
    );
  }
}
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
          
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
        env:
          CI: true
          
  performance-tests:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:performance
```

## Test Commands

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit --coverage",
    "test:integration": "jest tests/integration --runInBand",
    "test:e2e": "jest tests/e2e --runInBand --detectOpenHandles",
    "test:api": "jest tests/api --runInBand",
    "test:performance": "jest tests/performance --runInBand",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --coverageReporters=text-lcov | coveralls",
    "test:smoke": "node tests/api-smoke-testing.js",
    "test:stress": "node tests/stress-testing-newsletter.js",
    "test:uat": "node tests/puppeteer-uat-enhanced.js",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

## Test Environment Setup

### Local Development

```bash
# Install dependencies
npm install

# Setup test database
npm run db:setup:test

# Run all tests
npm run test:all

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Docker Setup

```dockerfile
# Dockerfile.test
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "test:all"]
```

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  test-runner:
    build:
      context: .
      dockerfile: Dockerfile.test
    depends_on:
      - test-db
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgres://test:test@test-db:5432/test
    volumes:
      - ./coverage:/app/coverage
      
  test-db:
    image: postgres:13
    environment:
      POSTGRES_DB: test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"
```

## Test Monitoring and Reporting

### Coverage Reports

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'workers/**/*.js',
    '!src/**/*.d.ts',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/lib/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
```

### Test Result Notifications

```javascript
// tests/utils/notifications.js
class TestNotifications {
  static async sendSlackNotification(results) {
    if (!process.env.SLACK_WEBHOOK_URL) return;
    
    const message = {
      text: `Test Suite Results`,
      attachments: [
        {
          color: results.success ? 'good' : 'danger',
          fields: [
            { title: 'Status', value: results.success ? 'PASSED' : 'FAILED', short: true },
            { title: 'Tests', value: `${results.passed}/${results.total}`, short: true },
            { title: 'Coverage', value: `${results.coverage}%`, short: true },
            { title: 'Duration', value: `${results.duration}ms`, short: true }
          ]
        }
      ]
    };
    
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }
}
```

## Best Practices

### 1. Test Organization

- **Descriptive Names**: Use clear, descriptive test names
- **Logical Grouping**: Group related tests using `describe` blocks
- **Test Isolation**: Each test should be independent
- **Setup and Teardown**: Use `beforeEach`/`afterEach` for test setup

### 2. Test Data

- **Factories over Fixtures**: Use factories for dynamic test data
- **Minimal Data**: Create only necessary test data
- **Cleanup**: Clean up test data after each test
- **Realistic Data**: Use realistic test data for better validation

### 3. Assertions

- **Single Assertion**: One assertion per test when possible
- **Specific Assertions**: Use specific matchers over generic ones
- **Error Messages**: Provide meaningful error messages
- **Edge Cases**: Test boundary conditions and edge cases

### 4. Mocking

- **Mock External Dependencies**: Mock external APIs and services
- **Verify Interactions**: Test that mocks are called correctly
- **Reset Mocks**: Clear mocks between tests
- **Minimal Mocking**: Mock only what's necessary

### 5. Performance

- **Fast Tests**: Keep tests fast and focused
- **Parallel Execution**: Run tests in parallel when possible
- **Database Transactions**: Use transactions for database tests
- **Resource Cleanup**: Clean up resources to prevent memory leaks

## Debugging Tests

### Common Issues

1. **Async/Await Issues**: Ensure proper async handling
2. **Test Isolation**: Tests affecting each other
3. **Mock Issues**: Mocks not being reset or configured correctly
4. **Timeout Issues**: Long-running tests timing out
5. **Environment Issues**: Test environment not properly configured

### Debugging Tips

```javascript
// Debug specific test
npm run test -- --testNamePattern="should calculate engagement score"

// Debug with console output
npm run test -- --verbose

// Debug with node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

// Debug in VS Code
// Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Test Maintenance

### Regular Tasks

1. **Update Test Data**: Keep test data current and relevant
2. **Review Coverage**: Ensure coverage meets requirements
3. **Performance Review**: Monitor test execution times
4. **Dependency Updates**: Update testing dependencies
5. **Test Cleanup**: Remove obsolete tests

### Monthly Reviews

- Review test execution times and optimize slow tests
- Analyze flaky tests and fix underlying issues
- Update test documentation and procedures
- Review and update CI/CD pipeline
- Assess test coverage and identify gaps

### Quarterly Assessments

- Comprehensive review of testing strategy
- Performance benchmark comparisons
- Tool and framework evaluation
- Team training and knowledge sharing
- Process improvement initiatives

## Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Puppeteer Documentation](https://pptr.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)

### Tools

- **Test Runners**: Jest, Mocha, Jasmine
- **Browser Automation**: Puppeteer, Playwright, Selenium
- **API Testing**: Supertest, Newman, Postman
- **Performance Testing**: Artillery, K6, JMeter
- **Coverage**: Istanbul, NYC, C8

### Best Practice Guides

- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Jest Best Practices](https://jestjs.io/docs/jest-best-practices)
- [API Testing Best Practices](https://assertible.com/blog/api-testing-best-practices)

---

*Last updated: January 15, 2024*
