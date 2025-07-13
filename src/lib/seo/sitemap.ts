/**
 * Sitemap Generation Utilities
 * Dynamic sitemap generation for SEO
 */

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapConfig {
  baseUrl: string;
  excludePatterns?: RegExp[];
  defaultChangeFrequency?: SitemapEntry['changeFrequency'];
  defaultPriority?: number;
}

// Generate XML sitemap
export function generateSitemapXML(entries: SitemapEntry[], config: SitemapConfig): string {
  const { baseUrl } = config;
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries
  .map(
    (entry) => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified.toISOString()}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

// Generate sitemap index for large sites
export function generateSitemapIndex(sitemaps: string[], baseUrl: string): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (sitemap) => `  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return xml;
}

// Priority calculator based on URL depth
export function calculatePriority(url: string): number {
  const depth = url.split('/').filter(Boolean).length;
  
  if (url === '/') return 1.0;
  if (depth === 1) return 0.8;
  if (depth === 2) return 0.6;
  if (depth === 3) return 0.4;
  return 0.3;
}

// Change frequency predictor
export function predictChangeFrequency(url: string): SitemapEntry['changeFrequency'] {
  if (url === '/' || url.includes('/blog')) return 'daily';
  if (url.includes('/services') || url.includes('/team')) return 'monthly';
  if (url.includes('/about') || url.includes('/contact')) return 'yearly';
  return 'weekly';
}

// Filter URLs based on robots.txt rules
export function filterDisallowedUrls(
  urls: string[],
  disallowPatterns: RegExp[]
): string[] {
  return urls.filter((url) => !disallowPatterns.some((pattern) => pattern.test(url)));
}

// Get all static pages
export async function getStaticPages(): Promise<SitemapEntry[]> {
  // In a real implementation, this would scan the pages directory
  const staticPages = [
    '/',
    '/services',
    '/services/cloud-strategy',
    '/services/devops',
    '/services/cybersecurity',
    '/services/digital-transformation',
    '/blog',
    '/case-studies',
    '/team',
    '/contact',
    '/about',
    '/privacy',
    '/terms',
  ];

  return staticPages.map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: predictChangeFrequency(url),
    priority: calculatePriority(url),
  }));
}

// Get dynamic pages (blog posts, case studies, etc.)
export async function getDynamicPages(): Promise<SitemapEntry[]> {
  // This would fetch from your CMS or database
  // For now, returning mock data
  const blogPosts = [
    {
      slug: 'multi-cloud-strategy-guide',
      updatedAt: new Date('2024-01-15'),
    },
    {
      slug: 'devops-best-practices',
      updatedAt: new Date('2024-01-10'),
    },
    {
      slug: 'zero-trust-security',
      updatedAt: new Date('2024-01-05'),
    },
  ];

  const caseStudies = [
    {
      slug: 'fintech-transformation',
      updatedAt: new Date('2024-01-01'),
    },
    {
      slug: 'healthcare-cloud-migration',
      updatedAt: new Date('2023-12-20'),
    },
  ];

  const dynamicPages: SitemapEntry[] = [];

  // Add blog posts
  blogPosts.forEach((post) => {
    dynamicPages.push({
      url: `/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  // Add case studies
  caseStudies.forEach((study) => {
    dynamicPages.push({
      url: `/case-studies/${study.slug}`,
      lastModified: study.updatedAt,
      changeFrequency: 'yearly',
      priority: 0.5,
    });
  });

  return dynamicPages;
}

// Generate complete sitemap
export async function generateSitemap(config: SitemapConfig): Promise<string> {
  const staticPages = await getStaticPages();
  const dynamicPages = await getDynamicPages();
  
  const allPages = [...staticPages, ...dynamicPages];
  
  // Apply exclusion patterns
  const filteredPages = config.excludePatterns
    ? allPages.filter(
        (page) => !config.excludePatterns!.some((pattern) => pattern.test(page.url))
      )
    : allPages;

  return generateSitemapXML(filteredPages, config);
}

// Generate robots.txt
export function generateRobotsTxt(sitemapUrl: string, disallowPaths: string[] = []): string {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
${disallowPaths.map((path) => `Disallow: ${path}`).join('\n')}
Allow: /

# Crawl-delay (in seconds)
Crawl-delay: 1

# Sitemap
Sitemap: ${sitemapUrl}

# Major search engine crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /`;

  return robotsTxt;
}