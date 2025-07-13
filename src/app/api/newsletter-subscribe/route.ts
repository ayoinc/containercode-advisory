import { NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email('Valid email address required'),
  name: z.string().optional(),
  preferences: z.object({
    frequency: z.enum(['weekly', 'monthly']).default('weekly'),
    topics: z.array(z.string()).default([])
  }).optional()
});

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, preferences } = subscribeSchema.parse(body);

    // Check if already subscribed
    const existingSubscriber = await getSubscriberFromKV(email);
    if (existingSubscriber && existingSubscriber.status === 'active') {
      return NextResponse.json({
        success: false,
        message: 'Email address is already subscribed to our newsletter'
      }, { status: 400 });
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
      confirmation_token: generateConfirmationToken()
    };

    // Store in Cloudflare KV
    await storeSubscriberInKV(subscriber);

    // Add to subscriber list
    await addToSubscriberList(email);

    // Send welcome email
    await sendWelcomeEmail(subscriber);

    // Log subscription activity
    await logSubscriptionActivity({
      type: 'subscription',
      email,
      timestamp: new Date().toISOString(),
      source: 'website'
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter! Please check your email for confirmation.',
      subscriber: {
        email: subscriber.email,
        name: subscriber.name,
        preferences: subscriber.preferences
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid input data',
        errors: error.errors
      }, { status: 400 });
    }

    console.error('Newsletter subscription failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to subscribe to newsletter. Please try again.'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email address required'
      }, { status: 400 });
    }

    // Get subscriber to verify token if provided
    if (token) {
      const subscriber = await getSubscriberFromKV(email);
      if (!subscriber || subscriber.confirmation_token !== token) {
        return NextResponse.json({
          success: false,
          message: 'Invalid unsubscribe token'
        }, { status: 400 });
      }
    }

    // Update subscriber status
    const subscriber = await getSubscriberFromKV(email);
    if (subscriber) {
      subscriber.status = 'unsubscribed';
      await storeSubscriberInKV(subscriber);
    }

    // Remove from active subscriber list
    await removeFromSubscriberList(email);

    // Log unsubscription activity
    await logSubscriptionActivity({
      type: 'unsubscription',
      email,
      timestamp: new Date().toISOString(),
      method: token ? 'email_link' : 'manual'
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscription failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to unsubscribe. Please try again.'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter subscription API endpoint',
    endpoints: {
      subscribe: 'POST /api/newsletter-subscribe',
      unsubscribe: 'DELETE /api/newsletter-subscribe?email=<email>&token=<token>'
    },
    timestamp: new Date().toISOString()
  });
}

// Helper functions
async function getSubscriberFromKV(email: string): Promise<Subscriber | null> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscriber_${btoa(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
        }
      }
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch subscriber from KV:', error);
    return null;
  }
}

async function storeSubscriberInKV(subscriber: Subscriber): Promise<void> {
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscriber_${btoa(subscriber.email)}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriber)
      }
    );
  } catch (error) {
    console.error('Failed to store subscriber in KV:', error);
    throw error;
  }
}

async function addToSubscriberList(email: string): Promise<void> {
  try {
    // Get current subscriber list
    const listResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscribers`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
        }
      }
    );

    let subscribers: string[] = [];
    if (listResponse.ok) {
      const data = await listResponse.json();
      subscribers = data.subscribers || [];
    }

    // Add new email if not already present
    if (!subscribers.includes(email)) {
      subscribers.push(email);

      // Update the list
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscribers`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ subscribers })
        }
      );
    }
  } catch (error) {
    console.error('Failed to add to subscriber list:', error);
  }
}

async function removeFromSubscriberList(email: string): Promise<void> {
  try {
    // Get current subscriber list
    const listResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscribers`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
        }
      }
    );

    if (listResponse.ok) {
      const data = await listResponse.json();
      const subscribers: string[] = data.subscribers || [];
      
      // Remove email from list
      const updatedSubscribers = subscribers.filter(sub => sub !== email);

      // Update the list
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscribers`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ subscribers: updatedSubscribers })
        }
      );
    }
  } catch (error) {
    console.error('Failed to remove from subscriber list:', error);
  }
}

async function sendWelcomeEmail(subscriber: Subscriber): Promise<void> {
  try {
    const welcomeContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to ContainerCode Advisory Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #14b8c6;">Welcome to ContainerCode Advisory!</h1>
  <p>Hello ${subscriber.name || ''},</p>
  <p>Thank you for subscribing to our newsletter. You'll receive expert insights on:</p>
  <ul>
    <li>Multi-cloud strategy and architecture</li>
    <li>Cybersecurity best practices</li>
    <li>DevOps automation and tools</li>
    <li>Digital transformation trends</li>
    <li>Industry analysis and case studies</li>
  </ul>
  <p>We're committed to providing valuable, actionable insights for enterprise technology leaders.</p>
  <p>Best regards,<br>The ContainerCode Advisory Team</p>
  <hr>
  <p style="font-size: 12px; color: #666;">
    <a href="/api/newsletter-subscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.confirmation_token}">Unsubscribe</a>
  </p>
</body>
</html>
    `;

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'ContainerCode Advisory <newsletter@containercode.com>',
        to: [subscriber.email],
        subject: 'Welcome to ContainerCode Advisory Newsletter',
        html: welcomeContent
      })
    });
  } catch (error) {
    console.warn('Failed to send welcome email:', error);
  }
}

async function logSubscriptionActivity(activity: any): Promise<void> {
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/137e4efd34d240a498369c0cc273d5e3/values/subscription_log_${Date.now()}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)
      }
    );
  } catch (error) {
    console.warn('Failed to log subscription activity:', error);
  }
}

function generateConfirmationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}