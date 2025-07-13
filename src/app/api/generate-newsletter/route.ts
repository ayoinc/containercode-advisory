import { NextResponse } from 'next/server';
import { NewsletterAutomationSystem } from '@/lib/newsletter-automation';

export async function POST(request: Request) {
  try {
    // Verify API key or admin authentication
    const authHeader = request.headers.get('Authorization');
    const expectedKey = process.env.ADMIN_API_KEY;
    
    if (!authHeader || !expectedKey || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const newsletterSystem = new NewsletterAutomationSystem();
    await newsletterSystem.generateNewsletterContent();

    return NextResponse.json({
      success: true,
      message: 'Newsletter content generated and published successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Newsletter generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Newsletter generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter automation API endpoint',
    usage: 'POST /api/generate-newsletter with Authorization: Bearer <ADMIN_API_KEY>',
    timestamp: new Date().toISOString()
  });
}