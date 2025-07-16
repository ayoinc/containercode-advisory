#!/usr/bin/env node
/**
 * Email Distribution Integration Tests
 * Tests the complete email distribution system including Resend API integration,
 * batch processing, error handling, and campaign tracking
 */

const { describe, expect, it, beforeEach, afterEach, beforeAll, afterAll } = require('@jest/globals');
const { performance } = require('perf_hooks');

// Mock environment variables
const mockEnv = {
  RESEND_API_KEY: 'test-resend-key',
  RESEND_DOMAIN: 'test.containercode.club',
  RESEND_EMAIL_FROM: 'ContainerCode Test <test@containercode.club>',
  ADMIN_EMAIL: 'admin@containercode.test',
  NEXT_PUBLIC_SITE_URL: 'https://test.containercode.club'
};

// Mock fetch globally
global.fetch = jest.fn();

// Mock email distribution utilities
class MockEmailDistributor {
  constructor(env) {
    this.env = env;
    this.resendApiKey = env.RESEND_API_KEY;
    this.fromEmail = env.RESEND_EMAIL_FROM;
    this.domain = env.RESEND_DOMAIN;
    this.batchSize = 50;
    this.rateLimitDelay = 1000;
    this.maxRetries = 3;
    this.deliveryStats = {
      sent: 0,
      failed: 0,
      bounced: 0,
      opened: 0,
      clicked: 0
    };
  }

  async sendSingleEmail(recipient, subject, htmlContent, textContent, metadata = {}) {
    const emailData = {
      from: this.fromEmail,
      to: recipient.email,
      subject: subject,
      html: htmlContent,
      text: textContent,
      headers: {
        'X-Campaign-ID': metadata.campaignId || 'test-campaign',
        'X-Subscriber-ID': recipient.id || 'test-subscriber',
        'X-Email-Type': metadata.type || 'newsletter'
      },
      tags: [
        { name: 'campaign', value: metadata.campaignId || 'test-campaign' },
        { name: 'type', value: metadata.type || 'newsletter' }
      ]
    };

    // Add personalization if available
    if (recipient.name) {
      emailData.html = emailData.html.replace(/{{name}}/g, recipient.name);
      emailData.text = emailData.text.replace(/{{name}}/g, recipient.name);
    }

    // Add unsubscribe link
    const unsubscribeUrl = `${this.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${recipient.unsubscribeToken}`;
    emailData.html = emailData.html.replace(/{{unsubscribe_url}}/g, unsubscribeUrl);
    emailData.text = emailData.text.replace(/{{unsubscribe_url}}/g, unsubscribeUrl);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Resend API error: ${response.status} - ${errorData.message}`);
      }

      const result = await response.json();
      this.deliveryStats.sent++;
      
      return {
        success: true,
        messageId: result.id,
        recipient: recipient.email,
        status: 'sent'
      };
    } catch (error) {
      this.deliveryStats.failed++;
      return {
        success: false,
        recipient: recipient.email,
        error: error.message,
        status: 'failed'
      };
    }
  }

  async sendBatch(recipients, subject, htmlContent, textContent, metadata = {}) {
    const results = [];
    const batches = this.createBatches(recipients, this.batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchResults = await this.processBatch(batch, subject, htmlContent, textContent, metadata);
      results.push(...batchResults);

      // Rate limiting delay between batches
      if (i < batches.length - 1) {
        await this.delay(this.rateLimitDelay);
      }
    }

    return results;
  }

  async processBatch(batch, subject, htmlContent, textContent, metadata) {
    const batchPromises = batch.map(recipient => 
      this.sendSingleEmail(recipient, subject, htmlContent, textContent, metadata)
    );

    const results = await Promise.allSettled(batchPromises);
    
    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        this.deliveryStats.failed++;
        return {
          success: false,
          recipient: 'unknown',
          error: result.reason.message,
          status: 'failed'
        };
      }
    });
  }

  async sendWithRetry(recipient, subject, htmlContent, textContent, metadata = {}, retryCount = 0) {
    try {
      const result = await this.sendSingleEmail(recipient, subject, htmlContent, textContent, metadata);
      
      if (result.success) {
        return result;
      }

      // Retry on specific errors
      if (retryCount < this.maxRetries && this.shouldRetry(result.error)) {
        await this.delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
        return this.sendWithRetry(recipient, subject, htmlContent, textContent, metadata, retryCount + 1);
      }

      return result;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        await this.delay(Math.pow(2, retryCount) * 1000);
        return this.sendWithRetry(recipient, subject, htmlContent, textContent, metadata, retryCount + 1);
      }

      this.deliveryStats.failed++;
      return {
        success: false,
        recipient: recipient.email,
        error: error.message,
        status: 'failed'
      };
    }
  }

  async sendNewsletterCampaign(campaign, subscribers) {
    const { subject, htmlContent, textContent, id: campaignId } = campaign;
    
    const metadata = {
      campaignId,
      type: 'newsletter',
      timestamp: new Date().toISOString()
    };

    const results = await this.sendBatch(subscribers, subject, htmlContent, textContent, metadata);
    
    const summary = {
      campaignId,
      totalRecipients: subscribers.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      deliveryRate: results.filter(r => r.success).length / subscribers.length,
      results
    };

    return summary;
  }

  async sendTransactionalEmail(type, recipient, templateData = {}) {
    const templates = {
      welcome: {
        subject: 'Welcome to ContainerCode Advisory',
        html: `
          <h1>Welcome {{name}}!</h1>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You'll receive updates about cloud technologies, cybersecurity, and digital transformation.</p>
          <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
        `,
        text: `
          Welcome {{name}}!
          Thank you for subscribing to our newsletter.
          You'll receive updates about cloud technologies, cybersecurity, and digital transformation.
          Unsubscribe: {{unsubscribe_url}}
        `
      },
      confirmation: {
        subject: 'Please confirm your subscription',
        html: `
          <h1>Confirm Your Subscription</h1>
          <p>Hi {{name}},</p>
          <p>Please confirm your email subscription by clicking the link below:</p>
          <p><a href="{{confirm_url}}">Confirm Subscription</a></p>
          <p>If you didn't subscribe, you can ignore this email.</p>
        `,
        text: `
          Confirm Your Subscription
          Hi {{name}},
          Please confirm your email subscription by clicking the link below:
          {{confirm_url}}
          If you didn't subscribe, you can ignore this email.
        `
      },
      unsubscribe: {
        subject: 'You have been unsubscribed',
        html: `
          <h1>Unsubscribed Successfully</h1>
          <p>Hi {{name}},</p>
          <p>You have been successfully unsubscribed from our newsletter.</p>
          <p>We're sorry to see you go. If you change your mind, you can always subscribe again.</p>
          <p><a href="{{subscribe_url}}">Subscribe Again</a></p>
        `,
        text: `
          Unsubscribed Successfully
          Hi {{name}},
          You have been successfully unsubscribed from our newsletter.
          We're sorry to see you go. If you change your mind, you can always subscribe again.
          Subscribe Again: {{subscribe_url}}
        `
      }
    };

    const template = templates[type];
    if (!template) {
      throw new Error(`Unknown email template: ${type}`);
    }

    let { subject, html, text } = template;

    // Replace template variables
    Object.entries(templateData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      html = html.replace(new RegExp(placeholder, 'g'), value);
      text = text.replace(new RegExp(placeholder, 'g'), value);
    });

    const metadata = {
      type: 'transactional',
      template: type,
      timestamp: new Date().toISOString()
    };

    return this.sendSingleEmail(recipient, subject, html, text, metadata);
  }

  async handleWebhook(webhookData) {
    const { type, data } = webhookData;

    switch (type) {
      case 'email.sent':
        this.deliveryStats.sent++;
        break;
      case 'email.delivered':
        // Email was successfully delivered
        break;
      case 'email.bounced':
        this.deliveryStats.bounced++;
        break;
      case 'email.opened':
        this.deliveryStats.opened++;
        break;
      case 'email.clicked':
        this.deliveryStats.clicked++;
        break;
      default:
        console.warn(`Unknown webhook type: ${type}`);
    }

    return {
      processed: true,
      type,
      timestamp: new Date().toISOString()
    };
  }

  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  shouldRetry(error) {
    const retryableErrors = [
      'rate limit',
      'timeout',
      'network error',
      'server error',
      '5'
    ];

    return retryableErrors.some(retryableError => 
      error.toLowerCase().includes(retryableError)
    );
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getDeliveryStats() {
    return {
      ...this.deliveryStats,
      deliveryRate: this.deliveryStats.sent / (this.deliveryStats.sent + this.deliveryStats.failed),
      openRate: this.deliveryStats.opened / this.deliveryStats.sent,
      clickRate: this.deliveryStats.clicked / this.deliveryStats.sent
    };
  }

  resetStats() {
    this.deliveryStats = {
      sent: 0,
      failed: 0,
      bounced: 0,
      opened: 0,
      clicked: 0
    };
  }
}

describe('Email Distribution Integration Tests', () => {
  let emailDistributor;
  let mockFetch;

  beforeAll(() => {
    Object.assign(process.env, mockEnv);
  });

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    emailDistributor = new MockEmailDistributor(mockEnv);
  });

  afterEach(() => {
    jest.clearAllMocks();
    emailDistributor.resetStats();
  });

  describe('Single Email Sending', () => {
    const mockRecipient = {
      id: 'test-recipient-1',
      email: 'test@example.com',
      name: 'Test User',
      unsubscribeToken: 'test-token-123'
    };

    it('should send single email successfully', async () => {
      const mockResponse = {
        id: 'email-message-id',
        from: mockEnv.RESEND_EMAIL_FROM,
        to: mockRecipient.email,
        subject: 'Test Subject',
        created_at: new Date().toISOString()
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await emailDistributor.sendSingleEmail(
        mockRecipient,
        'Test Subject',
        '<h1>Test HTML</h1>',
        'Test Text'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.resend.com/emails',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockEnv.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining(mockRecipient.email)
        })
      );

      expect(result).toEqual({
        success: true,
        messageId: mockResponse.id,
        recipient: mockRecipient.email,
        status: 'sent'
      });

      expect(emailDistributor.deliveryStats.sent).toBe(1);
    });

    it('should handle personalization in email content', async () => {
      const mockResponse = {
        id: 'personalized-email-id',
        from: mockEnv.RESEND_EMAIL_FROM,
        to: mockRecipient.email
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const htmlContent = '<h1>Hello {{name}}!</h1><p>Welcome to our newsletter.</p>';
      const textContent = 'Hello {{name}}!\nWelcome to our newsletter.';

      await emailDistributor.sendSingleEmail(
        mockRecipient,
        'Personalized Test',
        htmlContent,
        textContent
      );

      const sentData = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(sentData.html).toContain('Hello Test User!');
      expect(sentData.text).toContain('Hello Test User!');
    });

    it('should include unsubscribe link in emails', async () => {
      const mockResponse = {
        id: 'unsubscribe-email-id',
        from: mockEnv.RESEND_EMAIL_FROM,
        to: mockRecipient.email
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const htmlContent = '<p>Content here</p><p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>';
      const textContent = 'Content here\nUnsubscribe: {{unsubscribe_url}}';

      await emailDistributor.sendSingleEmail(
        mockRecipient,
        'Test with Unsubscribe',
        htmlContent,
        textContent
      );

      const sentData = JSON.parse(mockFetch.mock.calls[0][1].body);
      const expectedUnsubscribeUrl = `${mockEnv.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${mockRecipient.unsubscribeToken}`;
      
      expect(sentData.html).toContain(expectedUnsubscribeUrl);
      expect(sentData.text).toContain(expectedUnsubscribeUrl);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = {
        message: 'Invalid API key'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockError
      });

      const result = await emailDistributor.sendSingleEmail(
        mockRecipient,
        'Test Subject',
        '<h1>Test</h1>',
        'Test'
      );

      expect(result).toEqual({
        success: false,
        recipient: mockRecipient.email,
        error: 'Resend API error: 401 - Invalid API key',
        status: 'failed'
      });

      expect(emailDistributor.deliveryStats.failed).toBe(1);
    });
  });

  describe('Batch Email Processing', () => {
    const mockRecipients = Array.from({ length: 125 }, (_, i) => ({
      id: `recipient-${i}`,
      email: `test${i}@example.com`,
      name: `Test User ${i}`,
      unsubscribeToken: `token-${i}`
    }));

    it('should process batch emails in chunks', async () => {
      const mockResponse = {
        id: 'batch-email-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const results = await emailDistributor.sendBatch(
        mockRecipients,
        'Batch Test Subject',
        '<h1>Batch Test</h1>',
        'Batch Test'
      );

      expect(results).toHaveLength(125);
      expect(mockFetch).toHaveBeenCalledTimes(125);
      
      // Should process in batches of 50
      expect(results.every(r => r.success)).toBe(true);
      expect(emailDistributor.deliveryStats.sent).toBe(125);
    });

    it('should handle partial batch failures', async () => {
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount % 10 === 0) {
          // Fail every 10th email
          return Promise.resolve({
            ok: false,
            status: 500,
            json: async () => ({ message: 'Server error' })
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: `success-${callCount}` })
        });
      });

      const results = await emailDistributor.sendBatch(
        mockRecipients,
        'Partial Failure Test',
        '<h1>Test</h1>',
        'Test'
      );

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      expect(successful).toBe(113); // 125 - 12 failures (every 10th)
      expect(failed).toBe(12);
      expect(emailDistributor.deliveryStats.sent).toBe(113);
      expect(emailDistributor.deliveryStats.failed).toBe(12);
    });

    it('should implement rate limiting between batches', async () => {
      const mockResponse = {
        id: 'rate-limited-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const startTime = performance.now();
      await emailDistributor.sendBatch(
        mockRecipients.slice(0, 100), // 2 batches
        'Rate Limit Test',
        '<h1>Test</h1>',
        'Test'
      );
      const endTime = performance.now();

      // Should take at least 1 second due to rate limiting
      expect(endTime - startTime).toBeGreaterThan(1000);
    });
  });

  describe('Retry Logic', () => {
    const mockRecipient = {
      id: 'retry-recipient',
      email: 'retry@example.com',
      name: 'Retry User',
      unsubscribeToken: 'retry-token'
    };

    it('should retry on rate limit errors', async () => {
      let callCount = 0;
      mockFetch.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.resolve({
            ok: false,
            status: 429,
            json: async () => ({ message: 'Rate limit exceeded' })
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 'success-after-retry' })
        });
      });

      const result = await emailDistributor.sendWithRetry(
        mockRecipient,
        'Retry Test',
        '<h1>Test</h1>',
        'Test'
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('success-after-retry');
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should stop retrying after max attempts', async () => {
      mockFetch.mockRejectedValue(new Error('Server error'));

      const result = await emailDistributor.sendWithRetry(
        mockRecipient,
        'Max Retry Test',
        '<h1>Test</h1>',
        'Test'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Server error');
      expect(mockFetch).toHaveBeenCalledTimes(4); // Initial + 3 retries
    }, 10000);

    it('should use exponential backoff for retries', async () => {
      let callCount = 0;
      const callTimes = [];
      
      mockFetch.mockImplementation(() => {
        callTimes.push(performance.now());
        callCount++;
        
        if (callCount < 3) {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: async () => ({ message: 'Server error' })
          });
        }
        
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 'success-after-backoff' })
        });
      });

      await emailDistributor.sendWithRetry(
        mockRecipient,
        'Backoff Test',
        '<h1>Test</h1>',
        'Test'
      );

      // Check that delays increase exponentially (allowing for some timing variance)
      expect(callTimes[1] - callTimes[0]).toBeGreaterThan(900); // ~1 second (with tolerance)
      expect(callTimes[2] - callTimes[1]).toBeGreaterThan(1800); // ~2 seconds (with tolerance)
    });
  });

  describe('Newsletter Campaign', () => {
    const mockCampaign = {
      id: 'campaign-123',
      subject: 'Weekly Newsletter - January 2024',
      htmlContent: `
        <h1>Weekly Newsletter</h1>
        <p>Hello {{name}},</p>
        <p>Here are this week's updates...</p>
        <p><a href="{{unsubscribe_url}}">Unsubscribe</a></p>
      `,
      textContent: `
        Weekly Newsletter
        Hello {{name}},
        Here are this week's updates...
        Unsubscribe: {{unsubscribe_url}}
      `
    };

    const mockSubscribers = Array.from({ length: 50 }, (_, i) => ({
      id: `subscriber-${i}`,
      email: `subscriber${i}@example.com`,
      name: `Subscriber ${i}`,
      unsubscribeToken: `token-${i}`
    }));

    it('should send newsletter campaign successfully', async () => {
      const mockResponse = {
        id: 'newsletter-email-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await emailDistributor.sendNewsletterCampaign(
        mockCampaign,
        mockSubscribers
      );

      expect(result).toEqual({
        campaignId: mockCampaign.id,
        totalRecipients: 50,
        successful: 50,
        failed: 0,
        deliveryRate: 1,
        results: expect.arrayContaining([
          expect.objectContaining({
            success: true,
            messageId: 'newsletter-email-id'
          })
        ])
      });

      expect(mockFetch).toHaveBeenCalledTimes(50);
    });

    it('should include campaign metadata in emails', async () => {
      const mockResponse = {
        id: 'campaign-metadata-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      await emailDistributor.sendNewsletterCampaign(
        mockCampaign,
        mockSubscribers.slice(0, 1)
      );

      const sentData = JSON.parse(mockFetch.mock.calls[0][1].body);
      
      expect(sentData.headers).toEqual({
        'X-Campaign-ID': mockCampaign.id,
        'X-Subscriber-ID': mockSubscribers[0].id,
        'X-Email-Type': 'newsletter'
      });

      expect(sentData.tags).toEqual([
        { name: 'campaign', value: mockCampaign.id },
        { name: 'type', value: 'newsletter' }
      ]);
    });
  });

  describe('Transactional Emails', () => {
    const mockRecipient = {
      id: 'transactional-recipient',
      email: 'transactional@example.com',
      name: 'Transactional User',
      unsubscribeToken: 'transactional-token'
    };

    it('should send welcome email', async () => {
      const mockResponse = {
        id: 'welcome-email-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await emailDistributor.sendTransactionalEmail(
        'welcome',
        mockRecipient,
        { name: mockRecipient.name }
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('welcome-email-id');

      const sentData = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(sentData.subject).toBe('Welcome to ContainerCode Advisory');
      expect(sentData.html).toContain('Welcome Transactional User!');
    });

    it('should send confirmation email', async () => {
      const mockResponse = {
        id: 'confirmation-email-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const confirmUrl = `${mockEnv.NEXT_PUBLIC_SITE_URL}/confirm?token=confirm-token`;
      const result = await emailDistributor.sendTransactionalEmail(
        'confirmation',
        mockRecipient,
        { 
          name: mockRecipient.name,
          confirm_url: confirmUrl
        }
      );

      expect(result.success).toBe(true);
      
      const sentData = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(sentData.subject).toBe('Please confirm your subscription');
      expect(sentData.html).toContain(confirmUrl);
    });

    it('should handle unknown email template', async () => {
      await expect(
        emailDistributor.sendTransactionalEmail('unknown', mockRecipient)
      ).rejects.toThrow('Unknown email template: unknown');
    });
  });

  describe('Webhook Handling', () => {
    it('should process email sent webhook', async () => {
      const webhookData = {
        type: 'email.sent',
        data: {
          messageId: 'test-message-id',
          recipient: 'test@example.com',
          timestamp: new Date().toISOString()
        }
      };

      const result = await emailDistributor.handleWebhook(webhookData);

      expect(result).toEqual({
        processed: true,
        type: 'email.sent',
        timestamp: expect.any(String)
      });

      expect(emailDistributor.deliveryStats.sent).toBe(1);
    });

    it('should process email opened webhook', async () => {
      const webhookData = {
        type: 'email.opened',
        data: {
          messageId: 'test-message-id',
          recipient: 'test@example.com',
          userAgent: 'Mozilla/5.0...',
          timestamp: new Date().toISOString()
        }
      };

      const result = await emailDistributor.handleWebhook(webhookData);

      expect(result.processed).toBe(true);
      expect(emailDistributor.deliveryStats.opened).toBe(1);
    });

    it('should process email clicked webhook', async () => {
      const webhookData = {
        type: 'email.clicked',
        data: {
          messageId: 'test-message-id',
          recipient: 'test@example.com',
          url: 'https://example.com/link',
          timestamp: new Date().toISOString()
        }
      };

      const result = await emailDistributor.handleWebhook(webhookData);

      expect(result.processed).toBe(true);
      expect(emailDistributor.deliveryStats.clicked).toBe(1);
    });

    it('should handle unknown webhook types', async () => {
      const webhookData = {
        type: 'unknown.type',
        data: {}
      };

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await emailDistributor.handleWebhook(webhookData);

      expect(result.processed).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown webhook type: unknown.type');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance Tests', () => {
    it('should handle large batch efficiently', async () => {
      const largeRecipientList = Array.from({ length: 1000 }, (_, i) => ({
        id: `large-recipient-${i}`,
        email: `large${i}@example.com`,
        name: `Large User ${i}`,
        unsubscribeToken: `large-token-${i}`
      }));

      const mockResponse = {
        id: 'large-batch-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const startTime = performance.now();
      const results = await emailDistributor.sendBatch(
        largeRecipientList,
        'Large Batch Test',
        '<h1>Test</h1>',
        'Test'
      );
      const endTime = performance.now();

      expect(results).toHaveLength(1000);
      expect(results.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(30000); // Should complete in under 30 seconds
    });

    it('should handle concurrent email operations', async () => {
      const mockResponse = {
        id: 'concurrent-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const concurrentOperations = Array.from({ length: 10 }, (_, i) => 
        emailDistributor.sendSingleEmail(
          {
            id: `concurrent-${i}`,
            email: `concurrent${i}@example.com`,
            name: `Concurrent User ${i}`,
            unsubscribeToken: `concurrent-token-${i}`
          },
          'Concurrent Test',
          '<h1>Test</h1>',
          'Test'
        )
      );

      const startTime = performance.now();
      const results = await Promise.all(concurrentOperations);
      const endTime = performance.now();

      expect(results).toHaveLength(10);
      expect(results.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    });
  });

  describe('Statistics and Reporting', () => {
    it('should track delivery statistics correctly', async () => {
      const mockResponse = {
        id: 'stats-test-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      // Send some successful emails
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      await emailDistributor.sendSingleEmail(
        { email: 'success@example.com', unsubscribeToken: 'token' },
        'Success Test',
        '<h1>Test</h1>',
        'Test'
      );

      // Send some failed emails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid email' })
      });

      await emailDistributor.sendSingleEmail(
        { email: 'fail@example.com', unsubscribeToken: 'token' },
        'Fail Test',
        '<h1>Test</h1>',
        'Test'
      );

      // Simulate webhook events
      await emailDistributor.handleWebhook({
        type: 'email.opened',
        data: { messageId: 'stats-test-id' }
      });

      await emailDistributor.handleWebhook({
        type: 'email.clicked',
        data: { messageId: 'stats-test-id' }
      });

      const stats = emailDistributor.getDeliveryStats();

      expect(stats).toEqual({
        sent: 1,
        failed: 1,
        bounced: 0,
        opened: 1,
        clicked: 1,
        deliveryRate: 0.5,
        openRate: 1,
        clickRate: 1
      });
    });

    it('should reset statistics correctly', () => {
      emailDistributor.deliveryStats.sent = 10;
      emailDistributor.deliveryStats.failed = 5;
      emailDistributor.deliveryStats.opened = 8;

      emailDistributor.resetStats();

      expect(emailDistributor.deliveryStats).toEqual({
        sent: 0,
        failed: 0,
        bounced: 0,
        opened: 0,
        clicked: 0
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle network timeouts gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network timeout'));

      const result = await emailDistributor.sendSingleEmail(
        { email: 'timeout@example.com', unsubscribeToken: 'token' },
        'Timeout Test',
        '<h1>Test</h1>',
        'Test'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
      expect(emailDistributor.deliveryStats.failed).toBe(1);
    });

    it('should handle malformed recipient data', async () => {
      const malformedRecipient = {
        id: null,
        email: '',
        name: undefined,
        unsubscribeToken: ''
      };

      const mockResponse = {
        id: 'malformed-id',
        from: mockEnv.RESEND_EMAIL_FROM
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // Should handle malformed data without crashing
      await expect(
        emailDistributor.sendSingleEmail(
          malformedRecipient,
          'Malformed Test',
          '<h1>Test</h1>',
          'Test'
        )
      ).resolves.toBeDefined();
    });

    it('should handle empty recipient lists', async () => {
      const results = await emailDistributor.sendBatch(
        [],
        'Empty Test',
        '<h1>Test</h1>',
        'Test'
      );

      expect(results).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});

module.exports = { MockEmailDistributor };