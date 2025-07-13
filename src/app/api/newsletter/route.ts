import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { emailTemplates } from '@/lib/resend';
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
    
    // Send welcome email
    const welcomeEmail = emailTemplates.newsletterWelcome(email);
    await resend.emails.send(welcomeEmail);
    
    // Optional: Store subscriber in database
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
