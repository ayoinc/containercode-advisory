import imageMetadata from '../../public/images/image-metadata.json';
import { getLocalImage, type DownloadedMedia } from './media-client';

export type ImageCategory = 'hero' | 'services' | 'team' | 'cloud-technologies' | 'cybersecurity' | 'devops' | 'digital-transformation' | 'software-engineering' | 'it-support';
export type ImageUsage = 'hero' | 'card' | 'thumbnail' | 'background' | 'logo' | 'fallback';
export type ImageSize = 'small' | 'medium' | 'large';

export interface ImageMapping {
  path: string;
  alt: string;
  priority?: boolean;
  dimensions?: { width: number; height: number };
  category?: ImageCategory;
  fallback?: string;
  metadata?: Record<string, any>;
}

export interface ComponentImageConfig {
  component: string;
  category?: ImageCategory;
  categories?: ImageCategory[];
  categoryMap?: Record<string, ImageCategory>;
  priority?: boolean;
  dimensions?: { width: number; height: number };
  fallback?: string;
}

class ImageMapper {
  private metadata = imageMetadata;

  /**
   * Get static image information by key
   */
  getStaticImage(category: keyof typeof imageMetadata.staticImages, key: string): ImageMapping | null {
    const imageGroup = this.metadata.staticImages[category];
    if (!imageGroup || !(key in imageGroup)) {
      return null;
    }

    const image = imageGroup[key as keyof typeof imageGroup] as any;
    if (!image) {
      return null;
    }
    
    return {
      path: image.path || '',
      alt: image.alt || '',
      dimensions: image.dimensions,
      metadata: image.metadata
    };
  }

  /**
   * Get logo image based on context (mobile/desktop)
   */
  getLogo(isMobile = false): ImageMapping {
    const logoKey = isMobile ? 'containercode-icon' : 'containercode-logo-horizontal';
    const logo = this.getStaticImage('branding', logoKey);
    
    if (!logo) {
      return {
        path: '/images/containercode-logo-horizontal.svg',
        alt: 'ContainerCode Advisory logo'
      };
    }

    return logo;
  }

  /**
   * Get dynamic image configuration for a category
   */
  getDynamicImageConfig(category: ImageCategory): ComponentImageConfig | null {
    // Map category to dynamic image categories
    const dynamicCategory = category === 'cloud-technologies' || category === 'cybersecurity' || 
                           category === 'devops' || category === 'digital-transformation' || 
                           category === 'software-engineering' || category === 'it-support' ? 'services' : category;
    
    const config = this.metadata.dynamicImages.categories[dynamicCategory as keyof typeof this.metadata.dynamicImages.categories];
    if (!config) return null;

    return {
      component: 'SmartImage',
      category,
      dimensions: this.metadata.optimizationSettings.sizes.card.medium,
      ...config
    };
  }

  /**
   * Get image mapping for a specific page and section
   */
  async getPageImage(page: string, section: string, slug?: string): Promise<ImageMapping | null> {
    // Handle dynamic routes
    const pageKey = slug ? page.replace('[slug]', '[slug]') : page;
    const pageConfig = this.metadata.locationMapping.pages[pageKey as keyof typeof this.metadata.locationMapping.pages];
    
    if (!pageConfig) return null;

    const sectionConfig = pageConfig[section as keyof typeof pageConfig] as ComponentImageConfig;
    if (!sectionConfig) return null;

    // Handle category mapping for dynamic routes
    let category = sectionConfig.category;
    if (slug && sectionConfig.categoryMap) {
      category = sectionConfig.categoryMap[slug] || category;
    }

    if (!category) return null;

    // Try to get local media first
    const localMedia = await getLocalImage(category);
    if (localMedia) {
      return {
        path: `/${localMedia.localPath}`,
        alt: localMedia.alt,
        priority: sectionConfig.priority,
        dimensions: sectionConfig.dimensions,
        category,
        metadata: { photographer: localMedia.photographer }
      };
    }

    // Fallback to placeholder
    const dynamicConfig = this.getDynamicImageConfig(category);
    return {
      path: dynamicConfig?.fallback || '/images/placeholder-tech.jpg',
      alt: `${category.replace('-', ' ')} image`,
      priority: sectionConfig.priority,
      dimensions: sectionConfig.dimensions,
      category
    };
  }

  /**
   * Get image mapping for a component
   */
  async getComponentImage(componentName: string, context?: string): Promise<ImageMapping | null> {
    const componentConfig = this.metadata.locationMapping.components[componentName as keyof typeof this.metadata.locationMapping.components];
    if (!componentConfig) return null;

    if (context && componentConfig[context as keyof typeof componentConfig]) {
      const contextConfig = componentConfig[context as keyof typeof componentConfig];
      
      if (typeof contextConfig === 'string') {
        return { path: contextConfig, alt: `${componentName} ${context}` };
      }
      
      if (typeof contextConfig === 'object' && 'component' in contextConfig) {
        const config = contextConfig as ComponentImageConfig;
        return await this.resolveComponentConfig(config);
      }
    }

    return null;
  }

  /**
   * Get optimized image path with size and format preferences
   */
  getOptimizedImagePath(
    basePath: string, 
    size: ImageSize = 'medium', 
    format: 'webp' | 'jpg' | 'png' = 'webp'
  ): string {
    // For static images, return as-is
    if (basePath.startsWith('/images/')) {
      return basePath;
    }

    // For local Pexels media, return the stored path
    if (basePath.startsWith('/media/pexels/')) {
      return basePath;
    }

    return basePath;
  }

  /**
   * Get responsive image sizes string
   */
  getImageSizes(usage: ImageUsage): string {
    const sizeMap = {
      hero: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw',
      card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      thumbnail: '150px',
      background: '100vw',
      logo: '(max-width: 768px) 32px, 200px',
      fallback: '(max-width: 768px) 100vw, 50vw'
    };

    return sizeMap[usage] || sizeMap.fallback;
  }

  /**
   * Get fallback image for error states
   */
  getFallbackImage(category?: ImageCategory): ImageMapping {
    return {
      path: '/images/placeholder-tech.jpg',
      alt: category ? `${category.replace('-', ' ')} placeholder` : 'Placeholder image',
      dimensions: this.metadata.optimizationSettings.sizes.card.medium
    };
  }

  /**
   * Get all images for a category (useful for preloading)
   */
  getCategoryImages(category: ImageCategory): DownloadedMedia[] {
    // Map category to local media search terms
    const categoryMap: Record<ImageCategory, string> = {
      'hero': 'hero banner',
      'services': 'professional services',
      'team': 'business team',
      'cloud-technologies': 'cloud computing',
      'cybersecurity': 'cybersecurity',
      'devops': 'software development',
      'digital-transformation': 'digital transformation',
      'software-engineering': 'software engineering',
      'it-support': 'technical support'
    };

    // This would integrate with the media downloader to get all local images
    // For now, return empty array as this requires the manifest to be loaded
    return [];
  }

  public async resolveComponentConfig(config: ComponentImageConfig): Promise<ImageMapping | null> {
    if (config.category) {
      const localMedia = await getLocalImage(config.category);
      if (localMedia) {
        return {
          path: `/${localMedia.localPath}`,
          alt: localMedia.alt,
          priority: config.priority,
          dimensions: config.dimensions,
          category: config.category
        };
      }
    }

    return this.getFallbackImage(config.category);
  }
}

export const imageMapper = new ImageMapper();

// Helper functions for common use cases
export async function getHeroImage(page: string, slug?: string): Promise<ImageMapping | null> {
  return imageMapper.getPageImage(page, 'hero', slug);
}

export async function getServiceImage(service: string): Promise<ImageMapping | null> {
  const categoryMap: Record<string, ImageCategory> = {
    cloud: 'cloud-technologies',
    security: 'cybersecurity',
    devops: 'devops',
    transformation: 'digital-transformation',
    engineering: 'software-engineering',
    support: 'it-support',
    team: 'team'
  };

  const category = categoryMap[service];
  if (!category) return null;

  const config = imageMapper.getDynamicImageConfig(category);
  if (!config) return null;

  return imageMapper.resolveComponentConfig(config as ComponentImageConfig);
}

export async function getTeamImage(): Promise<ImageMapping | null> {
  return imageMapper.getPageImage('/team', 'hero');
}

export async function getBlogImage(slug?: string): Promise<ImageMapping | null> {
  // Determine category from slug if provided
  let category: ImageCategory = 'services'; // default
  
  if (slug) {
    if (slug.includes('cloud')) category = 'cloud-technologies';
    else if (slug.includes('security')) category = 'cybersecurity';
    else if (slug.includes('devops')) category = 'devops';
    else if (slug.includes('team')) category = 'team';
    else if (slug.includes('engineering')) category = 'software-engineering';
    else if (slug.includes('support')) category = 'it-support';
    else if (slug.includes('digital')) category = 'digital-transformation';
  }

  const localMedia = await getLocalImage(category);
  if (localMedia) {
    return {
      path: `/${localMedia.localPath}`,
      alt: localMedia.alt,
      category
    };
  }

  return imageMapper.getFallbackImage(category);
}

export function getLogo(isMobile = false): ImageMapping {
  return imageMapper.getLogo(isMobile);
}

export function getPlaceholderImage(): ImageMapping {
  return imageMapper.getStaticImage('placeholders', 'placeholder-tech') || 
    imageMapper.getFallbackImage();
}