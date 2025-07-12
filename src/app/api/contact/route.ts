import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/resend';
import { contactFormSchema } from '@/lib/validations';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate form data
    const result = contactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const data = result.data;
    
    // Send notification email to team
    const notificationEmail = emailTemplates.contactFormNotification(data);
    await resend.emails.send(notificationEmail);
    
    // Send confirmation email to user
    const confirmationEmail = emailTemplates.contactFormConfirmation(data);
    await resend.emails.send(confirmationEmail);
    
    // Optional: Store submission in database
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
