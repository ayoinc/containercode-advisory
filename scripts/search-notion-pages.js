// This script searches for pages in Notion
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function searchPages() {
  try {
    // Search for pages
    const response = await notion.search({
      query: 'ContainerCode',
      filter: {
        value: 'page',
        property: 'object'
      }
    });
    
    console.log(`Found ${response.results.length} pages:`);
    
    for (let i = 0; i < response.results.length; i++) {
      const page = response.results[i];
      
      // Try to get title in different ways
      let title = 'Untitled';
      if (page.properties && page.properties.title && page.properties.title.title) {
        title = page.properties.title.title[0]?.plain_text || 'Untitled';
      } else if (page.properties && page.properties.Name && page.properties.Name.title) {
        title = page.properties.Name.title[0]?.plain_text || 'Untitled';
      } else if (page.parent && page.parent.type === 'page_id') {
        title = `Page under parent ${page.parent.page_id}`;
      } else if (page.parent && page.parent.type === 'database_id') {
        title = `Page in database ${page.parent.database_id}`;
      } else if (page.parent && page.parent.type === 'workspace') {
        title = `Page in workspace`;
      }
      
      console.log(`${i + 1}. ${title} (ID: ${page.id})`);
    }
    
    return response.results;
  } catch (error) {
    console.error('Error searching for pages:', error.body || error);
    return [];
  }
}

searchPages();
