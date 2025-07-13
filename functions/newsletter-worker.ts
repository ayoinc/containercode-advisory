/**
 * Cloudflare Worker for Newsletter Processing
 * Handles newsletter generation, subscriber management, and email sending
 */

// Cloudflare Worker types
declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: any): Promise<any>;
  }

  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }

  interface ScheduledEvent {
    scheduledTime: number;
    cron: string;
  }
}

export interface Env {
  NEWSLETTER_KV: KVNamespace;
  BRAVE_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  PEXELS_API_KEY: string;
  RESEND_API_KEY: string;
  NOTION_API_KEY: string;
  NOTION_DATABASE_BLOG_POSTS: string;
  ADMIN_API_KEY: string;
}

interface Subscriber {
  email: string;
  name?: string;
  subscribed_at: string;
  preferences: {
    frequency: 'weekly' | 'monthly';
    topics: string[];
  };
  status: 'active' | 'unsubscribed';
  confirmation_token?: string;
}

interface NewsletterJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  articles_generated: number;
  subscribers_notified: number;
  error?: string;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Authentication check
      if (path.startsWith('/admin/') || path === '/newsletter/generate') {
        if (!isAuthenticated(request, env.ADMIN_API_KEY)) {
          return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        }
      }

      switch (path) {
        case '/newsletter/subscribe':
          return handleSubscribe(request, env);
        
        case '/newsletter/unsubscribe':
          return handleUnsubscribe(request, env);
        
        case '/newsletter/generate':
          return handleGenerateNewsletter(request, env, ctx);
        
        case '/admin/subscribers':
          return handleGetSubscribers(request, env);
        
        case '/admin/newsletter/status':
          return handleNewsletterStatus(request, env);
        
        case '/health':
          return new Response('OK', { headers: corsHeaders });
        
        default:
          return new Response('Not found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal server error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Scheduled newsletter generation (weekly on Mondays at 09:00 UTC)
    console.log('Running scheduled newsletter generation');
    
    try {
      const newsletterJob = await generateNewsletterContent(env);
      console.log(`Newsletter job completed: ${newsletterJob.id}`);
    } catch (error) {
      console.error('Scheduled newsletter generation failed:', error);
    }
  }
};

export default worker;

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { email, name, preferences } = await request.json();

    if (!email || !isValidEmail(email)) {
      return new Response('Valid email required', { status: 400 });
    }

    // Check if already subscribed
    const existing = await env.NEWSLETTER_KV.get(`subscriber:${email}`);
    if (existing) {
      const subscriber: Subscriber = JSON.parse(existing);
      if (subscriber.status === 'active') {
        return new Response('Already subscribed', { status: 400 });
      }
    }

    // Create new subscriber
    const subscriber: Subscriber = {
      email,
      name,
      subscribed_at: new Date().toISOString(),
      preferences: {
        frequency: preferences?.frequency || 'weekly',
        topics: preferences?.topics || []
      },
      status: 'active',
      confirmation_token: generateToken()
    };

    // Store subscriber
    await env.NEWSLETTER_KV.put(`subscriber:${email}`, JSON.stringify(subscriber));

    // Add to subscriber list
    await addToSubscriberList(env, email);

    // Send welcome email
    await sendWelcomeEmail(subscriber, env);

    // Log activity
    await logActivity(env, {
      type: 'subscription',
      email,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully subscribed to newsletter'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response('Subscription failed', { status: 500 });
  }
}

async function handleUnsubscribe(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');

  if (!email) {
    return new Response('Email required', { status: 400 });
  }

  try {
    // Get subscriber
    const existing = await env.NEWSLETTER_KV.get(`subscriber:${email}`);
    if (!existing) {
      return new Response('Subscriber not found', { status: 404 });
    }

    const subscriber: Subscriber = JSON.parse(existing);

    // Verify token if provided
    if (token && subscriber.confirmation_token !== token) {
      return new Response('Invalid token', { status: 400 });
    }

    // Update status
    subscriber.status = 'unsubscribed';
    await env.NEWSLETTER_KV.put(`subscriber:${email}`, JSON.stringify(subscriber));

    // Remove from active subscriber list
    await removeFromSubscriberList(env, email);

    // Log activity
    await logActivity(env, {
      type: 'unsubscription',
      email,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully unsubscribed'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response('Unsubscribe failed', { status: 500 });
  }
}

async function handleGenerateNewsletter(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Create newsletter job
    const jobId = generateToken();
    const job: NewsletterJob = {
      id: jobId,
      status: 'pending',
      created_at: new Date().toISOString(),
      articles_generated: 0,
      subscribers_notified: 0
    };

    await env.NEWSLETTER_KV.put(`job:${jobId}`, JSON.stringify(job));

    // Start newsletter generation (async)
    ctx.waitUntil(generateNewsletterContent(env, jobId));

    return new Response(JSON.stringify({
      success: true,
      job_id: jobId,
      message: 'Newsletter generation started'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Generate newsletter error:', error);
    return new Response('Newsletter generation failed', { status: 500 });
  }
}

async function handleGetSubscribers(request: Request, env: Env): Promise<Response> {
  try {
    const subscribers = await getActiveSubscribers(env);
    
    return new Response(JSON.stringify({
      count: subscribers.length,
      subscribers: subscribers.map(s => ({
        email: s.email,
        name: s.name,
        subscribed_at: s.subscribed_at,
        preferences: s.preferences
      }))
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    return new Response('Failed to get subscribers', { status: 500 });
  }
}

async function handleNewsletterStatus(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('job_id');

  if (!jobId) {
    return new Response('Job ID required', { status: 400 });
  }

  try {
    const jobData = await env.NEWSLETTER_KV.get(`job:${jobId}`);
    if (!jobData) {
      return new Response('Job not found', { status: 404 });
    }

    const job: NewsletterJob = JSON.parse(jobData);
    
    return new Response(JSON.stringify(job), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get status error:', error);
    return new Response('Failed to get status', { status: 500 });
  }
}

async function generateNewsletterContent(env: Env, jobId?: string): Promise<NewsletterJob> {
  const job: NewsletterJob = {
    id: jobId || generateToken(),
    status: 'processing',
    created_at: new Date().toISOString(),
    articles_generated: 0,
    subscribers_notified: 0
  };

  try {
    // Update job status
    await env.NEWSLETTER_KV.put(`job:${job.id}`, JSON.stringify(job));

    // 1. Search for trending topics
    const topics = await searchTrendingTopics(env);
    
    // 2. Generate articles with AI
    const articles = await generateArticlesWithAI(env, topics);
    job.articles_generated = articles.length;

    // 3. Publish to Notion
    for (const article of articles) {
      await publishToNotion(env, article);
    }

    // 4. Get subscribers and send notifications
    const subscribers = await getActiveSubscribers(env);
    const emailContent = createNewsletterEmail(articles);
    
    for (const subscriber of subscribers) {
      await sendNewsletterEmail(env, subscriber, emailContent, articles);
    }
    
    job.subscribers_notified = subscribers.length;
    job.status = 'completed';

    // Update final job status
    await env.NEWSLETTER_KV.put(`job:${job.id}`, JSON.stringify(job));

    return job;

  } catch (error) {
    console.error('Newsletter generation error:', error);
    job.status = 'failed';
    job.error = error instanceof Error ? error.message : 'Unknown error';
    await env.NEWSLETTER_KV.put(`job:${job.id}`, JSON.stringify(job));
    throw error;
  }
}

// Helper functions
function isAuthenticated(request: Request, adminApiKey: string): boolean {
  const authHeader = request.headers.get('Authorization');
  return authHeader === `Bearer ${adminApiKey}`;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

async function addToSubscriberList(env: Env, email: string): Promise<void> {
  const listKey = 'active_subscribers';
  const existing = await env.NEWSLETTER_KV.get(listKey);
  const subscribers: string[] = existing ? JSON.parse(existing) : [];
  
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    await env.NEWSLETTER_KV.put(listKey, JSON.stringify(subscribers));
  }
}

async function removeFromSubscriberList(env: Env, email: string): Promise<void> {
  const listKey = 'active_subscribers';
  const existing = await env.NEWSLETTER_KV.get(listKey);
  if (existing) {
    const subscribers: string[] = JSON.parse(existing);
    const updated = subscribers.filter(s => s !== email);
    await env.NEWSLETTER_KV.put(listKey, JSON.stringify(updated));
  }
}

async function getActiveSubscribers(env: Env): Promise<Subscriber[]> {
  const listKey = 'active_subscribers';
  const listData = await env.NEWSLETTER_KV.get(listKey);
  
  if (!listData) return [];
  
  const emails: string[] = JSON.parse(listData);
  const subscribers: Subscriber[] = [];
  
  for (const email of emails) {
    const data = await env.NEWSLETTER_KV.get(`subscriber:${email}`);
    if (data) {
      const subscriber: Subscriber = JSON.parse(data);
      if (subscriber.status === 'active') {
        subscribers.push(subscriber);
      }
    }
  }
  
  return subscribers;
}

async function sendWelcomeEmail(subscriber: Subscriber, env: Env): Promise<void> {
  const emailContent = `
    <h1>Welcome to ContainerCode Advisory Newsletter!</h1>
    <p>Hello ${subscriber.name || ''},</p>
    <p>Thank you for subscribing to our expert insights on technology trends.</p>
    <p>Best regards,<br>The ContainerCode Team</p>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ContainerCode Advisory <newsletter@containercode.com>',
      to: [subscriber.email],
      subject: 'Welcome to ContainerCode Advisory Newsletter',
      html: emailContent
    })
  });
}

async function sendNewsletterEmail(env: Env, subscriber: Subscriber, content: string, articles: any[]): Promise<void> {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ContainerCode Advisory <newsletter@containercode.com>',
      to: [subscriber.email],
      subject: `Latest Technology Insights - ${new Date().toLocaleDateString('en-GB')}`,
      html: content
    })
  });
}

async function logActivity(env: Env, activity: any): Promise<void> {
  const logKey = `activity:${Date.now()}:${generateToken()}`;
  await env.NEWSLETTER_KV.put(logKey, JSON.stringify(activity));
}

// Placeholder functions for newsletter generation
async function searchTrendingTopics(env: Env): Promise<any[]> {
  // Implementation would use Brave Search API
  return [];
}

async function generateArticlesWithAI(env: Env, topics: any[]): Promise<any[]> {
  // Implementation would use DeepSeek API
  return [];
}

async function publishToNotion(env: Env, article: any): Promise<void> {
  // Implementation would use Notion API
}

function createNewsletterEmail(articles: any[]): string {
  return '<h1>Newsletter</h1><p>Latest articles...</p>';
}