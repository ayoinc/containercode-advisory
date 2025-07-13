import { NextResponse } from 'next/server';

interface Subscriber {
  email: string;
  name?: string;
  subscribed_at: string;
}

interface NewsletterRequest {
  subscribers: string[] | Subscriber[];
  content: string;
  articles: Array<{
    title: string;
    slug: string;
    excerpt: string;
    category: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const { subscribers, content, articles }: NewsletterRequest = await request.json();

    // This would typically be handled by a Cloudflare Worker
    // For now, we'll simulate the newsletter sending process
    
    const emailPromises = subscribers.map(async (subscriber) => {
      const email = typeof subscriber === 'string' ? subscriber : subscriber.email;
      
      try {
        // Send individual email via Resend API
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'ContainerCode Advisory <newsletter@containercode.com>',
            to: [email],
            subject: `Latest Insights: ${articles.map(a => a.category).join(', ')} Trends`,
            html: content,
            text: createPlainTextNewsletter(articles)
          })
        });

        if (emailResponse.ok) {
          return { email, status: 'sent' };
        } else {
          const errorData = await emailResponse.json();
          return { email, status: 'failed', error: errorData.message };
        }
      } catch (error) {
        return { 
          email, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.status === 'sent').length;
    const failureCount = results.filter(r => r.status === 'failed').length;

    // Log newsletter sending activity
    await logNewsletterActivity({
      type: 'newsletter_sent',
      timestamp: new Date().toISOString(),
      details: {
        total_subscribers: subscribers.length,
        successful_sends: successCount,
        failed_sends: failureCount,
        articles_count: articles.length,
        article_titles: articles.map(a => a.title)
      }
    });

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers`,
      details: {
        total: subscribers.length,
        successful: successCount,
        failed: failureCount,
        results
      }
    });

  } catch (error) {
    console.error('Newsletter sending failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Newsletter sending failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function createPlainTextNewsletter(articles: NewsletterRequest['articles']): string {
  return `
ContainerCode Advisory Newsletter

Hello,

We're pleased to share our latest insights and analysis on trending technology topics.

${articles.map(article => `
${article.title}
${article.excerpt}
Read more: https://containercode.com/blog/${article.slug}

`).join('')}

Best regards,
The ContainerCode Advisory Team

---
You're receiving this because you subscribed to our newsletter.
Unsubscribe: https://containercode.com/api/unsubscribe
  `.trim();
}

async function logNewsletterActivity(activity: any): Promise<void> {
  try {
    // Store activity in Cloudflare KV for tracking
    const kvResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/newsletter_log_${Date.now()}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      }
    );

    if (!kvResponse.ok) {
      console.warn('Failed to log newsletter activity to KV');
    }
  } catch (error) {
    console.warn('Failed to log newsletter activity:', error);
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter sending API endpoint',
    usage: 'POST /api/send-newsletter with subscribers, content, and articles',
    timestamp: new Date().toISOString()
  });
}