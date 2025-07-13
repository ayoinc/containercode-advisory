'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Photo } from 'pexels/dist/types';
import { getRandomPhoto, IMAGE_CATEGORIES } from '@/lib/pexels';
import { cn } from '@/lib/utils';

interface PexelsImageProps {
  category: keyof typeof IMAGE_CATEGORIES;
  orientation?: 'landscape' | 'portrait' | 'square';
  className?: string;
  alt?: string;
  priority?: boolean;
  fallbackSrc?: string;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
}

export function PexelsImage({
  category,
  orientation = 'landscape',
  className,
  alt,
  priority = false,
  fallbackSrc = '/images/pexels/placeholder-technology-modern.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  width,
  height,
  quality = 75,
  ...props
}: PexelsImageProps) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const fetchedPhoto = await getRandomPhoto(category, orientation);
        
        if (mounted) {
          if (fetchedPhoto) {
            setPhoto(fetchedPhoto);
          } else {
            // If no photo is found, set error to use fallback
            setError(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch Pexels image:', err);
        if (mounted) {
          setError(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      mounted = false;
    };
  }, [category, orientation]);

  if (loading) {
    return (
      <div className={cn(
        'animate-pulse bg-gray-200 flex items-center justify-center',
        className
      )}>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt || 'Fallback image'}
        className={className}
        fill={fill}
        width={!fill ? width || 800 : undefined}
        height={!fill ? height || 600 : undefined}
        quality={quality}
        sizes={sizes}
        priority={priority}
        {...props}
      />
    );
  }

  const imageSrc = photo.src.large;
  const imageAlt = alt || photo.alt || `${category} related image by ${photo.photographer}`;

  return (
    <div className="relative">
      <Image
        src={imageSrc}
        alt={imageAlt}
        className={className}
        fill={fill}
        width={!fill ? width || photo.width : undefined}
        height={!fill ? height || photo.height : undefined}
        quality={quality}
        sizes={sizes}
        priority={priority}
        {...props}
      />
      
      {/* Attribution overlay - appears on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
        Photo by{' '}
        <a
          href={photo.photographer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          {photo.photographer}
        </a>{' '}
        on Pexels
      </div>
    </div>
  );
}

// Pre-configured variants for common use cases
export function HeroImage({ className, ...props }: Omit<PexelsImageProps, 'category' | 'orientation'>) {
  return (
    <PexelsImage
      category="cloudComputing"
      orientation="landscape"
      className={cn('w-full h-[500px] object-cover rounded-xl', className)}
      priority
      {...props}
    />
  );
}

export function ServiceImage({ 
  service, 
  className, 
  ...props 
}: Omit<PexelsImageProps, 'category'> & { 
  service: 'cloud' | 'security' | 'devops' | 'innovation' 
}) {
  const categoryMap = {
    cloud: 'cloudComputing' as const,
    security: 'cybersecurity' as const,
    devops: 'devops' as const,
    innovation: 'innovation' as const,
  };

  return (
    <PexelsImage
      category={categoryMap[service]}
      className={cn('w-full h-48 object-cover rounded-lg', className)}
      {...props}
    />
  );
}

export function TeamImage({ className, ...props }: Omit<PexelsImageProps, 'category'>) {
  return (
    <PexelsImage
      category="teamwork"
      orientation="portrait"
      className={cn('w-full h-64 object-cover rounded-lg', className)}
      {...props}
    />
  );
}

export function BlogImage({ className, ...props }: Omit<PexelsImageProps, 'category'>) {
  return (
    <PexelsImage
      category="innovation"
      orientation="landscape"
      className={cn('w-full h-48 object-cover rounded-lg', className)}
      {...props}
    />
  );
}