import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/resend';
import { contactFormSchema } from '@/lib/validations';
// import { validateInput, validateEmail, withSecurityHeaders } from '@/utils/security';
// import { rateLimit } from '@/utils/rate-limit';


export async function POST(request: NextRequest) {
  console.log('📧 Contact form API called at:', new Date().toISOString());
  
  try {
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
    
    const data = result.data;
    console.log('✅ Validation passed, sending emails...');
    
    // Send notification email to team
    console.log('📤 Sending notification email to:', process.env.ADMIN_EMAIL);
    const notificationEmail = emailTemplates.contactFormNotification(data);
    const notificationResult = await resend.emails.send(notificationEmail);
    console.log('📧 Notification email result:', notificationResult);
    
    // Send confirmation email to user
    console.log('📤 Sending confirmation email to:', data.email);
    const confirmationEmail = emailTemplates.contactFormConfirmation(data);
    const confirmationResult = await resend.emails.send(confirmationEmail);
    console.log('📧 Confirmation email result:', confirmationResult);
    
    // Handle newsletter subscription if requested
    if (data.subscribe) {
      try {
        console.log('📮 Adding to newsletter subscription...');
        const newsletterResponse = await fetch(new URL('/api/newsletter-subscribe', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
