#!/usr/bin/env node
/**
 * Inspect Current Notion Content Structure
 * This script inspects the current content in Notion databases to understand structure
 */

import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS!,
  WEBSITE_PAGES: process.env.NOTION_DATABASE_WEBSITE_PAGES!,
};

async function inspectContent() {
  console.log('🔍 Inspecting current Notion content structure...\n');

  try {
    // Get blog posts
    console.log('📝 BLOG POSTS:');
    const blogResponse = await notion.databases.query({
      database_id: DATABASE_IDS.BLOG_POSTS,
      page_size: 10,
    });

    for (const post of blogResponse.results) {
      if ('properties' in post) {
        const title = (post.properties.Title as any)?.title?.[0]?.plain_text || 'Untitled';
        console.log(`\n• ${title}`);
        console.log(`  ID: ${post.id}`);
        
        // Get blocks for this page
        try {
          const blocks = await notion.blocks.children.list({
            block_id: post.id,
            page_size: 20,
          });
          
          console.log(`  Blocks: ${blocks.results.length}`);
          blocks.results.forEach((block, index) => {
            if ('type' in block) {
              console.log(`    ${index + 1}. ${block.type}`);
              if (block.type === 'heading_2' && 'heading_2' in block) {
                const heading = block.heading_2.rich_text[0]?.plain_text || '';
                console.log(`       "${heading}"`);
              } else if (block.type === 'paragraph' && 'paragraph' in block) {
                const text = block.paragraph.rich_text[0]?.plain_text?.substring(0, 100) || '';
                console.log(`       "${text}${text.length >= 100 ? '...' : ''}"`);
              }
            }
          });
        } catch (error) {
          console.log(`    Error fetching blocks: ${error}`);
        }
      }
    }

    // Get website pages
    console.log('\n\n📄 WEBSITE PAGES:');
    const pagesResponse = await notion.databases.query({
      database_id: DATABASE_IDS.WEBSITE_PAGES,
      page_size: 10,
    });

    for (const page of pagesResponse.results) {
      if ('properties' in page) {
        const title = (page.properties.Title as any)?.title?.[0]?.plain_text || 'Untitled';
        console.log(`\n• ${title}`);
        console.log(`  ID: ${page.id}`);
        
        // Get blocks for this page
        try {
          const blocks = await notion.blocks.children.list({
            block_id: page.id,
            page_size: 20,
          });
          
          console.log(`  Blocks: ${blocks.results.length}`);
          blocks.results.forEach((block, index) => {
            if ('type' in block) {
              console.log(`    ${index + 1}. ${block.type}`);
            }
          });
        } catch (error) {
          console.log(`    Error fetching blocks: ${error}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error inspecting content:', error);
  }
}

inspectContent().catch(console.error);