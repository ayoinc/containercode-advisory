const { describe, expect, it, beforeEach, afterEach } = require('@jest/globals')
const { ContentGenerator } = require('../content-generator')

// Mock global fetch
global.fetch = require('jest').fn()

describe('ContentGenerator', () => {
  let contentGenerator
  let mockFetch

  beforeEach(() => {
    mockFetch = jest.fn()
    global.fetch = mockFetch
    contentGenerator = new ContentGenerator()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Constructor', () => {
    it('should initialize with default configuration', () => {
      expect(contentGenerator).toBeDefined()
      expect(contentGenerator.wordsPerMinute).toBe(200)
    })
  })

  describe('generateArticle', () => {
    it('should generate complete article structure', async () => {
      const mockEnv = {
        BRAVE_API_KEY: 'test-brave-key',
        DEEPSEEK_API_KEY: 'test-deepseek-key'
      }
      
      const mockTopic = {
        title: 'AI in Enterprise',
        description: 'How AI is transforming business',
        url: 'https://example.com/ai-enterprise'
      }
      
      // Mock BraveSearch response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          web: {
            results: [
              {
                title: 'AI Trends 2024',
                description: 'Latest AI developments in enterprise',
                url: 'https://example.com/ai-trends'
              }
            ]
          }
        })
      })
      
      // Mock DeepSeek response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'AI Transformation in Modern Enterprises',
                  content: 'Artificial intelligence is revolutionizing business operations across industries...',
                  summary: 'AI is transforming how businesses operate and make decisions.',
                  tags: ['ai', 'enterprise', 'transformation'],
                  category: 'technology'
                })
              }
            }
          ]
        })
      })
      
      const result = await contentGenerator.generateArticle(mockTopic, mockEnv)
      
      expect(result).toEqual(expect.objectContaining({
        title: expect.any(String),
        content: expect.any(String),
        summary: expect.any(String),
        tags: expect.any(Array),
        category: expect.any(String),
        slug: expect.any(String),
        readingTime: expect.any(Number),
        excerpt: expect.any(String)
      }))
    })

    it('should handle API failures gracefully', async () => {
      const mockEnv = {
        BRAVE_API_KEY: 'test-brave-key',
        DEEPSEEK_API_KEY: 'test-deepseek-key'
      }
      
      const mockTopic = {
        title: 'Test Topic',
        description: 'Test description',
        url: 'https://example.com/test'
      }
      
      mockFetch.mockRejectedValue(new Error('API Error'))
      
      const result = await contentGenerator.generateArticle(mockTopic, mockEnv)
      
      expect(result).toEqual(expect.objectContaining({
        title: 'Test Topic',
        content: expect.stringContaining('Test description'),
        summary: expect.any(String),
        tags: expect.any(Array),
        category: 'general'
      }))
    })
  })

  describe('researchWithBraveSearch', () => {
    it('should search for research data using Brave API', async () => {
      const mockResponse = {
        web: {
          results: [
            {
              title: 'Cloud Computing Best Practices',
              description: 'Modern cloud strategies for enterprises',
              url: 'https://example.com/cloud-practices'
            }
          ]
        }
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })
      
      const result = await contentGenerator.researchWithBraveSearch('cloud computing', 'test-api-key')
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('api.search.brave.com'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Subscription-Token': 'test-api-key'
          })
        })
      )
      
      expect(result).toEqual(mockResponse.web.results)
    })

    it('should handle search API errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Search API Error'))
      
      const result = await contentGenerator.researchWithBraveSearch('test query', 'test-api-key')
      
      expect(result).toEqual([])
    })

    it('should handle empty search results', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ web: { results: [] } })
      })
      
      const result = await contentGenerator.researchWithBraveSearch('test query', 'test-api-key')
      
      expect(result).toEqual([])
    })
  })

  describe('extractConsultingInsights', () => {
    it('should extract consulting insights from research data', () => {
      const mockData = [
        {
          title: 'Enterprise Cloud Migration Best Practices',
          description: 'Strategic approach to cloud migration for large enterprises',
          url: 'https://example.com/cloud-migration'
        },
        {
          title: 'Multi-Cloud Strategy Implementation',
          description: 'How to implement effective multi-cloud strategies',
          url: 'https://example.com/multi-cloud'
        }
      ]
      
      const result = contentGenerator.extractConsultingInsights(mockData)
      
      expect(result).toContain('Enterprise Cloud Migration')
      expect(result).toContain('Multi-Cloud Strategy')
      expect(result).toContain('Strategic approach')
      expect(result).toContain('effective multi-cloud')
    })

    it('should handle empty data', () => {
      const result = contentGenerator.extractConsultingInsights([])
      
      expect(result).toBe('No consulting insights available from current research.')
    })
  })

  describe('identifyTrends', () => {
    it('should identify trends from research data', () => {
      const mockData = [
        { title: 'AI Adoption Trends 2024', description: 'Growing AI adoption in enterprises' },
        { title: 'Cloud-First Strategy', description: 'Companies moving to cloud-first approaches' },
        { title: 'Zero Trust Security', description: 'Increasing focus on zero trust architecture' }
      ]
      
      const result = contentGenerator.identifyTrends(mockData)
      
      expect(result).toContain('AI Adoption')
      expect(result).toContain('Cloud-First')
      expect(result).toContain('Zero Trust')
    })

    it('should handle insufficient data', () => {
      const result = contentGenerator.identifyTrends([])
      
      expect(result).toBe('Current trends analysis shows emerging patterns in enterprise technology adoption.')
    })
  })

  describe('extractBestPractices', () => {
    it('should extract best practices from research data', () => {
      const mockData = [
        { title: 'DevOps Best Practices', description: 'Essential DevOps practices for teams' },
        { title: 'Security Best Practices', description: 'Key security practices for enterprises' }
      ]
      
      const result = contentGenerator.extractBestPractices(mockData)
      
      expect(result).toContain('DevOps Best Practices')
      expect(result).toContain('Security Best Practices')
    })

    it('should provide fallback best practices', () => {
      const result = contentGenerator.extractBestPractices([])
      
      expect(result).toContain('best practices')
      expect(result).toContain('enterprise')
    })
  })

  describe('generateSEOContent', () => {
    it('should generate SEO-optimized content', () => {
      const mockData = [
        { title: 'Cloud Computing Guide', description: 'Complete guide to cloud computing' }
      ]
      
      const result = contentGenerator.generateSEOContent('cloud computing', mockData)
      
      expect(result).toContain('cloud computing')
      expect(result.length).toBeGreaterThan(100)
    })

    it('should handle empty research data', () => {
      const result = contentGenerator.generateSEOContent('test topic', [])
      
      expect(result).toContain('test topic')
      expect(result.length).toBeGreaterThan(50)
    })
  })

  describe('generateSummary', () => {
    it('should generate article summary', () => {
      const content = 'This is a comprehensive article about cloud computing. It covers various aspects including benefits, challenges, and best practices. The article provides detailed insights into enterprise adoption patterns and future trends in cloud technology.'
      
      const result = contentGenerator.generateSummary(content)
      
      expect(result).toContain('cloud computing')
      expect(result.length).toBeLessThan(content.length)
      expect(result.length).toBeGreaterThan(20)
    })

    it('should handle short content', () => {
      const content = 'Short content.'
      
      const result = contentGenerator.generateSummary(content)
      
      expect(result).toBe(content)
    })
  })

  describe('generateExcerpt', () => {
    it('should generate excerpt from content', () => {
      const content = 'This is a long article about technology trends. It discusses various innovations and their impact on business operations. The article covers multiple aspects of digital transformation.'
      
      const result = contentGenerator.generateExcerpt(content)
      
      expect(result).toContain('This is a long article')
      expect(result.length).toBeLessThanOrEqual(153) // 150 + '...'
    })

    it('should handle short content', () => {
      const content = 'Short content'
      
      const result = contentGenerator.generateExcerpt(content)
      
      expect(result).toBe(content)
    })
  })

  describe('extractTags', () => {
    it('should extract relevant tags from content', () => {
      const content = 'This article discusses cloud computing, artificial intelligence, and cybersecurity best practices for enterprise environments.'
      
      const result = contentGenerator.extractTags(content)
      
      expect(result).toContain('cloud')
      expect(result).toContain('ai')
      expect(result).toContain('security')
      expect(result).toContain('enterprise')
    })

    it('should limit number of tags', () => {
      const content = 'cloud computing artificial intelligence machine learning cybersecurity devops digital transformation enterprise software development'
      
      const result = contentGenerator.extractTags(content)
      
      expect(result.length).toBeLessThanOrEqual(8)
    })

    it('should handle empty content', () => {
      const result = contentGenerator.extractTags('')
      
      expect(result).toEqual(['general', 'technology'])
    })
  })

  describe('generateSlug', () => {
    it('should generate URL-friendly slugs', () => {
      const testCases = [
        { input: 'AI and Machine Learning', expected: 'ai-and-machine-learning' },
        { input: 'Multi-Cloud Strategies', expected: 'multi-cloud-strategies' },
        { input: 'DevOps & CI/CD', expected: 'devops-ci-cd' }
      ]
      
      testCases.forEach(({ input, expected }) => {
        const result = contentGenerator.generateSlug(input)
        expect(result).toBe(expected)
      })
    })

    it('should handle special characters', () => {
      const result = contentGenerator.generateSlug('Hello! World? & More')
      expect(result).toBe('hello-world-more')
    })

    it('should handle empty strings', () => {
      const result = contentGenerator.generateSlug('')
      expect(result).toBe('')
    })
  })

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const content = 'This is a test content. '.repeat(100) // ~300 words
      
      const result = contentGenerator.calculateReadingTime(content)
      
      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThan(10)
    })

    it('should handle short content', () => {
      const content = 'Short content'
      
      const result = contentGenerator.calculateReadingTime(content)
      
      expect(result).toBe(1)
    })

    it('should handle empty content', () => {
      const result = contentGenerator.calculateReadingTime('')
      
      expect(result).toBe(1)
    })
  })

  describe('countWords', () => {
    it('should count words correctly', () => {
      const content = 'This is a test sentence with multiple words.'
      
      const result = contentGenerator.countWords(content)
      
      expect(result).toBe(9)
    })

    it('should handle empty content', () => {
      const result = contentGenerator.countWords('')
      
      expect(result).toBe(0)
    })

    it('should handle content with multiple spaces', () => {
      const content = 'This   is   a   test   sentence.'
      
      const result = contentGenerator.countWords(content)
      
      expect(result).toBe(5)
    })

    it('should handle content with line breaks', () => {
      const content = 'This is a test\nsentence with\nline breaks.'
      
      const result = contentGenerator.countWords(content)
      
      expect(result).toBe(8)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const mockEnv = {
        BRAVE_API_KEY: 'test-brave-key',
        DEEPSEEK_API_KEY: 'test-deepseek-key'
      }
      
      const mockTopic = {
        title: 'Test Topic',
        description: 'Test description',
        url: 'https://example.com/test'
      }
      
      mockFetch.mockRejectedValue(new Error('Network error'))
      
      const result = await contentGenerator.generateArticle(mockTopic, mockEnv)
      
      expect(result).toBeDefined()
      expect(result.title).toBe('Test Topic')
    })

    it('should handle malformed API responses', async () => {
      const mockEnv = {
        BRAVE_API_KEY: 'test-brave-key',
        DEEPSEEK_API_KEY: 'test-deepseek-key'
      }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => null
      })
      
      const result = await contentGenerator.researchWithBraveSearch('test query', mockEnv.BRAVE_API_KEY)
      
      expect(result).toEqual([])
    })
  })

  describe('Content Quality', () => {
    it('should generate appropriate content length', () => {
      const content = 'This is a test content. '.repeat(200) // ~600 words
      
      const summary = contentGenerator.generateSummary(content)
      const excerpt = contentGenerator.generateExcerpt(content)
      
      expect(summary.length).toBeLessThan(content.length)
      expect(excerpt.length).toBeLessThan(content.length)
      expect(summary.length).toBeGreaterThan(50)
    })

    it('should extract meaningful tags', () => {
      const content = 'This comprehensive guide covers cloud computing, artificial intelligence, and cybersecurity best practices for modern enterprises seeking digital transformation.'
      
      const tags = contentGenerator.extractTags(content)
      
      expect(tags).toContain('cloud')
      expect(tags).toContain('ai')
      expect(tags).toContain('security')
      expect(tags).toContain('enterprise')
      expect(tags).toContain('digital')
    })

    it('should generate valid slugs', () => {
      const titles = [
        'AI and Machine Learning in Enterprise',
        'Multi-Cloud Strategy Implementation',
        'DevOps & CI/CD Best Practices'
      ]
      
      titles.forEach(title => {
        const slug = contentGenerator.generateSlug(title)
        expect(slug).toMatch(/^[a-z0-9-]+$/)
        expect(slug).not.toContain(' ')
        expect(slug).not.toStartWith('-')
        expect(slug).not.toEndWith('-')
      })
    })
  })

  describe('Performance', () => {
    it('should process large content efficiently', () => {
      const largeContent = 'This is a test sentence. '.repeat(1000) // ~5000 words
      
      const startTime = performance.now()
      const summary = contentGenerator.generateSummary(largeContent)
      const excerpt = contentGenerator.generateExcerpt(largeContent)
      const tags = contentGenerator.extractTags(largeContent)
      const readingTime = contentGenerator.calculateReadingTime(largeContent)
      const wordCount = contentGenerator.countWords(largeContent)
      const endTime = performance.now()
      
      expect(summary).toBeDefined()
      expect(excerpt).toBeDefined()
      expect(tags).toBeDefined()
      expect(readingTime).toBeGreaterThan(0)
      expect(wordCount).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(500) // Should complete in under 500ms
    })
  })
})