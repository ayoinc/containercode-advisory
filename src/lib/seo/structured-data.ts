/**
 * Structured Data Utilities
 * Generates JSON-LD structured data for SEO
 */

// Organization schema
export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  email: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  sameAs: string[];
}

export function generateOrganizationSchema(org: OrganizationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    email: org.email,
    telephone: org.telephone,
    address: {
      '@type': 'PostalAddress',
      ...org.address,
    },
    sameAs: org.sameAs,
    // Additional properties
    founders: [
      {
        '@type': 'Person',
        name: 'ContainerCode Founders',
      },
    ],
    knowsAbout: [
      'Cloud Computing',
      'Amazon Web Services',
      'Microsoft Azure',
      'Google Cloud Platform',
      'DevOps',
      'Cybersecurity',
      'Digital Transformation',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
  };
}

// Service schema
export interface ServiceSchema {
  name: string;
  description: string;
  provider: string;
  serviceType: string;
  areaServed: string;
  availableChannel: {
    url: string;
    name: string;
  };
}

export function generateServiceSchema(service: ServiceSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    serviceType: service.serviceType,
    areaServed: service.areaServed,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: service.availableChannel.url,
      name: service.availableChannel.name,
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: 'Contact for pricing',
      },
    },
  };
}

// Blog post schema
export interface BlogPostSchema {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
  keywords: string[];
  wordCount: number;
  timeRequired: string;
}

export function generateBlogPostSchema(post: BlogPostSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    image: post.image,
    url: post.url,
    keywords: post.keywords.join(', '),
    wordCount: post.wordCount,
    timeRequired: post.timeRequired,
    publisher: {
      '@type': 'Organization',
      name: 'ContainerCode Advisory',
      logo: {
        '@type': 'ImageObject',
        url: 'https://containercode.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

// FAQ schema
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb schema
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Review schema
export interface ReviewSchema {
  author: string;
  reviewRating: number;
  reviewBody: string;
  datePublished: string;
}

export function generateReviewSchema(reviews: ReviewSchema[], itemReviewed: string) {
  const aggregateRating = reviews.reduce((sum, r) => sum + r.reviewRating, 0) / reviews.length;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemReviewed,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };
}

// How-to schema
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[],
  totalTime: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };
}

// Event schema
export interface EventSchema {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
  };
  organizer: string;
  eventStatus: 'EventScheduled' | 'EventCancelled' | 'EventPostponed';
  eventAttendanceMode: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}

export function generateEventSchema(event: EventSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.location.address,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer,
    },
    eventStatus: `https://schema.org/${event.eventStatus}`,
    eventAttendanceMode: `https://schema.org/${event.eventAttendanceMode}`,
  };
}

// Structured data component
export interface StructuredDataProps {
  data: any;
}

// Note: This would need to be a separate client component file
export function generateStructuredDataScript(data: any): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}