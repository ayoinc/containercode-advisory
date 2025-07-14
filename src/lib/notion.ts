import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';

// Simple cache implementation for Node.js environments
const simpleCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cache<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const cached = simpleCache.get(key);
    
    if (cached && cached.expiry > Date.now()) {
      return Promise.resolve(cached.data);
    }
    
    const result = fn(...args);
    result.then((data: any) => {
      simpleCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
    }).catch(() => {
      // Don't cache errors
    });
    
    return result;
  }) as T;
}

// Environment validation
const requiredEnvVars = {
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_SERVICES: process.env.NOTION_DATABASE_SERVICES,
  NOTION_DATABASE_BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS,
} as const;

// Validate environment variables
const validateEnvironment = () => {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(`Missing Notion environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Validate database ID format
const isValidDatabaseId = (id: string): boolean => {
  if (!id) return false;
  // Remove hyphens and check if it's 32 characters of hex
  const cleanId = id.replace(/-/g, '');
  return /^[a-f0-9]{32}$/i.test(cleanId);
};

// Initialize Notion clients only if environment is valid
export const notion = validateEnvironment() ? new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28', // Use stable API version
}) : null;

export const notionAPI = new NotionAPI();

// Enhanced error handling wrapper
const withNotionErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R | null> => {
    if (!notion) {
      console.warn('Notion client not initialized - skipping operation');
      return null;
    }

    try {
      return await fn(...args);
    } catch (error: any) {
      console.error('Notion API Error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        operation: fn.name
      });

      // Handle specific error types
      if (error.code === 'invalid_request_url') {
        console.error('Invalid Notion database ID or malformed request');
      } else if (error.code === 'unauthorized') {
        console.error('Invalid Notion token or insufficient permissions');
      } else if (error.code === 'object_not_found') {
        console.error('Notion database or page not found');
      }

      return null;
    }
  };
};

// Constants for database IDs with validation
export const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS || '',
  TEAM_MEMBERS: process.env.NOTION_DATABASE_TEAM_MEMBERS || '',
  SERVICES: process.env.NOTION_DATABASE_SERVICES || '',
  SUBSCRIBERS: process.env.NOTION_DATABASE_SUBSCRIBERS || '',
  NEWSLETTERS: process.env.NOTION_DATABASE_NEWSLETTERS || '',
  GENERATED_ARTICLES: process.env.NOTION_DATABASE_GENERATED_ARTICLES || '',
  WEBSITE_PAGES: process.env.NOTION_DATABASE_WEBSITE_PAGES || '',
  TRENDING_TOPICS: process.env.NOTION_DATABASE_TRENDING_TOPICS || '',
  EMAIL_CAMPAIGNS: process.env.NOTION_DATABASE_EMAIL_CAMPAIGNS || '',
};

// Validate all database IDs on startup
const validateDatabaseIds = () => {
  Object.entries(DATABASE_IDS).forEach(([name, id]) => {
    if (id && !isValidDatabaseId(id)) {
      console.warn(`Invalid database ID format for ${name}: ${id}`);
    }
  });
};

// Run validation
validateDatabaseIds();

// Cache-optimized database query function with enhanced error handling
export const getDatabase = cache(withNotionErrorHandling(async (databaseId: string) => {
  if (!databaseId) {
    console.warn('Database ID is empty, returning empty results');
    return [];
  }
  
  if (!isValidDatabaseId(databaseId)) {
    console.error(`Invalid database ID format: ${databaseId}`);
    return [];
  }
  
  const response = await notion!.databases.query({
    database_id: databaseId,
    page_size: 100,
  });
  return response.results;
}));

// Cache-optimized page query function with enhanced error handling
export const getPage = cache(withNotionErrorHandling(async (pageId: string) => {
  if (!pageId) {
    console.warn('Page ID is empty, returning null');
    return null;
  }
  
  if (!isValidDatabaseId(pageId)) {
    console.error(`Invalid page ID format: ${pageId}`);
    return null;
  }
  
  const response = await notion!.pages.retrieve({ page_id: pageId });
  return response;
}));

// Cache-optimized block query function with enhanced error handling
export const getBlocks = cache(withNotionErrorHandling(async (blockId: string) => {
  if (!blockId) {
    console.warn('Block ID is empty, returning empty blocks');
    return [];
  }
  
  if (!isValidDatabaseId(blockId)) {
    console.error(`Invalid block ID format: ${blockId}`);
    return [];
  }
  
  const blocks = [];
  let cursor;
  
  while (true) {
    const { results, next_cursor } = await notion!.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    blocks.push(...results);
    if (!next_cursor) break;
    cursor = next_cursor;
  }
  
  return blocks;
}));

// Interface definitions for Notion content types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedDate: string;
  lastEditedTime: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  content: any[];
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  bio: any[];
  photo: string;
  expertise: string[];
  certifications: string[];
  linkedIn: string;
  email: string;
  featured: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  icon: string;
  featuredImage: string;
  status: string;
  featured: boolean;
  order: number;
  content: any[];
}

// Helper function to safely extract text from rich text
const extractPlainText = (richText: any[]): string => {
  return richText?.[0]?.plain_text || '';
};

// Helper function to safely extract URL from files
const extractFileUrl = (files: any[]): string => {
  return files?.[0]?.file?.url || files?.[0]?.external?.url || '';
};

// Helper function to parse blog posts from Notion database results
export const parseBlogPosts = (posts: any[]): BlogPost[] => {
  return posts.map((post) => {
    const properties = post.properties;
    
    return {
      id: post.id,
      title: extractPlainText(properties.Title?.title) || 'Untitled',
      slug: extractPlainText(properties.Slug?.rich_text) || post.id,
      publishedDate: properties.PublishedDate?.date?.start || '',
      lastEditedTime: post.last_edited_time,
      author: {
        name: properties.Author?.people?.[0]?.name || 'Anonymous',
        avatar: properties.Author?.people?.[0]?.avatar_url || '',
      },
      category: properties.Category?.select?.name || '',
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      excerpt: extractPlainText(properties.Excerpt?.rich_text) || '',
      coverImage: extractFileUrl(properties.CoverImage?.files) || '',
      content: [], // To be populated with getBlocks
      featured: properties.Featured?.checkbox || false,
    };
  });
};

// Helper function to parse team members from Notion database results
export const parseTeamMembers = (teamMembers: any[]): TeamMember[] => {
  return teamMembers.map((member) => {
    const properties = member.properties;
    
    return {
      id: member.id,
      name: extractPlainText(properties.Name?.title) || 'Unnamed',
      position: extractPlainText(properties.Position?.rich_text) || '',
      department: properties.Department?.select?.name || '',
      bio: [], // To be populated with getBlocks
      photo: extractFileUrl(properties.Photo?.files) || '',
      expertise: properties.Expertise?.multi_select?.map((item: any) => item.name) || [],
      certifications: properties.Certifications?.multi_select?.map((item: any) => item.name) || [],
      linkedIn: properties.LinkedIn?.url || '',
      email: properties.Email?.email || '',
      featured: properties.Featured?.checkbox || false,
    };
  });
};

// Helper function to parse services from Notion database results
export const parseServices = (services: any[]): Service[] => {
  return services.map((service) => {
    const properties = service.properties;
    
    return {
      id: service.id,
      title: extractPlainText(properties["Service Name"]?.title) || 'Untitled',
      slug: extractPlainText(properties.Slug?.rich_text) || service.id,
      category: properties.Category?.select?.name || '',
      shortDescription: extractPlainText(properties.ShortDescription?.rich_text) || '',
      icon: extractFileUrl(properties.Icon?.files) || '',
      featuredImage: extractFileUrl(properties.FeaturedImage?.files) || '',
      status: properties.Status?.select?.name || 'Inactive',
      featured: properties.Featured?.checkbox || false,
      order: properties.Order?.number || 0,
      content: [], // To be populated with getBlocks
    };
  });
};

// Safe database query with fallback
const safeQueryDatabase = async (databaseId: string, options: any = {}) => {
  if (!databaseId || !isValidDatabaseId(databaseId)) {
    console.warn(`Invalid or missing database ID: ${databaseId}`);
    return { results: [], next_cursor: null, has_more: false };
  }

  const result = await getDatabase(databaseId);
  if (!result) {
    return { results: [], next_cursor: null, has_more: false };
  }

  return {
    results: result,
    next_cursor: null,
    has_more: false,
  };
};

// Get blog posts with filtering and pagination
export const getBlogPosts = cache(async ({
  pageSize = 10,
  startCursor = undefined,
  filter = { property: "Status", select: { equals: "Published" } },
  sorts = [{ property: "PublishedDate", direction: "descending" }]
}: {
  pageSize?: number;
  startCursor?: string;
  filter?: any;
  sorts?: any[];
} = {}) => {
  try {
    if (!DATABASE_IDS.BLOG_POSTS) {
      console.warn('Blog posts database ID not configured');
      return { results: [], next_cursor: null, has_more: false };
    }

    const response = await safeQueryDatabase(DATABASE_IDS.BLOG_POSTS, { filter, sorts });
    
    return {
      results: parseBlogPosts(response.results),
      next_cursor: response.next_cursor,
      has_more: response.has_more,
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { results: [], next_cursor: null, has_more: false };
  }
});

// Get single blog post by slug
export const getBlogPostBySlug = cache(async (slug: string) => {
  try {
    if (!DATABASE_IDS.BLOG_POSTS || !slug) {
      return null;
    }

    const result = await getDatabase(DATABASE_IDS.BLOG_POSTS);
    if (!result) return null;

    const filteredResults = result.filter((post: any) => 
      extractPlainText(post.properties.Slug?.rich_text) === slug
    );
    
    if (!filteredResults.length) {
      return null;
    }
    
    const post = parseBlogPosts(filteredResults)[0];
    const blocks = await getBlocks(filteredResults[0].id);
    post.content = blocks || [];
    
    return post;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
});

// Get services with filtering and pagination
export const getServices = cache(async ({
  pageSize = 100,
  startCursor = undefined,
  filter = { property: "Status", select: { equals: "Active" } },
  sorts = [{ property: "Order", direction: "ascending" }]
}: {
  pageSize?: number;
  startCursor?: string;
  filter?: any;
  sorts?: any[];
} = {}) => {
  try {
    if (!DATABASE_IDS.SERVICES) {
      console.warn('Services database ID not configured');
      return { results: [], next_cursor: null, has_more: false };
    }

    const response = await safeQueryDatabase(DATABASE_IDS.SERVICES, { filter, sorts });
    
    return {
      results: parseServices(response.results),
      next_cursor: response.next_cursor,
      has_more: response.has_more,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { results: [], next_cursor: null, has_more: false };
  }
});

// Get featured services
export const getFeaturedServices = cache(async () => {
  return getServices({
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "Active",
          },
        },
        {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });
});

// Get service by slug
export const getServiceBySlug = cache(async (slug: string) => {
  try {
    if (!DATABASE_IDS.SERVICES || !slug) {
      return null;
    }

    const result = await getDatabase(DATABASE_IDS.SERVICES);
    if (!result) return null;

    const filteredResults = result.filter((service: any) => 
      extractPlainText(service.properties.Slug?.rich_text) === slug
    );
    
    if (!filteredResults.length) {
      return null;
    }
    
    const service = parseServices(filteredResults)[0];
    const blocks = await getBlocks(filteredResults[0].id);
    service.content = blocks || [];
    
    return service;
  } catch (error) {
    console.error(`Error fetching service with slug ${slug}:`, error);
    return null;
  }
});

// Build-time safe functions (for static generation)
export const getBuildTimeBlogPosts = async () => {
  try {
    return await getBlogPosts();
  } catch (error) {
    console.warn('Failed to fetch blog posts during build, using fallback');
    return { results: [], next_cursor: null, has_more: false };
  }
};

export const getBuildTimeServices = async () => {
  try {
    return await getServices();
  } catch (error) {
    console.warn('Failed to fetch services during build, using fallback');
    return { results: [], next_cursor: null, has_more: false };
  }
};

// Team member functions (if needed)
export const getTeamMembers = cache(async ({
  pageSize = 100,
  startCursor = undefined,
  filter = {},
  sorts = [{ property: "Order", direction: "ascending" }]
}: {
  pageSize?: number;
  startCursor?: string;
  filter?: any;
  sorts?: any[];
} = {}) => {
  try {
    if (!DATABASE_IDS.TEAM_MEMBERS) {
      console.warn('Team members database ID not configured');
      return { results: [], next_cursor: null, has_more: false };
    }

    const response = await safeQueryDatabase(DATABASE_IDS.TEAM_MEMBERS, { filter, sorts });
    
    return {
      results: parseTeamMembers(response.results),
      next_cursor: response.next_cursor,
      has_more: response.has_more,
    };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { results: [], next_cursor: null, has_more: false };
  }
});

// Get featured team members
export const getFeaturedTeamMembers = cache(async () => {
  return getTeamMembers({
    filter: {
      property: "Featured",
      checkbox: {
        equals: true,
      },
    },
  });
});