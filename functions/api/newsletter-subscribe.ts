interface Env {
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
  NOTION_TOKEN: string;
  NOTION_SUBSCRIBERS_DATABASE_ID: string;
}

interface SubscriptionData {
  email: string;
  firstName?: string;
  lastName?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interests: string[];
  source: string;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    
    // Parse form data
    const subscriptionData: SubscriptionData = await request.json();
    
    // Validate required fields
    if (!subscriptionData.email || !subscriptionData.frequency) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Check if subscriber already exists
    const exists = await checkSubscriberExists(subscriptionData.email, env);
    if (exists) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email already subscribed to our newsletter.' 
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create subscriber in Notion
    const subscriberId = await createSubscriberInNotion(subscriptionData, env);
    
    // Send welcome email to subscriber
    await sendWelcomeEmail(subscriptionData, env);
    
    // Send notification email to admin
    await sendAdminSubscriptionNotification(subscriptionData, env);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Successfully subscribed to newsletter! Welcome email sent.',
      subscriberId
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to process subscription' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions(context: { request: Request }) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function checkSubscriberExists(email: string, env: Env): Promise<boolean> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_SUBSCRIBERS_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: {
          property: 'Email',
          title: {
            equals: email
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.length > 0;
  } catch (error) {
    console.error('Error checking subscriber existence:', error);
    return false;
  }
}

async function createSubscriberInNotion(subscriber: SubscriptionData, env: Env): Promise<string> {
  const unsubscribeToken = generateUnsubscribeToken();
  
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { 
        database_id: env.NOTION_SUBSCRIBERS_DATABASE_ID 
      },
      properties: {
        'Email': {
          title: [
            {
              text: {
                content: subscriber.email
              }
            }
          ]
        },
        'First Name': {
          rich_text: subscriber.firstName ? [
            {
              text: {
                content: subscriber.firstName
              }
            }
          ] : []
        },
        'Last Name': {
          rich_text: subscriber.lastName ? [
            {
              text: {
                content: subscriber.lastName
              }
            }
          ] : []
        },
        'Frequency': {
          select: {
            name: subscriber.frequency
          }
        },
        'Interests': {
          multi_select: subscriber.interests.map(interest => ({ name: interest }))
        },
        'Status': {
          select: {
            name: 'active'
          }
        },
        'Source': {
          select: {
            name: subscriber.source
          }
        },
        'Unsubscribe Token': {
          rich_text: [
            {
              text: {
                content: unsubscribeToken
              }
            }
          ]
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Notion API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  return data.id;
}

async function sendWelcomeEmail(subscriber: SubscriptionData, env: Env) {
  const html = generateWelcomeEmailHtml(subscriber);
  
  const emailPayload = {
    from: 'ContainerCode Advisory <noreply@containercode.com>',
    to: subscriber.email,
    reply_to: env.ADMIN_EMAIL,
    subject: '🎉 Welcome to ContainerCode Advisory Newsletter!',
    html
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  });

  if (!response.ok) {
    throw new Error(`Failed to send welcome email: ${response.statusText}`);
  }
}

async function sendAdminSubscriptionNotification(subscriber: SubscriptionData, env: Env) {
  const html = generateAdminSubscriptionHtml(subscriber);
  
  const emailPayload = {
    from: 'ContainerCode Advisory <noreply@containercode.com>',
    to: env.ADMIN_EMAIL,
    subject: '📧 New Newsletter Subscription',
    html
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailPayload)
  });

  if (!response.ok) {
    throw new Error(`Failed to send admin notification: ${response.statusText}`);
  }
}

function generateWelcomeEmailHtml(subscriber: SubscriptionData): string {
  const frequencyText = {
    daily: 'every day',
    weekly: 'every week', 
    monthly: 'every month'
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6, #8b5cf6); color: white; padding: 50px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .welcome-section { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
          .feature-list { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; }
          .feature-item { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #3b82f6; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 10px; }
          .frequency-badge { background: #dbeafe; color: #1d4ed8; padding: 8px 16px; border-radius: 20px; font-weight: 600; display: inline-block; margin: 10px 0; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 36px;">🎉 Welcome to the Community!</h1>
            <p style="margin: 20px 0 0 0; opacity: 0.9; font-size: 20px;">You're now part of ContainerCode Advisory's expert network</p>
          </div>
          
          <div class="content">
            <div class="welcome-section">
              <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 28px;">Hello ${subscriber.firstName || 'there'}! 👋</h2>
              <p style="margin: 0; font-size: 18px; color: #4b5563;">Thank you for subscribing to our newsletter. You'll receive cutting-edge insights <strong>${frequencyText[subscriber.frequency]}</strong>.</p>
              <div class="frequency-badge">${subscriber.frequency.toUpperCase()} DELIVERY</div>
            </div>

            <div class="feature-list">
              <h3 style="margin: 0 0 20px 0; color: #1e40af; font-size: 22px;">What you can expect:</h3>
              
              <div class="feature-item">
                <strong>🚀 Latest Cloud Trends</strong><br>
                <span style="color: #64748b;">Stay ahead with emerging technologies and industry insights</span>
              </div>
              
              <div class="feature-item">
                <strong>💡 Expert Analysis</strong><br>
                <span style="color: #64748b;">Deep dives into DevOps, cybersecurity, and digital transformation</span>
              </div>
              
              <div class="feature-item">
                <strong>📊 Real Case Studies</strong><br>
                <span style="color: #64748b;">Success stories and lessons from enterprise transformations</span>
              </div>
              
              <div class="feature-item">
                <strong>🛠️ Actionable Tips</strong><br>
                <span style="color: #64748b;">Practical advice you can implement immediately</span>
              </div>
            </div>

            ${subscriber.interests.length > 0 ? `
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin: 0 0 10px 0; color: #92400e;">Your Selected Interests:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${subscriber.interests.map(interest => `
                    <span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">${interest}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div style="background: #f0f9ff; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af;">Ready to accelerate your cloud journey? 🚀</h3>
              <p style="margin: 0 0 20px 0; color: #4b5563;">Let's discuss how ContainerCode Advisory can transform your business.</p>
              <a href="https://containercode.com/contact" class="cta-button">Schedule Free Consultation</a>
              <a href="https://containercode.com/blog" class="cta-button" style="background: linear-gradient(135deg, #059669, #10b981);">Explore Our Blog</a>
            </div>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 25px 0;">
              <p style="margin: 0; color: #dc2626; font-weight: 500;">
                💡 <strong>Pro Tip:</strong> Add noreply@containercode.com to your contacts to ensure our newsletters land in your inbox!
              </p>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 15px 0; color: #1e40af; font-weight: 600; font-size: 18px;">The ContainerCode Advisory Team</p>
            <p style="margin: 0 0 15px 0; color: #64748b;">Leading businesses through successful cloud transformations</p>
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              You can <a href="https://containercode.com/newsletter/preferences" style="color: #64748b;">manage your preferences</a> or 
              <a href="https://containercode.com/unsubscribe" style="color: #64748b;">unsubscribe</a> at any time.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateAdminSubscriptionHtml(subscriber: SubscriptionData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .field { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #10b981; }
          .field-label { font-weight: 600; color: #065f46; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; }
          .field-value { font-size: 16px; color: #374151; }
          .interests { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
          .interest-tag { background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📧 New Newsletter Subscription</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone joined our community!</p>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="field-label">📧 Email Address</div>
              <div class="field-value"><strong>${subscriber.email}</strong></div>
            </div>

            <div class="field">
              <div class="field-label">👤 Name</div>
              <div class="field-value">
                ${subscriber.firstName || 'Not provided'} ${subscriber.lastName || ''}
              </div>
            </div>

            <div class="field">
              <div class="field-label">📅 Frequency</div>
              <div class="field-value">
                <strong style="color: #1e40af; text-transform: uppercase;">${subscriber.frequency}</strong>
              </div>
            </div>

            <div class="field">
              <div class="field-label">🎯 Source</div>
              <div class="field-value">${subscriber.source}</div>
            </div>

            ${subscriber.interests.length > 0 ? `
              <div class="field">
                <div class="field-label">🏷️ Interests</div>
                <div class="field-value">
                  <div class="interests">
                    ${subscriber.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="field">
              <div class="field-label">⏰ Subscribed At</div>
              <div class="field-value">${new Date().toLocaleString()}</div>
            </div>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 25px; text-align: center;">
              <p style="margin: 0; color: #1e40af; font-weight: 500;">
                🎉 <strong>Total Newsletter Subscribers Growing!</strong><br>
                <span style="color: #64748b;">Welcome email has been sent automatically.</span>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateUnsubscribeToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}