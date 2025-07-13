import { NextRequest, NextResponse } from 'next/server';
import { generateSitemap, generateSitemapIndex } from '@/lib/seo/sitemap-generator';

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'main';
  
  try {
    let sitemap: string;
    
    switch (type) {
      case 'index':
        sitemap = await generateSitemapIndex();
        break;
      case 'blog':
        const { generateBlogSitemap } = await import('@/lib/seo/sitemap-generator');
        sitemap = await generateBlogSitemap();
        break;
      case 'pages':
        const { generatePagesSitemap } = await import('@/lib/seo/sitemap-generator');
        sitemap = await generatePagesSitemap();
        break;
      default:
        sitemap = await generateSitemap();
        break;
    }

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'CDN-Cache-Control': 'public, max-age=86400',
        'Vercel-CDN-Cache-Control': 'public, max-age=86400',
        'X-Robots-Tag': 'noarchive'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap as fallback
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}