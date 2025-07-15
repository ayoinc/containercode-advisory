/**
 * DeepSeek AI Processor Worker
 * Specialized worker for handling DeepSeek AI requests with extended timeout support
 * Implements circuit breaker pattern and intelligent retry logic
 */

import { JobState } from '../durable-objects/job-state.js';
import { RateLimiter } from '../durable-objects/rate-limiter.js';

export class DeepSeekProcessor {
  constructor(env) {
    this.env = env;
    this.db = env.DB;
    this.deepseekApiKey = env.DEEPSEEK_API_KEY;
    this.maxTimeout = 180000; // 3 minutes for DeepSeek processing
    this.circuitBreaker = new CircuitBreaker(env);
    this.rateLimiter = new DeepSeekRateLimiter(env);
  }

  /**
   * Process DeepSeek AI requests with extended timeout support
   */
  async processRequest(messageData) {
    const { jobId, type, payload } = messageData;
    
    // Get job state
    const jobState = this.env.JOB_STATE.get(
      this.env.JOB_STATE.idFromName(jobId)
    );
    
    try {
      await jobState.updateStatus('processing', {
        message: 'Starting DeepSeek AI processing',
        startTime: Date.now()
      });
      
      // Check rate limiting
      const rateLimitResult = await this.rateLimiter.checkLimit();
      if (!rateLimitResult.allowed) {
        await jobState.updateStatus('rate_limited', {
          message: `Rate limited. Retry after ${rateLimitResult.retryAfter}s`,
          retryAfter: rateLimitResult.retryAfter
        });
        return { status: 'rate_limited', retryAfter: rateLimitResult.retryAfter };
      }
      
      // Process based on type
      let result;
      switch (type) {
        case 'article_generation':
          result = await this.generateArticle(payload, jobState);
          break;
        case 'content_enhancement':
          result = await this.enhanceContent(payload, jobState);
          break;
        case 'content_analysis':
          result = await this.analyzeContent(payload, jobState);
          break;
        case 'newsletter_generation':
          result = await this.generateNewsletter(payload, jobState);
          break;
        default:
          throw new Error(`Unknown DeepSeek processing type: ${type}`);
      }
      
      await jobState.updateStatus('completed', {
        message: 'DeepSeek processing completed successfully',
        endTime: Date.now(),
        result
      });
      
      return result;
      
    } catch (error) {
      await jobState.updateStatus('failed', {
        message: `DeepSeek processing failed: ${error.message}`,
        endTime: Date.now(),
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Generate article using DeepSeek AI
   */
  async generateArticle(payload, jobState) {
    const { topic, researchData, targetAudience = 'enterprise', wordCount = 1000 } = payload;
    
    await jobState.updateProgress(10, 'Preparing article generation request');
    
    // Prepare comprehensive prompt
    const prompt = this.buildArticlePrompt(topic, researchData, targetAudience, wordCount);
    
    await jobState.updateProgress(20, 'Sending request to DeepSeek API');
    
    // Make API request with circuit breaker
    const apiResponse = await this.circuitBreaker.execute(async () => {
      return await this.makeDeepSeekRequest(prompt, {
        temperature: 0.7,
        max_tokens: Math.min(4000, wordCount * 2),
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });
    });
    
    await jobState.updateProgress(60, 'Processing DeepSeek response');
    
    // Parse and validate response
    const article = this.parseArticleResponse(apiResponse);
    
    await jobState.updateProgress(80, 'Validating generated content');
    
    // Validate and enhance content
    const validatedArticle = await this.validateAndEnhanceArticle(article, topic);
    
    await jobState.updateProgress(100, 'Article generation completed');
    
    return validatedArticle;
  }

  /**
   * Enhance existing content using DeepSeek AI
   */
  async enhanceContent(payload, jobState) {
    const { content, enhancementType = 'quality', targetAudience = 'enterprise' } = payload;
    
    await jobState.updateProgress(10, 'Preparing content enhancement request');
    
    const prompt = this.buildEnhancementPrompt(content, enhancementType, targetAudience);
    
    await jobState.updateProgress(30, 'Sending enhancement request to DeepSeek API');
    
    const apiResponse = await this.circuitBreaker.execute(async () => {
      return await this.makeDeepSeekRequest(prompt, {
        temperature: 0.6,
        max_tokens: 2000,
        top_p: 0.8
      });
    });
    
    await jobState.updateProgress(80, 'Processing enhanced content');
    
    const enhancedContent = this.parseEnhancementResponse(apiResponse);
    
    await jobState.updateProgress(100, 'Content enhancement completed');
    
    return enhancedContent;
  }

  /**
   * Analyze content using DeepSeek AI
   */
  async analyzeContent(payload, jobState) {
    const { content, analysisType = 'comprehensive' } = payload;
    
    await jobState.updateProgress(20, 'Preparing content analysis request');
    
    const prompt = this.buildAnalysisPrompt(content, analysisType);
    
    await jobState.updateProgress(40, 'Sending analysis request to DeepSeek API');
    
    const apiResponse = await this.circuitBreaker.execute(async () => {
      return await this.makeDeepSeekRequest(prompt, {
        temperature: 0.3,
        max_tokens: 1500,
        top_p: 0.7
      });
    });
    
    await jobState.updateProgress(80, 'Processing analysis results');
    
    const analysis = this.parseAnalysisResponse(apiResponse);
    
    await jobState.updateProgress(100, 'Content analysis completed');
    
    return analysis;
  }

  /**
   * Generate newsletter using DeepSeek AI
   */
  async generateNewsletter(payload, jobState) {
    const { articles, theme, audience = 'enterprise' } = payload;
    
    await jobState.updateProgress(15, 'Preparing newsletter generation request');
    
    const prompt = this.buildNewsletterPrompt(articles, theme, audience);
    
    await jobState.updateProgress(30, 'Sending newsletter request to DeepSeek API');
    
    const apiResponse = await this.circuitBreaker.execute(async () => {
      return await this.makeDeepSeekRequest(prompt, {
        temperature: 0.8,
        max_tokens: 3000,
        top_p: 0.9
      });
    });
    
    await jobState.updateProgress(70, 'Processing newsletter content');
    
    const newsletter = this.parseNewsletterResponse(apiResponse);
    
    await jobState.updateProgress(100, 'Newsletter generation completed');
    
    return newsletter;
  }

  /**
   * Make request to DeepSeek API with timeout and error handling
   */
  async makeDeepSeekRequest(prompt, options = {}) {
    const requestPayload = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a professional UK-based technology consultant specializing in enterprise solutions. Always use British English and maintain a professional, authoritative tone.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: false,
      ...options
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.maxTimeout);
    
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`DeepSeek API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from DeepSeek API');
      }
      
      return data.choices[0].message.content;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('DeepSeek API request timed out after 3 minutes');
      }
      
      throw error;
    }
  }

  /**
   * Build article generation prompt
   */
  buildArticlePrompt(topic, researchData, targetAudience, wordCount) {
    const researchSummary = researchData.map(item => 
      `- ${item.title}: ${item.description}`
    ).join('\n');
    
    return `
Generate a comprehensive, professional article on "${topic}" for ${targetAudience} audience.

Research Context:
${researchSummary}

Requirements:
- Target length: ${wordCount} words
- Use British English spelling and terminology
- Maintain professional, authoritative tone
- Include practical insights and actionable recommendations
- Structure with clear headings and subheadings
- Include relevant examples and case studies where appropriate
- Ensure content is engaging yet informative

Format the response as a JSON object with the following structure:
{
  "title": "Article title",
  "content": "Full article content with proper formatting",
  "summary": "Brief summary (100-150 words)",
  "tags": ["relevant", "tags", "for", "article"],
  "category": "primary category",
  "readingTime": estimated_reading_time_in_minutes,
  "keyPoints": ["key", "takeaways", "from", "article"],
  "callToAction": "Suggested call-to-action for readers"
}

Ensure all content is original, well-researched, and provides genuine value to enterprise decision-makers.
`;
  }

  /**
   * Build content enhancement prompt
   */
  buildEnhancementPrompt(content, enhancementType, targetAudience) {
    const enhancements = {
      quality: 'Improve clarity, flow, and professional tone',
      seo: 'Optimize for search engines while maintaining readability',
      engagement: 'Make more engaging and compelling for readers',
      brevity: 'Make more concise while retaining key information',
      technical: 'Add more technical depth and expertise',
      accessibility: 'Improve accessibility and readability for wider audience'
    };
    
    return `
Enhance the following content with focus on: ${enhancements[enhancementType]}

Target Audience: ${targetAudience}

Original Content:
${content}

Requirements:
- Maintain British English throughout
- Preserve original meaning and intent
- Improve ${enhancementType} aspects specifically
- Ensure professional tone appropriate for enterprise audience
- Keep enhancements natural and seamless

Return the enhanced content as a JSON object:
{
  "enhancedContent": "The improved content",
  "improvements": ["list", "of", "specific", "improvements", "made"],
  "qualityScore": numerical_score_1_to_10,
  "suggestions": ["additional", "suggestions", "for", "further", "improvement"]
}
`;
  }

  /**
   * Build analysis prompt
   */
  buildAnalysisPrompt(content, analysisType) {
    const analysisTypes = {
      comprehensive: 'Provide comprehensive analysis covering all aspects',
      seo: 'Focus on SEO optimization opportunities',
      readability: 'Analyze readability and accessibility',
      engagement: 'Evaluate engagement potential and improvements',
      technical: 'Assess technical accuracy and depth',
      competitive: 'Analyze competitive positioning and differentiation'
    };
    
    return `
Analyze the following content with focus on: ${analysisTypes[analysisType]}

Content to Analyze:
${content}

Provide detailed analysis as a JSON object:
{
  "overallScore": numerical_score_1_to_10,
  "strengths": ["identified", "strengths"],
  "weaknesses": ["identified", "weaknesses"],
  "recommendations": ["specific", "improvement", "recommendations"],
  "keyInsights": ["important", "insights", "from", "analysis"],
  "competitiveAdvantage": "How this content provides competitive advantage",
  "targetAudienceAlignment": "How well content aligns with target audience"
}

Focus on actionable insights that can improve content performance and business impact.
`;
  }

  /**
   * Build newsletter prompt
   */
  buildNewsletterPrompt(articles, theme, audience) {
    const articleSummaries = articles.map(article => 
      `- ${article.title}: ${article.summary}`
    ).join('\n');
    
    return `
Create a professional newsletter based on these articles:

Articles:
${articleSummaries}

Theme: ${theme}
Target Audience: ${audience}

Requirements:
- Professional, engaging tone appropriate for business leaders
- British English throughout
- Include compelling subject line
- Structure with clear sections
- Include brief introduction and conclusion
- Add relevant call-to-action
- Maintain consistent branding voice

Format as JSON:
{
  "subject": "Newsletter subject line",
  "introduction": "Engaging introduction paragraph",
  "sections": [
    {
      "title": "Section title",
      "content": "Section content",
      "articles": ["related", "article", "ids"]
    }
  ],
  "conclusion": "Concluding paragraph",
  "callToAction": "Primary call-to-action",
  "additionalResources": ["relevant", "resources", "or", "links"]
}
`;
  }

  /**
   * Parse article response
   */
  parseArticleResponse(response) {
    try {
      const parsed = JSON.parse(response);
      
      // Validate required fields
      if (!parsed.title || !parsed.content) {
        throw new Error('Invalid article structure');
      }
      
      return {
        title: parsed.title,
        content: parsed.content,
        summary: parsed.summary || '',
        tags: parsed.tags || [],
        category: parsed.category || 'general',
        readingTime: parsed.readingTime || this.calculateReadingTime(parsed.content),
        keyPoints: parsed.keyPoints || [],
        callToAction: parsed.callToAction || '',
        slug: this.generateSlug(parsed.title),
        excerpt: this.generateExcerpt(parsed.content)
      };
    } catch (error) {
      throw new Error(`Failed to parse article response: ${error.message}`);
    }
  }

  /**
   * Parse enhancement response
   */
  parseEnhancementResponse(response) {
    try {
      const parsed = JSON.parse(response);
      
      return {
        enhancedContent: parsed.enhancedContent,
        improvements: parsed.improvements || [],
        qualityScore: parsed.qualityScore || 0,
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      throw new Error(`Failed to parse enhancement response: ${error.message}`);
    }
  }

  /**
   * Parse analysis response
   */
  parseAnalysisResponse(response) {
    try {
      const parsed = JSON.parse(response);
      
      return {
        overallScore: parsed.overallScore || 0,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || [],
        recommendations: parsed.recommendations || [],
        keyInsights: parsed.keyInsights || [],
        competitiveAdvantage: parsed.competitiveAdvantage || '',
        targetAudienceAlignment: parsed.targetAudienceAlignment || ''
      };
    } catch (error) {
      throw new Error(`Failed to parse analysis response: ${error.message}`);
    }
  }

  /**
   * Parse newsletter response
   */
  parseNewsletterResponse(response) {
    try {
      const parsed = JSON.parse(response);
      
      return {
        subject: parsed.subject,
        introduction: parsed.introduction || '',
        sections: parsed.sections || [],
        conclusion: parsed.conclusion || '',
        callToAction: parsed.callToAction || '',
        additionalResources: parsed.additionalResources || []
      };
    } catch (error) {
      throw new Error(`Failed to parse newsletter response: ${error.message}`);
    }
  }

  /**
   * Validate and enhance article
   */
  async validateAndEnhanceArticle(article, topic) {
    // British English validation
    article.content = this.convertToBritishEnglish(article.content);
    
    // Ensure professional tone
    if (this.containsCasualLanguage(article.content)) {
      article.content = await this.enhanceContent({
        content: article.content,
        enhancementType: 'quality',
        targetAudience: 'enterprise'
      }).then(result => result.enhancedContent);
    }
    
    // Generate additional metadata
    if (!article.slug) {
      article.slug = this.generateSlug(article.title);
    }
    
    if (!article.excerpt) {
      article.excerpt = this.generateExcerpt(article.content);
    }
    
    return article;
  }

  /**
   * Utility methods
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  generateExcerpt(content, maxLength = 150) {
    const cleaned = content.replace(/[#*`]/g, '').substring(0, maxLength);
    return cleaned.length === maxLength ? cleaned + '...' : cleaned;
  }

  convertToBritishEnglish(text) {
    const conversions = {
      'color': 'colour',
      'favor': 'favour',
      'realize': 'realise',
      'organized': 'organised',
      'center': 'centre',
      'analyze': 'analyse',
      'optimize': 'optimise'
    };
    
    let result = text;
    for (const [american, british] of Object.entries(conversions)) {
      result = result.replace(new RegExp(`\\b${american}\\b`, 'gi'), british);
    }
    
    return result;
  }

  containsCasualLanguage(text) {
    const casualWords = ['awesome', 'cool', 'super', 'amazing', 'totally', 'basically'];
    return casualWords.some(word => text.toLowerCase().includes(word));
  }
}

/**
 * Circuit Breaker for DeepSeek API calls
 */
class CircuitBreaker {
  constructor(env, options = {}) {
    this.env = env;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 300000; // 5 minutes
    this.monitoringWindow = options.monitoringWindow || 60000; // 1 minute
    this.state = 'CLOSED';
    this.failures = [];
    this.lastFailureTime = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.failures = [];
      } else {
        throw new Error('Circuit breaker is OPEN - DeepSeek API temporarily unavailable');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }

  onSuccess() {
    this.failures = [];
    this.state = 'CLOSED';
  }

  onFailure(error) {
    const now = Date.now();
    this.failures.push({ timestamp: now, error: error.message });
    this.lastFailureTime = now;
    
    // Clean old failures
    this.failures = this.failures.filter(f => 
      now - f.timestamp < this.monitoringWindow
    );
    
    if (this.failures.length >= this.failureThreshold) {
      this.state = 'OPEN';
      console.error(`Circuit breaker OPEN: ${this.failures.length} failures in ${this.monitoringWindow}ms`);
    }
  }

  getStatus() {
    return {
      state: this.state,
      failures: this.failures.length,
      lastFailureTime: this.lastFailureTime,
      canRetry: this.state === 'HALF_OPEN' || this.state === 'CLOSED'
    };
  }
}

/**
 * Specialized rate limiter for DeepSeek API
 */
class DeepSeekRateLimiter {
  constructor(env) {
    this.env = env;
    this.rateLimiter = env.RATE_LIMITER.get(
      env.RATE_LIMITER.idFromName('deepseek')
    );
  }

  async checkLimit(cost = 1) {
    return await this.rateLimiter.checkRateLimit('deepseek', cost);
  }

  async updateConfig(config) {
    return await this.rateLimiter.updateConfig({
      algorithm: 'token_bucket',
      windowSize: 60000, // 1 minute
      maxRequests: 10, // 10 requests per minute for DeepSeek
      refillRate: 0.17, // ~10 requests per minute
      burstCapacity: 3, // Allow small bursts
      ...config
    });
  }
}

export default DeepSeekProcessor;