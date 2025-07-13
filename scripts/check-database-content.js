// This script checks for existing content in the databases
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function checkDatabaseContent(databaseId, databaseName) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
    });
    
    console.log(`${databaseName}: Found ${response.results.length} items`);
    
    if (response.results.length > 0) {
      // Show some details about the first few items
      const itemsToShow = Math.min(3, response.results.length);
      for (let i = 0; i < itemsToShow; i++) {
        const item = response.results[i];
        let title = '';
        
        // Get title based on database type
        if (databaseName === 'Blog Posts' || databaseName === 'Case Studies') {
          title = item.properties.Title?.title[0]?.plain_text || 'Untitled';
        } else if (databaseName === 'Team Members') {
          title = item.properties.Name?.title[0]?.plain_text || 'Unnamed';
        } else if (databaseName === 'Services') {
          title = item.properties['Service Name']?.title[0]?.plain_text || 'Untitled Service';
        }
        
        console.log(`  - ${title}`);
      }
      
      if (response.results.length > itemsToShow) {
        console.log(`  - ... and ${response.results.length - itemsToShow} more`);
      }
    }
    
    return response.results.length;
  } catch (error) {
    console.error(`Error checking ${databaseName} content:`, error.body || error);
    return 0;
  }
}

async function main() {
  console.log("Checking existing content in Notion databases...");
  
  const blogPostsCount = await checkDatabaseContent(
    process.env.NOTION_DATABASE_BLOG_POSTS,
    'Blog Posts'
  );
  
  const caseStudiesCount = await checkDatabaseContent(
    process.env.NOTION_DATABASE_CASE_STUDIES,
    'Case Studies'
  );
  
  const teamMembersCount = await checkDatabaseContent(
    process.env.NOTION_DATABASE_TEAM_MEMBERS,
    'Team Members'
  );
  
  const servicesCount = await checkDatabaseContent(
    process.env.NOTION_DATABASE_SERVICES,
    'Services'
  );
  
  console.log("\nSummary of content:");
  console.log(`- Blog Posts: ${blogPostsCount} items`);
  console.log(`- Case Studies: ${caseStudiesCount} items`);
  console.log(`- Team Members: ${teamMembersCount} items`);
  console.log(`- Services: ${servicesCount} items`);
  
  // Return information about which databases need content
  return {
    needsBlogPosts: blogPostsCount === 0,
    needsCaseStudies: caseStudiesCount === 0,
    needsTeamMembers: teamMembersCount === 0,
    needsServices: servicesCount === 0,
  };
}

main();
