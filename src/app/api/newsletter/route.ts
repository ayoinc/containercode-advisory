import { NextRequest, NextResponse } from 'next/server';
import { resend, emailTemplates } from '@/lib/resend';
import { notifyAdmin } from '@/lib/cf-email';
import { newsletterSchema } from '@/lib/validations';

// Note: Using Node.js runtime for OpenNext Cloudflare compatibility

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // Primary: notify the team of the new subscriber via the Cloudflare
    // send_email binding (verified admin inbox, no third-party key required).
    const adminResult = await notifyAdmin({
      subject: `New newsletter subscriber: ${email}`,
      html: `<p>A new visitor subscribed to the ContainerCode Advisory newsletter.</p><p><strong>Email:</strong> ${email}</p>`,
      replyTo: email,
    });
    console.log('📧 Subscriber notification:', adminResult);

    // Best-effort welcome to the subscriber. The send_email binding cannot
    // reach arbitrary recipients, so this goes via Resend and must never fail
    // the subscription.
    try {
      const welcomeEmail = emailTemplates.newsletterWelcome(email);
      const welcomeResult = await resend.emails.send(welcomeEmail);
      if (welcomeResult.error) {
        console.warn('⚠️ Welcome email not sent:', welcomeResult.error.message);
      }
    } catch (welcomeError) {
      console.warn('⚠️ Welcome email skipped:', welcomeError);
    }

    // Optional: Store subscriber in database

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      {
        error: 'Failed to subscribe',
        reason: error instanceof Error ? error.message : 'unknown',
      },
      { status: 500 }
    );
  }
}
