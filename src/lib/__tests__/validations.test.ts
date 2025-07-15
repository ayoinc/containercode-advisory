import { describe, expect, it } from '@jest/globals'
import { z } from 'zod'
import {
  contactFormSchema,
  newsletterSchema,
  loginSchema,
  assessmentSchema
} from '../validations'

describe('Form Validation Schemas', () => {
  describe('contactFormSchema', () => {
    const validContactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      service: 'Cloud Technologies',
      message: 'I am interested in your cloud services for our enterprise.',
      source: 'website'
    }

    it('should validate correct contact form data', () => {
      const result = contactFormSchema.safeParse(validContactData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validContactData)
      }
    })

    it('should require name field', () => {
      const invalidData = { ...validContactData, name: '' }
      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true)
      }
    })

    it('should validate email format', () => {
      const invalidData = { ...validContactData, email: 'invalid-email' }
      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
      }
    })

    it('should accept valid email formats', () => {
      const validEmails = [
        'user@example.com',
        'user+tag@example.co.uk',
        'user.name@example-domain.com',
        'test@containercode.co.uk'
      ]

      validEmails.forEach(email => {
        const data = { ...validContactData, email }
        const result = contactFormSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should require message field', () => {
      const invalidData = { ...validContactData, message: '' }
      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('message'))).toBe(true)
      }
    })

    it('should validate message length', () => {
      const shortMessage = { ...validContactData, message: 'Hi' }
      const result = contactFormSchema.safeParse(shortMessage)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('message'))).toBe(true)
      }
    })

    it('should handle optional fields', () => {
      const minimalData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message that meets the minimum length requirement.'
      }
      const result = contactFormSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })

    it('should sanitize input data', () => {
      const dataWithSpaces = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        service: '  Cloud Technologies  ',
        message: '  This is a test message.  '
      }
      const result = contactFormSchema.safeParse(dataWithSpaces)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.service).toBe('Cloud Technologies')
        expect(result.data.message).toBe('This is a test message.')
      }
    })
  })

  describe('newsletterSchema', () => {
    const validNewsletterData = {
      email: 'user@example.com',
      name: 'John Doe',
      source: 'footer'
    }

    it('should validate correct newsletter data', () => {
      const result = newsletterSchema.safeParse(validNewsletterData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validNewsletterData)
      }
    })

    it('should require email field', () => {
      const invalidData = { ...validNewsletterData, email: '' }
      const result = newsletterSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
      }
    })

    it('should validate email format', () => {
      const invalidEmails = [
        'invalid-email',
        'user@',
        '@example.com',
        'user..name@example.com',
        'user@.com'
      ]

      invalidEmails.forEach(email => {
        const data = { ...validNewsletterData, email }
        const result = newsletterSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should handle optional name field', () => {
      const dataWithoutName = {
        email: 'user@example.com',
        source: 'footer'
      }
      const result = newsletterSchema.safeParse(dataWithoutName)
      expect(result.success).toBe(true)
    })

    it('should handle different sources', () => {
      const sources = ['footer', 'header', 'popup', 'sidebar']
      sources.forEach(source => {
        const data = { ...validNewsletterData, source }
        const result = newsletterSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('loginSchema', () => {
    const validLoginData = {
      email: 'user@example.com',
      password: 'SecurePassword123!'
    }

    it('should validate correct login data', () => {
      const result = loginSchema.safeParse(validLoginData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validLoginData)
      }
    })

    it('should require email field', () => {
      const invalidData = { ...validLoginData, email: '' }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('email'))).toBe(true)
      }
    })

    it('should require password field', () => {
      const invalidData = { ...validLoginData, password: '' }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('password'))).toBe(true)
      }
    })

    it('should validate password length', () => {
      const shortPassword = { ...validLoginData, password: '123' }
      const result = loginSchema.safeParse(shortPassword)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('password'))).toBe(true)
      }
    })

    it('should handle different email formats', () => {
      const validEmails = [
        'user@example.com',
        'test+tag@domain.co.uk',
        'user.name@sub.domain.com'
      ]

      validEmails.forEach(email => {
        const data = { ...validLoginData, email }
        const result = loginSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('assessmentSchema', () => {
    const validAssessmentData = {
      companyName: 'Tech Corp',
      industry: 'Technology',
      employeeCount: '50-200',
      currentInfrastructure: 'On-premises',
      challenges: ['scalability', 'security'],
      budget: '10000-50000',
      timeline: '3-6 months',
      contactEmail: 'cto@techcorp.com',
      phone: '+44 20 7946 0958'
    }

    it('should validate correct assessment data', () => {
      const result = assessmentSchema.safeParse(validAssessmentData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validAssessmentData)
      }
    })

    it('should require company name', () => {
      const invalidData = { ...validAssessmentData, companyName: '' }
      const result = assessmentSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('companyName'))).toBe(true)
      }
    })

    it('should validate industry selection', () => {
      const validIndustries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail']
      validIndustries.forEach(industry => {
        const data = { ...validAssessmentData, industry }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should validate employee count ranges', () => {
      const validRanges = ['1-10', '11-50', '51-200', '201-500', '500+']
      validRanges.forEach(employeeCount => {
        const data = { ...validAssessmentData, employeeCount }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should validate challenges array', () => {
      const validChallenges = [
        ['scalability'],
        ['security', 'compliance'],
        ['cost-optimization', 'performance', 'scalability']
      ]
      
      validChallenges.forEach(challenges => {
        const data = { ...validAssessmentData, challenges }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should validate budget ranges', () => {
      const validBudgets = ['under-10000', '10000-50000', '50000-100000', '100000+']
      validBudgets.forEach(budget => {
        const data = { ...validAssessmentData, budget }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should validate timeline options', () => {
      const validTimelines = ['immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months']
      validTimelines.forEach(timeline => {
        const data = { ...validAssessmentData, timeline }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should validate contact email', () => {
      const invalidEmails = ['invalid', 'user@', '@domain.com']
      invalidEmails.forEach(contactEmail => {
        const data = { ...validAssessmentData, contactEmail }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should validate phone number format', () => {
      const validPhones = [
        '+44 20 7946 0958',
        '+1 (555) 123-4567',
        '+44 7700 900123',
        '020 7946 0958'
      ]

      validPhones.forEach(phone => {
        const data = { ...validAssessmentData, phone }
        const result = assessmentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should handle optional fields', () => {
      const minimalData = {
        companyName: 'Tech Corp',
        industry: 'Technology',
        employeeCount: '50-200',
        currentInfrastructure: 'On-premises',
        challenges: ['scalability'],
        budget: '10000-50000',
        timeline: '3-6 months',
        contactEmail: 'cto@techcorp.com'
      }
      const result = assessmentSchema.safeParse(minimalData)
      expect(result.success).toBe(true)
    })
  })

  describe('Schema Edge Cases', () => {
    it('should handle null and undefined values', () => {
      const schemas = [contactFormSchema, newsletterSchema, loginSchema, assessmentSchema]
      
      schemas.forEach(schema => {
        const nullResult = schema.safeParse(null)
        const undefinedResult = schema.safeParse(undefined)
        
        expect(nullResult.success).toBe(false)
        expect(undefinedResult.success).toBe(false)
      })
    })

    it('should handle empty objects', () => {
      const schemas = [contactFormSchema, newsletterSchema, loginSchema, assessmentSchema]
      
      schemas.forEach(schema => {
        const result = schema.safeParse({})
        expect(result.success).toBe(false)
      })
    })

    it('should handle malformed data types', () => {
      const malformedData = {
        name: 123,
        email: true,
        message: [],
        service: null
      }
      
      const result = contactFormSchema.safeParse(malformedData)
      expect(result.success).toBe(false)
    })
  })

  describe('Schema Transformation', () => {
    it('should transform and clean data', () => {
      const dirtyData = {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        service: '  Cloud Technologies  ',
        message: '  This is a test message.  '
      }
      
      const result = contactFormSchema.safeParse(dirtyData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.service).toBe('Cloud Technologies')
        expect(result.data.message).toBe('This is a test message.')
      }
    })
  })

  describe('Security Validation', () => {
    it('should prevent XSS in text fields', () => {
      const xssData = {
        name: '<script>alert("xss")</script>',
        email: 'user@example.com',
        message: 'This is a test message with <script>alert("xss")</script>'
      }
      
      const result = contactFormSchema.safeParse(xssData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.name).not.toContain('<script>')
        expect(result.data.message).not.toContain('<script>')
      }
    })

    it('should validate against SQL injection patterns', () => {
      const sqlInjectionData = {
        name: "'; DROP TABLE users; --",
        email: 'user@example.com',
        message: 'This is a test message with SQL injection attempt'
      }
      
      const result = contactFormSchema.safeParse(sqlInjectionData)
      expect(result.success).toBe(true)
      
      if (result.success) {
        expect(result.data.name).not.toContain('DROP TABLE')
        expect(result.data.name).not.toContain('--')
      }
    })
  })

  describe('Performance Tests', () => {
    it('should validate schemas quickly', () => {
      const testData = {
        name: 'John Doe',
        email: 'john@example.com',
        service: 'Cloud Technologies',
        message: 'This is a test message for performance testing.'
      }
      
      const startTime = performance.now()
      for (let i = 0; i < 1000; i++) {
        contactFormSchema.safeParse(testData)
      }
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should complete 1000 validations in under 100ms
    })
  })
})