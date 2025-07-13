/**
 * Social Media Meta Tags Automation
 * Generates optimized meta tags for SEO and social sharing
 */

export interface MetaTagsConfig {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  url: string;
  siteName: string;
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    type?: string;
  };
  video?: {
    url: string;
    type?: string;
    width?: number;
    height?: number;
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
  };
  locale?: string;
  type?: 'website' | 'article' | 'product' | 'profile' | 'book' | 'music.song' | 'video.movie';
  robots?: string;
  canonical?: string;
}

export interface StructuredDataConfig {
  type: 'Organization' | 'Article' | 'Product' | 'Service' | 'WebPage' | 'BlogPosting' | 'Person';
  data: any;
}

class MetaTagsGenerator {
  // Generate complete meta tags
  generateMetaTags(config: MetaTagsConfig): string {
    const tags: string[] = [];

    // Basic meta tags
    tags.push(...this.generateBasicTags(config));

    // Open Graph tags
    tags.push(...this.generateOpenGraphTags(config));

    // Twitter Card tags
    tags.push(...this.generateTwitterTags(config));

    // Additional SEO tags
    tags.push(...this.generateSEOTags(config));

    return tags.join('\n');
  }

  // Generate React/Next.js metadata object
  generateMetadata(config: MetaTagsConfig): any {
    const metadata: any = {
      title: config.title,
      description: config.description,
      keywords: config.keywords?.join(', '),
      authors: config.author ? [{ name: config.author }] : undefined,
      robots: config.robots || 'index, follow',
      canonical: config.canonical || config.url,
      openGraph: {
        title: config.title,
        description: config.description,
        url: config.url,
        siteName: config.siteName,
        locale: config.locale || 'en_US',
        type: config.type || 'website',
        images: config.image ? [
          {
            url: config.image.url,
            alt: config.image.alt,
            width: config.image.width || 1200,
            height: config.image.height || 630,
            type: config.image.type || 'image/jpeg'
          }
        ] : undefined,
        videos: config.video ? [
          {
            url: config.video.url,
            type: config.video.type || 'video/mp4',
            width: config.video.width || 1920,
            height: config.video.height || 1080
          }
        ] : undefined
      },
      twitter: {
        card: config.twitter?.card || 'summary_large_image',
        site: config.twitter?.site || '@containercode',
        creator: config.twitter?.creator,
        title: config.title,
        description: config.description,
        images: config.image ? [config.image.url] : undefined
      }
    };

    // Add article-specific metadata
    if (config.article && config.type === 'article') {
      metadata.openGraph.article = {
        publishedTime: config.article.publishedTime,
        modifiedTime: config.article.modifiedTime,
        authors: config.article.author ? [config.article.author] : undefined,
        section: config.article.section,
        tags: config.article.tags
      };
    }

    return metadata;
  }

  // Generate basic HTML meta tags
  private generateBasicTags(config: MetaTagsConfig): string[] {
    const tags: string[] = [];

    tags.push(`<meta charset="utf-8">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1">`);
    tags.push(`<title>${this.escapeHtml(config.title)}</title>`);
    tags.push(`<meta name="description" content="${this.escapeHtml(config.description)}">`);

    if (config.keywords?.length) {
      tags.push(`<meta name="keywords" content="${this.escapeHtml(config.keywords.join(', '))}">`);
    }

    if (config.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(config.author)}">`);
    }

    tags.push(`<meta name="robots" content="${config.robots || 'index, follow'}">`);
    tags.push(`<link rel="canonical" href="${config.canonical || config.url}">`);

    return tags;
  }

  // Generate Open Graph tags
  private generateOpenGraphTags(config: MetaTagsConfig): string[] {
    const tags: string[] = [];

    tags.push(`<meta property="og:title" content="${this.escapeHtml(config.title)}">`);
    tags.push(`<meta property="og:description" content="${this.escapeHtml(config.description)}">`);
    tags.push(`<meta property="og:url" content="${config.url}">`);
    tags.push(`<meta property="og:site_name" content="${this.escapeHtml(config.siteName)}">`);
    tags.push(`<meta property="og:locale" content="${config.locale || 'en_US'}">`);
    tags.push(`<meta property="og:type" content="${config.type || 'website'}">`);

    if (config.image) {
      tags.push(`<meta property="og:image" content="${config.image.url}">`);
      tags.push(`<meta property="og:image:alt" content="${this.escapeHtml(config.image.alt)}">`);
      tags.push(`<meta property="og:image:width" content="${config.image.width || 1200}">`);
      tags.push(`<meta property="og:image:height" content="${config.image.height || 630}">`);
      if (config.image.type) {
        tags.push(`<meta property="og:image:type" content="${config.image.type}">`);
      }
    }

    if (config.video) {
      tags.push(`<meta property="og:video" content="${config.video.url}">`);
      if (config.video.type) {
        tags.push(`<meta property="og:video:type" content="${config.video.type}">`);
      }
      tags.push(`<meta property="og:video:width" content="${config.video.width || 1920}">`);
      tags.push(`<meta property="og:video:height" content="${config.video.height || 1080}">`);
    }

    // Article-specific tags
    if (config.article && config.type === 'article') {
      if (config.article.publishedTime) {
        tags.push(`<meta property="article:published_time" content="${config.article.publishedTime}">`);
      }
      if (config.article.modifiedTime) {
        tags.push(`<meta property="article:modified_time" content="${config.article.modifiedTime}">`);
      }
      if (config.article.author) {
        tags.push(`<meta property="article:author" content="${this.escapeHtml(config.article.author)}">`);
      }
      if (config.article.section) {
        tags.push(`<meta property="article:section" content="${this.escapeHtml(config.article.section)}">`);
      }
      if (config.article.tags?.length) {
        config.article.tags.forEach(tag => {
          tags.push(`<meta property="article:tag" content="${this.escapeHtml(tag)}">`);
        });
      }
    }

    return tags;
  }

  // Generate Twitter Card tags
  private generateTwitterTags(config: MetaTagsConfig): string[] {
    const tags: string[] = [];

    tags.push(`<meta name="twitter:card" content="${config.twitter?.card || 'summary_large_image'}">`);
    tags.push(`<meta name="twitter:title" content="${this.escapeHtml(config.title)}">`);
    tags.push(`<meta name="twitter:description" content="${this.escapeHtml(config.description)}">`);

    if (config.twitter?.site) {
      tags.push(`<meta name="twitter:site" content="${config.twitter.site}">`);
    }

    if (config.twitter?.creator) {
      tags.push(`<meta name="twitter:creator" content="${config.twitter.creator}">`);
    }

    if (config.image) {
      tags.push(`<meta name="twitter:image" content="${config.image.url}">`);
      tags.push(`<meta name="twitter:image:alt" content="${this.escapeHtml(config.image.alt)}">`);
    }

    return tags;
  }

  // Generate additional SEO tags
  private generateSEOTags(config: MetaTagsConfig): string[] {
    const tags: string[] = [];

    // Additional SEO meta tags
    tags.push(`<meta name="theme-color" content="#1e40af">`);
    tags.push(`<meta name="msapplication-TileColor" content="#1e40af">`);
    tags.push(`<meta name="apple-mobile-web-app-capable" content="yes">`);
    tags.push(`<meta name="apple-mobile-web-app-status-bar-style" content="default">`);
    tags.push(`<meta name="apple-mobile-web-app-title" content="${this.escapeHtml(config.siteName)}">`);

    // Preconnect to external domains
    tags.push(`<link rel="preconnect" href="https://fonts.googleapis.com">`);
    tags.push(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`);
    tags.push(`<link rel="preconnect" href="https://api.notion.com">`);

    // DNS prefetch
    tags.push(`<link rel="dns-prefetch" href="//fonts.googleapis.com">`);
    tags.push(`<link rel="dns-prefetch" href="//api.notion.com">`);
    tags.push(`<link rel="dns-prefetch" href="//api.resend.com">`);

    return tags;
  }

  // Generate structured data script
  generateStructuredData(config: StructuredDataConfig): string {
    const jsonLd = JSON.stringify(config.data, null, 2);
    return `<script type="application/ld+json">${jsonLd}</script>`;
  }

  // Escape HTML entities
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Predefined configurations for different page types
export const metaConfigs = {
  // Homepage
  homepage: (baseUrl: string): MetaTagsConfig => ({
    title: 'ContainerCode Advisory - Leading Cloud Consulting & Digital Transformation',
    description: 'Transform your business with expert cloud consulting, DevOps automation, and cybersecurity solutions. AWS, Azure, GCP specialists helping enterprises scale securely.',
    keywords: [
      'cloud consulting',
      'digital transformation',
      'DevOps automation',
      'cybersecurity',
      'AWS consulting',
      'Azure consulting',
      'GCP consulting',
      'cloud migration',
      'enterprise cloud solutions'
    ],
    author: 'ContainerCode Advisory',
    url: baseUrl,
    siteName: 'ContainerCode Advisory',
    type: 'website',
    image: {
      url: `${baseUrl}/images/containercode-hero-og.jpg`,
      alt: 'ContainerCode Advisory - Cloud Consulting Excellence',
      width: 1200,
      height: 630
    },
    twitter: {
      card: 'summary_large_image',
      site: '@containercode',
      creator: '@containercode'
    }
  }),

  // Blog post
  blogPost: (post: any, baseUrl: string): MetaTagsConfig => ({
    title: `${post.title} | ContainerCode Blog`,
    description: post.excerpt || post.description,
    keywords: post.tags || [],
    author: post.author || 'ContainerCode Advisory',
    url: `${baseUrl}/blog/${post.slug}`,
    siteName: 'ContainerCode Advisory',
    type: 'article',
    image: {
      url: post.coverImage || `${baseUrl}/images/blog-default-og.jpg`,
      alt: post.title,
      width: 1200,
      height: 630
    },
    article: {
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      author: post.author,
      section: post.category || 'Technology',
      tags: post.tags
    },
    twitter: {
      card: 'summary_large_image',
      site: '@containercode',
      creator: '@containercode'
    }
  }),

  // Service page
  servicePage: (service: any, baseUrl: string): MetaTagsConfig => ({
    title: `${service.title} | ContainerCode Services`,
    description: service.description,
    keywords: service.keywords || [],
    author: 'ContainerCode Advisory',
    url: `${baseUrl}/services/${service.slug}`,
    siteName: 'ContainerCode Advisory',
    type: 'website',
    image: {
      url: service.image || `${baseUrl}/images/services-${service.slug}-og.jpg`,
      alt: service.title,
      width: 1200,
      height: 630
    },
    twitter: {
      card: 'summary_large_image',
      site: '@containercode',
      creator: '@containercode'
    }
  }),

  // Contact page
  contactPage: (baseUrl: string): MetaTagsConfig => ({
    title: 'Contact Us | ContainerCode Advisory',
    description: 'Get in touch with our cloud experts. Free consultation available. Let us help transform your business with proven cloud solutions.',
    keywords: [
      'contact cloud consultant',
      'free cloud consultation',
      'enterprise cloud support',
      'cloud transformation help'
    ],
    author: 'ContainerCode Advisory',
    url: `${baseUrl}/contact`,
    siteName: 'ContainerCode Advisory',
    type: 'website',
    image: {
      url: `${baseUrl}/images/contact-og.jpg`,
      alt: 'Contact ContainerCode Advisory',
      width: 1200,
      height: 630
    },
    twitter: {
      card: 'summary_large_image',
      site: '@containercode',
      creator: '@containercode'
    }
  })
};

// Export singleton instance
export const metaTagsGenerator = new MetaTagsGenerator();

// Utility functions
export function generateMetaTags(config: MetaTagsConfig): string {
  return metaTagsGenerator.generateMetaTags(config);
}

export function generateMetadata(config: MetaTagsConfig): any {
  return metaTagsGenerator.generateMetadata(config);
}

export function generateStructuredData(config: StructuredDataConfig): string {
  return metaTagsGenerator.generateStructuredData(config);
}