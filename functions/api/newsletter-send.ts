interface Env {
  RESEND_API_KEY: string;
  NOTION_TOKEN: string;
  NOTION_SUBSCRIBERS_DATABASE_ID: string;
  NOTION_NEWSLETTERS_DATABASE_ID: string;
  ADMIN_EMAIL: string;
}

interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  unsubscribeToken: string;
}

interface Newsletter {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  topics: string[];
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { request, env } = context;
    const { frequency = 'daily', newsletterId } = await request.json();
    
    let newsletter: Newsletter | null = null;
    
    if (newsletterId) {
      // Send specific newsletter
      const foundNewsletter = await getNewsletterById(newsletterId, env);
      if (foundNewsletter) {
        newsletter = foundNewsletter;
      }
    } else {
      // Get the latest published newsletter
      const latestNewsletter = await getLatestNewsletter(env);
      if (latestNewsletter) {
        newsletter = latestNewsletter;
      }
    }
    
    if (!newsletter) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No newsletter found to send' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get active subscribers for the frequency
    const subscribers = await getActiveSubscribersByFrequency(frequency, env);
    
    if (subscribers.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: `No active ${frequency} subscribers found`,
        sentCount: 0
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send newsletter to all subscribers
    const results = await sendNewsletterToSubscribers(newsletter, subscribers, env);
    
    // Update newsletter sent count in Notion
    await updateNewsletterSentCount(newsletter.id, results.success, env);
    
    // Send summary to admin
    await sendAdminSummary(newsletter, results, frequency, env);

    return new Response(JSON.stringify({ 
      success: true, 
      newsletterId: newsletter.id,
      title: newsletter.title,
      sentCount: results.success,
      failedCount: results.failed,
      totalSubscribers: subscribers.length
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to send newsletter' 
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

async function getNewsletterById(newsletterId: string, env: Env): Promise<Newsletter | null> {
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${newsletterId}`, {
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const page = await response.json();
    
    // Get page content
    const contentResponse = await fetch(`https://api.notion.com/v1/blocks/${newsletterId}/children`, {
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });

    let content = '';
    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      content = extractContentFromBlocks(contentData.results);
    }

    return {
      id: page.id,
      title: page.properties.Title?.title[0]?.text?.content || '',
      content: content || page.properties.Excerpt?.rich_text[0]?.text?.content || '',
      excerpt: page.properties.Excerpt?.rich_text[0]?.text?.content || '',
      topics: page.properties.Topics?.multi_select?.map((topic: any) => topic.name) || []
    };
  } catch (error) {
    console.error('Error fetching newsletter by ID:', error);
    return null;
  }
}

async function getLatestNewsletter(env: Env): Promise<Newsletter | null> {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${env.NOTION_NEWSLETTERS_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: {
          property: 'Status',
          select: {
            equals: 'published'
          }
        },
        sorts: [
          {
            property: 'Created',
            direction: 'descending'
          }
        ],
        page_size: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.results.length === 0) {
      return null;
    }

    const page = data.results[0];
    
    // Get page content
    const contentResponse = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28'
      }
    });

    let content = '';
    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      content = extractContentFromBlocks(contentData.results);
    }

    return {
      id: page.id,
      title: page.properties.Title?.title[0]?.text?.content || '',
      content: content || page.properties.Excerpt?.rich_text[0]?.text?.content || '',
      excerpt: page.properties.Excerpt?.rich_text[0]?.text?.content || '',
      topics: page.properties.Topics?.multi_select?.map((topic: any) => topic.name) || []
    };
  } catch (error) {
    console.error('Error fetching latest newsletter:', error);
    return null;
  }
}

async function getActiveSubscribersByFrequency(frequency: string, env: Env): Promise<Subscriber[]> {
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
          and: [
            {
              property: 'Status',
              select: {
                equals: 'active'
              }
            },
            {
              property: 'Frequency',
              select: {
                equals: frequency
              }
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.results.map((page: any) => ({
      id: page.id,
      email: page.properties.Email?.title[0]?.text?.content || '',
      firstName: page.properties['First Name']?.rich_text[0]?.text?.content,
      unsubscribeToken: page.properties['Unsubscribe Token']?.rich_text[0]?.text?.content || ''
    }));
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}

async function sendNewsletterToSubscribers(newsletter: Newsletter, subscribers: Subscriber[], env: Env): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Send emails in batches to avoid rate limits
  const batchSize = 25;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    
    const emailPromises = batch.map(async (subscriber) => {
      try {
        const html = generateNewsletterEmailHtml(newsletter, subscriber);
        
        const emailPayload = {
          from: 'ContainerCode Advisory Newsletter <newsletter@containercode.com>',
          to: subscriber.email,
          reply_to: env.ADMIN_EMAIL,
          subject: newsletter.title,
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
          throw new Error(`Resend API error: ${response.statusText}`);
        }

        // Update subscriber's last email sent date
        await updateSubscriberLastEmailSent(subscriber.id, env);
        
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
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return { success, failed };
}

async function updateNewsletterSentCount(newsletterId: string, sentCount: number, env: Env): Promise<void> {
  try {
    await fetch(`https://api.notion.com/v1/pages/${newsletterId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        properties: {
          'Sent Count': {
            number: sentCount
          }
        }
      })
    });
  } catch (error) {
    console.error('Error updating newsletter sent count:', error);
  }
}

async function updateSubscriberLastEmailSent(subscriberId: string, env: Env): Promise<void> {
  try {
    await fetch(`https://api.notion.com/v1/pages/${subscriberId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        properties: {
          'Last Email Sent': {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      })
    });
  } catch (error) {
    console.error('Error updating subscriber last email sent:', error);
  }
}

async function sendAdminSummary(newsletter: Newsletter, results: { success: number; failed: number }, frequency: string, env: Env): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .stats { display: flex; justify-content: space-around; background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .stat { text-align: center; }
          .stat-number { font-size: 24px; font-weight: 700; color: #1e40af; }
          .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
          .success { color: #059669; }
          .failed { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📊 Newsletter Send Summary</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${frequency.toUpperCase()} Newsletter Distribution Complete</p>
          </div>
          
          <div class="content">
            <h3 style="color: #1e40af; margin: 0 0 15px 0;">${newsletter.title}</h3>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number success">${results.success}</div>
                <div class="stat-label">Sent Successfully</div>
              </div>
              <div class="stat">
                <div class="stat-number failed">${results.failed}</div>
                <div class="stat-label">Failed</div>
              </div>
              <div class="stat">
                <div class="stat-number">${results.success + results.failed}</div>
                <div class="stat-label">Total Attempted</div>
              </div>
            </div>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #1e40af;">Newsletter Details:</h4>
              <p style="margin: 0;"><strong>Topics:</strong> ${newsletter.topics.join(', ')}</p>
              <p style="margin: 8px 0 0 0;"><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
            </div>

            ${results.failed > 0 ? `
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p style="margin: 0; color: #dc2626; font-weight: 500;">
                  ⚠️ <strong>${results.failed} emails failed to send.</strong> Check logs for details.
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
        subject: `📊 ${frequency.toUpperCase()} Newsletter Sent: ${results.success} delivered`,
        html
      })
    });
  } catch (error) {
    console.error('Failed to send admin summary:', error);
  }
}

function generateNewsletterEmailHtml(newsletter: Newsletter, subscriber: Subscriber): string {
  const unsubscribeUrl = `https://containercode.com/unsubscribe?token=${subscriber.unsubscribeToken}`;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletter.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
          .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6, #8b5cf6); color: white; padding: 40px 30px; text-align: center; position: relative; }
          .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3; }
          .logo { font-size: 24px; font-weight: 700; margin-bottom: 10px; position: relative; z-index: 1; }
          .content { padding: 40px 30px; }
          .topic-tags { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
          .topic-tag { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 6px 16px; border-radius: 25px; font-size: 14px; font-weight: 500; }
          .newsletter-content { background: #f8fafc; padding: 30px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #3b82f6; line-height: 1.8; }
          .newsletter-content h1, .newsletter-content h2, .newsletter-content h3 { color: #1e40af; margin-top: 25px; margin-bottom: 15px; }
          .newsletter-content p { margin: 15px 0; }
          .newsletter-content ul, .newsletter-content ol { margin: 15px 0; padding-left: 25px; }
          .newsletter-content li { margin: 8px 0; }
          .cta-section { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
          .cta-button { display: inline-block; background: white; color: #1e40af; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 15px 10px; }
          .footer { background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 30px; text-align: center; }
          .unsubscribe { font-size: 12px; color: #64748b; margin-top: 20px; }
          .unsubscribe a { color: #64748b; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo" style="position: relative; z-index: 1;">📧 ContainerCode Advisory</div>
            <h1 style="margin: 0; font-size: 28px; position: relative; z-index: 1;">${newsletter.title}</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px; position: relative; z-index: 1;">
              ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <div class="content">
            <p style="font-size: 18px; color: #1e40af; font-weight: 500;">Hello ${subscriber.firstName || 'Valued Subscriber'}! 👋</p>
            
            <p style="font-size: 16px; color: #4b5563;">${newsletter.excerpt}</p>

            ${newsletter.topics.length > 0 ? `
              <div class="topic-tags">
                ${newsletter.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
              </div>
            ` : ''}

            <div class="newsletter-content">
              ${formatNewsletterContent(newsletter.content)}
            </div>

            <div class="cta-section">
              <h3 style="margin: 0 0 15px 0; font-size: 24px;">Ready to Accelerate Your Cloud Journey? 🚀</h3>
              <p style="margin: 0 0 20px 0; opacity: 0.9;">Let's discuss how ContainerCode Advisory can transform your business with cutting-edge cloud solutions.</p>
              <a href="https://containercode.com/contact" class="cta-button">Schedule Free Consultation</a>
              <a href="https://containercode.com/case-studies" class="cta-button">View Success Stories</a>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0; color: #92400e; font-weight: 500;">
                💡 <strong>Share the Knowledge:</strong> Forward this newsletter to colleagues who could benefit from these insights!
              </p>
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
              📧 ayoinc@me.com | 📱 +1 (555) 123-4567 | 🌐 containercode.com
            </p>
            
            <div class="unsubscribe">
              <p>You're receiving this because you subscribed to our newsletter.</p>
              <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="https://containercode.com/newsletter/preferences">Manage Preferences</a></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function extractContentFromBlocks(blocks: any[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.paragraph.rich_text.map((text: any) => text.text.content).join('');
      case 'heading_1':
        return `<h1>${block.heading_1.rich_text.map((text: any) => text.text.content).join('')}</h1>`;
      case 'heading_2':
        return `<h2>${block.heading_2.rich_text.map((text: any) => text.text.content).join('')}</h2>`;
      case 'heading_3':
        return `<h3>${block.heading_3.rich_text.map((text: any) => text.text.content).join('')}</h3>`;
      case 'bulleted_list_item':
        return `<li>${block.bulleted_list_item.rich_text.map((text: any) => text.text.content).join('')}</li>`;
      default:
        return '';
    }
  }).join('\n');
}

function formatNewsletterContent(content: string): string {
  // Convert markdown-like formatting to HTML
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
}