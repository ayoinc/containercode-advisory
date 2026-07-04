import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/resend';
import { contactFormSchema } from '@/lib/validations';
import { validateInput, validateEmail, withSecurityHeaders } from '@/utils/security';
import { rateLimit } from '@/utils/rate-limit';


export async function POST(request: NextRequest) {
  console.log('📧 Contact form API called at:', new Date().toISOString());
  
  try {
    // Apply rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown';
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
    
    console.log('✅ Validation passed, sending emails...');
    
    // Send notification email to team
    console.log('📤 Sending notification email to:', process.env.ADMIN_EMAIL);
    const notificationEmail = emailTemplates.contactFormNotification(validatedData);
    const notificationResult = await resend.emails.send(notificationEmail);
    console.log('📧 Notification email result:', notificationResult);
    
    // Send confirmation email to user
    console.log('📤 Sending confirmation email to:', validatedData.email);
    const confirmationEmail = emailTemplates.contactFormConfirmation(validatedData);
    const confirmationResult = await resend.emails.send(confirmationEmail);
    console.log('📧 Confirmation email result:', confirmationResult);
    
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
      { error: 'Failed to send message' },
      { status: 500 }
    ));
  }
}
