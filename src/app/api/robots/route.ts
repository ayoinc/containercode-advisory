import { NextResponse } from 'next/server';
import { sitemapGenerator } from '@/lib/seo/sitemap-generator';

export async function GET() {
  try {
    const robotsTxt = sitemapGenerator.generateRobotsTxt();

    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'CDN-Cache-Control': 'public, max-age=604800',
        'Vercel-CDN-Cache-Control': 'public, max-age=604800',
        'X-Robots-Tag': 'noarchive'
      }
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    
    // Return basic robots.txt as fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
    const fallbackRobots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /.well-known/
Disallow: /private/

# Crawl delay
Crawl-delay: 1

# Host
Host: ${baseUrl}`;

    return new NextResponse(fallbackRobots, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}