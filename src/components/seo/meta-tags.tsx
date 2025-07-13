'use client';

import Head from 'next/head';
import { metaTagsGenerator, MetaTagsConfig, metaConfigs } from '@/lib/seo/meta-tags';

interface MetaTagsProps {
  config: MetaTagsConfig;
}

export const MetaTags: React.FC<MetaTagsProps> = ({ config }) => {
  const metadata = metaTagsGenerator.generateMetadata(config);

  return (
    <Head>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      {config.keywords && (
        <meta name="keywords" content={config.keywords.join(', ')} />
      )}
      {config.author && <meta name="author" content={config.author} />}
      <meta name="robots" content={config.robots || 'index, follow'} />
      <link rel="canonical" href={config.canonical || config.url} />

      {/* Open Graph */}
      <meta property="og:title" content={config.title} />
      <meta property="og:description" content={config.description} />
      <meta property="og:url" content={config.url} />
      <meta property="og:site_name" content={config.siteName} />
      <meta property="og:locale" content={config.locale || 'en_US'} />
      <meta property="og:type" content={config.type || 'website'} />
      
      {config.image && (
        <>
          <meta property="og:image" content={config.image.url} />
          <meta property="og:image:alt" content={config.image.alt} />
          <meta property="og:image:width" content={String(config.image.width || 1200)} />
          <meta property="og:image:height" content={String(config.image.height || 630)} />
          {config.image.type && (
            <meta property="og:image:type" content={config.image.type} />
          )}
        </>
      )}

      {config.video && (
        <>
          <meta property="og:video" content={config.video.url} />
          {config.video.type && (
            <meta property="og:video:type" content={config.video.type} />
          )}
          <meta property="og:video:width" content={String(config.video.width || 1920)} />
          <meta property="og:video:height" content={String(config.video.height || 1080)} />
        </>
      )}

      {/* Article-specific Open Graph */}
      {config.article && config.type === 'article' && (
        <>
          {config.article.publishedTime && (
            <meta property="article:published_time" content={config.article.publishedTime} />
          )}
          {config.article.modifiedTime && (
            <meta property="article:modified_time" content={config.article.modifiedTime} />
          )}
          {config.article.author && (
            <meta property="article:author" content={config.article.author} />
          )}
          {config.article.section && (
            <meta property="article:section" content={config.article.section} />
          )}
          {config.article.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={config.twitter?.card || 'summary_large_image'} />
      <meta name="twitter:title" content={config.title} />
      <meta name="twitter:description" content={config.description} />
      
      {config.twitter?.site && (
        <meta name="twitter:site" content={config.twitter.site} />
      )}
      {config.twitter?.creator && (
        <meta name="twitter:creator" content={config.twitter.creator} />
      )}
      
      {config.image && (
        <>
          <meta name="twitter:image" content={config.image.url} />
          <meta name="twitter:image:alt" content={config.image.alt} />
        </>
      )}

      {/* Additional SEO tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={config.siteName} />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://api.notion.com" />

      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//api.notion.com" />
      <link rel="dns-prefetch" href="//api.resend.com" />
    </Head>
  );
};

// Homepage meta tags
export const HomepageMetaTags: React.FC = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const config = metaConfigs.homepage(baseUrl);
  return <MetaTags config={config} />;
};

// Blog post meta tags
interface BlogPostMetaTagsProps {
  post: {
    title: string;
    excerpt?: string;
    description?: string;
    author?: string;
    slug: string;
    coverImage?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    category?: string;
  };
}

export const BlogPostMetaTags: React.FC<BlogPostMetaTagsProps> = ({ post }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const config = metaConfigs.blogPost(post, baseUrl);
  return <MetaTags config={config} />;
};

// Service page meta tags
interface ServicePageMetaTagsProps {
  service: {
    title: string;
    description: string;
    slug: string;
    keywords?: string[];
    image?: string;
  };
}

export const ServicePageMetaTags: React.FC<ServicePageMetaTagsProps> = ({ service }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const config = metaConfigs.servicePage(service, baseUrl);
  return <MetaTags config={config} />;
};

// Contact page meta tags
export const ContactPageMetaTags: React.FC = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  const config = metaConfigs.contactPage(baseUrl);
  return <MetaTags config={config} />;
};

// Generic page meta tags
interface GenericPageMetaTagsProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  type?: MetaTagsConfig['type'];
}

export const GenericPageMetaTags: React.FC<GenericPageMetaTagsProps> = ({
  title,
  description,
  path,
  keywords,
  image,
  type = 'website'
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://containercode.com';
  
  const config: MetaTagsConfig = {
    title,
    description,
    keywords,
    author: 'ContainerCode Advisory',
    url: `${baseUrl}${path}`,
    siteName: 'ContainerCode Advisory',
    type,
    image: image ? {
      url: image,
      alt: title,
      width: 1200,
      height: 630
    } : {
      url: `${baseUrl}/images/containercode-og-default.jpg`,
      alt: 'ContainerCode Advisory',
      width: 1200,
      height: 630
    },
    twitter: {
      card: 'summary_large_image',
      site: '@containercode',
      creator: '@containercode'
    }
  };

  return <MetaTags config={config} />;
};