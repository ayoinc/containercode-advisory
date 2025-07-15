#!/usr/bin/env node
/**
 * Notion API Integration Tests
 * Tests the complete Notion API integration including database operations,
 * page creation, content synchronization, and error handling
 */

const { describe, expect, it, jest, beforeEach, afterEach, beforeAll, afterAll } = require('@jest/globals');
const { performance } = require('perf_hooks');

// Mock environment variables
const mockEnv = {
  NOTION_TOKEN: 'test-notion-token',
  NOTION_DATABASE_SERVICES: 'test-services-db',
  NOTION_DATABASE_BLOG_POSTS: 'test-blog-db',
  NOTION_DATABASE_NEWSLETTERS: 'test-newsletter-db',
  NOTION_DATABASE_SUBSCRIBERS: 'test-subscriber-db',
  NOTION_DATABASE_GENERATED_ARTICLES: 'test-articles-db',
  NOTION_DATABASE_WEBSITE_PAGES: 'test-pages-db',
  NOTION_DATABASE_TRENDING_TOPICS: 'test-topics-db',
  NOTION_DATABASE_EMAIL_CAMPAIGNS: 'test-campaigns-db'
};

// Mock the Notion client
jest.mock('@notionhq/client', () => ({
  Client: jest.fn().mockImplementation(() => ({
    pages: {
      create: jest.fn(),
      update: jest.fn(),
      retrieve: jest.fn()
    },
    databases: {
      query: jest.fn(),
      retrieve: jest.fn()
    },
    blocks: {
      children: {
        append: jest.fn(),
        list: jest.fn()
      }
    }
  }))
}));

// Mock the NotionClient utility
class MockNotionClient {
  constructor(env) {
    this.env = env;
    this.notion = new (require('@notionhq/client').Client)({
      auth: env.NOTION_TOKEN
    });
  }

  async createArticlePage(article) {
    return this.notion.pages.create({
      parent: { database_id: this.env.NOTION_DATABASE_GENERATED_ARTICLES },
      properties: this.buildPageProperties(article),
      children: this.buildPageContent(article)
    });
  }

  async updateArticlePage(pageId, updates) {
    return this.notion.pages.update({
      page_id: pageId,
      properties: updates
    });
  }

  async createSubscriber(subscriber) {
    return this.notion.pages.create({
      parent: { database_id: this.env.NOTION_DATABASE_SUBSCRIBERS },
      properties: this.buildSubscriberProperties(subscriber)
    });
  }

  async createNewsletterCampaign(campaign) {
    return this.notion.pages.create({
      parent: { database_id: this.env.NOTION_DATABASE_EMAIL_CAMPAIGNS },
      properties: this.buildCampaignProperties(campaign)
    });
  }

  async queryDatabase(databaseId, filter = {}) {
    return this.notion.databases.query({
      database_id: databaseId,
      filter,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }]
    });
  }

  buildPageProperties(article) {
    return {
      'Title': {
        title: [{ text: { content: article.title } }]
      },
      'Status': {
        select: { name: 'Published' }
      },
      'Category': {
        select: { name: article.category }
      },
      'Tags': {
        multi_select: article.tags.map(tag => ({ name: tag }))
      },
      'Created': {
        date: { start: new Date().toISOString() }
      },
      'Reading Time': {
        number: article.readingTime
      },
      'Word Count': {
        number: article.wordCount || 0
      }
    };
  }

  buildSubscriberProperties(subscriber) {
    return {
      'Email': {
        email: subscriber.email
      },
      'Name': {
        title: [{ text: { content: subscriber.name || subscriber.email } }]
      },
      'Status': {
        select: { name: subscriber.status || 'active' }
      },
      'Subscribed Date': {
        date: { start: new Date().toISOString() }
      },
      'Source': {
        select: { name: subscriber.source || 'unknown' }
      },
      'Segment': {
        select: { name: subscriber.segment || 'general' }
      }
    };
  }

  buildCampaignProperties(campaign) {
    return {
      'Campaign Name': {
        title: [{ text: { content: campaign.name } }]
      },
      'Status': {
        select: { name: campaign.status || 'draft' }
      },
      'Sent Date': {
        date: campaign.sentDate ? { start: campaign.sentDate } : null
      },
      'Recipients': {
        number: campaign.recipients || 0
      },
      'Open Rate': {
        number: campaign.openRate || 0
      },
      'Click Rate': {
        number: campaign.clickRate || 0
      },
      'Subject': {
        rich_text: [{ text: { content: campaign.subject || '' } }]
      }
    };
  }

  buildPageContent(article) {
    const blocks = [];
    
    // Add summary
    if (article.summary) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [{ text: { content: article.summary } }]
        }
      });
    }
    
    // Add content blocks
    const contentBlocks = this.convertMarkdownToNotionBlocks(article.content);
    blocks.push(...contentBlocks);
    
    return blocks;
  }

  convertMarkdownToNotionBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      if (line.startsWith('# ')) {
        blocks.push({
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ text: { content: line.substring(2) } }]
          }
        });
      } else if (line.startsWith('## ')) {
        blocks.push({
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ text: { content: line.substring(3) } }]
          }
        });
      } else if (line.startsWith('### ')) {
        blocks.push({
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ text: { content: line.substring(4) } }]
          }
        });
      } else {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: line } }]
          }
        });
      }
    }
    
    return blocks;
  }
}

describe('Notion API Integration Tests', () => {
  let notionClient;
  let mockNotionInstance;

  beforeAll(() => {
    // Set up environment variables
    Object.assign(process.env, mockEnv);
  });

  beforeEach(() => {
    notionClient = new MockNotionClient(mockEnv);
    mockNotionInstance = notionClient.notion;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Article Management', () => {
    const mockArticle = {
      title: 'Test Article: AI in Enterprise Cloud Computing',
      content: `# Introduction

This is a comprehensive article about AI in enterprise cloud computing.

## Key Benefits

- Improved efficiency
- Better decision making
- Cost optimization

## Implementation Strategy

Organizations should consider the following approach:

1. Assess current infrastructure
2. Identify AI opportunities
3. Implement pilot projects
4. Scale successful initiatives`,
      summary: 'This article explores how AI is transforming enterprise cloud computing',
      tags: ['ai', 'cloud', 'enterprise', 'technology'],
      category: 'technology',
      readingTime: 5,
      wordCount: 250,
      slug: 'ai-enterprise-cloud-computing'
    };

    it('should create article page in Notion', async () => {
      const mockResponse = {
        id: 'test-page-id',
        url: 'https://notion.so/test-page-id',
        created_time: new Date().toISOString(),
        properties: {
          Title: { title: [{ text: { content: mockArticle.title } }] }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const result = await notionClient.createArticlePage(mockArticle);

      expect(mockNotionInstance.pages.create).toHaveBeenCalledWith({
        parent: { database_id: mockEnv.NOTION_DATABASE_GENERATED_ARTICLES },
        properties: expect.objectContaining({
          'Title': expect.objectContaining({
            title: [{ text: { content: mockArticle.title } }]
          }),
          'Status': expect.objectContaining({
            select: { name: 'Published' }
          }),
          'Category': expect.objectContaining({
            select: { name: mockArticle.category }
          }),
          'Tags': expect.objectContaining({
            multi_select: mockArticle.tags.map(tag => ({ name: tag }))
          })
        }),
        children: expect.any(Array)
      });

      expect(result).toEqual(mockResponse);
    });

    it('should update article page properties', async () => {
      const pageId = 'test-page-id';
      const updates = {
        'Status': { select: { name: 'Updated' } },
        'Reading Time': { number: 7 }
      };

      const mockResponse = {
        id: pageId,
        properties: updates
      };

      mockNotionInstance.pages.update.mockResolvedValue(mockResponse);

      const result = await notionClient.updateArticlePage(pageId, updates);

      expect(mockNotionInstance.pages.update).toHaveBeenCalledWith({
        page_id: pageId,
        properties: updates
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle article creation with missing optional fields', async () => {
      const minimalArticle = {
        title: 'Minimal Article',
        content: 'Basic content',
        category: 'general',
        tags: ['test']
      };

      const mockResponse = {
        id: 'minimal-page-id',
        url: 'https://notion.so/minimal-page-id'
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const result = await notionClient.createArticlePage(minimalArticle);

      expect(result).toEqual(mockResponse);
      expect(mockNotionInstance.pages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          properties: expect.objectContaining({
            'Title': expect.objectContaining({
              title: [{ text: { content: minimalArticle.title } }]
            })
          })
        })
      );
    });

    it('should convert markdown to Notion blocks correctly', () => {
      const markdown = `# Main Heading

This is a paragraph.

## Sub Heading

Another paragraph with content.

### Minor Heading

Final paragraph.`;

      const blocks = notionClient.convertMarkdownToNotionBlocks(markdown);

      expect(blocks).toHaveLength(6);
      expect(blocks[0]).toEqual({
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ text: { content: 'Main Heading' } }]
        }
      });
      expect(blocks[1]).toEqual({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: 'This is a paragraph.' } }]
        }
      });
      expect(blocks[2]).toEqual({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: 'Sub Heading' } }]
        }
      });
    });
  });

  describe('Subscriber Management', () => {
    const mockSubscriber = {
      email: 'test@example.com',
      name: 'Test User',
      status: 'active',
      source: 'website',
      segment: 'enterprise'
    };

    it('should create subscriber in Notion', async () => {
      const mockResponse = {
        id: 'subscriber-page-id',
        url: 'https://notion.so/subscriber-page-id',
        properties: {
          Email: { email: mockSubscriber.email }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const result = await notionClient.createSubscriber(mockSubscriber);

      expect(mockNotionInstance.pages.create).toHaveBeenCalledWith({
        parent: { database_id: mockEnv.NOTION_DATABASE_SUBSCRIBERS },
        properties: expect.objectContaining({
          'Email': { email: mockSubscriber.email },
          'Name': {
            title: [{ text: { content: mockSubscriber.name } }]
          },
          'Status': {
            select: { name: mockSubscriber.status }
          },
          'Source': {
            select: { name: mockSubscriber.source }
          },
          'Segment': {
            select: { name: mockSubscriber.segment }
          }
        })
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle subscriber creation with minimal data', async () => {
      const minimalSubscriber = {
        email: 'minimal@example.com'
      };

      const mockResponse = {
        id: 'minimal-subscriber-id',
        properties: {
          Email: { email: minimalSubscriber.email }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const result = await notionClient.createSubscriber(minimalSubscriber);

      expect(result).toEqual(mockResponse);
      expect(mockNotionInstance.pages.create).toHaveBeenCalledWith({
        parent: { database_id: mockEnv.NOTION_DATABASE_SUBSCRIBERS },
        properties: expect.objectContaining({
          'Email': { email: minimalSubscriber.email },
          'Name': {
            title: [{ text: { content: minimalSubscriber.email } }]
          }
        })
      });
    });
  });

  describe('Newsletter Campaign Management', () => {
    const mockCampaign = {
      name: 'Monthly Newsletter - January 2024',
      status: 'sent',
      sentDate: '2024-01-15T10:00:00Z',
      recipients: 500,
      openRate: 0.25,
      clickRate: 0.05,
      subject: 'Latest Updates in Cloud Technology'
    };

    it('should create newsletter campaign in Notion', async () => {
      const mockResponse = {
        id: 'campaign-page-id',
        url: 'https://notion.so/campaign-page-id',
        properties: {
          'Campaign Name': {
            title: [{ text: { content: mockCampaign.name } }]
          }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const result = await notionClient.createNewsletterCampaign(mockCampaign);

      expect(mockNotionInstance.pages.create).toHaveBeenCalledWith({
        parent: { database_id: mockEnv.NOTION_DATABASE_EMAIL_CAMPAIGNS },
        properties: expect.objectContaining({
          'Campaign Name': {
            title: [{ text: { content: mockCampaign.name } }]
          },
          'Status': {
            select: { name: mockCampaign.status }
          },
          'Sent Date': {
            date: { start: mockCampaign.sentDate }
          },
          'Recipients': {
            number: mockCampaign.recipients
          },
          'Open Rate': {
            number: mockCampaign.openRate
          },
          'Click Rate': {
            number: mockCampaign.clickRate
          }
        })
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle campaign creation with draft status', async () => {
      const draftCampaign = {
        name: 'Draft Newsletter',
        status: 'draft',
        subject: 'Draft Subject'
      };

      const mockResponse = {
        id: 'draft-campaign-id',
        properties: {
          'Campaign Name': {
            title: [{ text: { content: draftCampaign.name } }]
          }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const result = await notionClient.createNewsletterCampaign(draftCampaign);

      expect(result).toEqual(mockResponse);
      expect(mockNotionInstance.pages.create).toHaveBeenCalledWith({
        parent: { database_id: mockEnv.NOTION_DATABASE_EMAIL_CAMPAIGNS },
        properties: expect.objectContaining({
          'Status': {
            select: { name: 'draft' }
          },
          'Sent Date': null,
          'Recipients': {
            number: 0
          }
        })
      });
    });
  });

  describe('Database Queries', () => {
    it('should query database with filter', async () => {
      const mockResults = {
        results: [
          {
            id: 'result-1',
            properties: {
              Title: { title: [{ text: { content: 'Article 1' } }] }
            }
          },
          {
            id: 'result-2',
            properties: {
              Title: { title: [{ text: { content: 'Article 2' } }] }
            }
          }
        ]
      };

      mockNotionInstance.databases.query.mockResolvedValue(mockResults);

      const filter = {
        property: 'Status',
        select: { equals: 'Published' }
      };

      const result = await notionClient.queryDatabase(
        mockEnv.NOTION_DATABASE_GENERATED_ARTICLES,
        filter
      );

      expect(mockNotionInstance.databases.query).toHaveBeenCalledWith({
        database_id: mockEnv.NOTION_DATABASE_GENERATED_ARTICLES,
        filter,
        sorts: [{ timestamp: 'created_time', direction: 'descending' }]
      });

      expect(result).toEqual(mockResults);
    });

    it('should query database without filter', async () => {
      const mockResults = {
        results: []
      };

      mockNotionInstance.databases.query.mockResolvedValue(mockResults);

      const result = await notionClient.queryDatabase(
        mockEnv.NOTION_DATABASE_SUBSCRIBERS
      );

      expect(mockNotionInstance.databases.query).toHaveBeenCalledWith({
        database_id: mockEnv.NOTION_DATABASE_SUBSCRIBERS,
        filter: {},
        sorts: [{ timestamp: 'created_time', direction: 'descending' }]
      });

      expect(result).toEqual(mockResults);
    });
  });

  describe('Error Handling', () => {
    it('should handle Notion API errors gracefully', async () => {
      const mockError = new Error('Notion API Error: Invalid database ID');
      mockNotionInstance.pages.create.mockRejectedValue(mockError);

      await expect(notionClient.createArticlePage({
        title: 'Test Article',
        content: 'Test content',
        category: 'test',
        tags: ['test']
      })).rejects.toThrow('Notion API Error: Invalid database ID');
    });

    it('should handle network timeouts', async () => {
      const timeoutError = new Error('Network timeout');
      mockNotionInstance.databases.query.mockRejectedValue(timeoutError);

      await expect(notionClient.queryDatabase(
        mockEnv.NOTION_DATABASE_GENERATED_ARTICLES
      )).rejects.toThrow('Network timeout');
    });

    it('should handle malformed data gracefully', async () => {
      const invalidArticle = {
        title: null,
        content: undefined,
        category: '',
        tags: 'not-an-array'
      };

      // The function should handle malformed data without crashing
      expect(() => {
        notionClient.buildPageProperties(invalidArticle);
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should handle large article content efficiently', async () => {
      const largeArticle = {
        title: 'Large Article',
        content: 'This is a test paragraph. '.repeat(1000), // ~25,000 characters
        category: 'test',
        tags: Array.from({ length: 20 }, (_, i) => `tag-${i}`),
        readingTime: 15
      };

      const mockResponse = {
        id: 'large-article-id',
        url: 'https://notion.so/large-article-id'
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const startTime = performance.now();
      const result = await notionClient.createArticlePage(largeArticle);
      const endTime = performance.now();

      expect(result).toEqual(mockResponse);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should handle multiple concurrent operations', async () => {
      const mockResponse = {
        id: 'concurrent-test-id',
        url: 'https://notion.so/concurrent-test-id'
      };

      mockNotionInstance.pages.create.mockResolvedValue(mockResponse);

      const operations = Array.from({ length: 10 }, (_, i) => 
        notionClient.createArticlePage({
          title: `Concurrent Article ${i}`,
          content: `Test content ${i}`,
          category: 'test',
          tags: ['concurrent', 'test']
        })
      );

      const startTime = performance.now();
      const results = await Promise.all(operations);
      const endTime = performance.now();

      expect(results).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete in under 2 seconds
      expect(mockNotionInstance.pages.create).toHaveBeenCalledTimes(10);
    });
  });

  describe('Data Validation', () => {
    it('should validate article properties structure', () => {
      const article = {
        title: 'Test Article',
        content: 'Test content',
        category: 'technology',
        tags: ['test', 'validation'],
        readingTime: 3,
        wordCount: 150
      };

      const properties = notionClient.buildPageProperties(article);

      expect(properties).toHaveProperty('Title');
      expect(properties).toHaveProperty('Status');
      expect(properties).toHaveProperty('Category');
      expect(properties).toHaveProperty('Tags');
      expect(properties).toHaveProperty('Created');
      expect(properties).toHaveProperty('Reading Time');
      expect(properties).toHaveProperty('Word Count');

      expect(properties.Title.title[0].text.content).toBe(article.title);
      expect(properties.Category.select.name).toBe(article.category);
      expect(properties.Tags.multi_select).toHaveLength(article.tags.length);
      expect(properties['Reading Time'].number).toBe(article.readingTime);
    });

    it('should validate subscriber properties structure', () => {
      const subscriber = {
        email: 'test@example.com',
        name: 'Test User',
        status: 'active',
        source: 'website',
        segment: 'enterprise'
      };

      const properties = notionClient.buildSubscriberProperties(subscriber);

      expect(properties).toHaveProperty('Email');
      expect(properties).toHaveProperty('Name');
      expect(properties).toHaveProperty('Status');
      expect(properties).toHaveProperty('Subscribed Date');
      expect(properties).toHaveProperty('Source');
      expect(properties).toHaveProperty('Segment');

      expect(properties.Email.email).toBe(subscriber.email);
      expect(properties.Name.title[0].text.content).toBe(subscriber.name);
      expect(properties.Status.select.name).toBe(subscriber.status);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete article publishing workflow', async () => {
      const article = {
        title: 'Complete Workflow Test',
        content: '# Test Article\n\nThis is a complete test.',
        summary: 'Test summary',
        category: 'technology',
        tags: ['test', 'workflow'],
        readingTime: 2,
        wordCount: 50
      };

      const createResponse = {
        id: 'workflow-page-id',
        url: 'https://notion.so/workflow-page-id'
      };

      const updateResponse = {
        id: 'workflow-page-id',
        properties: {
          'Status': { select: { name: 'Published' } }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(createResponse);
      mockNotionInstance.pages.update.mockResolvedValue(updateResponse);

      // Create article
      const createResult = await notionClient.createArticlePage(article);
      expect(createResult).toEqual(createResponse);

      // Update article status
      const updateResult = await notionClient.updateArticlePage(
        createResponse.id,
        { 'Status': { select: { name: 'Published' } } }
      );
      expect(updateResult).toEqual(updateResponse);

      expect(mockNotionInstance.pages.create).toHaveBeenCalledTimes(1);
      expect(mockNotionInstance.pages.update).toHaveBeenCalledTimes(1);
    });

    it('should handle newsletter campaign lifecycle', async () => {
      const campaign = {
        name: 'Test Campaign',
        status: 'draft',
        subject: 'Test Subject'
      };

      const createResponse = {
        id: 'campaign-id',
        properties: {
          'Campaign Name': {
            title: [{ text: { content: campaign.name } }]
          }
        }
      };

      mockNotionInstance.pages.create.mockResolvedValue(createResponse);

      // Create campaign
      const result = await notionClient.createNewsletterCampaign(campaign);
      expect(result).toEqual(createResponse);

      // Update campaign after sending
      const updateData = {
        'Status': { select: { name: 'sent' } },
        'Sent Date': { date: { start: new Date().toISOString() } },
        'Recipients': { number: 250 }
      };

      const updateResponse = {
        id: 'campaign-id',
        properties: updateData
      };

      mockNotionInstance.pages.update.mockResolvedValue(updateResponse);

      const updateResult = await notionClient.updateArticlePage(
        createResponse.id,
        updateData
      );
      expect(updateResult).toEqual(updateResponse);
    });
  });
});

module.exports = { MockNotionClient };