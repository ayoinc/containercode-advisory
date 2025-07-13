interface Env {
  BRAVE_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  RESEND_API_KEY: string;
  NOTION_TOKEN: string;
  NOTION_NEWSLETTERS_DATABASE_ID: string;
  NOTION_SUBSCRIBERS_DATABASE_ID: string;
  ADMIN_EMAIL: string;
}

// This function will be triggered by Cloudflare Cron Jobs
export async function onRequest(context: { request: Request; env: Env }) {
  try {
    const { env } = context;
    
    // Generate daily newsletter
    const generateResponse = await generateDailyNewsletter(env);
    
    if (!generateResponse.success) {
      throw new Error('Failed to generate newsletter');
    }

    const newsletterId = generateResponse.newsletterId;
    
    // Send to daily subscribers
    const sendResponse = await sendToSubscribers(newsletterId, 'daily', env);
    
    // Check if it's Monday (send weekly newsletter)
    const today = new Date();
    const isMonday = today.getDay() === 1;
    
    if (isMonday) {
      await sendToSubscribers(newsletterId, 'weekly', env);
    }

    // Check if it's the 1st of the month (send monthly newsletter)
    const isFirstOfMonth = today.getDate() === 1;
    
    if (isFirstOfMonth) {
      await sendToSubscribers(newsletterId, 'monthly', env);
    }

    // Send completion notification to admin
    await sendAdminCompletionNotification(generateResponse, sendResponse, env);

    return new Response(JSON.stringify({
      success: true,
      message: 'Daily newsletter automation completed',
      newsletter: generateResponse,
      distribution: sendResponse,
      weeklyAlsoSent: isMonday,
      monthlyAlsoSent: isFirstOfMonth
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Daily newsletter automation error:', error);
    
    // Send error notification to admin
    await sendAdminErrorNotification(error, context.env);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function generateDailyNewsletter(env: Env): Promise<any> {
  const response = await fetch('https://containercode.com/api/newsletter-generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      source: 'automated_daily'
    })
  });

  if (!response.ok) {
    throw new Error(`Newsletter generation failed: ${response.statusText}`);
  }

  return await response.json();
}

async function sendToSubscribers(newsletterId: string, frequency: string, env: Env): Promise<any> {
  const response = await fetch('https://containercode.com/api/newsletter-send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newsletterId,
      frequency
    })
  });

  if (!response.ok) {
    throw new Error(`Newsletter sending failed: ${response.statusText}`);
  }

  return await response.json();
}

async function sendAdminCompletionNotification(generateResult: any, sendResult: any, env: Env): Promise<void> {
  const today = new Date();
  const isMonday = today.getDay() === 1;
  const isFirstOfMonth = today.getDate() === 1;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .success-box { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 24px; font-weight: 700; color: #1e40af; }
          .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-top: 5px; }
          .frequency-badge { background: #dbeafe; color: #1d4ed8; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 0 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">✅ Daily Newsletter Automation Complete</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${today.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <div class="content">
            <div class="success-box">
              <h3 style="margin: 0 0 10px 0; color: #059669;">🎉 Newsletter Generated & Distributed Successfully!</h3>
              <p style="margin: 0;"><strong>Title:</strong> ${generateResult.title}</p>
            </div>

            <h4 style="color: #1e40af; margin: 25px 0 15px 0;">Distribution Summary:</h4>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${sendResult.sentCount || 0}</div>
                <div class="stat-label">Daily Subscribers</div>
              </div>
              ${isMonday ? `
                <div class="stat">
                  <div class="stat-number">Weekly</div>
                  <div class="stat-label">Also Sent</div>
                </div>
              ` : ''}
              ${isFirstOfMonth ? `
                <div class="stat">
                  <div class="stat-number">Monthly</div>
                  <div class="stat-label">Also Sent</div>
                </div>
              ` : ''}
              <div class="stat">
                <div class="stat-number">${sendResult.failedCount || 0}</div>
                <div class="stat-label">Failed</div>
              </div>
            </div>

            <h4 style="color: #1e40af; margin: 25px 0 15px 0;">Frequency Schedule:</h4>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <span class="frequency-badge">DAILY</span> Every day at 9:00 AM UTC<br><br>
              <span class="frequency-badge">WEEKLY</span> Every Monday (with daily newsletter)<br><br>
              <span class="frequency-badge">MONTHLY</span> 1st of each month (with daily newsletter)
            </div>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af;">Next Actions:</h4>
              <p style="margin: 0; color: #4b5563;">
                ✅ Newsletter stored in Notion database<br>
                ✅ All active subscribers notified<br>
                ✅ Analytics updated<br>
                📊 <a href="https://notion.so/newsletters" style="color: #2563eb;">View in Notion</a>
              </p>
            </div>

            ${sendResult.failedCount > 0 ? `
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p style="margin: 0; color: #dc2626; font-weight: 500;">
                  ⚠️ <strong>${sendResult.failedCount} emails failed to send.</strong> 
                  Please check the logs and consider manual retry for failed addresses.
                </p>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ContainerCode Newsletter System <system@containercode.com>',
        to: env.ADMIN_EMAIL,
        subject: `✅ Daily Newsletter Automation Complete - ${sendResult.sentCount} sent`,
        html
      })
    });
  } catch (error) {
    console.error('Failed to send admin completion notification:', error);
  }
}

async function sendAdminErrorNotification(error: any, env: Env): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .error-box { background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🚨 Newsletter Automation Failed</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${new Date().toLocaleString()}</p>
          </div>
          
          <div class="content">
            <div class="error-box">
              <h3 style="margin: 0 0 10px 0; color: #dc2626;">Error Details:</h3>
              <p style="margin: 0; font-family: monospace; background: white; padding: 10px; border-radius: 4px;">
                ${error.message || 'Unknown error occurred'}
              </p>
            </div>

            <h4 style="color: #1e40af; margin: 25px 0 15px 0;">Recommended Actions:</h4>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
              <ul style="margin: 0; padding-left: 20px; color: #374151;">
                <li>Check API key configurations</li>
                <li>Verify Notion database connections</li>
                <li>Review Cloudflare function logs</li>
                <li>Test individual API endpoints</li>
                <li>Consider manual newsletter generation as fallback</li>
              </ul>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: 500;">
                ⚠️ <strong>Subscribers have not received today's newsletter.</strong><br>
                Please investigate and resolve the issue promptly.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ContainerCode Newsletter System <system@containercode.com>',
        to: env.ADMIN_EMAIL,
        subject: '🚨 URGENT: Daily Newsletter Automation Failed',
        html
      })
    });
  } catch (emailError) {
    console.error('Failed to send admin error notification:', emailError);
  }
}