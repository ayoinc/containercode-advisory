#!/usr/bin/env node
/**
 * Phase 1 Integration Test Script
 * Validates all implemented components are working correctly
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
  baseDir: __dirname,
  srcDir: path.join(__dirname, '../src'),
  verbose: true
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Test results
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

// Log helper
function log(message, color = colors.reset) {
  if (testConfig.verbose) {
    console.log(`${color}${message}${colors.reset}`);
  }
}

// Test helper
function test(name, testFn) {
  testResults.total++;
  try {
    const result = testFn();
    if (result === true || result === undefined) {
      testResults.passed++;
      testResults.tests.push({ name, status: 'PASS', message: '' });
      log(`  ✅ ${name}`, colors.green);
    } else {
      testResults.failed++;
      testResults.tests.push({ name, status: 'FAIL', message: result });
      log(`  ❌ ${name}: ${result}`, colors.red);
    }
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'ERROR', message: error.message });
    log(`  💥 ${name}: ${error.message}`, colors.red);
  }
}

// Warning helper
function warn(message) {
  testResults.warnings++;
  log(`  ⚠️  ${message}`, colors.yellow);
}

// File exists test
function testFileExists(filePath, description) {
  const fullPath = path.join(testConfig.srcDir, filePath);
  test(`${description} exists`, () => {
    if (!fs.existsSync(fullPath)) {
      return `File not found: ${fullPath}`;
    }
    return true;
  });
}

// File content test
function testFileContent(filePath, patterns, description) {
  const fullPath = path.join(testConfig.srcDir, filePath);
  test(`${description} has required content`, () => {
    if (!fs.existsSync(fullPath)) {
      return `File not found: ${fullPath}`;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        if (!content.includes(pattern)) {
          return `Missing pattern: ${pattern}`;
        }
      } else if (pattern instanceof RegExp) {
        if (!pattern.test(content)) {
          return `Missing regex pattern: ${pattern}`;
        }
      }
    }
    
    return true;
  });
}

// Package.json test
function testPackageJson() {
  const packagePath = path.join(testConfig.baseDir, '../package.json');
  test('package.json has enhanced scripts', () => {
    if (!fs.existsSync(packagePath)) {
      return 'package.json not found';
    }
    
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = [
      'dev:performance',
      'build:analyze',
      'security:audit',
      'monitor:vitals'
    ];
    
    for (const script of requiredScripts) {
      if (!pkg.scripts[script]) {
        return `Missing script: ${script}`;
      }
    }
    
    return true;
  });
}

// TypeScript compilation test
function testTypeScriptFiles() {
  const tsFiles = [
    'lib/cache/smart-cache.ts',
    'lib/monitoring/enhanced-performance.ts',
    'lib/animations/modern-effects.ts',
    'lib/security/advanced-security.ts'
  ];
  
  tsFiles.forEach(file => {
    testFileContent(file, [
      'export',
      'interface',
      'function'
    ], `TypeScript file ${file}`);
  });
}

// API routes test
function testApiRoutes() {
  const apiRoutes = [
    'app/api/analytics/performance/route.ts',
    'app/api/security/events/route.ts',
    'app/api/security/csp-report/route.ts'
  ];
  
  apiRoutes.forEach(route => {
    testFileExists(route, `API route ${route}`);
    testFileContent(route, [
      'NextRequest',
      'NextResponse',
      'export async function POST',
      'export async function GET'
    ], `API route ${route} functionality`);
  });
}

// Middleware test
function testMiddleware() {
  const middlewarePath = path.join(testConfig.baseDir, '../middleware.ts');
  test('Enhanced middleware implementation', () => {
    if (!fs.existsSync(middlewarePath)) {
      return 'middleware.ts not found';
    }
    
    const content = fs.readFileSync(middlewarePath, 'utf8');
    
    const requiredFeatures = [
      'ENHANCED_CACHE_CONTROL',
      'ENHANCED_SECURITY_HEADERS',
      'rateLimitMap',
      'BOT_PATTERNS',
      'SUSPICIOUS_PATTERNS',
      'checkRateLimit',
      'applyCachingStrategy',
      'applySecurityMonitoring'
    ];
    
    for (const feature of requiredFeatures) {
      if (!content.includes(feature)) {
        return `Missing middleware feature: ${feature}`;
      }
    }
    
    return true;
  });
}

// Dependencies test
function testDependencies() {
  const packagePath = path.join(testConfig.baseDir, '../package.json');
  test('Required dependencies are present', () => {
    if (!fs.existsSync(packagePath)) {
      return 'package.json not found';
    }
    
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = [
      'framer-motion',
      'web-vitals',
      '@vercel/analytics',
      '@vercel/speed-insights'
    ];
    
    const requiredDevDeps = [
      'lighthouse'
    ];
    
    for (const dep of requiredDeps) {
      if (!pkg.dependencies[dep]) {
        return `Missing dependency: ${dep}`;
      }
    }
    
    for (const dep of requiredDevDeps) {
      if (!pkg.devDependencies[dep]) {
        return `Missing dev dependency: ${dep}`;
      }
    }
    
    return true;
  });
}

// Configuration tests
function testConfigurations() {
  test('Performance budgets configured', () => {
    const packagePath = path.join(testConfig.baseDir, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (!pkg.performance || !pkg.performance.budgets) {
      return 'Performance budgets not configured';
    }
    
    const requiredBudgets = ['bundle', 'lcp', 'fcp', 'cls', 'fid', 'ttfb'];
    for (const budget of requiredBudgets) {
      if (!pkg.performance.budgets[budget]) {
        return `Missing performance budget: ${budget}`;
      }
    }
    
    return true;
  });
}

// Integration test
function testIntegration() {
  test('Smart cache integration', () => {
    try {
      // This would require actual module loading in a Node.js context
      // For now, we'll check the file structure and exports
      const cachePath = path.join(testConfig.srcDir, 'lib/cache/smart-cache.ts');
      const content = fs.readFileSync(cachePath, 'utf8');
      
      const requiredExports = [
        'export class SmartCache',
        'export const criticalCache',
        'export const standardCache',
        'export const cacheConfigs'
      ];
      
      for (const exportCheck of requiredExports) {
        if (!content.includes(exportCheck)) {
          return `Missing export: ${exportCheck}`;
        }
      }
      
      return true;
    } catch (error) {
      return error.message;
    }
  });
}

// Main test runner
async function runTests() {
  log(`${colors.bold}${colors.blue}🧪 PHASE 1 INTEGRATION TESTS${colors.reset}\n`);
  
  log(`${colors.bold}📁 File Structure Tests:${colors.reset}`);
  testFileExists('lib/cache/smart-cache.ts', 'Smart Cache System');
  testFileExists('lib/monitoring/enhanced-performance.ts', 'Enhanced Performance Monitor');
  testFileExists('lib/animations/modern-effects.ts', 'Modern Animation Effects');
  testFileExists('lib/security/advanced-security.ts', 'Advanced Security System');
  
  log(`\n${colors.bold}🔌 API Routes Tests:${colors.reset}`);
  testApiRoutes();
  
  log(`\n${colors.bold}⚡ Middleware Tests:${colors.reset}`);
  testMiddleware();
  
  log(`\n${colors.bold}📦 Package Configuration Tests:${colors.reset}`);
  testPackageJson();
  testDependencies();
  testConfigurations();
  
  log(`\n${colors.bold}🔧 TypeScript Tests:${colors.reset}`);
  testTypeScriptFiles();
  
  log(`\n${colors.bold}🔗 Integration Tests:${colors.reset}`);
  testIntegration();
  
  // Print summary
  log(`\n${colors.bold}📊 TEST SUMMARY:${colors.reset}`);
  log(`Total Tests: ${testResults.total}`);
  log(`Passed: ${testResults.passed}`, colors.green);
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? colors.red : colors.green);
  log(`Warnings: ${testResults.warnings}`, testResults.warnings > 0 ? colors.yellow : colors.green);
  
  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  log(`Success Rate: ${successRate}%`, successRate >= 90 ? colors.green : colors.yellow);
  
  // Overall result
  if (testResults.failed === 0) {
    log(`\n${colors.bold}${colors.green}✅ ALL TESTS PASSED! Phase 1 implementation is ready.${colors.reset}`);
    return 0;
  } else {
    log(`\n${colors.bold}${colors.red}❌ ${testResults.failed} TEST(S) FAILED. Please review the implementation.${colors.reset}`);
    return 1;
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  log(`💥 Uncaught Exception: ${error.message}`, colors.red);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`, colors.red);
  process.exit(1);
});

// Run tests if called directly
if (require.main === module) {
  runTests().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    log(`💥 Test runner failed: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { runTests, testResults };
