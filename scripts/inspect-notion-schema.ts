#!/usr/bin/env node
/**
 * Inspect Notion Database Schema
 * This script inspects the actual schema of the Notion databases to understand available properties
 */

import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS!,
  SERVICES: process.env.NOTION_DATABASE_SERVICES!,
  NEWSLETTERS: process.env.NOTION_DATABASE_NEWSLETTERS!,
  WEBSITE_PAGES: process.env.NOTION_DATABASE_WEBSITE_PAGES!,
};

async function inspectDatabase(name: string, databaseId: string) {
  try {
    console.log(`\n🔍 Inspecting ${name} database (${databaseId}):`);
    
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    console.log('📋 Available properties:');
    Object.entries(database.properties).forEach(([key, property]) => {
      console.log(`  - ${key}: ${property.type}`);
    });
    
  } catch (error) {
    console.error(`❌ Error inspecting ${name} database:`, error);
  }
}

async function main() {
  console.log('🚀 Starting Notion database schema inspection...\n');
  
  for (const [name, id] of Object.entries(DATABASE_IDS)) {
    await inspectDatabase(name, id);
  }
  
  console.log('\n✅ Schema inspection completed!');
}

main().catch(console.error);