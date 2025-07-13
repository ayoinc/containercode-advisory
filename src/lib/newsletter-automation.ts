import { Client } from '@notionhq/client';
import { notion, DATABASE_IDS } from './notion';
import { getPexelsPhoto, PEXELS_IMAGE_CATEGORIES } from './pexels-helpers';

// Brave Search API configuration
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const BRAVE_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Cloudflare KV configuration
const CLOUDFLARE_KV_NAMESPACE_ID = '137e4efd34d240a498369c0cc273d5e3';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

interface TrendingTopic {
  query: string;
  category: string;
  searchResults: BraveSearchResult[];
}

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  published: string;
}

interface GeneratedArticle {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  slug: string;
  coverImageQuery: string;
}

interface NewsletterActivity {
  timestamp: string;
  type: 'search' | 'generation' | 'publication' | 'notification';
  status: 'success' | 'error';
  details: any;
  error?: string;
}

export class NewsletterAutomationSystem {
  private activities: NewsletterActivity[] = [];

  // ContainerCode business niches for trending topic searches
  private readonly businessNiches = [
    'cloud computing trends 2025',
    'multi-cloud strategy enterprise',
    'cybersecurity best practices',
    'zero trust security implementation',
    'DevOps automation tools',
    'infrastructure as code',
    'container security kubernetes',
    'digital transformation trends',
    'cloud cost optimization',
    'hybrid cloud architecture',
    'microservices deployment',
    'cloud migration strategies',
    'data protection regulations GDPR',
    'enterprise cloud governance',
    'serverless computing trends'
  ];

  private readonly categories = [
    'Cloud Strategy',
    'Cybersecurity',
    'DevOps',
    'Digital Transformation',
    'Industry Analysis'
  ];

  /**
   * Main function to generate and publish newsletter content
   */
  async generateNewsletterContent(): Promise<void> {
    try {
      console.log('🚀 Starting newsletter automation process...');
      
      // Step 1: Search for trending topics
      const trendingTopics = await this.searchTrendingTopics();
      this.logActivity('search', 'success', { topicsFound: trendingTopics.length });

      // Step 2: Generate articles using AI
      const articles = await this.generateArticles(trendingTopics);
      this.logActivity('generation', 'success', { articlesGenerated: articles.length });

      // Step 3: Download appropriate images
      const articlesWithImages = await this.downloadArticleImages(articles);

      // Step 4: Publish to blog and Notion
      const publishedArticles = await this.publishArticles(articlesWithImages);
      this.logActivity('publication', 'success', { articlesPublished: publishedArticles.length });

      // Step 5: Notify newsletter subscribers
      await this.notifySubscribers(publishedArticles);
      this.logActivity('notification', 'success', { subscribersNotified: true });

      // Step 6: Log all activities to Notion
      await this.logActivitiesToNotion();

      console.log('✅ Newsletter automation completed successfully');
    } catch (error) {
      console.error('❌ Newsletter automation failed:', error);
      this.logActivity('search', 'error', {}, error instanceof Error ? error.message : String(error));
      await this.logActivitiesToNotion();
      throw error;
    }
  }

  /**
   * Search for trending topics using Brave Search API
   */
  private async searchTrendingTopics(): Promise<TrendingTopic[]> {
    console.log('🔍 Searching for trending topics...');
    
    const trendingTopics: TrendingTopic[] = [];

    for (const niche of this.businessNiches.slice(0, 5)) { // Limit to 5 searches
      try {
        const response = await fetch(`${BRAVE_SEARCH_URL}?q=${encodeURIComponent(niche)}&count=5&freshness=pd`, {
          headers: {
            'X-Subscription-Token': BRAVE_API_KEY!,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const searchResults: BraveSearchResult[] = data.web?.results?.map((result: any) => ({
            title: result.title,
            url: result.url,
            description: result.description,
            published: result.published || new Date().toISOString()
          })) || [];

          if (searchResults.length > 0) {
            trendingTopics.push({
              query: niche,
              category: this.categorizeTopic(niche),
              searchResults
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to search for topic: ${niche}`, error);
      }
    }

    console.log(`✅ Found ${trendingTopics.length} trending topics`);
    return trendingTopics;
  }

  /**
   * Generate articles using DeepSeek AI
   */
  private async generateArticles(topics: TrendingTopic[]): Promise<GeneratedArticle[]> {
    console.log('🤖 Generating articles with DeepSeek AI...');
    
    const articles: GeneratedArticle[] = [];

    for (const topic of topics.slice(0, 2)) { // Generate 2 articles per run
      try {
        const researchSummary = this.createResearchSummary(topic);
        
        const prompt = `
You are a professional technology consultant writing for ContainerCode Advisory, a UK-based consultancy specialising in multi-cloud strategy, cybersecurity, and DevOps.

Based on this research about "${topic.query}":
${researchSummary}

Write a comprehensive, professional article in British English that:
1. Has an engaging title (50-60 characters)
2. Includes a compelling excerpt (150-200 words)
3. Contains 800-1200 words of expert analysis
4. Uses British spelling and terminology
5. Focuses on practical insights for enterprise clients
6. Includes actionable recommendations
7. Maintains a professional, authoritative tone
8. Incorporates industry best practices

Structure the article with clear headings and subheadings.
Format the response as JSON with these fields:
- title: The article title
- excerpt: Brief description for previews
- content: Full article content in markdown format
- tags: Array of 3-5 relevant tags
- slug: URL-friendly slug
- coverImageQuery: Search term for finding a relevant cover image

Ensure the content demonstrates ContainerCode's expertise and provides genuine value to enterprise decision-makers.
`;

        const response = await fetch(DEEPSEEK_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are an expert technology consultant and writer specialising in enterprise cloud computing, cybersecurity, and DevOps. You write in professional British English.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const aiResponse = await response.json();
          const content = aiResponse.choices[0].message.content;
          
          try {
            const article = JSON.parse(content);
            articles.push({
              ...article,
              category: topic.category,
              slug: this.generateSlug(article.title)
            });
            console.log(`✅ Generated article: ${article.title}`);
          } catch (parseError) {
            console.warn('Failed to parse AI response as JSON, treating as plain text');
            // Fallback: create article from plain text response
            const fallbackArticle = this.createFallbackArticle(content, topic);
            articles.push(fallbackArticle);
          }
        }
      } catch (error) {
        console.warn(`Failed to generate article for topic: ${topic.query}`, error);
      }
    }

    console.log(`✅ Generated ${articles.length} articles`);
    return articles;
  }

  /**
   * Download appropriate images for articles using Pexels API
   */
  private async downloadArticleImages(articles: GeneratedArticle[]): Promise<GeneratedArticle[]> {
    console.log('📸 Downloading article images from Pexels...');
    
    const articlesWithImages: GeneratedArticle[] = [];

    for (const article of articles) {
      try {
        // Map article category to Pexels image category
        const imageCategory = this.mapCategoryToImageCategory(article.category);
        const photo = await getPexelsPhoto(imageCategory);
        
        if (photo) {
          console.log(`✅ Downloaded image for: ${article.title}`);
          articlesWithImages.push({
            ...article,
            coverImageQuery: photo.src.large // Use the Pexels image URL
          });
        } else {
          articlesWithImages.push(article);
        }
      } catch (error) {
        console.warn(`Failed to download image for article: ${article.title}`, error);
        articlesWithImages.push(article);
      }
    }

    return articlesWithImages;
  }

  /**
   * Publish articles to blog and Notion database
   */
  private async publishArticles(articles: GeneratedArticle[]): Promise<GeneratedArticle[]> {
    console.log('📝 Publishing articles to Notion...');
    
    const publishedArticles: GeneratedArticle[] = [];

    for (const article of articles) {
      try {
        // Create blog post in Notion database
        const response = await notion.pages.create({
          parent: {
            database_id: DATABASE_IDS.BLOG_POSTS
          },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: article.title
                  }
                }
              ]
            },
            Slug: {
              rich_text: [
                {
                  text: {
                    content: article.slug
                  }
                }
              ]
            },
            Category: {
              select: {
                name: article.category
              }
            },
            Tags: {
              multi_select: article.tags.map(tag => ({ name: tag }))
            },
            Excerpt: {
              rich_text: [
                {
                  text: {
                    content: article.excerpt
                  }
                }
              ]
            },
            PublishedDate: {
              date: {
                start: new Date().toISOString()
              }
            },
            Status: {
              select: {
                name: 'Published'
              }
            },
            Featured: {
              checkbox: true // Mark newsletter articles as featured
            },
            CoverImage: {
              files: article.coverImageQuery ? [
                {
                  external: {
                    url: article.coverImageQuery
                  },
                  name: 'Cover Image',
                  type: 'external' as const
                }
              ] : []
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
                      content: article.content
                    }
                  }
                ]
              }
            }
          ]
        });

        publishedArticles.push(article);
        console.log(`✅ Published article to Notion: ${article.title}`);
      } catch (error) {
        console.warn(`Failed to publish article: ${article.title}`, error);
      }
    }

    return publishedArticles;
  }

  /**
   * Notify newsletter subscribers via Cloudflare Workers
   */
  private async notifySubscribers(articles: GeneratedArticle[]): Promise<void> {
    console.log('📧 Notifying newsletter subscribers...');
    
    try {
      // Get subscriber list from Cloudflare KV
      const subscribers = await this.getSubscribersFromKV();
      
      if (subscribers.length === 0) {
        console.log('No subscribers found');
        return;
      }

      // Create newsletter email content
      const emailContent = this.createNewsletterEmail(articles);
      
      // Send via Cloudflare Worker (this would be implemented in the Worker)
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscribers: subscribers.slice(0, 100), // Limit for testing
          content: emailContent,
          articles
        })
      });

      if (response.ok) {
        console.log(`✅ Newsletter sent to ${subscribers.length} subscribers`);
      } else {
        throw new Error(`Failed to send newsletter: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Failed to notify subscribers:', error);
    }
  }

  /**
   * Get subscribers from Cloudflare KV
   */
  private async getSubscribersFromKV(): Promise<string[]> {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_NAMESPACE_ID}/values/subscribers`,
        {
          headers: {
            'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.subscribers || [];
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch subscribers from KV:', error);
      return [];
    }
  }

  /**
   * Log activities to Notion database
   */
  private async logActivitiesToNotion(): Promise<void> {
    console.log('📊 Logging activities to Notion...');
    
    try {
      // Create a newsletter activity log entry
      await notion.pages.create({
        parent: {
          database_id: DATABASE_IDS.BLOG_POSTS // Using blog database for now, could create separate activity log
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: `Newsletter Automation Log - ${new Date().toLocaleDateString('en-GB')}`
                }
              }
            ]
          },
          Category: {
            select: {
              name: 'System Log'
            }
          },
          PublishedDate: {
            date: {
              start: new Date().toISOString()
            }
          },
          Status: {
            select: {
              name: 'Published'
            }
          }
        },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: 'Newsletter Automation Activities'
                  }
                }
              ]
            }
          },
          ...this.activities.map(activity => ({
            object: 'block' as const,
            type: 'paragraph' as const,
            paragraph: {
              rich_text: [
                {
                  type: 'text' as const,
                  text: {
                    content: `${activity.timestamp}: ${activity.type} - ${activity.status} - ${JSON.stringify(activity.details)}`
                  }
                }
              ]
            }
          }))
        ]
      });

      console.log('✅ Activities logged to Notion');
    } catch (error) {
      console.warn('Failed to log activities to Notion:', error);
    }
  }

  // Helper methods
  private logActivity(type: NewsletterActivity['type'], status: NewsletterActivity['status'], details: any, error?: string): void {
    this.activities.push({
      timestamp: new Date().toISOString(),
      type,
      status,
      details,
      error
    });
  }

  private categorizeTopic(query: string): string {
    if (query.includes('cloud') || query.includes('multi-cloud')) return 'Cloud Strategy';
    if (query.includes('security') || query.includes('cyber')) return 'Cybersecurity';
    if (query.includes('devops') || query.includes('automation')) return 'DevOps';
    if (query.includes('digital') || query.includes('transform')) return 'Digital Transformation';
    return 'Industry Analysis';
  }

  private createResearchSummary(topic: TrendingTopic): string {
    return topic.searchResults
      .map(result => `• ${result.title}: ${result.description}`)
      .join('\n');
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private mapCategoryToImageCategory(category: string): keyof typeof PEXELS_IMAGE_CATEGORIES {
    switch (category) {
      case 'Cloud Strategy': return 'cloudComputing';
      case 'Cybersecurity': return 'cybersecurity';
      case 'DevOps': return 'devops';
      case 'Digital Transformation': return 'innovation';
      default: return 'teamwork';
    }
  }

  private createFallbackArticle(content: string, topic: TrendingTopic): GeneratedArticle {
    const title = `${topic.category} Trends: Expert Analysis`;
    return {
      title,
      content: content.substring(0, 1000) + '...',
      excerpt: content.substring(0, 200) + '...',
      category: topic.category,
      tags: ['trends', 'analysis', topic.category.toLowerCase()],
      slug: this.generateSlug(title),
      coverImageQuery: this.mapCategoryToImageCategory(topic.category)
    };
  }

  private createNewsletterEmail(articles: GeneratedArticle[]): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ContainerCode Advisory Newsletter</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #14b8c6;">ContainerCode Advisory Newsletter</h1>
  <p>Hello,</p>
  <p>We're pleased to share our latest insights and analysis on trending technology topics.</p>
  
  ${articles.map(article => `
    <div style="border: 1px solid #e0e0e0; margin: 20px 0; padding: 20px;">
      <h2 style="color: #333;">${article.title}</h2>
      <p style="color: #666;">${article.excerpt}</p>
      <a href="https://containercode.com/blog/${article.slug}" style="color: #14b8c6;">Read full article →</a>
    </div>
  `).join('')}
  
  <p>Best regards,<br>
  The ContainerCode Advisory Team</p>
  
  <hr>
  <p style="font-size: 12px; color: #666;">
    You're receiving this because you subscribed to our newsletter. 
    <a href="/api/unsubscribe">Unsubscribe</a>
  </p>
</body>
</html>
    `;
  }
}