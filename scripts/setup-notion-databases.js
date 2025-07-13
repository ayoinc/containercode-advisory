// This script creates all necessary Notion databases for the ContainerCode website
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function createBlogPostsDatabase(parentPageId) {
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
            content: "Blog Posts",
          },
        },
      ],
      properties: {
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
    });
    
    console.log("✅ Created Blog Posts database with ID:", response.id);
    return response.id;
  } catch (error) {
    console.error("❌ Error creating Blog Posts database:", error.body || error);
    return null;
  }
}

async function createCaseStudiesDatabase(parentPageId) {
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
            content: "Case Studies",
          },
        },
      ],
      properties: {
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
    });
    
    console.log("✅ Created Case Studies database with ID:", response.id);
    return response.id;
  } catch (error) {
    console.error("❌ Error creating Case Studies database:", error.body || error);
    return null;
  }
}

async function createTeamMembersDatabase(parentPageId) {
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
            content: "Team Members",
          },
        },
      ],
      properties: {
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
    });
    
    console.log("✅ Created Team Members database with ID:", response.id);
    return response.id;
  } catch (error) {
    console.error("❌ Error creating Team Members database:", error.body || error);
    return null;
  }
}

async function createServicesDatabase(parentPageId) {
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
            content: "Services",
          },
        },
      ],
      properties: {
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
    });
    
    console.log("✅ Created Services database with ID:", response.id);
    return response.id;
  } catch (error) {
    console.error("❌ Error creating Services database:", error.body || error);
    return null;
  }
}

async function main() {
  // Parent page ID is required
  if (!process.argv[2]) {
    console.error("❌ Please provide a parent page ID as a command line argument");
    console.log("Usage: node setup-notion-databases.js <parent_page_id>");
    return;
  }
  
  const parentPageId = process.argv[2];
  
  console.log("Creating databases in Notion...");
  
  // Create all databases
  const blogPostsId = await createBlogPostsDatabase(parentPageId);
  const caseStudiesId = await createCaseStudiesDatabase(parentPageId);
  const teamMembersId = await createTeamMembersDatabase(parentPageId);
  const servicesId = await createServicesDatabase(parentPageId);
  
  // Output environment variables
  if (blogPostsId && caseStudiesId && teamMembersId && servicesId) {
    console.log("\n=== Add these values to your .env.local file ===");
    console.log(`NOTION_DATABASE_BLOG_POSTS=${blogPostsId}`);
    console.log(`NOTION_DATABASE_CASE_STUDIES=${caseStudiesId}`);
    console.log(`NOTION_DATABASE_TEAM_MEMBERS=${teamMembersId}`);
    console.log(`NOTION_DATABASE_SERVICES=${servicesId}`);
    
    // Return values for easy copying
    return {
      NOTION_DATABASE_BLOG_POSTS: blogPostsId,
      NOTION_DATABASE_CASE_STUDIES: caseStudiesId,
      NOTION_DATABASE_TEAM_MEMBERS: teamMembersId,
      NOTION_DATABASE_SERVICES: servicesId
    };
  } else {
    console.error("❌ Some databases could not be created. Please check the errors above.");
  }
}

main();
