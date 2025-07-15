import { describe, expect, it, jest } from '@jest/globals'
import {
  formatDate,
  cn,
  slugify,
  truncateText,
  getReadingTime,
  notionRichTextToPlainText,
  getInitials,
  getRandomItems
} from '../utils'

// Mock the clsx and tailwind-merge modules
jest.mock('clsx', () => ({
  clsx: jest.fn((...args) => args.filter(Boolean).join(' '))
}))

jest.mock('tailwind-merge', () => ({
  twMerge: jest.fn((str) => str)
}))

describe('Core Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date with default locale', () => {
      const date = '2024-01-15T10:30:00Z'
      const result = formatDate(date)
      expect(result).toMatch(/January 15, 2024|15 January 2024|Jan 15, 2024/)
    })

    it('should format date with custom locale', () => {
      const date = '2024-01-15T10:30:00Z'
      const result = formatDate(date, 'en-GB')
      expect(result).toMatch(/15 January 2024|15\/01\/2024/)
    })

    it('should handle invalid date strings', () => {
      expect(() => formatDate('invalid-date')).toThrow()
    })

    it('should handle empty date strings', () => {
      expect(() => formatDate('')).toThrow()
    })
  })

  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base', 'additional')
      expect(result).toBe('base additional')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden')
      expect(result).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toBe('base valid')
    })
  })

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Multi-Cloud Technologies')).toBe('multi-cloud-technologies')
      expect(slugify('DevOps & DevSecOps')).toBe('devops-devsecops')
    })

    it('should handle special characters', () => {
      expect(slugify('Hello! World? & More')).toBe('hello-world-more')
      expect(slugify('UK £ Price: $100')).toBe('uk-price-100')
    })

    it('should handle multiple spaces and dashes', () => {
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
      expect(slugify('Already-Has-Dashes')).toBe('already-has-dashes')
    })

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('')
      expect(slugify('   ')).toBe('')
    })
  })

  describe('truncateText', () => {
    it('should truncate text to specified length', () => {
      const text = 'This is a very long text that needs to be truncated'
      const result = truncateText(text, 20)
      expect(result).toBe('This is a very long...')
      expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
    })

    it('should not truncate text shorter than maxLength', () => {
      const text = 'Short text'
      const result = truncateText(text, 20)
      expect(result).toBe('Short text')
    })

    it('should handle empty strings', () => {
      expect(truncateText('', 10)).toBe('')
    })

    it('should handle maxLength of 0', () => {
      expect(truncateText('Some text', 0)).toBe('...')
    })
  })

  describe('getReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const text = 'This is a test text. '.repeat(50) // ~100 words
      const result = getReadingTime(text)
      expect(result).toBeWithinRange(1, 2) // Should be around 1 minute
    })

    it('should handle short text', () => {
      const text = 'Short text'
      const result = getReadingTime(text)
      expect(result).toBe(1) // Minimum 1 minute
    })

    it('should handle long text', () => {
      const text = 'This is a test text. '.repeat(500) // ~1000 words
      const result = getReadingTime(text)
      expect(result).toBeWithinRange(4, 6) // Should be around 5 minutes
    })

    it('should handle empty text', () => {
      expect(getReadingTime('')).toBe(1)
    })
  })

  describe('notionRichTextToPlainText', () => {
    it('should convert Notion rich text to plain text', () => {
      const richText = [
        {
          type: 'text',
          text: { content: 'Hello ' },
          plain_text: 'Hello ',
        },
        {
          type: 'text',
          text: { content: 'World' },
          plain_text: 'World',
          annotations: { bold: true },
        },
      ]
      const result = notionRichTextToPlainText(richText)
      expect(result).toBe('Hello World')
    })

    it('should handle empty rich text array', () => {
      expect(notionRichTextToPlainText([])).toBe('')
    })

    it('should handle null or undefined input', () => {
      expect(notionRichTextToPlainText(null)).toBe('')
      expect(notionRichTextToPlainText(undefined)).toBe('')
    })

    it('should handle rich text with mentions and links', () => {
      const richText = [
        {
          type: 'text',
          text: { content: 'Visit ' },
          plain_text: 'Visit ',
        },
        {
          type: 'text',
          text: { content: 'our website', link: { url: 'https://example.com' } },
          plain_text: 'our website',
        },
      ]
      const result = notionRichTextToPlainText(richText)
      expect(result).toBe('Visit our website')
    })
  })

  describe('getInitials', () => {
    it('should get initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Sarah Johnson')).toBe('SJ')
      expect(getInitials('Mary Jane Watson')).toBe('MJW')
    })

    it('should handle single names', () => {
      expect(getInitials('John')).toBe('J')
      expect(getInitials('Madonna')).toBe('M')
    })

    it('should handle names with extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD')
    })

    it('should handle empty names', () => {
      expect(getInitials('')).toBe('')
      expect(getInitials('   ')).toBe('')
    })

    it('should handle special characters in names', () => {
      expect(getInitials('Jean-Pierre')).toBe('J')
      expect(getInitials("O'Connor")).toBe('O')
    })
  })

  describe('getRandomItems', () => {
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    it('should return random items from array', () => {
      const result = getRandomItems(testArray, 3)
      expect(result).toHaveLength(3)
      expect(result.every(item => testArray.includes(item))).toBe(true)
    })

    it('should not return duplicate items', () => {
      const result = getRandomItems(testArray, 5)
      const uniqueItems = [...new Set(result)]
      expect(uniqueItems).toHaveLength(result.length)
    })

    it('should return all items if count equals array length', () => {
      const result = getRandomItems(testArray, testArray.length)
      expect(result).toHaveLength(testArray.length)
    })

    it('should return all items if count exceeds array length', () => {
      const result = getRandomItems(testArray, 15)
      expect(result).toHaveLength(testArray.length)
    })

    it('should handle empty array', () => {
      expect(getRandomItems([], 3)).toEqual([])
    })

    it('should handle count of 0', () => {
      expect(getRandomItems(testArray, 0)).toEqual([])
    })

    it('should handle negative count', () => {
      expect(getRandomItems(testArray, -1)).toEqual([])
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle various input types gracefully', () => {
      // Test with different input types
      expect(() => slugify(null as any)).toThrow()
      expect(() => slugify(undefined as any)).toThrow()
      expect(() => truncateText(null as any, 10)).toThrow()
      expect(() => getReadingTime(null as any)).toThrow()
    })

    it('should handle extreme values', () => {
      // Very long text
      const longText = 'word '.repeat(10000)
      expect(() => getReadingTime(longText)).not.toThrow()
      expect(() => truncateText(longText, 100)).not.toThrow()
      expect(() => slugify(longText)).not.toThrow()
    })

    it('should handle Unicode characters', () => {
      expect(slugify('Hello 世界')).toBe('hello-世界')
      expect(truncateText('Hello 世界 test', 10)).toBe('Hello 世界...')
      expect(getInitials('张 三')).toBe('张三')
    })
  })

  describe('Performance Tests', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i)
      const startTime = performance.now()
      const result = getRandomItems(largeArray, 100)
      const endTime = performance.now()
      
      expect(result).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in under 100ms
    })

    it('should handle very long text efficiently', () => {
      const longText = 'This is a test sentence. '.repeat(1000)
      const startTime = performance.now()
      const readingTime = getReadingTime(longText)
      const truncated = truncateText(longText, 100)
      const endTime = performance.now()
      
      expect(readingTime).toBeGreaterThan(0)
      expect(truncated).toHaveLength(103) // 100 + '...'
      expect(endTime - startTime).toBeLessThan(50) // Should complete in under 50ms
    })
  })
})