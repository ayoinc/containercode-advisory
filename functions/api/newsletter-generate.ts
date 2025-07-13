interface Env {
  BRAVE_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  NOTION_TOKEN: string;
  NOTION_NEWSLETTERS_DATABASE_ID: string;
  RESEND_API_KEY: string;
  ADMIN_EMAIL: string;
}

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  published?: string;
}

interface NewsletterContent {
  title: string;
  content: string;
  excerpt: string;
  topics: string[];
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const { env } = context;
    
    // Generate newsletter content using AI
    const newsletterContent = await generateNewsletterContent(env);
    
    // Store in Notion database
    const newsletterId = await storeNewsletterInNotion(newsletterContent, env);
    
    return new Response(JSON.stringify({ 
      success: true, 
      newsletterId,
      title: newsletterContent.title,
      message: 'Newsletter generated and stored successfully' 
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Newsletter generation error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to generate newsletter' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions(context: { request: Request }) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function generateNewsletterContent(env: Env): Promise<NewsletterContent> {
  // Step 1: Search for latest cloud/tech news using Brave Search
  const searchQueries = [
    'cloud computing news 2024',
    'DevOps trends 2024',
    'cybersecurity updates latest',
    'digital transformation enterprise',
    'AWS Azure Google Cloud updates',
    'Kubernetes container orchestration news',
    'microservices architecture trends',
    'serverless computing developments'
  ];
  
  const searchResults: BraveSearchResult[] = [];
  
  for (const query of searchQueries.slice(0, 4)) { // Limit to 4 searches for efficiency
    try {
      const results = await searchWithBrave(query, env.BRAVE_API_KEY);
      searchResults.push(...results.slice(0, 3)); // Top 3 results per query
    } catch (error) {
      console.error(`Search failed for query "${query}":`, error);
    }
  }

  // Step 2: Use DeepSeek to generate newsletter content
  const newsletterPrompt = `
    You are an expert content writer for ContainerCode Advisory, a leading cloud consulting company. 
    
    Based on the following recent news and developments in cloud computing, DevOps, and cybersecurity, 
    create an engaging, informative newsletter that provides value to enterprise technology leaders.

    Recent News Sources:
    ${searchResults.map(result => `
    - Title: ${result.title}
    - Description: ${result.description}
    - URL: ${result.url}
    `).join('\n')}

    Generate a comprehensive newsletter with the following structure:
    1. Compelling headline that captures the main themes
    2. Executive summary (2-3 sentences)
    3. 3-4 main sections covering key topics
    4. Actionable insights and recommendations
    5. Call-to-action for ContainerCode services

    Guidelines:
    - Write in a professional but engaging tone
    - Focus on business value and ROI
    - Include specific examples and use cases
    - Target audience: CTOs, IT Directors, DevOps managers
    - Length: 800-1200 words
    - Use relevant emojis sparingly for visual appeal
    - Include practical tips that readers can implement
    - Reference current industry challenges and solutions

    Format the response as a structured newsletter with clear sections and subheadings.
    Make it actionable and valuable for enterprise decision-makers.
  `;

  const aiResponse = await generateContentWithDeepSeek(newsletterPrompt, env.DEEPSEEK_API_KEY);
  
  // Step 3: Extract newsletter components
  const title = extractTitle(aiResponse);
  const excerpt = extractExcerpt(aiResponse);
  const topics = extractTopics(searchResults);
  
  return {
    title,
    content: aiResponse,
    excerpt,
    topics
  };
}

async function searchWithBrave(query: string, apiKey: string): Promise<BraveSearchResult[]> {
  const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10&safesearch=moderate&freshness=pd&text_decorations=false`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Brave Search API error: ${response.statusText}`);
  }

  const data = await response.json();
  
  return data.web?.results?.map((result: any) => ({
    title: result.title || '',
    url: result.url || '',
    description: result.description || '',
    published: result.age || ''
  })) || [];
}

async function generateContentWithDeepSeek(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer specializing in enterprise technology, cloud computing, and digital transformation. Create engaging, valuable content for business leaders.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function storeNewsletterInNotion(newsletter: NewsletterContent, env: Env): Promise<string> {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      parent: { 
        database_id: env.NOTION_NEWSLETTERS_DATABASE_ID 
      },
      properties: {
        'Title': {
          title: [
            {
              text: {
                content: newsletter.title
              }
            }
          ]
        },
        'Excerpt': {
          rich_text: [
            {
              text: {
                content: newsletter.excerpt
              }
            }
          ]
        },
        'Topics': {
          multi_select: newsletter.topics.map(topic => ({ name: topic }))
        },
        'Status': {
          select: {
            name: 'published'
          }
        },
        'Publish Date': {
          date: {
            start: new Date().toISOString().split('T')[0]
          }
        },
        'Sent Count': {
          number: 0
        },
        'Generated By': {
          select: {
            name: 'ai'
          }
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: newsletter.content
                }
              }
            ]
          }
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Notion API error: ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  return data.id;
}

function extractTitle(content: string): string {
  // Look for the first line that appears to be a title
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.length > 10 && trimmed.length < 100) {
      return trimmed.replace(/^#+\s*/, '').replace(/[*_]/g, '');
    }
  }
  return `ContainerCode Insights - ${new Date().toLocaleDateString()}`;
}

function extractExcerpt(content: string): string {
  // Find the first substantial paragraph
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.length > 50 && trimmed.length < 300) {
      return trimmed.replace(/[*_]/g, '').substring(0, 250) + '...';
    }
  }
  return 'Stay ahead of the curve with the latest insights in cloud computing, DevOps, and digital transformation from ContainerCode Advisory.';
}

function extractTopics(searchResults: BraveSearchResult[]): string[] {
  const topics = new Set<string>();
  
  const keywords = [
    'Cloud Computing', 'DevOps', 'Cybersecurity', 'Digital Transformation',
    'AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Containers',
    'Microservices', 'Serverless', 'AI/ML', 'Data Analytics',
    'Automation', 'Infrastructure', 'Security', 'Compliance'
  ];

  searchResults.forEach(result => {
    const text = `${result.title} ${result.description}`.toLowerCase();
    keywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        topics.add(keyword);
      }
    });
  });

  return Array.from(topics).slice(0, 6); // Limit to 6 topics
}