/**
 * Notion CMS Integration
 * Manages website content through Notion databases
 */

import { Client } from '@notionhq/client';
import { cache } from 'react';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Database IDs for different content types
const DATABASES = {
  PAGES: process.env.NOTION_PAGES_DATABASE_ID || '', // Main website pages content
  SERVICES: process.env.NOTION_SERVICES_DATABASE_ID || '', // Services content
  TESTIMONIALS: process.env.NOTION_TESTIMONIALS_DATABASE_ID || '', // Testimonials
  FEATURES: process.env.NOTION_FEATURES_DATABASE_ID || '', // Features/capabilities
  TEAM: process.env.NOTION_TEAM_DATABASE_ID || '', // Team members
  FAQS: process.env.NOTION_FAQS_DATABASE_ID || '', // FAQs
  HERO_SECTIONS: process.env.NOTION_HERO_SECTIONS_DATABASE_ID || '', // Hero sections
  COMPANY_INFO: process.env.NOTION_COMPANY_INFO_DATABASE_ID || '', // Company information
};

// Types for content structure
export interface NotionPage {
  id: string;
  title: string;
  content: any[];
  slug: string;
  status: 'published' | 'draft';
  pageType: string;
  lastEdited: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface NotionService {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  outcomes: string[];
  href: string;
  image?: string;
  imageType?: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface NotionTestimonial {
  id: string;
  name: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  image?: string;
  serviceUsed?: string;
  featured: boolean;
  date: string;
}

export interface NotionFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  order: number;
  active: boolean;
  benefit?: string;
}

export interface NotionTeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image?: string;
  imageType?: string;
  linkedIn?: string;
  email?: string;
  specialties: string[];
  yearsExperience?: number;
  certifications?: string[];
  active: boolean;
  order: number;
}

export interface NotionFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  relatedService?: string;
}

export interface NotionHeroSection {
  id: string;
  pageSlug: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  imageType?: string;
  active: boolean;
}

export interface NotionCompanyInfo {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
}

// Helper function to extract rich text
function extractRichText(richText: any[]): string {
  return richText.map(text => text.plain_text).join('');
}

// Helper function to extract array from multi-select
function extractMultiSelect(multiSelect: any[]): string[] {
  return multiSelect.map(item => item.name);
}

// Helper function to parse blocks content
async function parseBlocks(blocks: any[]): Promise<any[]> {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return {
          type: 'paragraph',
          content: extractRichText(block.paragraph.rich_text),
        };
      case 'heading_1':
        return {
          type: 'heading_1',
          content: extractRichText(block.heading_1.rich_text),
        };
      case 'heading_2':
        return {
          type: 'heading_2',
          content: extractRichText(block.heading_2.rich_text),
        };
      case 'heading_3':
        return {
          type: 'heading_3',
          content: extractRichText(block.heading_3.rich_text),
        };
      case 'bulleted_list_item':
        return {
          type: 'bullet_list',
          content: extractRichText(block.bulleted_list_item.rich_text),
        };
      case 'numbered_list_item':
        return {
          type: 'numbered_list',
          content: extractRichText(block.numbered_list_item.rich_text),
        };
      case 'callout':
        return {
          type: 'callout',
          content: extractRichText(block.callout.rich_text),
          icon: block.callout.icon?.emoji || '💡',
        };
      case 'image':
        return {
          type: 'image',
          url: block.image.external?.url || block.image.file?.url,
          caption: block.image.caption ? extractRichText(block.image.caption) : '',
        };
      default:
        return {
          type: 'unknown',
          content: '',
        };
    }
  });
}

// Cached functions for better performance
export const getPageContent = cache(async (pageSlug: string): Promise<NotionPage | null> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.PAGES,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: pageSlug,
            },
          },
          {
            property: 'Status',
            select: {
              equals: 'published',
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0] as any;
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    const content = await parseBlocks(blocks.results);

    return {
      id: page.id,
      title: extractRichText(page.properties.Title.title),
      content,
      slug: extractRichText(page.properties.Slug.rich_text),
      status: page.properties.Status.select.name,
      pageType: page.properties.PageType.select.name,
      lastEdited: page.last_edited_time,
      seo: {
        title: page.properties.SEOTitle?.rich_text ? extractRichText(page.properties.SEOTitle.rich_text) : undefined,
        description: page.properties.SEODescription?.rich_text ? extractRichText(page.properties.SEODescription.rich_text) : undefined,
        keywords: page.properties.SEOKeywords?.multi_select ? extractMultiSelect(page.properties.SEOKeywords.multi_select) : undefined,
      },
    };
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
});

export const getServices = cache(async (): Promise<NotionService[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.SERVICES,
      filter: {
        property: 'Status',
        select: {
          equals: 'active',
        },
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((service: any) => ({
      id: service.id,
      title: extractRichText(service.properties.Title.title),
      description: extractRichText(service.properties.Description.rich_text),
      icon: extractRichText(service.properties.Icon.rich_text),
      color: extractRichText(service.properties.Color.rich_text),
      features: extractMultiSelect(service.properties.Features.multi_select),
      outcomes: extractMultiSelect(service.properties.Outcomes.multi_select),
      href: extractRichText(service.properties.Href.rich_text),
      image: service.properties.Image?.files[0]?.external?.url || service.properties.Image?.files[0]?.file?.url,
      status: service.properties.Status.select.name,
      order: service.properties.Order.number,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
});

export const getTestimonials = cache(async (featured: boolean = false): Promise<NotionTestimonial[]> => {
  try {
    const filters: any[] = [];
    
    if (featured) {
      filters.push({
        property: 'Featured',
        checkbox: {
          equals: true,
        },
      });
    }

    const response = await notion.databases.query({
      database_id: DATABASES.TESTIMONIALS,
      filter: filters.length > 0 ? { and: filters } : undefined,
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return response.results.map((testimonial: any) => ({
      id: testimonial.id,
      name: extractRichText(testimonial.properties.Name.title),
      company: extractRichText(testimonial.properties.Company.rich_text),
      position: extractRichText(testimonial.properties.Position.rich_text),
      content: extractRichText(testimonial.properties.Content.rich_text),
      rating: testimonial.properties.Rating.number,
      image: testimonial.properties.Image?.files[0]?.external?.url || testimonial.properties.Image?.files[0]?.file?.url,
      featured: testimonial.properties.Featured.checkbox,
      date: testimonial.properties.Date.date.start,
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
});

export const getFeatures = cache(async (category?: string): Promise<NotionFeature[]> => {
  try {
    const filters: any[] = [
      {
        property: 'Active',
        checkbox: {
          equals: true,
        },
      },
    ];

    if (category) {
      filters.push({
        property: 'Category',
        select: {
          equals: category,
        },
      });
    }

    const response = await notion.databases.query({
      database_id: DATABASES.FEATURES,
      filter: { and: filters },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((feature: any) => ({
      id: feature.id,
      title: extractRichText(feature.properties.Title.title),
      description: extractRichText(feature.properties.Description.rich_text),
      icon: extractRichText(feature.properties.Icon.rich_text),
      category: feature.properties.Category.select.name,
      order: feature.properties.Order.number,
      active: feature.properties.Active.checkbox,
    }));
  } catch (error) {
    console.error('Error fetching features:', error);
    return [];
  }
});

export const getTeamMembers = cache(async (): Promise<NotionTeamMember[]> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.TEAM,
      filter: {
        property: 'Active',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((member: any) => ({
      id: member.id,
      name: extractRichText(member.properties.Name.title),
      position: extractRichText(member.properties.Position.rich_text),
      bio: extractRichText(member.properties.Bio.rich_text),
      image: member.properties.Image?.files[0]?.external?.url || member.properties.Image?.files[0]?.file?.url,
      linkedIn: member.properties.LinkedIn?.url,
      email: member.properties.Email?.email,
      specialties: extractMultiSelect(member.properties.Specialties.multi_select),
      active: member.properties.Active.checkbox,
      order: member.properties.Order.number,
    }));
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
});

export const getFAQs = cache(async (category?: string): Promise<NotionFAQ[]> => {
  try {
    const filters: any[] = [
      {
        property: 'Active',
        checkbox: {
          equals: true,
        },
      },
    ];

    if (category) {
      filters.push({
        property: 'Category',
        select: {
          equals: category,
        },
      });
    }

    const response = await notion.databases.query({
      database_id: DATABASES.FAQS,
      filter: { and: filters },
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map((faq: any) => ({
      id: faq.id,
      question: extractRichText(faq.properties.Question.title),
      answer: extractRichText(faq.properties.Answer.rich_text),
      category: faq.properties.Category.select.name,
      order: faq.properties.Order.number,
      active: faq.properties.Active.checkbox,
    }));
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
});

export const getHeroSection = cache(async (pageSlug: string): Promise<NotionHeroSection | null> => {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.HERO_SECTIONS,
      filter: {
        and: [
          {
            property: 'PageSlug',
            rich_text: {
              equals: pageSlug,
            },
          },
          {
            property: 'Active',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const hero = response.results[0] as any;

    return {
      id: hero.id,
      pageSlug: extractRichText(hero.properties.PageSlug.rich_text),
      title: extractRichText(hero.properties.Title.title),
      subtitle: extractRichText(hero.properties.Subtitle.rich_text),
      description: extractRichText(hero.properties.Description.rich_text),
      ctaText: extractRichText(hero.properties.CTAText.rich_text),
      ctaLink: extractRichText(hero.properties.CTALink.rich_text),
      backgroundImage: hero.properties.BackgroundImage?.files[0]?.external?.url || hero.properties.BackgroundImage?.files[0]?.file?.url,
      active: hero.properties.Active.checkbox,
    };
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
});

export const getCompanyInfo = cache(async (key?: string): Promise<NotionCompanyInfo[]> => {
  try {
    const filters: any[] = [];

    if (key) {
      filters.push({
        property: 'Key',
        rich_text: {
          equals: key,
        },
      });
    }

    const response = await notion.databases.query({
      database_id: DATABASES.COMPANY_INFO,
      filter: filters.length > 0 ? { and: filters } : undefined,
    });

    return response.results.map((info: any) => ({
      id: info.id,
      key: extractRichText(info.properties.Key.title),
      value: extractRichText(info.properties.Value.rich_text),
      category: info.properties.Category.select.name,
      description: info.properties.Description?.rich_text ? extractRichText(info.properties.Description.rich_text) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching company info:', error);
    return [];
  }
});

// Helper function to get specific company info value
export const getCompanyInfoValue = cache(async (key: string): Promise<string | null> => {
  const info = await getCompanyInfo(key);
  return info.length > 0 ? info[0].value : null;
});