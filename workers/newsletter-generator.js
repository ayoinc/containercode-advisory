/**
 * Newsletter Generator Worker
 * Orchestrates weekly newsletter generation and distribution
 */

import { generateNewsletter } from './utils/newsletter-generator.js';
import { sendNewsletterEmails } from './utils/email-sender.js';
import { generateNewsletterImage } from './utils/image-generator.js';

export default {
  /**
   * Scheduled event handler for weekly newsletter generation
   * @param {ScheduledEvent} event - Scheduled event
   * @param {Object} env - Environment variables and bindings
   * @param {Object} ctx - Execution context
   */
  async scheduled(event, env, ctx) {
    console.log('📰 Starting scheduled newsletter generation job');
    
    // Log job start
    const jobId = await this.logJobStart(env, 'newsletter-generation');
    
    try {
      // Get recent articles for newsletter
      console.log('📚 Fetching recent articles...');
      const articles = await this.getRecentArticles(env);
      
      if (articles.length === 0) {
        console.log('No recent articles found, skipping newsletter generation');
        await this.logJobEnd(env, jobId, 'completed', 'No recent articles available', 0);
        return;
      }

      console.log(`Found ${articles.length} recent articles for newsletter`);

      // Generate newsletter content
      console.log('📝 Generating newsletter content...');
      const newsletterData = await generateNewsletter(articles, {
        issue_number: await this.getNextIssueNumber(env)
      });

      // Generate newsletter header image
      console.log('🎨 Generating newsletter header image...');
      const headerImageUrl = await generateNewsletterImage(newsletterData, env.AI, env.R2_ASSETS);

      // Store newsletter in database
      console.log('💾 Storing newsletter in database...');
      const newsletterResult = await env.DB.prepare(`
        INSERT INTO newsletter_issues (
          issue_number, subject, preheader, content_html, content_text, 
          template_version, article_ids, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        newsletterData.issue_number,
        newsletterData.subject,
        newsletterData.preheader,
        newsletterData.content_html,
        newsletterData.content_text,
        'v1',
        JSON.stringify(newsletterData.article_ids),
        'scheduled',
        new Date().toISOString()
      ).run();

      const newsletterId = newsletterResult.meta.last_row_id;

      // Get active subscribers
      console.log('👥 Fetching active subscribers...');
      const subscribers = await env.DB.prepare(`
        SELECT * FROM subscribers 
        WHERE status = 'active' AND confirmed_at IS NOT NULL
        ORDER BY subscribed_at ASC
      `).all();

      if (subscribers.results.length === 0) {
        console.log('No active subscribers found, newsletter created but not sent');
        await this.logJobEnd(env, jobId, 'completed', 'Newsletter created but no subscribers', 1);
        return;
      }

      console.log(`📧 Preparing to send newsletter to ${subscribers.results.length} subscribers`);

      // Update newsletter with subscriber count
      await env.DB.prepare(`
        UPDATE newsletter_issues 
        SET total_subscribers = ?, status = 'sending', scheduled_at = ?
        WHERE id = ?
      `).bind(
        subscribers.results.length,
        new Date().toISOString(),
        newsletterId
      ).run();

      // Send newsletter
      console.log('📮 Sending newsletter...');
      const sendResults = await sendNewsletterEmails(
        { ...newsletterData, id: newsletterId },
        subscribers.results,
        env
      );

      // Update newsletter with final results
      await env.DB.prepare(`
        UPDATE newsletter_issues 
        SET 
          delivered_count = ?, 
          status = ?,
          sent_at = ?
        WHERE id = ?
      `).bind(
        sendResults.successful,
        sendResults.successful > 0 ? 'sent' : 'failed',
        new Date().toISOString(),
        newsletterId
      ).run();

      // Update subscriber activity
      await this.updateSubscriberActivity(subscribers.results, env);

      // Store analytics event
      await this.trackNewsletterSent(newsletterId, sendResults, env);

      console.log(`✅ Newsletter generation completed. Sent to ${sendResults.successful} subscribers`);
      
      // Log job completion
      await this.logJobEnd(env, jobId, 'completed', 
        `Newsletter sent to ${sendResults.successful} subscribers`, 
        sendResults.successful
      );

    } catch (error) {
      console.error('❌ Fatal error in newsletter generation job:', error);
      await this.logJobEnd(env, jobId, 'failed', error.message, 0);
    }
  },

  /**
   * HTTP request handler for manual newsletter operations
   * @param {Request} request - HTTP request
   * @param {Object} env - Environment variables and bindings
   * @param {Object} ctx - Execution context
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Generate preview newsletter
    if (url.pathname === '/preview' && request.method === 'GET') {
      try {
        const articles = await this.getRecentArticles(env, 5);
        const newsletterData = await generateNewsletter(articles, {
          issue_number: await this.getNextIssueNumber(env)
        });

        return new Response(newsletterData.content_html, {
          headers: { 'Content-Type': 'text/html' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Send test newsletter
    if (url.pathname === '/test' && request.method === 'POST') {
      try {
        const body = await request.json();
        
        if (!body.email) {
          return new Response(JSON.stringify({
            error: 'Email address is required'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const articles = await this.getRecentArticles(env, 3);
        const newsletterData = await generateNewsletter(articles, {
          issue_number: await this.getNextIssueNumber(env),
          subject: '[TEST] ' + (await generateNewsletter(articles)).subject
        });

        const emailSender = new (await import('./utils/email-sender.js')).EmailSender(
          env.RESEND_API_KEY,
          env.RESEND_DOMAIN,
          env.RESEND_EMAIL_FROM
        );

        const result = await emailSender.sendSingleEmail({
          to: body.email,
          subject: newsletterData.subject,
          html: newsletterData.content_html,
          text: newsletterData.content_text
        });

        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Newsletter statistics
    if (url.pathname === '/stats') {
      const stats = await this.getNewsletterStats(env);
      return new Response(JSON.stringify(stats), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Webhook handler for email events
    if (url.pathname === '/webhook' && request.method === 'POST') {
      try {
        const webhook = await request.json();
        
        const emailSender = new (await import('./utils/email-sender.js')).EmailSender(
          env.RESEND_API_KEY,
          env.RESEND_DOMAIN,
          env.RESEND_EMAIL_FROM
        );
        
        await emailSender.handleWebhook(webhook, env);
        
        return new Response('OK', { status: 200 });
        
      } catch (error) {
        console.error('❌ Webhook error:', error);
        return new Response('Error', { status: 500 });
      }
    }
    
    return new Response('Newsletter Generator Worker\n\nEndpoints:\n- GET /preview\n- POST /test\n- GET /stats\n- POST /webhook', {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  /**
   * Get recent articles for newsletter
   * @param {Object} env - Environment bindings
   * @param {number} limit - Maximum number of articles
   * @returns {Promise<Array>} Recent articles
   */
  async getRecentArticles(env, limit = 5) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7); // Last 7 days

    const articles = await env.DB.prepare(`
      SELECT * FROM articles 
      WHERE status = 'published' 
        AND published_at >= ?
        AND validation_status = 'valid'
      ORDER BY published_at DESC, view_count DESC
      LIMIT ?
    `).bind(cutoffDate.toISOString(), limit).all();

    return articles.results;
  },

  /**
   * Get next issue number
   * @param {Object} env - Environment bindings
   * @returns {Promise<number>} Next issue number
   */
  async getNextIssueNumber(env) {
    const lastIssue = await env.DB.prepare(`
      SELECT MAX(issue_number) as last_number FROM newsletter_issues
    `).first();

    return (lastIssue?.last_number || 0) + 1;
  },

  /**
   * Update subscriber last activity
   * @param {Array} subscribers - Array of subscribers
   * @param {Object} env - Environment bindings
   */
  async updateSubscriberActivity(subscribers, env) {
    const currentTime = new Date().toISOString();
    
    for (const subscriber of subscribers) {
      try {
        await env.DB.prepare(`
          UPDATE subscribers 
          SET last_activity = ? 
          WHERE id = ?
        `).bind(currentTime, subscriber.id).run();
      } catch (error) {
        console.error(`❌ Error updating subscriber ${subscriber.id} activity:`, error);
      }
    }
  },

  /**
   * Track newsletter sent analytics
   * @param {number} newsletterId - Newsletter ID
   * @param {Object} results - Send results
   * @param {Object} env - Environment bindings
   */
  async trackNewsletterSent(newsletterId, results, env) {
    try {
      await env.DB.prepare(`
        INSERT INTO analytics (
          event_type, event_data, timestamp
        ) VALUES (?, ?, ?)
      `).bind(
        'newsletter_sent',
        JSON.stringify({
          newsletter_id: newsletterId,
          total_sent: results.total_sent,
          successful: results.successful,
          failed: results.failed,
          errors: results.errors
        }),
        new Date().toISOString()
      ).run();
    } catch (error) {
      console.error('❌ Error tracking newsletter analytics:', error);
    }
  },

  /**
   * Log job start
   * @param {Object} env - Environment bindings
   * @param {string} jobName - Job name
   * @returns {Promise<number>} Job ID
   */
  async logJobStart(env, jobName) {
    const result = await env.DB.prepare(`
      INSERT INTO cron_logs (job_name, status, start_time) 
      VALUES (?, ?, ?)
    `).bind(jobName, 'started', new Date().toISOString()).run();
    
    return result.meta.last_row_id;
  },

  /**
   * Log job completion
   * @param {Object} env - Environment bindings
   * @param {number} jobId - Job ID
   * @param {string} status - Job status
   * @param {string} result - Job result
   * @param {number} recordsProcessed - Records processed
   */
  async logJobEnd(env, jobId, status, result, recordsProcessed) {
    const endTime = new Date().toISOString();
    
    await env.DB.prepare(`
      UPDATE cron_logs 
      SET status = ?, end_time = ?, result = ?, records_processed = ?
      WHERE id = ?
    `).bind(status, endTime, result, recordsProcessed, jobId).run();
  },

  /**
   * Get newsletter statistics
   * @param {Object} env - Environment bindings
   * @returns {Promise<Object>} Newsletter statistics
   */
  async getNewsletterStats(env) {
    const recentNewsletters = await env.DB.prepare(`
      SELECT * FROM newsletter_issues 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();

    const totalSubscribers = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM subscribers WHERE status = 'active'
    `).first();

    const thisMonthSent = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM newsletter_issues 
      WHERE status = 'sent' AND DATE(sent_at) >= DATE('now', 'start of month')
    `).first();

    const avgOpenRate = await env.DB.prepare(`
      SELECT AVG(opened_count * 100.0 / delivered_count) as rate 
      FROM newsletter_issues 
      WHERE delivered_count > 0 AND sent_at >= DATE('now', '-3 months')
    `).first();

    return {
      total_subscribers: totalSubscribers.count,
      newsletters_this_month: thisMonthSent.count,
      average_open_rate: Math.round(avgOpenRate.rate || 0),
      recent_newsletters: recentNewsletters.results
    };
  }
};