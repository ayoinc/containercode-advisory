'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getLocalImage, type DownloadedMedia } from '@/lib/media-client';

interface SmartImageProps {
  category?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  fallbackSrc?: string;
  showAttribution?: boolean;
}

export function SmartImage({
  category,
  alt,
  className,
  width = 800,
  height = 600,
  priority = false,
  fill = false,
  fallbackSrc = '/images/hero-main.svg',
  showAttribution = true,
  ...props
}: SmartImageProps) {
  const [media, setMedia] = useState<DownloadedMedia | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get a local image first
    const loadMedia = async () => {
      try {
        const localMedia = await getLocalImage(category);
        if (localMedia) {
          setMedia(localMedia);
        }
      } catch (error) {
        console.warn('Failed to load local media:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMedia();
  }, [category]);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const getImageSrc = (): string => {
    if (imageError) return fallbackSrc;
    if (media) {
      // Ensure path starts with /
      const path = media.localPath.startsWith('/') ? media.localPath : `/${media.localPath}`;
      return path;
    }
    return fallbackSrc;
  };

  const getImageAlt = (): string => {
    if (alt) return alt;
    if (media) return media.alt;
    return `${category || 'Professional'} image`;
  };

  if (isLoading) {
    return (
      <div 
        className={cn(
          'animate-pulse bg-gray-200 rounded-lg',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <Image
        src={getImageSrc()}
        alt={getImageAlt()}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        onError={handleImageError}
        className={cn(
          'object-cover rounded-lg',
          imageError && 'opacity-75'
        )}
        {...props}
      />
      
      {/* Attribution overlay */}
      {showAttribution && media && !imageError && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded backdrop-blur-sm">
          Photo by {media.photographer}
        </div>
      )}
      
      {/* Error state indicator */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Specific image components for different sections
export function HeroImage({ className, ...props }: Omit<SmartImageProps, 'category'>) {
  return (
    <SmartImage
      category="hero"
      className={className}
      {...props}
    />
  );
}

export function ServiceImage({ 
  service, 
  className, 
  ...props 
}: Omit<SmartImageProps, 'category'> & { service: 'cloud' | 'security' | 'devops' | 'team' | 'innovation' | 'cloud-technologies' | 'cybersecurity' | 'digital-transformation' | 'software-engineering' | 'it-support' }) {
  const serviceImageMap = {
    cloud: '/images/service-cloud-technologies.svg',
    'cloud-technologies': '/images/service-cloud-technologies.svg',
    security: '/images/service-cybersecurity.svg',
    cybersecurity: '/images/service-cybersecurity.svg',
    devops: '/images/service-devops.svg',
    'digital-transformation': '/images/service-digital-transformation.svg',
    'software-engineering': '/images/service-software-engineering.svg',
    'it-support': '/images/service-it-support.svg',
    team: '/images/team-professional.svg',
    innovation: '/images/innovation-ai.svg'
  };

  const imageSrc = serviceImageMap[service] || '/images/hero-main.svg';

  return (
    <Image
      src={imageSrc}
      alt={`${service} professional services`}
      className={className}
      width={800}
      height={600}
      {...props}
    />
  );
}

export function BlogImage({ className, ...props }: Omit<SmartImageProps, 'category'>) {
  return (
    <SmartImage
      category="digital innovation"
      className={className}
      {...props}
    />
  );
}

export function TeamImage({ className, ...props }: Omit<SmartImageProps, 'category'>) {
  return (
    <SmartImage
      category="business team"
      className={className}
      {...props}
    />
  );
}