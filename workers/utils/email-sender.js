/**
 * Email Sender for Newsletter Automation
 * Handles batch email distribution with rate limiting and tracking
 */

export class EmailSender {
  constructor(resendApiKey, domain, fromEmail) {
    this.apiKey = resendApiKey;
    this.domain = domain;
    this.fromEmail = fromEmail;
    this.baseUrl = 'https://api.resend.com';
    this.batchSize = 50; // Resend allows up to 50 recipients per API call
    this.rateLimit = 100; // Max 100 emails per second
    this.retryAttempts = 3;
  }

  /**
   * Send newsletter to all active subscribers
   * @param {Object} newsletter - Newsletter data
   * @param {Array} subscribers - Array of subscribers
   * @param {Object} env - Environment bindings
   * @returns {Promise<Object>} Send results
   */
  async sendNewsletter(newsletter, subscribers, env) {
    console.log(`📧 Starting newsletter distribution to ${subscribers.length} subscribers`);
    
    const results = {
      total_sent: 0,
      successful: 0,
      failed: 0,
      bounced: 0,
      errors: []
    };

    // Process subscribers in batches
    const batches = this.createBatches(subscribers, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📮 Processing batch ${i + 1}/${batches.length} (${batch.length} subscribers)`);
      
      try {
        const batchResults = await this.sendBatch(newsletter, batch, env);
        
        // Aggregate results
        results.total_sent += batchResults.length;
        results.successful += batchResults.filter(r => r.success).length;
        results.failed += batchResults.filter(r => !r.success).length;
        
        // Store individual campaign records
        await this.storeCampaignRecords(newsletter.id, batchResults, env);
        
        // Rate limiting delay between batches
        if (i < batches.length - 1) {
          await this.delay(1000); // 1 second delay between batches
        }
        
      } catch (error) {
        console.error(`❌ Error processing batch ${i + 1}:`, error);
        results.errors.push(`Batch ${i + 1}: ${error.message}`);
        results.failed += batch.length;
      }
    }

    // Update newsletter statistics
    await this.updateNewsletterStats(newsletter.id, results, env);
    
    console.log(`✅ Newsletter distribution completed. Success: ${results.successful}, Failed: ${results.failed}`);
    return results;
  }

  /**
   * Send email batch using Resend API
   * @param {Object} newsletter - Newsletter data
   * @param {Array} subscribers - Batch of subscribers
   * @param {Object} env - Environment bindings
   * @returns {Promise<Array>} Batch results
   */
  async sendBatch(newsletter, subscribers, env) {
    const batchResults = [];
    
    // Prepare email data for batch sending
    const emails = subscribers.map(subscriber => ({
      from: this.fromEmail,
      to: subscriber.email,
      subject: newsletter.subject,
      html: this.personalizeContent(newsletter.content_html, subscriber),
      text: this.personalizeContent(newsletter.content_text, subscriber),
      headers: {
        'List-Unsubscribe': `<${this.generateUnsubscribeUrl(subscriber.email)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [
        { name: 'newsletter', value: 'weekly' },
        { name: 'issue', value: newsletter.issue_number.toString() },
        { name: 'category', value: 'automation' }
      ]
    }));

    // Send batch email
    try {
      for (const email of emails) {
        const subscriber = subscribers.find(s => s.email === email.to);
        
        try {
          const response = await fetch(`${this.baseUrl}/emails`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
          });

          const result = await response.json();
          
          if (response.ok) {
            batchResults.push({
              subscriber_id: subscriber.id,
              email: subscriber.email,
              success: true,
              message_id: result.id,
              sent_at: new Date().toISOString()
            });
          } else {
            batchResults.push({
              subscriber_id: subscriber.id,
              email: subscriber.email,
              success: false,
              error: result.message || 'Unknown error',
              sent_at: new Date().toISOString()
            });
          }
          
        } catch (emailError) {
          console.error(`❌ Error sending to ${subscriber.email}:`, emailError);
          batchResults.push({
            subscriber_id: subscriber.id,
            email: subscriber.email,
            success: false,
            error: emailError.message,
            sent_at: new Date().toISOString()
          });
        }
        
        // Small delay between individual emails to avoid rate limiting
        await this.delay(100);
      }
      
    } catch (batchError) {
      console.error('❌ Batch sending error:', batchError);
      throw batchError;
    }

    return batchResults;
  }

  /**
   * Send single email (for testing or manual sends)
   * @param {Object} emailData - Email data
   * @returns {Promise<Object>} Send result
   */
  async sendSingleEmail(emailData) {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: emailData.from || this.fromEmail,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text,
          headers: emailData.headers || {},
          tags: emailData.tags || []
        })
      });

      const result = await response.json();
      
      return {
        success: response.ok,
        data: result,
        error: response.ok ? null : result.message
      };
      
    } catch (error) {
      console.error('❌ Error sending single email:', error);
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Personalize email content for subscriber
   * @param {string} content - Email content
   * @param {Object} subscriber - Subscriber data
   * @returns {string} Personalized content
   */
  personalizeContent(content, subscriber) {
    let personalizedContent = content;
    
    // Replace personalization tokens
    const replacements = {
      '{{subscriber_name}}': subscriber.name || subscriber.first_name || 'Valued Subscriber',
      '{{subscriber_email}}': subscriber.email,
      '{{first_name}}': subscriber.first_name || 'there',
      '{{unsubscribe_url}}': this.generateUnsubscribeUrl(subscriber.email),
      '{{preferences_url}}': this.generatePreferencesUrl(subscriber.email),
      '{{subscriber_id}}': subscriber.id.toString()
    };

    Object.entries(replacements).forEach(([token, value]) => {
      personalizedContent = personalizedContent.replace(new RegExp(token, 'g'), value);
    });

    return personalizedContent;
  }

  /**
   * Generate unsubscribe URL
   * @param {string} email - Subscriber email
   * @returns {string} Unsubscribe URL
   */
  generateUnsubscribeUrl(email) {
    const token = this.generateSecureToken(email);
    return `https://containercode.club/unsubscribe?token=${token}&email=${encodeURIComponent(email)}`;
  }

  /**
   * Generate email preferences URL
   * @param {string} email - Subscriber email
   * @returns {string} Preferences URL
   */
  generatePreferencesUrl(email) {
    const token = this.generateSecureToken(email);
    return `https://containercode.club/preferences?token=${token}&email=${encodeURIComponent(email)}`;
  }

  /**
   * Generate secure token for email actions
   * @param {string} email - Subscriber email
   * @returns {string} Secure token
   */
  generateSecureToken(email) {
    // Simple token generation - in production, use proper JWT or similar
    const data = `${email}:${Date.now()}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  /**
   * Create batches from subscriber array
   * @param {Array} subscribers - Array of subscribers
   * @param {number} batchSize - Size of each batch
   * @returns {Array} Array of batches
   */
  createBatches(subscribers, batchSize) {
    const batches = [];
    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Store campaign records in database
   * @param {number} newsletterId - Newsletter ID
   * @param {Array} results - Batch results
   * @param {Object} env - Environment bindings
   */
  async storeCampaignRecords(newsletterId, results, env) {
    for (const result of results) {
      try {
        await env.DB.prepare(`
          INSERT INTO email_campaigns (
            newsletter_issue_id, subscriber_id, email, sent_at, 
            status, error_message
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          newsletterId,
          result.subscriber_id,
          result.email,
          result.sent_at,
          result.success ? 'sent' : 'failed',
          result.error || null
        ).run();
      } catch (dbError) {
        console.error('❌ Error storing campaign record:', dbError);
      }
    }
  }

  /**
   * Update newsletter statistics
   * @param {number} newsletterId - Newsletter ID
   * @param {Object} results - Send results
   * @param {Object} env - Environment bindings
   */
  async updateNewsletterStats(newsletterId, results, env) {
    try {
      await env.DB.prepare(`
        UPDATE newsletter_issues 
        SET 
          delivered_count = ?, 
          status = ?,
          sent_at = ?
        WHERE id = ?
      `).bind(
        results.successful,
        results.successful > 0 ? 'sent' : 'failed',
        new Date().toISOString(),
        newsletterId
      ).run();
    } catch (error) {
      console.error('❌ Error updating newsletter stats:', error);
    }
  }

  /**
   * Handle email webhooks from Resend
   * @param {Object} webhook - Webhook data
   * @param {Object} env - Environment bindings
   */
  async handleWebhook(webhook, env) {
    try {
      const { type, data } = webhook;
      
      switch (type) {
        case 'email.delivered':
          await this.updateCampaignStatus(data.email_id, 'delivered', data.timestamp, env);
          break;
          
        case 'email.opened':
          await this.updateCampaignStatus(data.email_id, 'opened', data.timestamp, env);
          await this.incrementNewsletterOpens(data.email_id, env);
          break;
          
        case 'email.clicked':
          await this.updateCampaignStatus(data.email_id, 'clicked', data.timestamp, env);
          await this.incrementNewsletterClicks(data.email_id, env);
          break;
          
        case 'email.bounced':
          await this.updateCampaignStatus(data.email_id, 'bounced', data.timestamp, env);
          await this.handleBounce(data, env);
          break;
          
        case 'email.complained':
          await this.updateCampaignStatus(data.email_id, 'complained', data.timestamp, env);
          await this.handleComplaint(data, env);
          break;
          
        default:
          console.log(`📧 Unknown webhook type: ${type}`);
      }
      
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
    }
  }

  /**
   * Update campaign status from webhook
   * @param {string} emailId - Email ID from Resend
   * @param {string} status - New status
   * @param {string} timestamp - Event timestamp
   * @param {Object} env - Environment bindings
   */
  async updateCampaignStatus(emailId, status, timestamp, env) {
    // Note: We'd need to store the Resend email ID to match this
    // For now, this is a placeholder for the webhook handling logic
    console.log(`📧 Email ${emailId} status updated to ${status} at ${timestamp}`);
  }

  /**
   * Increment newsletter open count
   * @param {string} emailId - Email ID
   * @param {Object} env - Environment bindings
   */
  async incrementNewsletterOpens(emailId, env) {
    // Placeholder for tracking opens
    console.log(`📧 Email opened: ${emailId}`);
  }

  /**
   * Increment newsletter click count
   * @param {string} emailId - Email ID
   * @param {Object} env - Environment bindings
   */
  async incrementNewsletterClicks(emailId, env) {
    // Placeholder for tracking clicks
    console.log(`📧 Email clicked: ${emailId}`);
  }

  /**
   * Handle email bounce
   * @param {Object} data - Bounce data
   * @param {Object} env - Environment bindings
   */
  async handleBounce(data, env) {
    // Update subscriber status if hard bounce
    if (data.bounce_type === 'hard') {
      await env.DB.prepare(`
        UPDATE subscribers 
        SET status = 'bounced' 
        WHERE email = ?
      `).bind(data.to).run();
    }
  }

  /**
   * Handle spam complaint
   * @param {Object} data - Complaint data
   * @param {Object} env - Environment bindings
   */
  async handleComplaint(data, env) {
    // Unsubscribe user who complained
    await env.DB.prepare(`
      UPDATE subscribers 
      SET status = 'unsubscribed', unsubscribed_at = ? 
      WHERE email = ?
    `).bind(new Date().toISOString(), data.to).run();
  }

  /**
   * Delay helper function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} Delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Send newsletter to subscribers
 * @param {Object} newsletter - Newsletter data
 * @param {Array} subscribers - Array of subscribers
 * @param {Object} env - Environment bindings
 * @returns {Promise<Object>} Send results
 */
export async function sendNewsletterEmails(newsletter, subscribers, env) {
  const emailSender = new EmailSender(
    env.RESEND_API_KEY,
    env.RESEND_DOMAIN,
    env.RESEND_EMAIL_FROM
  );
  
  return await emailSender.sendNewsletter(newsletter, subscribers, env);
}

/**
 * Send single test email
 * @param {Object} emailData - Email data
 * @param {Object} env - Environment bindings
 * @returns {Promise<Object>} Send result
 */
export async function sendTestEmail(emailData, env) {
  const emailSender = new EmailSender(
    env.RESEND_API_KEY,
    env.RESEND_DOMAIN,
    env.RESEND_EMAIL_FROM
  );
  
  return await emailSender.sendSingleEmail(emailData);
}

export default EmailSender;