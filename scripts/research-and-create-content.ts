#!/usr/bin/env node
/**
 * Research and Create 2025 Content
 * Uses Brave Search API and DeepSeek API to create comprehensive, current British English content
 */

import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS!,
};

// Topics relevant to ContainerCode Advisory's services
const researchTopics = [
  {
    slug: 'multi-cloud-security-2025',
    title: 'Multi-Cloud Security Strategies for UK Enterprises in 2025',
    category: 'Cybersecurity',
    searchQueries: [
      'multi-cloud security 2025 UK enterprise',
      'cloud security best practices 2025',
      'UK data protection multi-cloud compliance'
    ]
  },
  {
    slug: 'devops-automation-2025',
    title: 'Advanced DevOps Automation: Transforming UK Software Delivery in 2025',
    category: 'DevOps',
    searchQueries: [
      'DevOps automation 2025 trends UK',
      'CI/CD pipeline security 2025',
      'kubernetes enterprise adoption UK'
    ]
  },
  {
    slug: 'digital-transformation-ai-2025',
    title: 'AI-Powered Digital Transformation: A Comprehensive Guide for UK Businesses',
    category: 'Digital Transformation',
    searchQueries: [
      'AI digital transformation UK 2025',
      'enterprise AI implementation strategies',
      'UK AI governance compliance 2025'
    ]
  },
  {
    slug: 'cloud-cost-optimisation-2025',
    title: 'Strategic Cloud Cost Optimisation: Advanced Techniques for 2025',
    category: 'Cloud Strategy',
    searchQueries: [
      'cloud cost optimisation 2025 strategies',
      'multi-cloud cost management UK',
      'enterprise cloud financial operations'
    ]
  },
  {
    slug: 'zero-trust-implementation-2025',
    title: 'Zero Trust Security Implementation: Enterprise Guide for 2025',
    category: 'Cybersecurity',
    searchQueries: [
      'zero trust security implementation 2025',
      'UK cybersecurity framework 2025',
      'enterprise identity management 2025'
    ]
  }
];

// Function to search for latest information using Brave Search API
async function researchTopic(queries: string[]): Promise<string> {
  const braveApiKey = process.env.BRAVE_API_KEY;
  if (!braveApiKey) {
    console.log('⚠️  Brave API key not available');
    return '';
  }

  let researchData = '';

  try {
    for (const query of queries) {
      console.log(`   🔍 Searching: ${query}`);
      
      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`, {
        headers: {
          'X-Subscription-Token': braveApiKey,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const results = data.web?.results || [];
        
        for (const result of results.slice(0, 3)) {
          researchData += `${result.title}: ${result.description} `;
        }
      }
      
      // Add delay between searches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.log(`   ⚠️  Search error:`, error);
  }

  return researchData;
}

// Function to generate content using DeepSeek API
async function generateContentWithDeepSeek(topic: any, researchData: string): Promise<any> {
  const deepSeekApiKey = process.env.DEEPSEEK_API_KEY;
  if (!deepSeekApiKey) {
    console.log('⚠️  DeepSeek API key not available');
    return null;
  }

  try {
    console.log(`   🤖 Generating content with DeepSeek`);

    const prompt = `You are a senior technology consultant writing for ContainerCode Advisory, a UK-based enterprise technology consultancy. 

Write a comprehensive, professional blog article in British English about: "${topic.title}"

Research context: ${researchData}

Requirements:
- Write in professional British English (use British spelling, terminology, and expressions)
- Target enterprise decision-makers and technical leaders
- Include current 2025 trends and developments
- Focus on UK/European market context and regulations
- Provide actionable insights and practical guidance
- Include specific statistics and data where relevant
- Structure with clear headings and subheadings
- Write approximately 2000-2500 words
- Include an engaging introduction and conclusion
- Reference UK compliance requirements (GDPR, Data Protection Act, etc.)

Structure the article with:
1. Executive Summary
2. Current Industry Landscape
3. Key Challenges and Opportunities
4. Best Practice Implementation
5. UK Regulatory Considerations
6. ROI and Business Value
7. Implementation Roadmap
8. Conclusion and Next Steps

Write the content in a format that can be easily converted to Notion blocks.`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepSeekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 8000,
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (content) {
        return parseContentToBlocks(content, topic);
      }
    } else {
      console.log(`   ❌ DeepSeek API error: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ DeepSeek generation error:`, error);
  }

  return null;
}

// Function to parse generated content into Notion blocks
function parseContentToBlocks(content: string, topic: any): any {
  const lines = content.split('\n').filter(line => line.trim());
  const blocks = [];
  
  // Add title block
  blocks.push({
    type: 'heading_1',
    heading_1: {
      rich_text: [{ type: 'text', text: { content: topic.title }}]
    }
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Handle headings
    if (line.startsWith('# ')) {
      blocks.push({
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) }}]
        }
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: line.substring(3) }}]
        }
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: line.substring(4) }}]
        }
      });
    } else if (line.startsWith('- ')) {
      // Bullet list item
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.substring(2) }}]
        }
      });
    } else if (line.match(/^\d+\. /)) {
      // Numbered list item
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: line.replace(/^\d+\. /, '') }}]
        }
      });
    } else if (line.length > 20) {
      // Regular paragraph
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line }}]
        }
      });
    }
  }

  // Generate excerpt from first paragraph
  const firstParagraph = blocks.find(block => block.type === 'paragraph');
  const excerpt = firstParagraph?.paragraph?.rich_text?.[0]?.text?.content
    ? firstParagraph.paragraph.rich_text[0].text.content.substring(0, 200) + '...'
    : `Comprehensive guide to ${topic.title.toLowerCase()} for UK enterprises.`;

  return {
    title: topic.title,
    slug: topic.slug,
    category: topic.category,
    excerpt: excerpt,
    tags: [topic.category.toLowerCase().replace(' ', '-'), '2025-trends', 'uk-enterprise', 'best-practices'],
    blocks: blocks
  };
}

// Function to create or update blog post
async function createOrUpdateBlogPost(content: any): Promise<boolean> {
  try {
    console.log(`📝 Creating/updating: ${content.title}`);
    
    // Check if post exists
    const existingResponse = await notion.databases.query({
      database_id: DATABASE_IDS.BLOG_POSTS,
      filter: {
        property: 'Slug',
        rich_text: {
          equals: content.slug
        }
      }
    });

    let pageId;
    
    if (existingResponse.results.length > 0) {
      pageId = existingResponse.results[0].id;
      console.log(`   ♻️  Updating existing post`);
    } else {
      console.log(`   ✨ Creating new post`);
      
      const newPage = await notion.pages.create({
        parent: { database_id: DATABASE_IDS.BLOG_POSTS },
        properties: {
          Title: {
            title: [{ text: { content: content.title } }]
          },
          Slug: {
            rich_text: [{ text: { content: content.slug } }]
          },
          Category: {
            select: { name: content.category }
          },
          Excerpt: {
            rich_text: [{ text: { content: content.excerpt } }]
          },
          Tags: {
            multi_select: content.tags.map((tag: string) => ({ name: tag }))
          },
          Status: {
            select: { name: 'Published' }
          },
          PublishedDate: {
            date: { start: new Date().toISOString().split('T')[0] }
          },
          Author: {
            people: []
          }
        }
      });
      
      pageId = newPage.id;
    }

    // Clear existing blocks
    const existingBlocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    for (const block of existingBlocks.results) {
      try {
        await notion.blocks.delete({
          block_id: (block as any).id,
        });
      } catch (error) {
        // Some blocks might not be deletable
      }
    }

    // Add new content blocks in chunks
    const chunks = [];
    for (let i = 0; i < content.blocks.length; i += 100) {
      chunks.push(content.blocks.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: chunk,
      });
    }

    console.log(`   ✅ Successfully processed: ${content.title}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error processing ${content.title}:`, error);
    return false;
  }
}

// Main function
async function researchAndCreateContent() {
  console.log('🚀 Starting comprehensive content research and creation...\n');

  let successCount = 0;
  
  for (const topic of researchTopics) {
    console.log(`\n📖 Processing: ${topic.title}`);
    
    // Research the topic
    const researchData = await researchTopic(topic.searchQueries);
    
    // Generate content with DeepSeek
    const content = await generateContentWithDeepSeek(topic, researchData);
    
    if (content) {
      // Create/update the blog post
      const success = await createOrUpdateBlogPost(content);
      if (success) {
        successCount++;
      }
    }
    
    // Add delay between topics
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n🎉 Content research and creation completed!`);
  console.log(`📊 Successfully processed ${successCount}/${researchTopics.length} articles`);
  console.log(`\n💡 All content written in British English with current 2025 data`);
  console.log(`🔗 Content integrated into Notion and ready for website display`);
}

researchAndCreateContent().catch(console.error);