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
   * Get image by ID
   */
  getImageById(id: string): ImageMapping | null {
    const image = this.metadata.images[id as keyof typeof this.metadata.images];
    if (!image) {
      return null;
    }
    
    return {
      path: image.localPath || '',
      alt: image.alt || '',
      dimensions: image.dimensions,
      category: image.category as ImageCategory,
      metadata: {
        photographer: image.photographer,
        url: image.url,
        downloadedAt: image.downloadedAt
      }
    };
  }

  /**
   * Get images by category
   */
  getImagesByCategory(category: string): ImageMapping[] {
    const imageIds = this.metadata.categories[category as keyof typeof this.metadata.categories];
    if (!imageIds || !Array.isArray(imageIds)) {
      return [];
    }

    return imageIds
      .map(id => this.getImageById(id))
      .filter((image): image is ImageMapping => image !== null);
  }

  /**
   * Get logo image based on context (mobile/desktop)
   */
  getLogo(isMobile = false): ImageMapping {
    // Return static logo path since we don't have branding in metadata
    return {
      path: '/images/containercode-logo-horizontal.svg',
      alt: 'ContainerCode Advisory logo'
    };
  }

  /**
   * Get hero image for a specific category
   */
  getHeroImage(category: ImageCategory = 'hero'): ImageMapping | null {
    // Map category to actual metadata categories
    const categoryMap: Record<string, string> = {
      'hero': 'cloud computing',
      'cloud-technologies': 'cloud computing',
      'cybersecurity': 'cybersecurity',
      'devops': 'devops',
      'digital-transformation': 'digital transformation',
      'software-engineering': 'software engineering',
      'it-support': 'it support',
      'services': 'cloud computing',
      'team': 'professional teams'
    };

    const mappedCategory = categoryMap[category] || category;
    const images = this.getImagesByCategory(mappedCategory);
    
    // Prefer hero usage images
    const heroImages = images.filter(img => {
      const imgData = this.metadata.images[Object.keys(this.metadata.images).find(key => 
        this.metadata.images[key as keyof typeof this.metadata.images].localPath === img.path
      ) as keyof typeof this.metadata.images];
      return imgData?.usage === 'hero';
    });

    if (heroImages.length > 0) {
      return heroImages[0];
    }

    return images.length > 0 ? images[0] : null;
  }

  /**
   * Get service card image for a specific service category
   */
  getServiceImage(category: ImageCategory): ImageMapping | null {
    const categoryMap: Record<string, string> = {
      'cloud-technologies': 'cloud computing',
      'cybersecurity': 'cybersecurity',
      'devops': 'devops',
      'digital-transformation': 'digital transformation',
      'software-engineering': 'software engineering',
      'it-support': 'it support'
    };

    const mappedCategory = categoryMap[category] || category;
    const images = this.getImagesByCategory(mappedCategory);
    
    // Prefer service usage images
    const serviceImages = images.filter(img => {
      const imgData = this.metadata.images[Object.keys(this.metadata.images).find(key => 
        this.metadata.images[key as keyof typeof this.metadata.images].localPath === img.path
      ) as keyof typeof this.metadata.images];
      return imgData?.usage === 'service';
    });

    if (serviceImages.length > 0) {
      return serviceImages[0];
    }

    return images.length > 0 ? images[0] : null;
  }

  /**
   * Get team member image
   */
  getTeamImage(index: number = 0): ImageMapping | null {
    const teamImages = this.getImagesByCategory('professional teams');
    return teamImages[index] || teamImages[0] || null;
  }

  /**
   * Get fallback image
   */
  getFallbackImage(): ImageMapping {
    const businessImages = this.getImagesByCategory('business general');
    if (businessImages.length > 0) {
      return businessImages[0];
    }

    return {
      path: '/images/fallback-tech.jpg',
      alt: 'Technology consulting services',
      category: 'services',
      fallback: '/images/placeholder.svg'
    };
  }

  /**
   * Get smart image configuration based on usage context
   */
  getSmartImageConfig(usage: ImageUsage, category?: ImageCategory): ImageMapping {
    switch (usage) {
      case 'hero':
        return this.getHeroImage(category) || this.getFallbackImage();
      case 'card':
      case 'thumbnail':
        return this.getServiceImage(category || 'services') || this.getFallbackImage();
      case 'background':
        return this.getHeroImage('hero') || this.getFallbackImage();
      case 'logo':
        return this.getLogo();
      case 'fallback':
      default:
        return this.getFallbackImage();
    }
  }

  /**
   * Get image for component with automatic selection
   */
  getComponentImage(componentName: string, category?: ImageCategory): ImageMapping {
    // Component-specific mappings
    const componentMappings: Record<string, ImageCategory> = {
      'hero-section': 'hero',
      'service-card': 'services',
      'team-card': 'team',
      'feature-section': 'cloud-technologies',
      'testimonial': 'team'
    };

    const mappedCategory = category || componentMappings[componentName] || 'services';
    return this.getSmartImageConfig('card', mappedCategory);
  }

  /**
   * Get multiple images for a category (useful for galleries)
   */
  getMultipleImages(category: string, count: number = 3): ImageMapping[] {
    const images = this.getImagesByCategory(category);
    return images.slice(0, count);
  }

  /**
   * Search images by alt text or category
   */
  searchImages(query: string): ImageMapping[] {
    const results: ImageMapping[] = [];
    
    Object.keys(this.metadata.images).forEach(key => {
      const image = this.metadata.images[key as keyof typeof this.metadata.images];
      if (image.alt.toLowerCase().includes(query.toLowerCase()) || 
          image.category.toLowerCase().includes(query.toLowerCase())) {
        const mapping = this.getImageById(key);
        if (mapping) {
          results.push(mapping);
        }
      }
    });

    return results;
  }
}

// Export singleton instance
export const imageMapper = new ImageMapper();

/**
 * Get optimized image path with fallback
 */
export function getOptimizedImagePath(
  imagePath: string, 
  fallback: string = '/images/placeholder.svg'
): string {
  return imagePath || fallback;
}

/**
 * Get default fallback image
 */
export function getDefaultFallback(): ImageMapping {
  return imageMapper.getFallbackImage();
}
