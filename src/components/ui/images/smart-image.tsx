'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface SmartImageProps {
  // Basic image props
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  
  // Smart loading props
  category?: string;
  usage?: 'hero' | 'service' | 'team' | 'general' | 'fallback';
  
  // Next.js Image props
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  
  // Fallback behavior
  fallbackSrc?: string;
  showLoadingSpinner?: boolean;
  
  // Style props
  rounded?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

interface ImageManifest {
  metadata: {
    generatedAt: string;
    version: string;
    totalImages: number;
  };
  images: Record<string, {
    id: string;
    filename: string;
    localPath: string;
    url: string;
    photographer: string;
    alt: string;
    category: string;
    usage: string;
    dimensions: { width: number; height: number };
    downloadedAt: string;
  }>;
  categories: Record<string, string[]>;
  usageMap: Record<string, Record<string, string[]>>;
}

// Cache for manifest
let manifestCache: ImageManifest | null = null;
let manifestPromise: Promise<ImageManifest> | null = null;

async function loadImageManifest(): Promise<ImageManifest> {
  if (manifestCache) return manifestCache;
  if (manifestPromise) return manifestPromise;

  manifestPromise = (async () => {
    try {
      const response = await fetch('/images/image-metadata.json');
      if (!response.ok) {
        throw new Error('Failed to load image manifest');
      }
      
      const manifest = await response.json() as ImageManifest;
      manifestCache = manifest;
      return manifest;
    } catch (error) {
      console.warn('Failed to load image manifest, using fallback:', error);
      // Return empty manifest structure
      return {
        metadata: { generatedAt: '', version: '1.0.0', totalImages: 0 },
        images: {},
        categories: {},
        usageMap: {}
      };
    }
  })();

  return manifestPromise;
}

// Direct image mapping without manifest dependency
function getDirectImagePath(category?: string, usage?: string): string | null {
  console.log(`[SmartImage] Direct lookup for category: "${category}", usage: "${usage}"`);
  
  // Direct mapping based on actual file structure
  const imageMap: Record<string, Record<string, string[]>> = {
    hero: {
      'cloud computing': [
        '/images/pexels/hero/hero-cloud-computing-1.jpeg',
        '/images/pexels/hero/hero-cloud-computing-2.jpeg',
        '/images/pexels/hero/hero-cloud-computing-3.jpeg'
      ],
      'cybersecurity': [
        '/images/pexels/hero/hero-cybersecurity-1.jpeg',
        '/images/pexels/hero/hero-cybersecurity-2.jpeg',
        '/images/pexels/hero/hero-cybersecurity-3.jpeg'
      ],
      'software development': [
        '/images/pexels/hero/hero-devops-1.jpeg',
        '/images/pexels/hero/hero-devops-2.jpeg',
        '/images/pexels/hero/hero-devops-3.jpeg'
      ],
      'digital innovation': [
        '/images/pexels/hero/hero-innovation-1.jpeg',
        '/images/pexels/hero/hero-innovation-2.jpeg',
        '/images/pexels/hero/hero-innovation-3.jpeg'
      ],
      'business team': [
        '/images/pexels/hero/hero-team-1.jpeg',
        '/images/pexels/hero/hero-team-2.jpeg',
        '/images/pexels/hero/hero-team-3.jpeg'
      ]
    },
    service: {
      'cloud computing': [
        '/images/pexels/service/service-cloud-technologies-1.jpeg',
        '/images/pexels/service/service-cloud-technologies-2.jpeg',
        '/images/pexels/service/service-cloud-technologies-3.jpeg',
        '/images/pexels/service/service-cloud-technologies-4.jpeg',
        '/images/pexels/service/service-cloud-technologies-5.jpeg'
      ],
      'cybersecurity': [
        '/images/pexels/service/service-cybersecurity-1.jpeg',
        '/images/pexels/service/service-cybersecurity-2.jpeg',
        '/images/pexels/service/service-cybersecurity-3.jpeg',
        '/images/pexels/service/service-cybersecurity-4.jpeg',
        '/images/pexels/service/service-cybersecurity-5.jpeg'
      ],
      'devops automation': [
        '/images/pexels/service/service-devops-1.jpeg',
        '/images/pexels/service/service-devops-2.jpeg',
        '/images/pexels/service/service-devops-3.jpeg',
        '/images/pexels/service/service-devops-4.jpeg',
        '/images/pexels/service/service-devops-5.jpeg'
      ],
      'digital transformation': [
        '/images/pexels/service/service-digital-transformation-1.jpeg',
        '/images/pexels/service/service-digital-transformation-2.jpeg',
        '/images/pexels/service/service-digital-transformation-3.jpeg',
        '/images/pexels/service/service-digital-transformation-4.jpeg',
        '/images/pexels/service/service-digital-transformation-5.jpeg'
      ],
      'software engineering': [
        '/images/pexels/service/service-software-engineering-1.jpeg',
        '/images/pexels/service/service-software-engineering-2.jpeg',
        '/images/pexels/service/service-software-engineering-3.jpeg',
        '/images/pexels/service/service-software-engineering-4.jpeg',
        '/images/pexels/service/service-software-engineering-5.jpeg'
      ],
      'it support': [
        '/images/pexels/service/service-it-support-1.jpeg',
        '/images/pexels/service/service-it-support-2.jpeg',
        '/images/pexels/service/service-it-support-3.jpeg',
        '/images/pexels/service/service-it-support-4.jpeg',
        '/images/pexels/service/service-it-support-5.jpeg'
      ]
    },
    general: {
      'technology': [
        '/images/pexels/general/tech-general-1.jpeg',
        '/images/pexels/general/tech-general-2.jpeg',
        '/images/pexels/general/tech-general-3.jpeg',
        '/images/pexels/general/tech-general-4.jpeg',
        '/images/pexels/general/tech-general-5.jpeg',
        '/images/pexels/general/tech-general-6.jpeg',
        '/images/pexels/general/tech-general-7.jpeg',
        '/images/pexels/general/tech-general-8.jpeg',
        '/images/pexels/general/tech-general-9.jpeg',
        '/images/pexels/general/tech-general-10.jpeg'
      ],
      'cloud computing': [
        '/images/pexels/general/tech-general-1.jpeg',
        '/images/pexels/general/tech-general-2.jpeg',
        '/images/pexels/general/tech-general-3.jpeg'
      ],
      'cybersecurity': [
        '/images/pexels/general/tech-general-4.jpeg',
        '/images/pexels/general/tech-general-5.jpeg',
        '/images/pexels/general/tech-general-6.jpeg'
      ],
      'digital transformation': [
        '/images/pexels/general/tech-general-7.jpeg',
        '/images/pexels/general/tech-general-8.jpeg',
        '/images/pexels/general/tech-general-9.jpeg'
      ]
    }
  };
  
  const usageKey = usage || 'general';
  const categoryKey = category || 'technology';
  
  // Try exact match first
  if (imageMap[usageKey]?.[categoryKey]) {
    const images = imageMap[usageKey][categoryKey];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log(`[SmartImage] Found direct match: ${randomImage}`);
    return randomImage;
  }
  
  // Try fallback within same usage
  if (imageMap[usageKey]) {
    const availableCategories = Object.keys(imageMap[usageKey]);
    if (availableCategories.length > 0) {
      const fallbackCategory = availableCategories[0];
      const images = imageMap[usageKey][fallbackCategory];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      console.log(`[SmartImage] Using fallback within usage "${usageKey}": ${randomImage}`);
      return randomImage;
    }
  }
  
  // Final fallback to general technology
  const generalImages = imageMap.general.technology;
  const randomImage = generalImages[Math.floor(Math.random() * generalImages.length)];
  console.log(`[SmartImage] Using final fallback: ${randomImage}`);
  return randomImage;
}

const DEFAULT_FALLBACKS = {
  hero: '/images/placeholder-tech.jpg',
  service: '/images/placeholder-tech.jpg',
  team: '/images/team-professional.jpg',
  general: '/images/placeholder-tech.jpg',
  fallback: '/images/placeholder-tech.jpg'
};

export function SmartImage({
  src,
  alt,
  className,
  category,
  usage = 'general',
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality = 85,
  fallbackSrc,
  showLoadingSpinner = true,
  rounded = false,
  objectFit = 'cover',
  ...props
}: SmartImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Load smart image source
  useEffect(() => {
    async function loadSmartImage() {
      setIsLoading(true);
      setHasError(false);

      try {
        // If src is provided, use it directly
        if (src) {
          setImageSrc(src);
          setIsLoading(false);
          return;
        }

        // Use direct image mapping instead of manifest
        const smartSrc = getDirectImagePath(category, usage);
        
        if (smartSrc) {
          setImageSrc(smartSrc);
        } else {
          // Fall back to default images
          const defaultSrc = fallbackSrc || DEFAULT_FALLBACKS[usage] || DEFAULT_FALLBACKS.fallback;
          setImageSrc(defaultSrc);
        }
      } catch (error) {
        console.warn('Error loading smart image:', error);
        const defaultSrc = fallbackSrc || DEFAULT_FALLBACKS[usage] || DEFAULT_FALLBACKS.fallback;
        setImageSrc(defaultSrc);
      } finally {
        setIsLoading(false);
      }
    }

    loadSmartImage();
  }, [src, category, usage, fallbackSrc]);

  const handleImageError = () => {
    setHasError(true);
    
    // Try fallback chain
    if (imageSrc !== (fallbackSrc || DEFAULT_FALLBACKS[usage])) {
      const defaultSrc = fallbackSrc || DEFAULT_FALLBACKS[usage] || DEFAULT_FALLBACKS.fallback;
      setImageSrc(defaultSrc);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (isLoading && showLoadingSpinner) {
    return (
      <div 
        className={cn(
          'bg-gray-200 animate-pulse flex items-center justify-center',
          rounded && 'rounded-lg',
          className
        )}
        style={{ width, height }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (!imageSrc) {
    return (
      <div 
        className={cn(
          'bg-gray-200 flex items-center justify-center text-gray-500',
          rounded && 'rounded-lg',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">No image available</span>
      </div>
    );
  }

  const imageProps = {
    src: imageSrc,
    alt,
    onError: handleImageError,
    onLoad: handleImageLoad,
    priority,
    quality,
    className: cn(
      'transition-opacity duration-300',
      rounded && 'rounded-lg',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    style: {
      objectFit,
      ...props.style
    },
    sizes: sizes || (fill ? '100vw' : undefined),
    ...props
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 600}  // Reduced from 800 for faster loading
      height={height || 400} // Reduced from 600 for faster loading
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
}

// Convenience components for specific use cases
export function HeroImage({ category, ...props }: Omit<SmartImageProps, 'usage'>) {
  return <SmartImage 
    {...props} 
    usage="hero" 
    category={category} 
    priority={true} 
    sizes="(max-width: 768px) 100vw, 50vw"
    quality={80}
  />;
}

export function ServiceImage({ category, ...props }: Omit<SmartImageProps, 'usage'>) {
  return <SmartImage 
    {...props} 
    usage="service" 
    category={category}
    sizes="(max-width: 768px) 100vw, 25vw"
    quality={75}
  />;
}

export function TeamImage({ ...props }: Omit<SmartImageProps, 'usage' | 'category'>) {
  return <SmartImage {...props} usage="team" category="professional team" />;
}

export function GeneralImage({ ...props }: Omit<SmartImageProps, 'usage'>) {
  return <SmartImage {...props} usage="general" />;
}

// Hook for getting smart image URLs
export function useSmartImage(category?: string, usage: string = 'general') {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      setIsLoading(true);
      try {
        const url = getDirectImagePath(category, usage);
        setImageUrl(url || DEFAULT_FALLBACKS[usage as keyof typeof DEFAULT_FALLBACKS] || DEFAULT_FALLBACKS.fallback);
      } catch (error) {
        console.warn('Error in useSmartImage:', error);
        setImageUrl(DEFAULT_FALLBACKS[usage as keyof typeof DEFAULT_FALLBACKS] || DEFAULT_FALLBACKS.fallback);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [category, usage]);

  return { imageUrl, isLoading };
}