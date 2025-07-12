import { Resend } from 'resend';
import { ContactFormData } from './validations';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(resendApiKey);

// Email configuration
export const EMAIL_CONFIG = {
  fromEmail: 'ContainerCode Advisory <hello@containercode.club>',
  replyTo: 'info@containercode.club',
  supportEmail: 'support@containercode.club',
  domain: 'containercode.club',
};

// Email templates
export const emailTemplates = {
  // Contact form notification to team
  contactFormNotification: (data: ContactFormData) => ({
    from: EMAIL_CONFIG.fromEmail,
    to: [EMAIL_CONFIG.supportEmail],
    subject: `New contact form submission from ${data.name}`,
    html: generateContactFormNotificationHtml(data),
  }),
  
  // Contact form confirmation to user
  contactFormConfirmation: (data: ContactFormData) => ({
    from: EMAIL_CONFIG.fromEmail,
    to: [data.email],
    subject: 'Thank you for contacting ContainerCode Advisory',
    html: generateContactFormConfirmationHtml(data),
  }),
  
  // Newsletter welcome email
  newsletterWelcome: (email: string) => ({
    from: EMAIL_CONFIG.fromEmail,
    to: [email],
    subject: 'Welcome to the ContainerCode Advisory Newsletter',
    html: generateNewsletterWelcomeHtml(email),
  }),
};

// HTML template generators
function generateContactFormNotificationHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <p>A new contact form has been submitted on the ContainerCode Advisory website:</p>
            
            <div class="field">
              <div class="label">Name:</div>
              <div>${data.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div>${data.email}</div>
            </div>
            
            <div class="field">
              <div class="label">Service of Interest:</div>
              <div>${data.service}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div>${data.message}</div>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated email from the ContainerCode Advisory website.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateContactFormConfirmationHtml(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for contacting ContainerCode Advisory</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Reaching Out</h1>
          </div>
          <div class="content">
            <p>Hello ${data.name},</p>
            
            <p>Thank you for contacting ContainerCode Advisory. We've received your message and will get back to you within 24-48 hours. Our team is reviewing your inquiry and will provide the information you need about our ${data.service} services.</p>
            
            <p>If you have any urgent questions, please don't hesitate to call us at +1 (123) 456-7890.</p>
            
            <a href="https://containercode.club" class="button">Visit Our Website</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ContainerCode Advisory. All rights reserved.</p>
            <p>123 Tech Plaza, San Francisco, CA 94103</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateNewsletterWelcomeHtml(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to the ContainerCode Advisory Newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          .topics { margin: 20px 0; }
          .topic { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Newsletter</h1>
          </div>
          <div class="content">
            <p>Thank you for subscribing to the ContainerCode Advisory newsletter!</p>
            
            <p>You'll now receive our monthly updates featuring:</p>
            
            <div class="topics">
              <div class="topic">🚀 Latest cloud technology trends and insights</div>
              <div class="topic">🔒 Cybersecurity best practices and updates</div>
              <div class="topic">⚙️ DevOps methodologies and implementation strategies</div>
              <div class="topic">📈 Case studies and success stories</div>
              <div class="topic">📚 Free resources and tools</div>
            </div>
            
            <p>Our next newsletter will be sent on the first Tuesday of next month. In the meantime, feel free to explore our resources:</p>
            
            <a href="https://containercode.club/blog" class="button">Read Our Blog</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ContainerCode Advisory. All rights reserved.</p>
            <p>You're receiving this email because you signed up for our newsletter.</p>
            <p>To unsubscribe, <a href="https://containercode.club/unsubscribe?email=${encodeURIComponent(email)}">click here</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
