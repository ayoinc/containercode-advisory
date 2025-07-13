/**
 * Social Media Optimization Utilities
 * Generates optimal metadata for social sharing
 */

export interface SocialMetadata {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  locale?: string;
  siteName?: string;
}

export interface TwitterMetadata extends SocialMetadata {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  creator?: string;
  site?: string;
}

// Generate Open Graph metadata
export function generateOpenGraphMeta(data: SocialMetadata) {
  const meta = [
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:url', content: data.url },
    { property: 'og:type', content: data.type || 'website' },
    { property: 'og:locale', content: data.locale || 'en_US' },
    { property: 'og:site_name', content: data.siteName || 'ContainerCode Advisory' },
  ];

  if (data.image) {
    meta.push(
      { property: 'og:image', content: data.image },
      { property: 'og:image:alt', content: data.title },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' }
    );
  }

  return meta;
}

// Generate Twitter Card metadata
export function generateTwitterMeta(data: TwitterMetadata) {
  const meta = [
    { name: 'twitter:card', content: data.card || 'summary_large_image' },
    { name: 'twitter:title', content: data.title },
    { name: 'twitter:description', content: data.description },
  ];

  if (data.image) {
    meta.push({ name: 'twitter:image', content: data.image });
  }

  if (data.creator) {
    meta.push({ name: 'twitter:creator', content: data.creator });
  }

  if (data.site) {
    meta.push({ name: 'twitter:site', content: data.site });
  }

  return meta;
}

// Generate complete social metadata
export function generateSocialMeta(data: SocialMetadata & TwitterMetadata) {
  return [
    ...generateOpenGraphMeta(data),
    ...generateTwitterMeta(data),
  ];
}

// Generate optimal title
export function generateTitle(
  pageTitle: string,
  siteName: string = 'ContainerCode Advisory',
  separator: string = '|'
): string {
  // Ensure title is within optimal length (50-60 characters)
  const fullTitle = `${pageTitle} ${separator} ${siteName}`;
  
  if (fullTitle.length > 60) {
    // Truncate page title to fit
    const maxPageTitleLength = 60 - siteName.length - separator.length - 2;
    const truncatedPageTitle = pageTitle.substring(0, maxPageTitleLength) + '...';
    return `${truncatedPageTitle} ${separator} ${siteName}`;
  }
  
  return fullTitle;
}

// Generate optimal description
export function generateDescription(
  description: string,
  maxLength: number = 155
): string {
  if (description.length <= maxLength) {
    return description;
  }
  
  // Truncate at last complete word
  const truncated = description.substring(0, maxLength - 3);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpaceIndex) + '...';
}

// Image optimization for social media
export interface SocialImageConfig {
  width: number;
  height: number;
  text?: string;
  logo?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function generateSocialImageUrl(
  baseImage: string,
  config: SocialImageConfig
): string {
  // In production, this would use a service like Cloudinary or Vercel OG
  const params = new URLSearchParams({
    w: config.width.toString(),
    h: config.height.toString(),
    ...(config.text && { text: config.text }),
    ...(config.backgroundColor && { bg: config.backgroundColor }),
    ...(config.textColor && { color: config.textColor }),
  });
  
  return `${baseImage}?${params.toString()}`;
}

// Platform-specific image sizes
export const SOCIAL_IMAGE_SIZES = {
  openGraph: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
  linkedin: { width: 1200, height: 627 },
  facebook: { width: 1200, height: 630 },
  instagram: { width: 1080, height: 1080 },
} as const;

// Generate all social images
export function generateSocialImages(
  baseImage: string,
  title: string
): Record<keyof typeof SOCIAL_IMAGE_SIZES, string> {
  const images: Record<string, string> = {};
  
  Object.entries(SOCIAL_IMAGE_SIZES).forEach(([platform, size]) => {
    images[platform] = generateSocialImageUrl(baseImage, {
      ...size,
      text: title,
    });
  });
  
  return images as Record<keyof typeof SOCIAL_IMAGE_SIZES, string>;
}

// Social share URLs
export function generateShareUrls(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  };
}

// Rich snippet generator
export interface RichSnippet {
  rating?: number;
  reviewCount?: number;
  price?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
}

export function generateRichSnippetMeta(data: RichSnippet) {
  const meta = [];
  
  if (data.rating !== undefined) {
    meta.push(
      { itemprop: 'ratingValue', content: data.rating.toString() },
      { itemprop: 'bestRating', content: '5' }
    );
  }
  
  if (data.reviewCount !== undefined) {
    meta.push({ itemprop: 'reviewCount', content: data.reviewCount.toString() });
  }
  
  if (data.price) {
    meta.push({ itemprop: 'price', content: data.price });
  }
  
  if (data.availability) {
    meta.push({ itemprop: 'availability', content: `https://schema.org/${data.availability}` });
  }
  
  if (data.brand) {
    meta.push({ itemprop: 'brand', content: data.brand });
  }
  
  return meta;
}