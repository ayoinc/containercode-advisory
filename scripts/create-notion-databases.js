// This script helps create Notion databases for the ContainerCode website
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function createDatabase(parentPageId, title, properties) {
  try {
    const response = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: parentPageId,
      },
      title: [
        {
          type: "text",
          text: {
            content: title,
          },
        },
      ],
      properties: properties,
    });
    
    console.log(`✅ Created "${title}" database with ID: ${response.id}`);
    return response.id;
  } catch (error) {
    console.error(`❌ Error creating "${title}" database:`, error);
    return null;
  }
}

async function main() {
  // Replace with your Notion parent page ID where databases will be created
  const PARENT_PAGE_ID = "YOUR_PARENT_PAGE_ID"; // TODO: Replace with your page ID
  
  // Blog Posts Database
  const blogPostsId = await createDatabase(
    PARENT_PAGE_ID,
    "Blog Posts",
    {
      "Title": {
        title: {}
      },
      "Slug": {
        rich_text: {}
      },
      "Status": {
        select: {
          options: [
            { name: "Draft", color: "gray" },
            { name: "Published", color: "green" },
            { name: "Archived", color: "red" }
          ]
        }
      },
      "Author": {
        people: {}
      },
      "PublishedDate": {
        date: {}
      },
      "Category": {
        select: {
          options: [
            { name: "Multi-Cloud", color: "blue" },
            { name: "Security", color: "red" },
            { name: "DevOps", color: "purple" },
            { name: "Digital Transformation", color: "orange" },
            { name: "Software Engineering", color: "green" }
          ]
        }
      },
      "Tags": {
        multi_select: {
          options: [
            { name: "Azure", color: "blue" },
            { name: "AWS", color: "orange" },
            { name: "Google Cloud", color: "green" },
            { name: "Security", color: "red" },
            { name: "DevSecOps", color: "purple" },
            { name: "Compliance", color: "yellow" },
            { name: "Tutorial", color: "pink" },
            { name: "Best Practices", color: "gray" }
          ]
        }
      },
      "Excerpt": {
        rich_text: {}
      },
      "CoverImage": {
        files: {}
      },
      "Featured": {
        checkbox: {}
      },
      "SEOTitle": {
        rich_text: {}
      },
      "SEODescription": {
        rich_text: {}
      }
    }
  );
  
  // Case Studies Database
  const caseStudiesId = await createDatabase(
    PARENT_PAGE_ID,
    "Case Studies",
    {
      "Title": {
        title: {}
      },
      "Slug": {
        rich_text: {}
      },
      "Client": {
        rich_text: {}
      },
      "Industry": {
        select: {
          options: [
            { name: "Healthcare", color: "blue" },
            { name: "Financial Services", color: "green" },
            { name: "Manufacturing", color: "yellow" },
            { name: "Retail", color: "orange" },
            { name: "Technology", color: "purple" },
            { name: "Government", color: "gray" },
            { name: "Education", color: "pink" }
          ]
        }
      },
      "Services": {
        multi_select: {
          options: [
            { name: "Multi-Cloud Strategy", color: "blue" },
            { name: "Azure Migration", color: "blue" },
            { name: "AWS Optimization", color: "orange" },
            { name: "Google Cloud Implementation", color: "green" },
            { name: "Security Architecture", color: "red" },
            { name: "DevSecOps", color: "purple" },
            { name: "Digital Transformation", color: "yellow" }
          ]
        }
      },
      "CoverImage": {
        files: {}
      },
      "Gallery": {
        files: {}
      },
      "Status": {
        select: {
          options: [
            { name: "Draft", color: "gray" },
            { name: "Published", color: "green" },
            { name: "Featured", color: "blue" }
          ]
        }
      },
      "TestimonialQuote": {
        rich_text: {}
      },
      "TestimonialAuthor": {
        rich_text: {}
      },
      "TestimonialPosition": {
        rich_text: {}
      },
      "TestimonialCompany": {
        rich_text: {}
      }
    }
  );
  
  // Team Members Database
  const teamMembersId = await createDatabase(
    PARENT_PAGE_ID,
    "Team Members",
    {
      "Name": {
        title: {}
      },
      "Position": {
        rich_text: {}
      },
      "Department": {
        select: {
          options: [
            { name: "Leadership", color: "blue" },
            { name: "Cloud Services", color: "green" },
            { name: "Security", color: "red" },
            { name: "DevOps", color: "purple" },
            { name: "Digital Transformation", color: "orange" },
            { name: "Software Engineering", color: "yellow" }
          ]
        }
      },
      "Photo": {
        files: {}
      },
      "Expertise": {
        multi_select: {
          options: [
            { name: "Azure", color: "blue" },
            { name: "AWS", color: "orange" },
            { name: "Google Cloud", color: "green" },
            { name: "Security", color: "red" },
            { name: "DevOps", color: "purple" },
            { name: "Software Architecture", color: "yellow" },
            { name: "Digital Strategy", color: "pink" }
          ]
        }
      },
      "Certifications": {
        multi_select: {}
      },
      "LinkedIn": {
        url: {}
      },
      "Email": {
        email: {}
      },
      "Featured": {
        checkbox: {}
      },
      "Order": {
        number: {}
      }
    }
  );
  
  // Services Database
  const servicesId = await createDatabase(
    PARENT_PAGE_ID,
    "Services",
    {
      "Service Name": {
        title: {}
      },
      "Slug": {
        rich_text: {}
      },
      "Category": {
        select: {
          options: [
            { name: "Cloud", color: "blue" },
            { name: "Cybersecurity", color: "red" },
            { name: "DevOps", color: "purple" },
            { name: "Digital Transformation", color: "orange" },
            { name: "Software Engineering", color: "green" },
            { name: "IT Support", color: "gray" }
          ]
        }
      },
      "ShortDescription": {
        rich_text: {}
      },
      "Icon": {
        files: {}
      },
      "FeaturedImage": {
        files: {}
      },
      "Status": {
        select: {
          options: [
            { name: "Active", color: "green" },
            { name: "Coming Soon", color: "yellow" },
            { name: "Inactive", color: "gray" }
          ]
        }
      },
      "Featured": {
        checkbox: {}
      },
      "Order": {
        number: {}
      }
    }
  );
  
  // Output the database IDs to add to .env.local
  console.log("\n=== Add these IDs to your .env.local file ===");
  console.log(`NOTION_DATABASE_BLOG_POSTS=${blogPostsId}`);
  console.log(`NOTION_DATABASE_CASE_STUDIES=${caseStudiesId}`);
  console.log(`NOTION_DATABASE_TEAM_MEMBERS=${teamMembersId}`);
  console.log(`NOTION_DATABASE_SERVICES=${servicesId}`);
}

main().catch(console.error);
