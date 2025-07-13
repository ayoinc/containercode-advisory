#!/usr/bin/env node
/**
 * Quick Database Schema Checker
 * Check the actual property names in our Notion databases
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const databases = {
    'Generated Articles': process.env.NOTION_DATABASE_GENERATED_ARTICLES,
    'Newsletters': process.env.NOTION_DATABASE_NEWSLETTERS,
    'Trending Topics': process.env.NOTION_DATABASE_TRENDING_TOPICS
};

async function checkSchemas() {
    console.log('🔍 Checking Database Schemas...\n');
    
    for (const [name, id] of Object.entries(databases)) {
        try {
            console.log(`📊 ${name}:`);
            const db = await notion.databases.retrieve({ database_id: id });
            
            console.log('  Properties:');
            Object.entries(db.properties).forEach(([propName, prop]) => {
                console.log(`    - ${propName}: ${prop.type}`);
            });
            console.log('');
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}\n`);
        }
    }
}

checkSchemas().catch(console.error);
