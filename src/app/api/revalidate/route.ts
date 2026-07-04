/**
 * On-demand ISR Revalidation API
 * Allows programmatic revalidation of static pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/isr';

// Note: Using Node.js runtime for OpenNext Cloudflare compatibility

// Secret token for authentication
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN || 'your-secret-token';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { path, tag, token } = body;
    
    // Validate token
    if (token !== REVALIDATION_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Validate input
    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Either path or tag is required' },
        { status: 400 }
      );
    }
    
    // Perform revalidation
    if (path) {
      // Revalidate specific path
      await revalidatePath(path);
      console.log(`[Revalidation] Path revalidated: ${path}`);
    }
    
    if (tag) {
      // Revalidate by tag (Next 16 requires a cache profile; 'max' = on-demand)
      await revalidateTag(tag, 'max');
      console.log(`[Revalidation] Tag revalidated: ${tag}`);
    }
    
    // Log revalidation event
    const timestamp = new Date().toISOString();
    console.log(`[Revalidation] Success at ${timestamp}`, {
      path,
      tag,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });
    
    return NextResponse.json({
      revalidated: true,
      timestamp,
      path,
      tag,
    });
  } catch (error) {
    console.error('[Revalidation] Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}