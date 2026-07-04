import { NextRequest, NextResponse } from 'next/server';
import { resend, emailTemplates } from '@/lib/resend';
import { notifyAdmin } from '@/lib/cf-email';
import { contactFormSchema } from '@/lib/validations';
import { validateInput, validateEmail, withSecurityHeaders } from '@/utils/security';
import { rateLimit } from '@/utils/rate-limit';


export async function POST(request: NextRequest) {
  console.log('📧 Contact form API called at:', new Date().toISOString());

  try {
    // Apply rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    await rateLimit.check(clientIP, 10, '1m'); // 10 requests per minute per IP

    const body = await request.json();
    console.log('📝 Form data received:', JSON.stringify(body, null, 2));

    // Validate form data
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      console.log('❌ Validation failed:', result.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    // Additional security validation
    const validatedData = {
      name: validateInput(result.data.name),
      email: result.data.email, // validateEmail returns boolean, use original validated email
      message: validateInput(result.data.message),
      service: result.data.service ? validateInput(result.data.service) : 'General Inquiry',
      subscribe: result.data.subscribe
    };

    // Validate email format separately
    if (!validateEmail(validatedData.email)) {
      return withSecurityHeaders(NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      ));
    }

    console.log('✅ Validation passed, notifying admin...');

    // Primary delivery: notify the team via the Cloudflare send_email binding.
    // No third-party key required — the enquiry lands in the verified admin
    // inbox. A rejected send here is a real misconfiguration, so let it throw.
    const notification = emailTemplates.contactFormNotification(validatedData);
    const adminResult = await notifyAdmin({
      subject: notification.subject,
      html: notification.html,
      replyTo: validatedData.email,
    });
    console.log('📧 Admin notification:', adminResult);

    // Fallback for environments without the binding (e.g. local `next dev`):
    // try Resend if a key is configured. Not fatal if it isn't.
    if (!adminResult.delivered) {
      console.warn('⚠️ EMAIL binding unavailable; attempting Resend fallback for admin notification');
      try {
        const r = await resend.emails.send(notification);
        if (r.error) throw new Error(r.error.message);
      } catch (fallbackError) {
        console.warn('⚠️ Admin notification fallback failed:', fallbackError);
      }
    }

    // User-facing confirmation. The send_email binding cannot reach arbitrary
    // recipients, so this goes via Resend and is strictly best-effort — a
    // missing/failed confirmation must never fail the submission.
    try {
      console.log('📤 Sending confirmation email to:', validatedData.email);
      const confirmationEmail = emailTemplates.contactFormConfirmation(validatedData);
      const confirmationResult = await resend.emails.send(confirmationEmail);
      if (confirmationResult.error) {
        console.warn('⚠️ Confirmation email not sent:', confirmationResult.error.message);
      }
    } catch (confirmationError) {
      console.warn('⚠️ Confirmation email skipped:', confirmationError);
    }

    // Handle newsletter subscription if requested
    if (validatedData.subscribe) {
      try {
        console.log('📮 Adding to newsletter subscription...');
        const newsletterResponse = await fetch(new URL('/api/newsletter-subscribe', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: validatedData.email,
            name: validatedData.name,
          }),
        });

        if (!newsletterResponse.ok) {
          console.warn('⚠️ Failed to subscribe user to newsletter:', await newsletterResponse.text());
        } else {
          console.log('✅ Newsletter subscription successful');
        }
      } catch (error) {
        console.warn('⚠️ Newsletter subscription error:', error);
      }
    }

    console.log('🎉 Contact form submission completed successfully');
    return withSecurityHeaders(NextResponse.json({ success: true }));
  } catch (error) {
    console.error('❌ Contact form error:', error);

    // Handle rate limit errors
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      return withSecurityHeaders(NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      ));
    }

    return withSecurityHeaders(NextResponse.json(
      {
        error: 'Failed to send message',
        // Surfaced to help diagnose live config (unverified sending domain or
        // destination address on the send_email binding, etc.). Not sensitive.
        reason: error instanceof Error ? error.message : 'unknown',
      },
      { status: 500 }
    ));
  }
}
