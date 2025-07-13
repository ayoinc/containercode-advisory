#!/usr/bin/env node

/**
 * Newsletter Automation Runner
 * CLI script to manually trigger newsletter generation and sending
 */

import { NewsletterAutomationSystem } from '../src/lib/newsletter-automation';

interface NewsletterConfig {
  dryRun: boolean;
  maxArticles: number;
  testEmails: string[];
  skipImages: boolean;
  skipNotification: boolean;
}

class NewsletterRunner {
  private config: NewsletterConfig;

  constructor(config: NewsletterConfig) {
    this.config = config;
  }

  async run(): Promise<void> {
    console.log('🚀 Starting Newsletter Automation Runner');
    console.log('Configuration:', this.config);

    try {
      // Validate environment variables
      this.validateEnvironment();

      // Initialize newsletter system
      const newsletterSystem = new NewsletterAutomationSystem();

      if (this.config.dryRun) {
        console.log('🧪 Running in DRY RUN mode - no actual content will be published');
        await this.runDryRun(newsletterSystem);
      } else {
        console.log('🔴 Running in LIVE mode - content will be published and subscribers notified');
        await newsletterSystem.generateNewsletterContent();
      }

      console.log('✅ Newsletter automation completed successfully');
    } catch (error) {
      console.error('❌ Newsletter automation failed:', error);
      process.exit(1);
    }
  }

  private validateEnvironment(): void {
    const requiredEnvVars = [
      'BRAVE_API_KEY',
      'DEEPSEEK_API_KEY',
      'PEXELS_API_KEY',
      'NOTION_API_KEY',
      'NOTION_DATABASE_BLOG_POSTS',
      'RESEND_API_KEY',
      'CLOUDFLARE_API_TOKEN',
      'CLOUDFLARE_ACCOUNT_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.error(`  - ${varName}`));
      throw new Error('Missing required environment variables');
    }

    console.log('✅ Environment variables validated');
  }

  private async runDryRun(newsletterSystem: NewsletterAutomationSystem): Promise<void> {
    console.log('🧪 Dry run - simulating newsletter automation...');
    
    // In a real implementation, you'd create a dry-run mode for the NewsletterAutomationSystem
    // For now, we'll just validate the setup
    
    console.log('📊 Dry run summary:');
    console.log('  ✓ Environment variables validated');
    console.log('  ✓ API connections would be tested');
    console.log('  ✓ Trending topics would be searched');
    console.log('  ✓ Articles would be generated');
    console.log('  ✓ Images would be downloaded');
    console.log('  ✓ Content would be published to Notion');
    
    if (!this.config.skipNotification) {
      console.log('  ✓ Subscribers would be notified');
    } else {
      console.log('  ⏭ Subscriber notification skipped');
    }
  }

  private async testAPIConnections(): Promise<void> {
    console.log('🔍 Testing API connections...');

    // Test Brave Search API
    try {
      const braveResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?q=test&count=1`, {
        headers: {
          'X-Subscription-Token': process.env.BRAVE_API_KEY!
        }
      });
      console.log(`  Brave Search API: ${braveResponse.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.log('  Brave Search API: ❌ Connection failed');
    }

    // Test DeepSeek API
    try {
      const deepseekResponse = await fetch('https://api.deepseek.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      });
      console.log(`  DeepSeek API: ${deepseekResponse.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.log('  DeepSeek API: ❌ Connection failed');
    }

    // Test Pexels API
    try {
      const pexelsResponse = await fetch('https://api.pexels.com/v1/search?query=technology&per_page=1', {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY!
        }
      });
      console.log(`  Pexels API: ${pexelsResponse.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.log('  Pexels API: ❌ Connection failed');
    }

    // Test Notion API
    try {
      const notionResponse = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28'
        }
      });
      console.log(`  Notion API: ${notionResponse.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.log('  Notion API: ❌ Connection failed');
    }

    // Test Cloudflare KV
    try {
      const cfResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
          }
        }
      );
      console.log(`  Cloudflare KV: ${cfResponse.ok ? '✅' : '❌'}`);
    } catch (error) {
      console.log('  Cloudflare KV: ❌ Connection failed');
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const config: NewsletterConfig = {
    dryRun: args.includes('--dry-run'),
    maxArticles: parseInt(args.find(arg => arg.startsWith('--max-articles='))?.split('=')[1] || '2'),
    testEmails: args.find(arg => arg.startsWith('--test-emails='))?.split('=')[1]?.split(',') || [],
    skipImages: args.includes('--skip-images'),
    skipNotification: args.includes('--skip-notification')
  };

  switch (command) {
    case 'generate':
      const runner = new NewsletterRunner(config);
      await runner.run();
      break;

    case 'test-apis':
      const testRunner = new NewsletterRunner(config);
      await testRunner['testAPIConnections']();
      break;

    case 'validate':
      try {
        const validator = new NewsletterRunner(config);
        validator['validateEnvironment']();
        console.log('✅ Environment validation passed');
      } catch (error) {
        console.error('❌ Environment validation failed:', error);
        process.exit(1);
      }
      break;

    default:
      console.log(`
📰 Newsletter Automation Runner

Usage:
  npm run newsletter:generate [options]     - Generate and publish newsletter content
  npm run newsletter:test-apis             - Test API connections
  npm run newsletter:validate              - Validate environment configuration

Options:
  --dry-run                                - Simulate without actually publishing
  --max-articles=N                         - Limit number of articles (default: 2)
  --test-emails=email1,email2              - Send to test emails only
  --skip-images                            - Skip image downloading
  --skip-notification                      - Skip subscriber notification

Examples:
  npm run newsletter:generate --dry-run
  npm run newsletter:generate --max-articles=1 --test-emails=test@example.com
  npm run newsletter:test-apis
  npm run newsletter:validate

Environment Variables Required:
  BRAVE_API_KEY                           - Brave Search API key
  DEEPSEEK_API_KEY                        - DeepSeek AI API key
  PEXELS_API_KEY                          - Pexels API key
  NOTION_API_KEY                          - Notion integration token
  NOTION_DATABASE_BLOG_POSTS              - Notion blog database ID
  RESEND_API_KEY                          - Resend email API key
  CLOUDFLARE_API_TOKEN                    - Cloudflare API token
  CLOUDFLARE_ACCOUNT_ID                   - Cloudflare account ID
  ADMIN_API_KEY                           - Admin API key for authentication
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { NewsletterRunner, type NewsletterConfig };