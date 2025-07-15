import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals'
import { NewsletterAutomationSystem } from '../newsletter-automation'

// Mock external dependencies
jest.mock('fs/promises')
jest.mock('path')

// Mock environment variables
const mockEnv = {
  BRAVE_API_KEY: 'test-brave-key',
  DEEPSEEK_API_KEY: 'test-deepseek-key',
  NOTION_TOKEN: 'test-notion-token',
  RESEND_API_KEY: 'test-resend-key'
}

describe('NewsletterAutomationSystem', () => {
  let automationSystem: NewsletterAutomationSystem
  let mockFetch: jest.MockedFunction<typeof fetch>

  beforeEach(() => {
    // Mock fetch globally
    mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>
    global.fetch = mockFetch
    
    // Mock environment variables
    Object.assign(process.env, mockEnv)
    
    automationSystem = new NewsletterAutomationSystem()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Constructor and Initialization', () => {
    it('should initialize with default configuration', () => {
      expect(automationSystem).toBeDefined()
      expect(automationSystem.topics).toBeDefined()
      expect(automationSystem.topics.length).toBeGreaterThan(0)
    })

    it('should have predefined topics', () => {
      const expectedTopics = [
        'AI and Machine Learning',
        'Cloud Computing',
        'Cybersecurity',
        'DevOps and CI/CD',
        'Digital Transformation'
      ]
      
      expectedTopics.forEach(topic => {
        expect(automationSystem.topics.some(t => t.includes(topic.split(' ')[0]))).toBe(true)
      })
    })
  })

  describe('categorizeTopic', () => {
    it('should categorize AI topics correctly', () => {
      const aiTopics = [
        'Machine Learning in Enterprise',
        'Artificial Intelligence Trends',
        'Deep Learning Applications'
      ]
      
      aiTopics.forEach(topic => {
        const category = automationSystem.categorizeTopic(topic)
        expect(category).toBe('ai')
      })
    })

    it('should categorize cloud topics correctly', () => {
      const cloudTopics = [
        'Multi-Cloud Strategies',
        'AWS Best Practices',
        'Azure Migration',
        'Google Cloud Platform'
      ]
      
      cloudTopics.forEach(topic => {
        const category = automationSystem.categorizeTopic(topic)
        expect(category).toBe('cloud')
      })
    })

    it('should categorize security topics correctly', () => {
      const securityTopics = [
        'Cybersecurity Frameworks',
        'Zero Trust Architecture',
        'Data Protection Strategies'
      ]
      
      securityTopics.forEach(topic => {
        const category = automationSystem.categorizeTopic(topic)
        expect(category).toBe('security')
      })
    })

    it('should default to general category for unknown topics', () => {
      const unknownTopics = [
        'Project Management',
        'Team Building',
        'Marketing Strategies'
      ]
      
      unknownTopics.forEach(topic => {
        const category = automationSystem.categorizeTopic(topic)
        expect(category).toBe('general')
      })
    })
  })

  describe('generateSlug', () => {
    it('should generate URL-friendly slugs', () => {
      const testCases = [
        { input: 'AI and Machine Learning', expected: 'ai-and-machine-learning' },
        { input: 'Multi-Cloud Strategies', expected: 'multi-cloud-strategies' },
        { input: 'DevOps & CI/CD Best Practices', expected: 'devops-ci-cd-best-practices' },
        { input: 'Zero Trust Architecture', expected: 'zero-trust-architecture' }
      ]
      
      testCases.forEach(({ input, expected }) => {
        const result = automationSystem.generateSlug(input)
        expect(result).toBe(expected)
      })
    })

    it('should handle special characters and spaces', () => {
      const result = automationSystem.generateSlug('Hello! World? & More')
      expect(result).toBe('hello-world-more')
    })

    it('should handle empty strings', () => {
      const result = automationSystem.generateSlug('')
      expect(result).toBe('')
    })
  })

  describe('searchTrendingTopics', () => {
    it('should search for trending topics using Brave API', async () => {
      const mockResponse = {
        web: {
          results: [
            {
              title: 'AI Trends 2024',
              description: 'Latest AI trends in enterprise',
              url: 'https://example.com/ai-trends'
            },
            {
              title: 'Cloud Computing Best Practices',
              description: 'Modern cloud strategies',
              url: 'https://example.com/cloud-best-practices'
            }
          ]
        }
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response)
      
      const result = await automationSystem.searchTrendingTopics()
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('api.search.brave.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Subscription-Token': mockEnv.BRAVE_API_KEY
          })
        })
      )
      
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(expect.objectContaining({
        title: 'AI Trends 2024',
        description: 'Latest AI trends in enterprise',
        url: 'https://example.com/ai-trends'
      }))
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'))
      
      const result = await automationSystem.searchTrendingTopics()
      
      expect(result).toEqual([])
    })

    it('should handle empty search results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ web: { results: [] } })
      } as Response)
      
      const result = await automationSystem.searchTrendingTopics()
      
      expect(result).toEqual([])
    })
  })

  describe('generateArticles', () => {
    it('should generate articles using DeepSeek API', async () => {
      const mockResearchData = [
        {
          title: 'AI in Enterprise',
          description: 'How AI is transforming business',
          url: 'https://example.com/ai-enterprise'
        }
      ]
      
      const mockDeepSeekResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: 'AI Transformation in Modern Enterprises',
                content: 'Artificial intelligence is revolutionizing...',
                summary: 'AI is transforming business operations...',
                tags: ['ai', 'enterprise', 'transformation'],
                category: 'ai'
              })
            }
          }
        ]
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockDeepSeekResponse
      } as Response)
      
      const result = await automationSystem.generateArticles(mockResearchData)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.deepseek.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${mockEnv.DEEPSEEK_API_KEY}`
          })
        })
      )
      
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(expect.objectContaining({
        title: 'AI Transformation in Modern Enterprises',
        content: expect.stringContaining('Artificial intelligence'),
        summary: expect.stringContaining('AI is transforming'),
        tags: expect.arrayContaining(['ai', 'enterprise', 'transformation']),
        category: 'ai'
      }))
    })

    it('should handle invalid JSON responses', async () => {
      const mockResearchData = [
        {
          title: 'Test Article',
          description: 'Test description',
          url: 'https://example.com/test'
        }
      ]
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: 'Invalid JSON response'
              }
            }
          ]
        })
      } as Response)
      
      const result = await automationSystem.generateArticles(mockResearchData)
      
      expect(result).toEqual([])
    })

    it('should handle API failures', async () => {
      const mockResearchData = [
        {
          title: 'Test Article',
          description: 'Test description',
          url: 'https://example.com/test'
        }
      ]
      
      mockFetch.mockRejectedValueOnce(new Error('DeepSeek API Error'))
      
      const result = await automationSystem.generateArticles(mockResearchData)
      
      expect(result).toEqual([])
    })
  })

  describe('createResearchSummary', () => {
    it('should create research summary from data', () => {
      const mockData = [
        {
          title: 'AI Trends 2024',
          description: 'Latest AI developments',
          url: 'https://example.com/ai-trends'
        },
        {
          title: 'Cloud Computing Evolution',
          description: 'How cloud is evolving',
          url: 'https://example.com/cloud-evolution'
        }
      ]
      
      const result = automationSystem.createResearchSummary(mockData)
      
      expect(result).toContain('AI Trends 2024')
      expect(result).toContain('Cloud Computing Evolution')
      expect(result).toContain('Latest AI developments')
      expect(result).toContain('How cloud is evolving')
    })

    it('should handle empty data', () => {
      const result = automationSystem.createResearchSummary([])
      
      expect(result).toBe('No research data available.')
    })
  })

  describe('mapCategoryToImageCategory', () => {
    it('should map categories to image categories', () => {
      const mappings = [
        { input: 'ai', expected: 'technology' },
        { input: 'cloud', expected: 'business' },
        { input: 'security', expected: 'security' },
        { input: 'devops', expected: 'technology' },
        { input: 'unknown', expected: 'business' }
      ]
      
      mappings.forEach(({ input, expected }) => {
        const result = automationSystem.mapCategoryToImageCategory(input)
        expect(result).toBe(expected)
      })
    })
  })

  describe('generateNewsletterContent', () => {
    it('should generate complete newsletter content', async () => {
      // Mock search results
      const mockSearchResults = [
        {
          title: 'AI Trends 2024',
          description: 'Latest AI developments',
          url: 'https://example.com/ai-trends'
        }
      ]
      
      // Mock article generation
      const mockArticles = [
        {
          title: 'AI Transformation in Modern Enterprises',
          content: 'Artificial intelligence is revolutionizing business operations...',
          summary: 'AI is transforming how businesses operate...',
          tags: ['ai', 'enterprise', 'transformation'],
          category: 'ai',
          slug: 'ai-transformation-modern-enterprises',
          readingTime: 5,
          excerpt: 'AI is transforming business operations...'
        }
      ]
      
      // Mock API responses
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ web: { results: mockSearchResults } })
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify(mockArticles[0])
                }
              }
            ]
          })
        } as Response)
      
      const result = await automationSystem.generateNewsletterContent()
      
      expect(result).toEqual(expect.objectContaining({
        articles: expect.arrayContaining([
          expect.objectContaining({
            title: 'AI Transformation in Modern Enterprises',
            content: expect.stringContaining('Artificial intelligence'),
            category: 'ai'
          })
        ]),
        metadata: expect.objectContaining({
          generated_at: expect.any(String),
          total_articles: 1,
          categories: expect.arrayContaining(['ai'])
        })
      }))
    })

    it('should handle complete failure gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Complete API failure'))
      
      const result = await automationSystem.generateNewsletterContent()
      
      expect(result).toEqual(expect.objectContaining({
        articles: [],
        metadata: expect.objectContaining({
          total_articles: 0,
          categories: []
        })
      }))
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))
      
      const result = await automationSystem.searchTrendingTopics()
      
      expect(result).toEqual([])
    })

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValue(new Error('Timeout'))
      
      const result = await automationSystem.generateArticles([])
      
      expect(result).toEqual([])
    })

    it('should handle rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      } as Response)
      
      const result = await automationSystem.searchTrendingTopics()
      
      expect(result).toEqual([])
    })
  })

  describe('Data Validation', () => {
    it('should validate article structure', () => {
      const invalidArticle = {
        title: '',
        content: 'Some content',
        summary: 'Summary'
      }
      
      // Test that the system handles invalid data appropriately
      expect(() => automationSystem.generateSlug(invalidArticle.title)).not.toThrow()
    })

    it('should handle malformed API responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      } as Response)
      
      const result = await automationSystem.searchTrendingTopics()
      
      expect(result).toEqual([])
    })
  })

  describe('Performance', () => {
    it('should complete operations within reasonable time', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ web: { results: [] } })
      } as Response)
      
      const startTime = performance.now()
      await automationSystem.searchTrendingTopics()
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(5000) // Should complete in under 5 seconds
    })

    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        title: `Article ${i}`,
        description: `Description ${i}`,
        url: `https://example.com/article-${i}`
      }))
      
      const startTime = performance.now()
      const result = automationSystem.createResearchSummary(largeDataset)
      const endTime = performance.now()
      
      expect(result).toBeDefined()
      expect(endTime - startTime).toBeLessThan(1000) // Should complete in under 1 second
    })
  })

  describe('Content Quality', () => {
    it('should generate appropriate content for different categories', () => {
      const categories = ['ai', 'cloud', 'security', 'devops', 'general']
      
      categories.forEach(category => {
        const imageCategory = automationSystem.mapCategoryToImageCategory(category)
        expect(imageCategory).toBeDefined()
        expect(typeof imageCategory).toBe('string')
      })
    })

    it('should create valid slugs for all topics', () => {
      automationSystem.topics.forEach(topic => {
        const slug = automationSystem.generateSlug(topic)
        expect(slug).toMatch(/^[a-z0-9-]+$/)
        expect(slug).not.toContain(' ')
        expect(slug).not.toStartWith('-')
        expect(slug).not.toEndWith('-')
      })
    })
  })
})