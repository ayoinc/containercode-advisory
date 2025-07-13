// This script checks for existing databases in the parent page
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function checkExistingDatabases(parentPageId) {
  try {
    // Get the blocks in the parent page
    const response = await notion.blocks.children.list({
      block_id: parentPageId,
    });
    
    console.log(`Found ${response.results.length} blocks in the parent page.`);
    
    // Look for child database blocks
    const databaseBlocks = response.results.filter(block => 
      block.type === 'child_database'
    );
    
    console.log(`Found ${databaseBlocks.length} databases in the parent page:`);
    
    for (const block of databaseBlocks) {
      console.log(`- ${block.child_database.title} (ID: ${block.id})`);
      
      // Get database details
      try {
        const database = await notion.databases.retrieve({
          database_id: block.id,
        });
        
        console.log(`  Database name: ${database.title[0]?.plain_text || 'Untitled'}`);
        console.log(`  Properties: ${Object.keys(database.properties).join(', ')}`);
      } catch (error) {
        console.log(`  Error retrieving database details: ${error.message}`);
      }
    }
    
    return databaseBlocks;
  } catch (error) {
    console.error('Error checking for existing databases:', error.body || error);
    return [];
  }
}

// Parent page ID from the search
const parentPageId = '22ef9e48-4512-80a7-b10d-c3dc36bd9a20';
checkExistingDatabases(parentPageId);
