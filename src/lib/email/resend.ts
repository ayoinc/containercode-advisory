import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface ContactFormEmailData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  services: string[];
  budget?: string;
  timeline?: string;
  submittedAt: Date;
}

export interface NewsletterEmailData {
  title: string;
  content: string;
  excerpt: string;
  topics: string[];
  unsubscribeUrl: string;
  subscriberName?: string;
}

export class EmailService {
  private static readonly FROM_EMAIL = 'ContainerCode Advisory <noreply@containercode.com>';
  private static readonly REPLY_TO_EMAIL = 'contact@containercode.com';

  static async sendContactFormNotification(data: ContactFormEmailData): Promise<boolean> {
    try {
      const html = this.generateContactFormHtml(data);
      
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: this.REPLY_TO_EMAIL,
        reply_to: data.email,
        subject: `New Contact Form Submission: ${data.subject}`,
        html,
      });

      return true;
    } catch (error) {
      console.error('Failed to send contact form notification:', error);
      return false;
    }
  }

  static async sendContactFormConfirmation(data: ContactFormEmailData): Promise<boolean> {
    try {
      const html = this.generateContactConfirmationHtml(data);
      
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: data.email,
        reply_to: this.REPLY_TO_EMAIL,
        subject: 'Thank you for contacting ContainerCode Advisory',
        html,
      });

      return true;
    } catch (error) {
      console.error('Failed to send contact form confirmation:', error);
      return false;
    }
  }

  static async sendNewsletter(
    subscribers: Array<{ email: string; firstName?: string; unsubscribeToken: string }>,
    newsletter: NewsletterEmailData
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          const personalizedNewsletter = {
            ...newsletter,
            unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${subscriber.unsubscribeToken}`,
            subscriberName: subscriber.firstName || 'Valued Subscriber',
          };

          const html = this.generateNewsletterHtml(personalizedNewsletter);

          await resend.emails.send({
            from: this.FROM_EMAIL,
            to: subscriber.email,
            reply_to: this.REPLY_TO_EMAIL,
            subject: newsletter.title,
            html,
          });

          return { success: true, email: subscriber.email };
        } catch (error) {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
          return { success: false, email: subscriber.email };
        }
      });

      const results = await Promise.allSettled(emailPromises);
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value.success) {
          success++;
        } else {
          failed++;
        }
      });

      // Add delay between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success, failed };
  }

  static async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    try {
      const html = this.generateWelcomeHtml(firstName);
      
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        reply_to: this.REPLY_TO_EMAIL,
        subject: 'Welcome to ContainerCode Advisory Newsletter!',
        html,
      });

      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  private static generateContactFormHtml(data: ContactFormEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: 600; color: #1e40af; margin-bottom: 5px; }
            .field-value { background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #3b82f6; }
            .services { display: flex; flex-wrap: wrap; gap: 8px; }
            .service-tag { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">ContainerCode Advisory</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="field-label">Contact Information</div>
                <div class="field-value">
                  <strong>${data.firstName} ${data.lastName}</strong><br>
                  📧 ${data.email}<br>
                  ${data.phone ? `📱 ${data.phone}<br>` : ''}
                  ${data.company ? `🏢 ${data.company}<br>` : ''}
                </div>
              </div>

              <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">${data.subject}</div>
              </div>

              <div class="field">
                <div class="field-label">Message</div>
                <div class="field-value">${data.message.replace(/\n/g, '<br>')}</div>
              </div>

              ${data.services.length > 0 ? `
                <div class="field">
                  <div class="field-label">Interested Services</div>
                  <div class="field-value">
                    <div class="services">
                      ${data.services.map(service => `<span class="service-tag">${service}</span>`).join('')}
                    </div>
                  </div>
                </div>
              ` : ''}

              ${data.budget ? `
                <div class="field">
                  <div class="field-label">Budget Range</div>
                  <div class="field-value">${data.budget}</div>
                </div>
              ` : ''}

              ${data.timeline ? `
                <div class="field">
                  <div class="field-label">Project Timeline</div>
                  <div class="field-value">${data.timeline}</div>
                </div>
              ` : ''}

              <div class="field">
                <div class="field-label">Submitted At</div>
                <div class="field-value">${data.submittedAt.toLocaleString()}</div>
              </div>
            </div>

            <div class="footer">
              <p>This email was generated automatically from the ContainerCode Advisory contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateContactConfirmationHtml(data: ContactFormEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You - ContainerCode Advisory</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; }
            .contact-info { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Thank You, ${data.firstName}!</h1>
              <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px;">We've received your message</p>
            </div>
            
            <div class="content">
              <p>Thank you for contacting ContainerCode Advisory. We've received your inquiry about "${data.subject}" and our team will review it shortly.</p>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your submission within 24 hours</li>
                <li>A senior consultant will reach out to discuss your specific needs</li>
                <li>We'll schedule a complimentary consultation to explore how we can help</li>
              </ul>

              <div class="contact-info">
                <h3 style="margin-top: 0; color: #1e40af;">Need immediate assistance?</h3>
                <p style="margin-bottom: 0;">
                  📧 Email: contact@containercode.com<br>
                  📱 Phone: +1 (555) 123-4567<br>
                  🌐 Website: containercode.com
                </p>
              </div>

              <p>In the meantime, feel free to explore our resources and insights on cloud transformation, DevOps best practices, and cybersecurity solutions.</p>

              <div style="text-align: center;">
                <a href="https://containercode.com/blog" class="cta-button">Explore Our Blog</a>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0; color: #64748b;">
                Best regards,<br>
                <strong>The ContainerCode Advisory Team</strong>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateNewsletterHtml(data: NewsletterEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
            .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6, #8b5cf6); color: white; padding: 40px 30px; text-align: center; position: relative; }
            .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
            .content { padding: 40px 30px; }
            .topic-tags { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
            .topic-tag { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 6px 16px; border-radius: 25px; font-size: 14px; font-weight: 500; }
            .footer { background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 30px; text-align: center; }
            .unsubscribe { font-size: 12px; color: #64748b; margin-top: 20px; }
            .unsubscribe a { color: #64748b; text-decoration: underline; }
            .newsletter-content { background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #3b82f6; }
            .cta-section { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: white; color: #1e40af; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 32px; position: relative; z-index: 1;">📧 ${data.title}</h1>
              <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 18px; position: relative; z-index: 1;">ContainerCode Advisory Newsletter</p>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; color: #1e40af; font-weight: 500;">Hello ${data.subscriberName || 'Valued Subscriber'}! 👋</p>
              
              <p style="font-size: 16px; color: #4b5563;">${data.excerpt}</p>

              ${data.topics.length > 0 ? `
                <div class="topic-tags">
                  ${data.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                </div>
              ` : ''}

              <div class="newsletter-content">
                ${data.content}
              </div>

              <div class="cta-section">
                <h3 style="margin: 0 0 15px 0; font-size: 24px;">Ready to Transform Your Business? 🚀</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Let's discuss how ContainerCode Advisory can accelerate your cloud journey.</p>
                <a href="https://containercode.com/contact" class="cta-button">Schedule a Free Consultation</a>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0 0 15px 0; color: #1e40af; font-weight: 600; font-size: 18px;">
                ContainerCode Advisory
              </p>
              <p style="margin: 0 0 15px 0; color: #64748b;">
                Leading Cloud Consulting & Digital Transformation
              </p>
              <p style="margin: 0; color: #64748b;">
                📧 contact@containercode.com | 📱 +1 (555) 123-4567 | 🌐 containercode.com
              </p>
              
              <div class="unsubscribe">
                <p>You're receiving this because you subscribed to our newsletter.</p>
                <p><a href="${data.unsubscribeUrl}">Unsubscribe</a> | <a href="https://containercode.com/newsletter/preferences">Manage Preferences</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateWelcomeHtml(firstName?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ContainerCode Advisory</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6, #8b5cf6); color: white; padding: 50px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .welcome-section { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .feature-list { list-style: none; padding: 0; }
            .feature-list li { background: #f8fafc; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { background: #f8fafc; padding: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 36px;">🎉 Welcome!</h1>
              <p style="margin: 20px 0 0 0; opacity: 0.9; font-size: 20px;">You're now part of the ContainerCode community</p>
            </div>
            
            <div class="content">
              <div class="welcome-section">
                <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 28px;">Hello ${firstName || 'there'}! 👋</h2>
                <p style="margin: 0; font-size: 18px; color: #4b5563;">Thank you for subscribing to our newsletter. You're about to receive cutting-edge insights on cloud technology and digital transformation.</p>
              </div>

              <h3 style="color: #1e40af; font-size: 22px;">What to expect:</h3>
              <ul class="feature-list">
                <li><strong>🚀 Latest Cloud Trends</strong> - Stay ahead with emerging technologies and best practices</li>
                <li><strong>💡 Expert Insights</strong> - Deep dives into DevOps, cybersecurity, and digital transformation</li>
                <li><strong>📊 Case Studies</strong> - Real-world success stories and lessons learned</li>
                <li><strong>🛠️ Practical Tips</strong> - Actionable advice you can implement immediately</li>
                <li><strong>🎯 Industry News</strong> - Curated updates on what matters most</li>
              </ul>

              <p style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                <strong>💡 Pro Tip:</strong> Add contact@containercode.com to your contacts to ensure our emails land in your inbox!
              </p>

              <div style="text-align: center;">
                <p style="font-size: 18px; color: #1e40af; font-weight: 500;">Ready to start your cloud transformation journey?</p>
                <a href="https://containercode.com/contact" class="cta-button">Schedule a Free Consultation</a>
              </div>
            </div>

            <div class="footer">
              <p style="margin: 0 0 15px 0; color: #1e40af; font-weight: 600; font-size: 18px;">
                The ContainerCode Advisory Team
              </p>
              <p style="margin: 0; color: #64748b;">
                Leading businesses through successful cloud transformations since 2020
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}