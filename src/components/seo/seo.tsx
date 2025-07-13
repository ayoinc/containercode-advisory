'use client';

/**
 * SEO Component
 * Comprehensive SEO management for pages
 */

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  generateTitle,
  generateDescription,
} from '@/lib/seo';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  keywords?: string[];
  structuredData?: any;
  noindex?: boolean;
  nofollow?: boolean;
  canonicalUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  keywords = [],
  structuredData,
  noindex = false,
  nofollow = false,
  canonicalUrl,
}) => {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const currentUrl = `${baseUrl}${pathname}`;
  
  // Use hooks for analytics - temporarily disabled
  // usePageView();
  // useScrollDepthTracking();
  // useTimeOnPageTracking();
  
  // Structured data will be rendered directly in the component
  return (
    <>
      {/* {structuredData && <StructuredData data={structuredData} />} */}
    </>
  );
};

// Page-specific SEO components
export const BlogSEO: React.FC<{
  title: string;
  description: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  tags: string[];
  wordCount: number;
  readingTime: number;
}> = (props) => {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.description,
    author: {
      '@type': 'Organization',
      name: props.author,
    },
    datePublished: props.publishedTime,
    dateModified: props.modifiedTime || props.publishedTime,
    image: props.image || `${baseUrl}/og-image.png`,
    url: `${baseUrl}${pathname}`,
    keywords: props.tags.join(', '),
    wordCount: props.wordCount,
    timeRequired: `PT${props.readingTime}M`,
    publisher: {
      '@type': 'Organization',
      name: 'ContainerCode Advisory',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${pathname}`,
    },
  };
  
  return (
    <SEO
      title={props.title}
      description={props.description}
      image={props.image}
      type="article"
      publishedTime={props.publishedTime}
      modifiedTime={props.modifiedTime}
      author={props.author}
      keywords={props.tags}
      structuredData={structuredData}
    />
  );
};

export const ServiceSEO: React.FC<{
  title: string;
  description: string;
  image?: string;
  serviceName: string;
  serviceType: string;
}> = (props) => {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.serviceName,
    description: props.description,
    serviceType: props.serviceType,
    provider: {
      '@type': 'Organization',
      name: 'ContainerCode Advisory',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}${pathname}`,
      name: 'Online Consultation',
    },
  };
  
  return (
    <SEO
      title={props.title}
      description={props.description}
      image={props.image}
      structuredData={structuredData}
    />
  );
};

// Metadata generator for Next.js 13+ App Router
export function generateSEOMetadata({
  title,
  description,
  image,
  type = 'website',
  keywords = [],
  noindex = false,
  nofollow = false,
  canonicalUrl,
}: SEOProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const optimizedTitle = generateTitle(title);
  const optimizedDescription = generateDescription(description);
  const imageUrl = image || `${baseUrl}/og-image.png`;
  
  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: keywords.join(', '),
    authors: [{ name: 'ContainerCode Advisory' }],
    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url: canonicalUrl || baseUrl,
      siteName: 'ContainerCode Advisory',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      images: [imageUrl],
      creator: '@containercode',
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}