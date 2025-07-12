import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import { cache } from 'react';

// Initialize official Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Initialize unofficial client for better content parsing
export const notionAPI = new NotionAPI();

// Cache-optimized database query function
export const getDatabase = cache(async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
});

// Cache-optimized page query function
export const getPage = cache(async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
});

// Cache-optimized block query function
export const getBlocks = cache(async (blockId: string) => {
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
});

// Constants for database IDs
export const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS || '',
  CASE_STUDIES: process.env.NOTION_DATABASE_CASE_STUDIES || '',
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
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  services: string[];
  challenge: any[];
  solution: any[];
  results: any[];
  testimonial: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  coverImage: string;
  gallery: string[];
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
    };
  });
};

// Helper function to parse case studies from Notion database results
export const parseCaseStudies = (caseStudies: any[]): CaseStudy[] => {
  return caseStudies.map((caseStudy) => {
    const properties = caseStudy.properties;
    
    return {
      id: caseStudy.id,
      title: properties.Title?.title[0]?.plain_text || 'Untitled',
      slug: properties.Slug?.rich_text[0]?.plain_text || caseStudy.id,
      client: properties.Client?.rich_text[0]?.plain_text || '',
      industry: properties.Industry?.select?.name || '',
      services: properties.Services?.multi_select.map((service: any) => service.name) || [],
      challenge: [], // To be populated with getBlocks
      solution: [], // To be populated with getBlocks
      results: [], // To be populated with getBlocks
      testimonial: {
        quote: properties.TestimonialQuote?.rich_text[0]?.plain_text || '',
        author: properties.TestimonialAuthor?.rich_text[0]?.plain_text || '',
        position: properties.TestimonialPosition?.rich_text[0]?.plain_text || '',
        company: properties.TestimonialCompany?.rich_text[0]?.plain_text || '',
      },
      coverImage: properties.CoverImage?.files[0]?.file?.url || properties.CoverImage?.files[0]?.external?.url || '',
      gallery: properties.Gallery?.files.map((file: any) => file.file?.url || file.external?.url) || [],
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
