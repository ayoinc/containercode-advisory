'use client';

import { useEffect } from 'react';
import { 
  generateOrganizationSchema,
  generateServiceSchema,
  generateBlogPostSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  OrganizationSchema,
  ServiceSchema,
  BlogPostSchema,
  FAQItem,
  BreadcrumbItem
} from '@/lib/seo/structured-data';

interface StructuredDataProps {
  type: 'organization' | 'service' | 'blogpost' | 'faq' | 'breadcrumb';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  useEffect(() => {
    let schema: any;

    switch (type) {
      case 'organization':
        schema = generateOrganizationSchema(data as OrganizationSchema);
        break;
      case 'service':
        schema = generateServiceSchema(data as ServiceSchema);
        break;
      case 'blogpost':
        schema = generateBlogPostSchema(data as BlogPostSchema);
        break;
      case 'faq':
        schema = generateFAQSchema(data as FAQItem[]);
        break;
      case 'breadcrumb':
        schema = generateBreadcrumbSchema(data as BreadcrumbItem[]);
        break;
      default:
        return;
    }

    // Create and append script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    script.id = `structured-data-${type}`;

    // Remove existing script if present
    const existingScript = document.getElementById(`structured-data-${type}`);
    if (existingScript) {
      existingScript.remove();
    }

    // Append new script
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptElement = document.getElementById(`structured-data-${type}`);
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [type, data]);

  return null; // This component doesn't render anything visible
};

// Organization structured data for the main site
export const OrganizationStructuredData: React.FC = () => {
  const organizationData: OrganizationSchema = {
    name: 'ContainerCode Advisory',
    url: 'https://containercode.com',
    logo: 'https://containercode.com/images/containercode-logo.svg',
    description: 'Leading cloud consulting and digital transformation advisory helping enterprises scale securely with AWS, Azure, and GCP solutions.',
    email: 'ayoinc@me.com',
    telephone: '+1-555-CONTAINER',
    address: {
      streetAddress: '123 Cloud Street',
      addressLocality: 'Tech City',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US'
    },
    sameAs: [
      'https://linkedin.com/company/containercode',
      'https://twitter.com/containercode',
      'https://github.com/containercode'
    ]
  };

  return <StructuredData type="organization" data={organizationData} />;
};

// Service structured data
interface ServiceStructuredDataProps {
  serviceName: string;
  serviceDescription: string;
  serviceSlug: string;
}

export const ServiceStructuredData: React.FC<ServiceStructuredDataProps> = ({
  serviceName,
  serviceDescription,
  serviceSlug
}) => {
  const serviceData: ServiceSchema = {
    name: serviceName,
    description: serviceDescription,
    provider: 'ContainerCode Advisory',
    serviceType: 'Cloud Consulting',
    areaServed: 'Worldwide',
    availableChannel: {
      url: `https://containercode.com/services/${serviceSlug}`,
      name: 'Online Consultation'
    }
  };

  return <StructuredData type="service" data={serviceData} />;
};

// Blog post structured data
interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  author: string;
  publishedTime: string;
  modifiedTime: string;
  image: string;
  slug: string;
  keywords: string[];
  wordCount: number;
  readingTime: string;
}

export const BlogPostStructuredData: React.FC<BlogPostStructuredDataProps> = ({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  slug,
  keywords,
  wordCount,
  readingTime
}) => {
  const blogPostData: BlogPostSchema = {
    title,
    description,
    author,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    image,
    url: `https://containercode.com/blog/${slug}`,
    keywords,
    wordCount,
    timeRequired: readingTime
  };

  return <StructuredData type="blogpost" data={blogPostData} />;
};

// FAQ structured data
interface FAQStructuredDataProps {
  faqs: FAQItem[];
}

export const FAQStructuredData: React.FC<FAQStructuredDataProps> = ({ faqs }) => {
  return <StructuredData type="faq" data={faqs} />;
};

// Breadcrumb structured data
interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbItem[];
}

export const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({ breadcrumbs }) => {
  return <StructuredData type="breadcrumb" data={breadcrumbs} />;
};

// Combined structured data for pages that need multiple schemas
interface CombinedStructuredDataProps {
  organization?: boolean;
  service?: {
    name: string;
    description: string;
    slug: string;
  };
  blogPost?: {
    title: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime: string;
    image: string;
    slug: string;
    keywords: string[];
    wordCount: number;
    readingTime: string;
  };
  faq?: FAQItem[];
  breadcrumbs?: BreadcrumbItem[];
}

export const CombinedStructuredData: React.FC<CombinedStructuredDataProps> = ({
  organization = false,
  service,
  blogPost,
  faq,
  breadcrumbs
}) => {
  return (
    <>
      {organization && <OrganizationStructuredData />}
      {service && (
        <ServiceStructuredData 
          serviceName={service.name}
          serviceDescription={service.description}
          serviceSlug={service.slug}
        />
      )}
      {blogPost && (
        <BlogPostStructuredData 
          title={blogPost.title}
          description={blogPost.description}
          author={blogPost.author}
          publishedTime={blogPost.publishedTime}
          modifiedTime={blogPost.modifiedTime}
          image={blogPost.image}
          slug={blogPost.slug}
          keywords={blogPost.keywords}
          wordCount={blogPost.wordCount}
          readingTime={blogPost.readingTime}
        />
      )}
      {faq && <FAQStructuredData faqs={faq} />}
      {breadcrumbs && <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />}
    </>
  );
};