#!/usr/bin/env node

/**
 * Enhanced Content Automation with ContainerCode Advisory Strategy
 * Integrates business-specific keywords and topics for targeted content generation
 */

require('dotenv').config();
const { Client } = require('@notionhq/client');

// ===================================================================
// CONTAINERCODE ADVISORY CONTENT STRATEGY
// ===================================================================

const CONTENT_STRATEGY = {
  // Core Business Keywords
  coreKeywords: {
    primary: [
      "multi-cloud consulting",
      "cloud migration strategy", 
      "cybersecurity consulting",
      "DevOps implementation",
      "digital transformation consulting",
      "cloud security architecture",
      "enterprise cloud solutions"
    ],
    cloudPlatforms: [
      "AWS consulting services",
      "Microsoft Azure consulting", 
      "Google Cloud Platform consulting",
      "Oracle Cloud consulting",
      "IBM Cloud solutions",
      "multi-cloud architecture",
      "hybrid cloud strategy"
    ],
    security: [
      "cloud security assessment",
      "SOC 2 compliance consulting",
      "GDPR compliance automation",
      "zero trust architecture",
      "cybersecurity framework implementation",
      "ISO 27001 certification",
      "security incident response"
    ],
    devops: [
      "DevSecOps implementation",
      "CI/CD pipeline automation",
      "Kubernetes consulting",
      "infrastructure as code",
      "container orchestration",
      "microservices architecture",
      "automated deployment strategies"
    ]
  },

  // Trending Topics for 2025
  trendingTopics: [
    "AI automation trends 2025",
    "cloud security trends 2025", 
    "multi-cloud management 2025",
    "DevOps best practices 2025",
    "cybersecurity predictions 2025",
    "enterprise AI adoption",
    "sustainable cloud computing",
    "edge computing strategies"
  ],

  // Industry-Specific Topics
  industryTopics: [
    "healthcare cloud compliance",
    "financial services cybersecurity",
    "retail digital transformation",
    "manufacturing IoT security",
    "education technology modernization",
    "government cloud migration",
    "startup cloud strategy",
    "enterprise cloud governance"
  ],

  // Content Types
  contentTypes: [
    "implementation guide",
    "best practices analysis",
    "case study review",
    "expert insights",
    "technology comparison",
    "security framework analysis",
    "cost optimization strategy",
    "industry trend analysis"
  ]
};

// ===================================================================
// API CLIENTS INITIALIZATION
// ===================================================================

console.log('🚀 Initializing ContainerCode Advisory Content Automation...');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

// Database IDs
const databases = {
  trendingTopics: process.env.NOTION_TRENDING_TOPICS_DB_ID,
  generatedArticles: process.env.NOTION_GENERATED_ARTICLES_DB_ID,
  newsletters: process.env.NOTION_NEWSLETTERS_DB_ID,
  subscribers: process.env.NOTION_SUBSCRIBERS_DB_ID
};

// ===================================================================
// ENHANCED SEARCH QUERY GENERATION
// ===================================================================

function generateBusinessFocusedQuery() {
  const categories = Object.keys(CONTENT_STRATEGY.coreKeywords);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const keywords = CONTENT_STRATEGY.coreKeywords[randomCategory];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  const searchPrefixes = [
    "latest developments in",
    "best practices for",
    "2025 trends in",
    "expert guide to",
    "business benefits of",
    "implementation strategies for",
    "ROI analysis of",
    "security considerations for"
  ];
  
  const randomPrefix = searchPrefixes[Math.floor(Math.random() * searchPrefixes.length)];
  return `${randomPrefix} ${randomKeyword} 2025`;
}

function generateTrendingQuery() {
  const trending = CONTENT_STRATEGY.trendingTopics;
  const randomTrending = trending[Math.floor(Math.random() * trending.length)];
  
  const trendPrefixes = [
    "latest news about",
    "recent developments in",
    "industry updates on",
    "expert predictions for",
    "market analysis of",
    "implementation challenges in"
  ];
  
  const randomPrefix = trendPrefixes[Math.floor(Math.random() * trendPrefixes.length)];
  return `${randomPrefix} ${randomTrending}`;
}

function generateIndustryQuery() {
  const industries = CONTENT_STRATEGY.industryTopics;
  const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
  
  const industryPrefixes = [
    "case studies in",
    "implementation examples for",
    "success stories about",
    "challenges and solutions in",
    "best practices for",
    "regulatory requirements for"
  ];
  
  const randomPrefix = industryPrefixes[Math.floor(Math.random() * industryPrefixes.length)];
  return `${randomPrefix} ${randomIndustry}`;
}

// ===================================================================
// ENHANCED CONTENT GENERATION PROMPTS
// ===================================================================

function generateBusinessArticlePrompt(researchData, query) {
  const contentType = CONTENT_STRATEGY.contentTypes[Math.floor(Math.random() * CONTENT_STRATEGY.contentTypes.length)];
  
  return `You are a senior technology consultant at ContainerCode Advisory, a premier multi-cloud consulting firm specializing in cybersecurity, DevOps, and digital transformation.

Write a comprehensive ${contentType} about: "${query}"

COMPANY CONTEXT:
- ContainerCode Advisory: Premier technology consulting business
- Specialties: Multi-cloud (AWS, Azure, Google Cloud, Oracle, IBM), Cybersecurity, DevOps/DevSecOps, Digital Transformation
- Key Stats: 500+ clients served, 99.9% uptime SLA, 150+ projects delivered, 24/7 expert support
- Value Propositions: Vendor-neutral expertise, security-first approach, measurable business outcomes

RESEARCH DATA TO INCORPORATE:
${researchData.map((item, index) => `
${index + 1}. ${item.title}
   Source: ${item.url}
   Summary: ${item.snippet}
`).join('')}

WRITING REQUIREMENTS:
1. **Business Focus**: Emphasize ROI, business outcomes, and strategic value
2. **Technical Depth**: Provide expert-level insights while remaining accessible
3. **Authority**: Demonstrate deep expertise across cloud platforms and security
4. **Practical Value**: Include actionable recommendations and best practices
5. **SEO Optimization**: Naturally incorporate relevant keywords and phrases
6. **Structure**: Use clear headings, bullet points, and logical flow
7. **Length**: 2000-3000 words for comprehensive coverage

ARTICLE STRUCTURE:
1. Executive Summary (business impact focus)
2. Current Market Context (industry trends and challenges)
3. Technical Analysis (expert insights and best practices)
4. Implementation Strategy (step-by-step guidance)
5. Case Study Examples (real-world applications)
6. Risk Considerations (security and compliance aspects)
7. ROI and Business Benefits (measurable outcomes)
8. Future Outlook (trends and predictions)
9. ContainerCode Advisory Perspective (how we help clients)
10. Conclusion and Next Steps

TONE: Professional, authoritative, consultative - speaking to decision-makers and technical leaders

Focus on delivering exceptional value that positions ContainerCode Advisory as the premier choice for enterprise cloud transformation and cybersecurity consulting.`;
}

function generateNewsletterPrompt(articles) {
  return `You are the content marketing team at ContainerCode Advisory, creating our weekly technology insights newsletter for enterprise decision-makers.

Create a comprehensive newsletter edition that summarizes this week's key developments in cloud technology, cybersecurity, and digital transformation.

RECENT ARTICLES TO FEATURE:
${articles.map((article, index) => `
${index + 1}. ${article.title}
   Key Points: ${article.content.substring(0, 200)}...
`).join('')}

NEWSLETTER REQUIREMENTS:
1. **Audience**: CTOs, IT Directors, Security Leaders, Digital Transformation Executives
2. **Tone**: Professional, insightful, actionable
3. **Length**: 1500-2000 words
4. **Focus**: Business value and strategic implications

NEWSLETTER STRUCTURE:
1. Executive Summary (week's key themes)
2. Featured Insights (top 3-4 articles with business context)
3. Industry Spotlight (sector-specific updates)
4. Technology Watch (emerging trends and tools)
5. Security Brief (threat landscape and protection strategies)
6. ContainerCode Advisory Updates (service highlights)
7. Recommended Actions (practical next steps)
8. Upcoming Events and Resources

Include relevant calls-to-action for ContainerCode Advisory services and consultation opportunities.`;
}

// ===================================================================
// AUTOMATED RESEARCH & CONTENT WORKFLOW
// ===================================================================

async function performBusinessResearch(query) {
  try {
    console.log(`🔍 Researching: ${query}`);
    
    const searchUrl = 'https://api.search.brave.com/res/v1/web/search';
    const response = await fetch(`${searchUrl}?q=${encodeURIComponent(query)}&count=5`, {
      headers: {
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Research failed: ${response.status}`);
    }

    const data = await response.json();
    return data.web?.results || [];
  } catch (error) {
    console.error('❌ Research error:', error);
    return [];
  }
}

async function generateBusinessContent(prompt) {
  try {
    console.log('🤖 Generating business-focused content...');
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a senior technology consultant and thought leader writing authoritative content for enterprise decision-makers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Content generation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ Content generation error:', error);
    return null;
  }
}

// ===================================================================
// NOTION STORAGE WITH UNLIMITED CONTENT
// ===================================================================

function convertToNotionBlocks(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const blocks = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) continue;

    // Headers
    if (trimmed.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: trimmed.substring(2) } }]
        }
      });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: trimmed.substring(3) } }]
        }
      });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: trimmed.substring(4) } }]
        }
      });
    }
    // Bullet points
    else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: trimmed.substring(2) } }]
        }
      });
    }
    // Regular paragraphs
    else {
      // Split long paragraphs to stay under 2000 char limit per block
      const maxLength = 1800;
      if (trimmed.length > maxLength) {
        const chunks = [];
        let remaining = trimmed;
        while (remaining.length > maxLength) {
          let splitIndex = remaining.lastIndexOf(' ', maxLength);
          if (splitIndex === -1) splitIndex = maxLength;
          chunks.push(remaining.substring(0, splitIndex));
          remaining = remaining.substring(splitIndex + 1);
        }
        if (remaining) chunks.push(remaining);
        
        chunks.forEach(chunk => {
          blocks.push({
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [{ type: 'text', text: { content: chunk } }]
            }
          });
        });
      } else {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: trimmed } }]
          }
        });
      }
    }
  }

  return blocks;
}

async function storeArticleWithUnlimitedContent(title, content, topic, wordCount) {
  try {
    console.log(`📝 Storing article: ${title}`);
    
    const contentBlocks = convertToNotionBlocks(content);
    
    // Create article page with unlimited content in blocks
    const response = await notion.pages.create({
      parent: {
        database_id: databases.generatedArticles
      },
      properties: {
        Title: {
          title: [{ type: 'text', text: { content: title } }]
        },
        Topic: {
          rich_text: [{ type: 'text', text: { content: topic } }]
        },
        WordCount: {
          number: wordCount
        },
        GeneratedDate: {
          date: { start: new Date().toISOString() }
        },
        Status: {
          select: { name: 'Published' }
        }
      },
      children: contentBlocks
    });

    console.log(`✅ Article stored with ${contentBlocks.length} content blocks`);
    return response;
  } catch (error) {
    console.error('❌ Article storage error:', error);
    throw error;
  }
}

// ===================================================================
// MAIN AUTOMATION WORKFLOW
// ===================================================================

async function runContainerCodeAutomation() {
  try {
    console.log('🎯 Starting ContainerCode Advisory Content Automation');
    console.log('================================================');

    // Generate diverse queries based on business focus
    const queries = [
      generateBusinessFocusedQuery(),
      generateTrendingQuery(),
      generateIndustryQuery()
    ];

    const generatedArticles = [];

    for (const [index, query] of queries.entries()) {
      console.log(`\n📋 Processing Query ${index + 1}: ${query}`);
      
      // Research phase
      const researchData = await performBusinessResearch(query);
      if (researchData.length === 0) {
        console.log('⚠️ No research data found, skipping...');
        continue;
      }

      // Content generation
      const articlePrompt = generateBusinessArticlePrompt(researchData, query);
      const content = await generateBusinessContent(articlePrompt);
      
      if (!content) {
        console.log('⚠️ Content generation failed, skipping...');
        continue;
      }

      // Generate title and calculate metrics
      const title = `${query.split(' ').slice(-3).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - ${new Date().toISOString().split('T')[0]}`;
      const wordCount = content.split(' ').length;

      // Store with unlimited content capability
      await storeArticleWithUnlimitedContent(title, content, query, wordCount);
      
      generatedArticles.push({ title, content, topic: query, wordCount });
      
      console.log(`✅ Article completed: ${wordCount} words`);
    }

    // Generate newsletter if we have articles
    if (generatedArticles.length > 0) {
      console.log('\n📰 Generating weekly newsletter...');
      
      const newsletterPrompt = generateNewsletterPrompt(generatedArticles);
      const newsletterContent = await generateBusinessContent(newsletterPrompt);
      
      if (newsletterContent) {
        const newsletterBlocks = convertToNotionBlocks(newsletterContent);
        
        await notion.pages.create({
          parent: { database_id: databases.newsletters },
          properties: {
            Title: {
              title: [{ type: 'text', text: { content: `ContainerCode Advisory Weekly - ${new Date().toLocaleDateString()}` } }]
            },
            GeneratedDate: {
              date: { start: new Date().toISOString() }
            },
            SendDate: {
              date: { start: new Date(Date.now() + 24*60*60*1000).toISOString() }
            },
            Status: {
              select: { name: 'Draft' }
            }
          },
          children: newsletterBlocks
        });
        
        console.log('✅ Newsletter generated successfully');
      }
    }

    console.log('\n🎉 ContainerCode Advisory automation completed successfully!');
    console.log(`📊 Articles generated: ${generatedArticles.length}`);
    console.log(`📝 Total words: ${generatedArticles.reduce((sum, article) => sum + article.wordCount, 0)}`);
    
  } catch (error) {
    console.error('❌ Automation failed:', error);
    process.exit(1);
  }
}

// ===================================================================
// EXECUTION
// ===================================================================

if (require.main === module) {
  runContainerCodeAutomation();
}

module.exports = {
  CONTENT_STRATEGY,
  generateBusinessFocusedQuery,
  generateTrendingQuery,
  generateIndustryQuery,
  runContainerCodeAutomation
};
