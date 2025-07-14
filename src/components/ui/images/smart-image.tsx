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

function getRandomImageFromManifest(manifest: ImageManifest, category?: string, usage?: string): string | null {
  try {
    let imageIds: string[] = [];
    
    if (usage && category && manifest.usageMap[usage]?.[category]) {
      imageIds = manifest.usageMap[usage][category];
    } else if (category && manifest.categories[category]) {
      imageIds = manifest.categories[category];
    } else {
      imageIds = Object.keys(manifest.images);
    }
    
    if (imageIds.length === 0) return null;
    
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
    const image = manifest.images[randomId];
    
    return image ? `/${image.localPath}` : null;
  } catch (error) {
    console.warn('Error getting random image from manifest:', error);
    return null;
  }
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

        // Try to get image from manifest
        const manifest = await loadImageManifest();
        const smartSrc = getRandomImageFromManifest(manifest, category, usage);
        
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
      width={width || 800}
      height={height || 600}
    />
  );
}

// Convenience components for specific use cases
export function HeroImage({ category, ...props }: Omit<SmartImageProps, 'usage'>) {
  return <SmartImage {...props} usage="hero" category={category} priority={true} />;
}

export function ServiceImage({ category, ...props }: Omit<SmartImageProps, 'usage'>) {
  return <SmartImage {...props} usage="service" category={category} />;
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
        const manifest = await loadImageManifest();
        const url = getRandomImageFromManifest(manifest, category, usage);
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