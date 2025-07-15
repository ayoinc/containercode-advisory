/**
 * Cloudflare Queue Processor
 * Advanced queue processing system for handling newsletter automation pipeline
 * Implements priority queues, dead letter queues, and distributed processing
 */

class QueueProcessor {
  constructor(env) {
    this.env = env;
    this.db = env.DB;
    this.queues = {
      article: env.ARTICLE_QUEUE,
      newsletter: env.NEWSLETTER_QUEUE,
      email: env.EMAIL_QUEUE,
      image: env.IMAGE_QUEUE,
      deadLetter: env.DEAD_LETTER_QUEUE
    };
    this.durableObjects = {
      jobState: env.JOB_STATE,
      rateLimiter: env.RATE_LIMITER,
      pipelineOrchestrator: env.PIPELINE_ORCHESTRATOR
    };
    this.maxRetries = 3;
    this.retryDelays = [1000, 5000, 15000]; // Progressive backoff
    this.circuitBreaker = new CircuitBreaker();
  }

  /**
   * Main queue message handler
   * Routes messages to appropriate processors based on message type
   */
  async handleMessage(batch) {
    const results = [];
    
    for (const message of batch.messages) {
      try {
        const messageData = JSON.parse(message.body);
        const result = await this.processMessage(messageData, message);
        results.push(result);
        
        // Acknowledge successful processing
        message.ack();
      } catch (error) {
        console.error('Message processing failed:', error);
        await this.handleFailedMessage(message, error);
      }
    }
    
    return results;
  }

  /**
   * Process individual message based on type
   */
  async processMessage(messageData, message) {
    const { type, payload, priority = 'normal', retryCount = 0 } = messageData;
    
    // Get job state from Durable Object
    const jobState = this.durableObjects.jobState.get(this.durableObjects.jobState.idFromName(payload.jobId));
    await jobState.updateStatus('processing', { startTime: Date.now() });
    
    try {
      let result;
      
      switch (type) {
        case 'article_research':
          result = await this.processArticleResearch(payload);
          break;
        case 'article_generation':
          result = await this.processArticleGeneration(payload);
          break;
        case 'content_validation':
          result = await this.processContentValidation(payload);
          break;
        case 'newsletter_generation':
          result = await this.processNewsletterGeneration(payload);
          break;
        case 'email_batch':
          result = await this.processEmailBatch(payload);
          break;
        case 'image_generation':
          result = await this.processImageGeneration(payload);
          break;
        case 'notion_sync':
          result = await this.processNotionSync(payload);
          break;
        default:
          throw new Error(`Unknown message type: ${type}`);
      }
      
      await jobState.updateStatus('completed', { 
        endTime: Date.now(), 
        result 
      });
      
      return result;
    } catch (error) {
      await jobState.updateStatus('failed', { 
        endTime: Date.now(), 
        error: error.message,
        retryCount 
      });
      throw error;
    }
  }

  /**
   * Process article research tasks
   */
  async processArticleResearch(payload) {
    const { topic, researchDepth = 'standard' } = payload;
    
    // Use circuit breaker for external API calls
    return await this.circuitBreaker.execute(async () => {
      const researchData = await this.performBraveSearch(topic, researchDepth);
      
      // Queue next stage: article generation
      await this.queueMessage('article_generation', {
        jobId: payload.jobId,
        topic,
        researchData,
        priority: payload.priority
      });
      
      return { status: 'research_completed', researchItemsFound: researchData.length };
    });
  }

  /**
   * Process article generation with AI
   */
  async processArticleGeneration(payload) {
    const { topic, researchData, jobId } = payload;
    
    // Check rate limiting using Durable Object
    const rateLimiter = this.durableObjects.rateLimiter.get(
      this.durableObjects.rateLimiter.idFromName('deepseek')
    );
    
    const canProceed = await rateLimiter.checkRateLimit();
    if (!canProceed) {
      // Requeue with delay
      await this.requeueWithDelay(payload, 60000); // 1 minute delay
      return { status: 'rate_limited', retryAfter: 60000 };
    }
    
    return await this.circuitBreaker.execute(async () => {
      const article = await this.generateArticleWithAI(topic, researchData);
      
      // Queue content validation
      await this.queueMessage('content_validation', {
        jobId,
        article,
        priority: payload.priority
      });
      
      return { status: 'article_generated', articleId: article.id };
    });
  }

  /**
   * Process content validation and quality checks
   */
  async processContentValidation(payload) {
    const { article, jobId } = payload;
    
    const validator = new ContentValidator();
    const validationResult = await validator.validateContent(article);
    
    if (validationResult.isValid) {
      // Queue for Notion sync
      await this.queueMessage('notion_sync', {
        jobId,
        article: validationResult.article,
        priority: payload.priority
      });
      
      // Queue for image generation
      await this.queueMessage('image_generation', {
        jobId,
        article: validationResult.article,
        priority: payload.priority
      });
      
      return { status: 'validation_passed', fixes: validationResult.fixes };
    } else {
      // Auto-fix and re-validate
      const fixedArticle = await validator.autoFix(article);
      await this.queueMessage('content_validation', {
        jobId,
        article: fixedArticle,
        priority: payload.priority,
        retryCount: (payload.retryCount || 0) + 1
      });
      
      return { status: 'validation_failed_auto_fixing', issues: validationResult.issues };
    }
  }

  /**
   * Process newsletter generation
   */
  async processNewsletterGeneration(payload) {
    const { campaignId, subscriberSegments } = payload;
    
    // Get recent articles from database
    const articles = await this.db.prepare(`
      SELECT * FROM articles 
      WHERE published_at >= datetime('now', '-7 days') 
      AND status = 'published' 
      ORDER BY created_at DESC LIMIT 10
    `).all();
    
    // Generate newsletter content
    const newsletter = await this.generateNewsletterContent(articles.results);
    
    // Queue email batches for each segment
    for (const segment of subscriberSegments) {
      await this.queueMessage('email_batch', {
        jobId: `${payload.jobId}_${segment.id}`,
        newsletter,
        segment,
        campaignId,
        priority: 'high'
      });
    }
    
    return { 
      status: 'newsletter_generated', 
      batchesQueued: subscriberSegments.length 
    };
  }

  /**
   * Process email batch sending
   */
  async processEmailBatch(payload) {
    const { newsletter, segment, campaignId, jobId } = payload;
    
    // Get rate limiter for email sending
    const emailRateLimiter = this.durableObjects.rateLimiter.get(
      this.durableObjects.rateLimiter.idFromName('email')
    );
    
    const canSend = await emailRateLimiter.checkRateLimit();
    if (!canSend) {
      await this.requeueWithDelay(payload, 30000); // 30 second delay
      return { status: 'rate_limited', retryAfter: 30000 };
    }
    
    // Get subscribers for this segment
    const subscribers = await this.getSubscribersForSegment(segment.id);
    
    // Send emails in batches
    const batchSize = 50;
    let sent = 0;
    let failed = 0;
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      try {
        await this.sendEmailBatch(batch, newsletter, campaignId);
        sent += batch.length;
      } catch (error) {
        failed += batch.length;
        console.error('Email batch failed:', error);
      }
      
      // Rate limiting delay
      await this.delay(1000);
    }
    
    return { 
      status: 'batch_completed', 
      sent, 
      failed, 
      segmentId: segment.id 
    };
  }

  /**
   * Process image generation for articles
   */
  async processImageGeneration(payload) {
    const { article, jobId } = payload;
    
    return await this.circuitBreaker.execute(async () => {
      const imageUrl = await this.generateArticleImage(article);
      
      // Update article with image URL
      await this.db.prepare(`
        UPDATE articles 
        SET image_url = ? 
        WHERE id = ?
      `).bind(imageUrl, article.id).run();
      
      return { status: 'image_generated', imageUrl };
    });
  }

  /**
   * Process Notion synchronization
   */
  async processNotionSync(payload) {
    const { article, jobId } = payload;
    
    return await this.circuitBreaker.execute(async () => {
      const notionClient = new NotionClient(this.env);
      const notionPageId = await notionClient.createArticlePage(article);
      
      // Update article with Notion page ID
      await this.db.prepare(`
        UPDATE articles 
        SET notion_page_id = ? 
        WHERE id = ?
      `).bind(notionPageId, article.id).run();
      
      return { status: 'notion_synced', notionPageId };
    });
  }

  /**
   * Handle failed message processing
   */
  async handleFailedMessage(message, error) {
    const messageData = JSON.parse(message.body);
    const retryCount = messageData.retryCount || 0;
    
    if (retryCount < this.maxRetries) {
      // Retry with exponential backoff
      const delay = this.retryDelays[retryCount] || 30000;
      await this.requeueWithDelay({
        ...messageData,
        retryCount: retryCount + 1
      }, delay);
    } else {
      // Send to dead letter queue
      await this.queues.deadLetter.send({
        originalMessage: messageData,
        error: error.message,
        failedAt: new Date().toISOString(),
        retryCount
      });
    }
    
    // Retry the message
    message.retry();
  }

  /**
   * Queue a message with specified type and payload
   */
  async queueMessage(type, payload) {
    const message = {
      type,
      payload,
      queuedAt: new Date().toISOString(),
      priority: payload.priority || 'normal'
    };
    
    // Route to appropriate queue
    let queue;
    switch (type) {
      case 'article_research':
      case 'article_generation':
      case 'content_validation':
        queue = this.queues.article;
        break;
      case 'newsletter_generation':
        queue = this.queues.newsletter;
        break;
      case 'email_batch':
        queue = this.queues.email;
        break;
      case 'image_generation':
        queue = this.queues.image;
        break;
      case 'notion_sync':
        queue = this.queues.article;
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
    
    await queue.send(message);
  }

  /**
   * Requeue message with delay
   */
  async requeueWithDelay(payload, delay) {
    setTimeout(async () => {
      await this.queueMessage(payload.type, payload);
    }, delay);
  }

  /**
   * Utility methods
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async performBraveSearch(topic, depth) {
    const ContentGenerator = require('./utils/content-generator');
    const generator = new ContentGenerator();
    return await generator.researchWithBraveSearch(topic, this.env.BRAVE_API_KEY);
  }

  async generateArticleWithAI(topic, researchData) {
    const ContentGenerator = require('./utils/content-generator');
    const generator = new ContentGenerator();
    return await generator.generateArticleWithDeepSeek(topic, researchData, this.env.DEEPSEEK_API_KEY);
  }

  async generateNewsletterContent(articles) {
    const NewsletterGenerator = require('./utils/newsletter-generator');
    const generator = new NewsletterGenerator();
    return await generator.generateFromArticles(articles);
  }

  async generateArticleImage(article) {
    const ImageGenerator = require('./utils/image-generator');
    const generator = new ImageGenerator();
    return await generator.generateForArticle(article, this.env.PEXELS_API_KEY);
  }

  async getSubscribersForSegment(segmentId) {
    const result = await this.db.prepare(`
      SELECT * FROM subscribers 
      WHERE status = 'active' 
      AND segment_id = ?
    `).bind(segmentId).all();
    
    return result.results;
  }

  async sendEmailBatch(subscribers, newsletter, campaignId) {
    const EmailSender = require('./utils/email-sender');
    const sender = new EmailSender();
    return await sender.sendBatch(subscribers, newsletter, campaignId, this.env);
  }
}

/**
 * Circuit Breaker Implementation
 */
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.failureCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

/**
 * Content Validator Class
 */
class ContentValidator {
  async validateContent(article) {
    const issues = [];
    const fixes = [];
    
    // British English check
    if (!this.isBritishEnglish(article.content)) {
      issues.push('Content should use British English');
    }
    
    // Length validation
    if (article.content.length < 500) {
      issues.push('Content too short (minimum 500 characters)');
    }
    
    // Professional tone check
    if (!this.isProfessionalTone(article.content)) {
      issues.push('Content should maintain professional tone');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      fixes,
      article
    };
  }

  async autoFix(article) {
    // Auto-fix common issues
    let content = article.content;
    
    // Convert to British English
    content = this.convertToBritishEnglish(content);
    
    // Fix common grammar issues
    content = this.fixGrammar(content);
    
    return {
      ...article,
      content
    };
  }

  isBritishEnglish(text) {
    const britishWords = ['colour', 'favour', 'realise', 'organised', 'centre'];
    const americanWords = ['color', 'favor', 'realize', 'organized', 'center'];
    
    const britishCount = britishWords.filter(word => text.includes(word)).length;
    const americanCount = americanWords.filter(word => text.includes(word)).length;
    
    return britishCount >= americanCount;
  }

  isProfessionalTone(text) {
    const casualWords = ['awesome', 'cool', 'super', 'amazing'];
    const casualCount = casualWords.filter(word => text.toLowerCase().includes(word)).length;
    
    return casualCount < 3; // Allow some casual words but not too many
  }

  convertToBritishEnglish(text) {
    const conversions = {
      'color': 'colour',
      'favor': 'favour',
      'realize': 'realise',
      'organized': 'organised',
      'center': 'centre'
    };
    
    let result = text;
    for (const [american, british] of Object.entries(conversions)) {
      result = result.replace(new RegExp(american, 'gi'), british);
    }
    
    return result;
  }

  fixGrammar(text) {
    // Basic grammar fixes
    return text
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\.\s+/g, '. ') // Consistent sentence spacing
      .trim();
  }
}

module.exports = { QueueProcessor, CircuitBreaker, ContentValidator };