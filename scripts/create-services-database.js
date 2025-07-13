// This script creates the Services database in your parent page
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

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

// Parent page ID
const parentPageId = '22ef9e48-4512-80a7-b10d-c3dc36bd9a20';
createServicesDatabase(parentPageId);
