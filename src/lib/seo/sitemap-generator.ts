/**
 * SEO-Optimized Sitemap Generator
 * Dynamic sitemap generation with priority, change frequency, and last modified dates
 */

import { notion, getBlogPosts } from '@/lib/notion';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
}

export interface SitemapImage {
  loc: string;
  caption?: string;
  title?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  duration?: number;
  rating?: number;
  view_count?: number;
  publication_date?: string;
  family_friendly?: boolean;
  restriction?: {
    relationship: 'allow' | 'deny';
    countries: string[];
  };
  platform?: {
    relationship: 'allow' | 'deny';
    content: string;
  };
  requires_subscription?: boolean;
  uploader?: {
    name: string;
    info?: string;
  };
  live?: boolean;
}

export interface SitemapConfig {
  baseUrl: string;
  defaultChangefreq: SitemapUrl['changefreq'];
  defaultPriority: number;
  includeImages: boolean;
  includeVideos: boolean;
  maxUrls: number;
  excludePatterns: string[];
}

class SitemapGenerator {
  private config: SitemapConfig;

  constructor(config: SitemapConfig) {
    this.config = config;
  }

  // Generate complete sitemap
  async generateSitemap(): Promise<string> {
    const urls = await this.getAllUrls();
    return this.generateXML(urls);
  }

  // Generate sitemap index for large sites
  async generateSitemapIndex(): Promise<string> {
    const sitemaps = [
      {
        loc: `${this.config.baseUrl}/sitemap-pages.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${this.config.baseUrl}/sitemap-blog.xml`,
        lastmod: await this.getLastBlogModified()
      },
      {
        loc: `${this.config.baseUrl}/sitemap-services.xml`,
        lastmod: new Date().toISOString()
      }
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
  }

  // Generate blog-specific sitemap
  async generateBlogSitemap(): Promise<string> {
    const blogUrls = await this.getBlogUrls();
    return this.generateXML(blogUrls);
  }

  // Generate pages sitemap
  async generatePagesSitemap(): Promise<string> {
    const pageUrls = await this.getStaticPageUrls();
    return this.generateXML(pageUrls);
  }

  // Get all URLs for sitemap
  private async getAllUrls(): Promise<SitemapUrl[]> {
    const urls: SitemapUrl[] = [];

    // Add static pages
    urls.push(...await this.getStaticPageUrls());

    // Add blog posts
    urls.push(...await this.getBlogUrls());

    // Add service pages
    urls.push(...await this.getServiceUrls());

    // Filter excluded patterns
    return urls.filter(url => !this.isExcluded(url.loc));
  }

  // Get static page URLs
  private async getStaticPageUrls(): Promise<SitemapUrl[]> {
    const staticPages = [
      {
        path: '',
        priority: 1.0,
        changefreq: 'weekly' as const,
        images: [
          {
            loc: `${this.config.baseUrl}/images/containercode-hero.jpg`,
            caption: 'ContainerCode Advisory - Cloud Consulting Services',
            title: 'Leading Cloud Transformation'
          }
        ]
      },
      {
        path: '/about',
        priority: 0.8,
        changefreq: 'monthly' as const
      },
      {
        path: '/services',
        priority: 0.9,
        changefreq: 'weekly' as const,
        images: [
          {
            loc: `${this.config.baseUrl}/images/services-overview.jpg`,
            caption: 'Comprehensive Cloud Services',
            title: 'Cloud Consulting and DevOps Services'
          }
        ]
      },
      {
        path: '/services/cloud-consulting',
        priority: 0.8,
        changefreq: 'monthly' as const
      },
      {
        path: '/services/devops-automation',
        priority: 0.8,
        changefreq: 'monthly' as const
      },
      {
        path: '/services/cybersecurity',
        priority: 0.8,
        changefreq: 'monthly' as const
      },
      {
        path: '/services/digital-transformation',
        priority: 0.8,
        changefreq: 'monthly' as const
      },
      {
        path: '/contact',
        priority: 0.7,
        changefreq: 'monthly' as const
      },
      {
        path: '/blog',
        priority: 0.8,
        changefreq: 'daily' as const
      }
    ];

    return staticPages.map(page => ({
      loc: `${this.config.baseUrl}${page.path}`,
      lastmod: new Date().toISOString(),
      changefreq: page.changefreq,
      priority: page.priority,
      images: this.config.includeImages ? page.images : undefined
    }));
  }

  // Get blog URLs from Notion
  private async getBlogUrls(): Promise<SitemapUrl[]> {
    try {
      const response = await getBlogPosts({ 
        pageSize: 1000
      });
      const posts = response.results;

      return posts.map((post: any) => ({
        loc: `${this.config.baseUrl}/blog/${post.slug}`,
        lastmod: post.lastEditedTime || post.createdTime,
        changefreq: 'monthly' as const,
        priority: 0.6,
        images: this.config.includeImages && post.coverImage ? [
          {
            loc: post.coverImage,
            caption: post.excerpt || post.title,
            title: post.title
          }
        ] : undefined
      }));
    } catch (error) {
      console.warn('Failed to fetch blog posts for sitemap:', error);
      return [];
    }
  }

  // Get service URLs
  private async getServiceUrls(): Promise<SitemapUrl[]> {
    const services = [
      'aws-consulting',
      'azure-consulting', 
      'gcp-consulting',
      'kubernetes-services',
      'serverless-architecture',
      'cloud-migration',
      'security-assessment',
      'devops-implementation',
      'monitoring-alerting',
      'cost-optimization'
    ];

    return services.map(service => ({
      loc: `${this.config.baseUrl}/services/${service}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.7
    }));
  }

  // Get last blog modified date
  private async getLastBlogModified(): Promise<string> {
    try {
      const response = await getBlogPosts({ 
        pageSize: 1,
        sorts: [{ property: 'LastEditedTime', direction: 'descending' }]
      });
      const posts = response.results;
      
      return posts[0]?.lastEditedTime || new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  // Check if URL should be excluded
  private isExcluded(url: string): boolean {
    return this.config.excludePatterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(url);
    });
  }

  // Generate XML sitemap
  private generateXML(urls: SitemapUrl[]): string {
    const urlset = urls.slice(0, this.config.maxUrls);

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlset.map(url => this.generateUrlXML(url)).join('\n')}
</urlset>`;
  }

  // Generate individual URL XML
  private generateUrlXML(url: SitemapUrl): string {
    let xml = `  <url>
    <loc>${this.escapeXML(url.loc)}</loc>`;

    if (url.lastmod) {
      xml += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }

    if (url.changefreq) {
      xml += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }

    if (url.priority !== undefined) {
      xml += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    }

    // Add images
    if (url.images && url.images.length > 0) {
      url.images.forEach(image => {
        xml += `\n    <image:image>
      <image:loc>${this.escapeXML(image.loc)}</image:loc>`;
        
        if (image.caption) {
          xml += `\n      <image:caption>${this.escapeXML(image.caption)}</image:caption>`;
        }
        
        if (image.title) {
          xml += `\n      <image:title>${this.escapeXML(image.title)}</image:title>`;
        }
        
        if (image.license) {
          xml += `\n      <image:license>${this.escapeXML(image.license)}</image:license>`;
        }
        
        xml += `\n    </image:image>`;
      });
    }

    // Add videos
    if (url.videos && url.videos.length > 0) {
      url.videos.forEach(video => {
        xml += `\n    <video:video>
      <video:thumbnail_loc>${this.escapeXML(video.thumbnail_loc)}</video:thumbnail_loc>
      <video:title>${this.escapeXML(video.title)}</video:title>
      <video:description>${this.escapeXML(video.description)}</video:description>`;
        
        if (video.content_loc) {
          xml += `\n      <video:content_loc>${this.escapeXML(video.content_loc)}</video:content_loc>`;
        }
        
        if (video.player_loc) {
          xml += `\n      <video:player_loc>${this.escapeXML(video.player_loc)}</video:player_loc>`;
        }
        
        if (video.duration) {
          xml += `\n      <video:duration>${video.duration}</video:duration>`;
        }
        
        if (video.rating) {
          xml += `\n      <video:rating>${video.rating}</video:rating>`;
        }
        
        if (video.view_count) {
          xml += `\n      <video:view_count>${video.view_count}</video:view_count>`;
        }
        
        if (video.publication_date) {
          xml += `\n      <video:publication_date>${video.publication_date}</video:publication_date>`;
        }
        
        if (video.family_friendly !== undefined) {
          xml += `\n      <video:family_friendly>${video.family_friendly ? 'yes' : 'no'}</video:family_friendly>`;
        }
        
        if (video.requires_subscription !== undefined) {
          xml += `\n      <video:requires_subscription>${video.requires_subscription ? 'yes' : 'no'}</video:requires_subscription>`;
        }
        
        if (video.live !== undefined) {
          xml += `\n      <video:live>${video.live ? 'yes' : 'no'}</video:live>`;
        }
        
        xml += `\n    </video:video>`;
      });
    }

    xml += `\n  </url>`;
    return xml;
  }

  // Escape XML characters
  private escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.config.baseUrl}/sitemap.xml
Sitemap: ${this.config.baseUrl}/sitemap-index.xml

# Disallow
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /.well-known/
Disallow: /private/

# Crawl delay
Crawl-delay: 1

# Host
Host: ${this.config.baseUrl}`;
  }
}

// Default configuration
export const defaultSitemapConfig: SitemapConfig = {
  baseUrl: 'https://containercode.com',
  defaultChangefreq: 'monthly',
  defaultPriority: 0.5,
  includeImages: true,
  includeVideos: true,
  maxUrls: 50000,
  excludePatterns: [
    '/api/',
    '/_next/',
    '/admin/',
    '/private/',
    '/.well-known/',
    '/404',
    '/500',
    '/signin',
    '/signup'
  ]
};

// Export singleton instance
export const sitemapGenerator = new SitemapGenerator(defaultSitemapConfig);

// Utility functions
export function generateSitemap(): Promise<string> {
  return sitemapGenerator.generateSitemap();
}

export function generateSitemapIndex(): Promise<string> {
  return sitemapGenerator.generateSitemapIndex();
}

export function generateBlogSitemap(): Promise<string> {
  return sitemapGenerator.generateBlogSitemap();
}

export function generatePagesSitemap(): Promise<string> {
  return sitemapGenerator.generatePagesSitemap();
}

export function generateRobotsTxt(): string {
  return sitemapGenerator.generateRobotsTxt();
}