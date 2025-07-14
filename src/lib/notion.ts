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
    });
    
    return result;
  }) as T;
}

// Initialize official Notion client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Initialize unofficial client for better content parsing
export const notionAPI = new NotionAPI();

// Cache-optimized database query function
export const getDatabase = cache(async (databaseId: string) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      console.warn('NOTION_TOKEN not found, returning empty results');
      return [];
    }
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.warn(`Failed to query Notion database ${databaseId}:`, error);
    return [];
  }
});

// Cache-optimized page query function
export const getPage = cache(async (pageId: string) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      console.warn('NOTION_TOKEN not found, returning null');
      return null;
    }
    
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.warn(`Failed to retrieve Notion page ${pageId}:`, error);
    return null;
  }
});

// Cache-optimized block query function
export const getBlocks = cache(async (blockId: string) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      console.warn('NOTION_TOKEN not found, returning empty blocks');
      return [];
    }
    
    const blocks = [];
    let cursor;
    
    while (true) {
      const { results, next_cursor } = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });
      blocks.push(...results);
      if (!next_cursor) break;
      cursor = next_cursor;
    }
    
    return blocks;
  } catch (error) {
    console.warn(`Failed to retrieve Notion blocks for ${blockId}:`, error);
    return [];
  }
});

// Constants for database IDs
export const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS || '',
  TEAM_MEMBERS: process.env.NOTION_DATABASE_TEAM_MEMBERS || '',
  SERVICES: process.env.NOTION_DATABASE_SERVICES || '',
};

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

// Helper function to parse blog posts from Notion database results
export const parseBlogPosts = (posts: any[]): BlogPost[] => {
  return posts.map((post) => {
    const properties = post.properties;
    
    return {
      id: post.id,
      title: properties.Title?.title[0]?.plain_text || 'Untitled',
      slug: properties.Slug?.rich_text[0]?.plain_text || post.id,
      publishedDate: properties.PublishedDate?.date?.start || '',
      lastEditedTime: post.last_edited_time,
      author: {
        name: properties.Author?.people[0]?.name || 'Anonymous',
        avatar: properties.Author?.people[0]?.avatar_url || '',
      },
      category: properties.Category?.select?.name || '',
      tags: properties.Tags?.multi_select.map((tag: any) => tag.name) || [],
      excerpt: properties.Excerpt?.rich_text[0]?.plain_text || '',
      coverImage: properties.CoverImage?.files[0]?.file?.url || properties.CoverImage?.files[0]?.external?.url || '',
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
      name: properties.Name?.title[0]?.plain_text || 'Unnamed',
      position: properties.Position?.rich_text[0]?.plain_text || '',
      department: properties.Department?.select?.name || '',
      bio: [], // To be populated with getBlocks
      photo: properties.Photo?.files[0]?.file?.url || properties.Photo?.files[0]?.external?.url || '',
      expertise: properties.Expertise?.multi_select.map((item: any) => item.name) || [],
      certifications: properties.Certifications?.multi_select.map((item: any) => item.name) || [],
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
      title: properties["Service Name"]?.title[0]?.plain_text || 'Untitled',
      slug: properties.Slug?.rich_text[0]?.plain_text || service.id,
      category: properties.Category?.select?.name || '',
      shortDescription: properties.ShortDescription?.rich_text[0]?.plain_text || '',
      icon: properties.Icon?.files[0]?.file?.url || properties.Icon?.files[0]?.external?.url || '',
      featuredImage: properties.FeaturedImage?.files[0]?.file?.url || properties.FeaturedImage?.files[0]?.external?.url || '',
      status: properties.Status?.select?.name || 'Inactive',
      featured: properties.Featured?.checkbox || false,
      order: properties.Order?.number || 0,
      content: [], // To be populated with getBlocks
    };
  });
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
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.BLOG_POSTS,
      page_size: pageSize,
      start_cursor: startCursor,
      filter,
      sorts,
    });
    
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
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.BLOG_POSTS,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });
    
    if (!response.results.length) {
      return null;
    }
    
    const post = parseBlogPosts(response.results)[0];
    post.content = await getBlocks(response.results[0].id);
    
    return post;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
});

// Get team members with filtering and pagination
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
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.TEAM_MEMBERS,
      page_size: pageSize,
      start_cursor: startCursor,
      filter,
      sorts,
    });
    
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
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.SERVICES,
      page_size: pageSize,
      start_cursor: startCursor,
      filter,
      sorts,
    });
    
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
    const response = await notion.databases.query({
      database_id: DATABASE_IDS.SERVICES,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });
    
    if (!response.results.length) {
      return null;
    }
    
    const service = parseServices(response.results)[0];
    service.content = await getBlocks(response.results[0].id);
    
    return service;
  } catch (error) {
    console.error(`Error fetching service with slug ${slug}:`, error);
    return null;
  }
});
