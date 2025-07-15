/**
 * BraveSearch API Processor Worker
 * Enhanced integration with domain-specific queries and intelligent search strategies
 * Implements topic-based search optimization and content quality filtering
 */

// Import statements removed to avoid unused import warnings

export class BraveSearchProcessor {
  constructor(env) {
    this.env = env;
    this.braveApiKey = env.BRAVE_API_KEY;
    this.rateLimiter = new BraveSearchRateLimiter(env);
    this.circuitBreaker = new SearchCircuitBreaker(env);
    this.searchStrategies = new SearchStrategies();
  }

  /**
   * Process BraveSearch requests with domain-specific optimizations
   */
  async processSearch(messageData) {
    const { jobId, type, payload } = messageData;
    
    // Get job state
    const jobState = this.env.JOB_STATE.get(
      this.env.JOB_STATE.idFromName(jobId)
    );
    
    try {
      await jobState.updateStatus('processing', {
        message: 'Starting BraveSearch processing',
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
      
      // Process based on search type
      let result;
      switch (type) {
        case 'topic_research':
          result = await this.researchTopic(payload, jobState);
          break;
        case 'competitive_analysis':
          result = await this.competitiveAnalysis(payload, jobState);
          break;
        case 'trend_analysis':
          result = await this.trendAnalysis(payload, jobState);
          break;
        case 'content_verification':
          result = await this.verifyContent(payload, jobState);
          break;
        case 'domain_specific_search':
          result = await this.domainSpecificSearch(payload, jobState);
          break;
        default:
          throw new Error(`Unknown search type: ${type}`);
      }
      
      await jobState.updateStatus('completed', {
        message: 'BraveSearch processing completed successfully',
        endTime: Date.now(),
        result
      });
      
      return result;
      
    } catch (error) {
      await jobState.updateStatus('failed', {
        message: `BraveSearch processing failed: ${error.message}`,
        endTime: Date.now(),
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Research topic with domain-specific optimization
   */
  async researchTopic(payload, jobState) {
    const { topic, domain = 'technology', depth = 'comprehensive', targetAudience = 'enterprise' } = payload;
    
    await jobState.updateProgress(10, 'Preparing domain-specific search strategy');
    
    // Get domain-specific search strategy
    const searchStrategy = this.searchStrategies.getStrategy(domain, targetAudience);
    
    await jobState.updateProgress(20, 'Generating optimized search queries');
    
    // Generate multiple search queries for comprehensive coverage
    const queries = this.generateSearchQueries(topic, searchStrategy, depth);
    
    await jobState.updateProgress(30, 'Executing search queries');
    
    // Execute searches in parallel with rate limiting
    const searchResults = await this.executeSearches(queries, jobState);
    
    await jobState.updateProgress(70, 'Processing and filtering results');
    
    // Filter and enhance results
    const filteredResults = await this.filterAndEnhanceResults(searchResults, searchStrategy);
    
    await jobState.updateProgress(90, 'Generating research summary');
    
    // Generate comprehensive research summary
    const researchSummary = await this.generateResearchSummary(filteredResults, topic, domain);
    
    await jobState.updateProgress(100, 'Topic research completed');
    
    return {
      topic,
      domain,
      searchStrategy: searchStrategy.name,
      totalResults: filteredResults.length,
      sources: this.extractSources(filteredResults),
      keyFindings: researchSummary.keyFindings,
      trends: researchSummary.trends,
      recommendations: researchSummary.recommendations,
      results: filteredResults,
      metadata: {
        queriesExecuted: queries.length,
        searchDepth: depth,
        targetAudience,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Domain-specific search with targeted queries
   */
  async domainSpecificSearch(payload, jobState) {
    const { query, domains, excludeDomains = [], contentType = 'all', freshness = 'any' } = payload;
    
    await jobState.updateProgress(15, 'Preparing domain-specific search');
    
    // Build domain-specific query
    const enhancedQuery = this.buildDomainQuery(query, domains, excludeDomains, contentType);
    
    await jobState.updateProgress(30, 'Executing domain-specific search');
    
    // Execute search with domain targeting
    const searchResults = await this.circuitBreaker.execute(async () => {
      return await this.makeBraveSearchRequest(enhancedQuery, {
        freshness,
        count: 50,
        search_lang: 'en',
        country: 'GB',
        safesearch: 'moderate',
        text_decorations: true,
        spellcheck: true
      });
    });
    
    await jobState.updateProgress(70, 'Processing domain-specific results');
    
    // Process and categorize results by domain
    const categorizedResults = this.categorizeByDomain(searchResults.web?.results || []);
    
    await jobState.updateProgress(100, 'Domain-specific search completed');
    
    return {
      query: enhancedQuery,
      originalQuery: query,
      targetDomains: domains,
      excludedDomains: excludeDomains,
      totalResults: searchResults.web?.results?.length || 0,
      categorizedResults,
      domainCoverage: this.calculateDomainCoverage(categorizedResults, domains),
      qualityScore: this.calculateQualityScore(categorizedResults),
      metadata: {
        freshness,
        contentType,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Competitive analysis search
   */
  async competitiveAnalysis(payload, jobState) {
    const { competitors, topic, market = 'UK', analysisType = 'comprehensive' } = payload;
    
    await jobState.updateProgress(10, 'Preparing competitive analysis');
    
    const competitiveQueries = this.generateCompetitiveQueries(competitors, topic, market);
    
    await jobState.updateProgress(30, 'Executing competitive searches');
    
    const competitiveResults = await this.executeSearches(competitiveQueries, jobState);
    
    await jobState.updateProgress(70, 'Analyzing competitive landscape');
    
    const analysis = this.analyzeCompetitiveLandscape(competitiveResults, competitors, topic);
    
    await jobState.updateProgress(100, 'Competitive analysis completed');
    
    return {
      competitors,
      topic,
      market,
      analysis,
      competitiveGaps: analysis.gaps,
      opportunities: analysis.opportunities,
      threats: analysis.threats,
      recommendations: analysis.recommendations,
      metadata: {
        analysisType,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Trend analysis search
   */
  async trendAnalysis(payload, jobState) {
    const { topic, timeframe = '1y', region = 'GB', categories = ['technology'] } = payload;
    
    await jobState.updateProgress(15, 'Preparing trend analysis');
    
    const trendQueries = this.generateTrendQueries(topic, timeframe, region, categories);
    
    await jobState.updateProgress(40, 'Executing trend searches');
    
    const trendResults = await this.executeSearches(trendQueries, jobState);
    
    await jobState.updateProgress(80, 'Analyzing trends and patterns');
    
    const trendAnalysis = this.analyzeTrends(trendResults, topic, timeframe);
    
    await jobState.updateProgress(100, 'Trend analysis completed');
    
    return {
      topic,
      timeframe,
      region,
      categories,
      trends: trendAnalysis.trends,
      emergingTopics: trendAnalysis.emergingTopics,
      decliningTopics: trendAnalysis.decliningTopics,
      seasonality: trendAnalysis.seasonality,
      predictions: trendAnalysis.predictions,
      metadata: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Make BraveSearch API request with error handling
   */
  async makeBraveSearchRequest(query, options = {}) {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      ...options
    });
    
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': this.braveApiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`BraveSearch API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }
    
    return await response.json();
  }

  /**
   * Generate search queries based on topic and domain
   */
  generateSearchQueries(topic, strategy, depth) {
    const baseQueries = [
      `"${topic}" ${strategy.domainKeywords.join(' OR ')}`,
      `${topic} ${strategy.industryTerms.join(' ')}`,
      `${topic} best practices ${strategy.targetMarket}`,
      `${topic} trends ${new Date().getFullYear()}`,
      `${topic} case study ${strategy.targetMarket}`
    ];
    
    if (depth === 'comprehensive') {
      baseQueries.push(
        `${topic} implementation guide`,
        `${topic} challenges solutions`,
        `${topic} ROI benefits`,
        `${topic} market research ${strategy.targetMarket}`,
        `${topic} vendor comparison`
      );
    }
    
    if (depth === 'expert') {
      baseQueries.push(
        `${topic} technical specifications`,
        `${topic} architecture design`,
        `${topic} performance benchmarks`,
        `${topic} security considerations`,
        `${topic} scalability factors`
      );
    }
    
    return baseQueries;
  }

  /**
   * Execute multiple searches with rate limiting
   */
  async executeSearches(queries, jobState) {
    const results = [];
    const progressStep = 40 / queries.length;
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      
      try {
        // Check rate limiting before each request
        const rateLimitResult = await this.rateLimiter.checkLimit();
        if (!rateLimitResult.allowed) {
          await new Promise(resolve => setTimeout(resolve, rateLimitResult.retryAfter * 1000));
        }
        
        const result = await this.circuitBreaker.execute(async () => {
          return await this.makeBraveSearchRequest(query, {
            count: 20,
            search_lang: 'en',
            country: 'GB',
            safesearch: 'moderate'
          });
        });
        
        results.push({
          query,
          results: result.web?.results || [],
          totalResults: result.web?.totalResults || 0
        });
        
        await jobState.updateProgress(30 + (i + 1) * progressStep, `Completed search ${i + 1}/${queries.length}`);
        
      } catch (error) {
        console.error(`Search failed for query "${query}":`, error);
        results.push({
          query,
          error: error.message,
          results: []
        });
      }
    }
    
    return results;
  }

  /**
   * Build domain-specific query
   */
  buildDomainQuery(query, domains, excludeDomains, contentType) {
    let enhancedQuery = query;
    
    // Add domain restrictions
    if (domains && domains.length > 0) {
      const domainQuery = domains.map(domain => `site:${domain}`).join(' OR ');
      enhancedQuery += ` (${domainQuery})`;
    }
    
    // Add domain exclusions
    if (excludeDomains && excludeDomains.length > 0) {
      const excludeQuery = excludeDomains.map(domain => `-site:${domain}`).join(' ');
      enhancedQuery += ` ${excludeQuery}`;
    }
    
    // Add content type filters
    if (contentType === 'pdf') {
      enhancedQuery += ' filetype:pdf';
    } else if (contentType === 'news') {
      enhancedQuery += ' inurl:news OR inurl:blog OR inurl:article';
    } else if (contentType === 'academic') {
      enhancedQuery += ' (site:*.edu OR site:*.ac.uk OR inurl:research OR inurl:paper)';
    }
    
    return enhancedQuery;
  }

  /**
   * Filter and enhance search results
   */
  async filterAndEnhanceResults(searchResults, strategy) {
    const allResults = [];
    
    // Combine all search results
    searchResults.forEach(searchResult => {
      if (searchResult.results) {
        allResults.push(...searchResult.results.map(result => ({
          ...result,
          searchQuery: searchResult.query
        })));
      }
    });
    
    // Remove duplicates based on URL
    const uniqueResults = this.removeDuplicateUrls(allResults);
    
    // Filter by domain authority and relevance
    const filteredResults = uniqueResults.filter(result => {
      return this.isHighQualitySource(result, strategy);
    });
    
    // Sort by relevance and authority
    filteredResults.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, strategy);
      const scoreB = this.calculateRelevanceScore(b, strategy);
      return scoreB - scoreA;
    });
    
    return filteredResults.slice(0, 30); // Return top 30 results
  }

  /**
   * Calculate relevance score for search result
   */
  calculateRelevanceScore(result, strategy) {
    let score = 0;
    
    // Domain authority (based on well-known domains)
    if (this.isAuthorityDomain(result.url)) {
      score += 10;
    }
    
    // Keyword relevance in title
    strategy.domainKeywords.forEach(keyword => {
      if (result.title.toLowerCase().includes(keyword.toLowerCase())) {
        score += 5;
      }
    });
    
    // Keyword relevance in description
    strategy.domainKeywords.forEach(keyword => {
      if (result.description.toLowerCase().includes(keyword.toLowerCase())) {
        score += 3;
      }
    });
    
    // Recency bonus
    if (result.age && result.age === 'recent') {
      score += 5;
    }
    
    // HTTPS bonus
    if (result.url.startsWith('https://')) {
      score += 2;
    }
    
    return score;
  }

  /**
   * Check if domain is considered authoritative
   */
  isAuthorityDomain(url) {
    const authorityDomains = [
      'bbc.co.uk', 'theguardian.com', 'ft.com', 'economist.com',
      'techcrunch.com', 'wired.com', 'arstechnica.com',
      'stackoverflow.com', 'github.com', 'medium.com',
      'forbes.com', 'harvard.edu', 'mit.edu', 'acm.org',
      'ieee.org', 'cloudflare.com', 'aws.amazon.com',
      'microsoft.com', 'google.com', 'ibm.com'
    ];
    
    return authorityDomains.some(domain => url.includes(domain));
  }

  /**
   * Remove duplicate URLs from results
   */
  removeDuplicateUrls(results) {
    const seen = new Set();
    return results.filter(result => {
      if (seen.has(result.url)) {
        return false;
      }
      seen.add(result.url);
      return true;
    });
  }

  /**
   * Generate comprehensive research summary
   */
  async generateResearchSummary(results, topic, domain) {
    const keyFindings = this.extractKeyFindings(results, topic);
    const trends = this.identifyTrends(results);
    const recommendations = this.generateRecommendations(results, domain);
    
    return {
      keyFindings,
      trends,
      recommendations,
      sourceQuality: this.assessSourceQuality(results),
      coverage: this.assessTopicCoverage(results, topic)
    };
  }

  /**
   * Extract key findings from search results
   */
  extractKeyFindings(results, topic) {
    const findings = [];
    
    // Analyze titles and descriptions for key insights
    results.forEach(result => {
      const content = `${result.title} ${result.description}`.toLowerCase();
      
      // Look for statistical information
      const stats = content.match(/\d+%|\d+\s*(percent|million|billion|thousand)/g);
      if (stats) {
        findings.push({
          type: 'statistic',
          content: result.title,
          source: result.url,
          relevance: this.calculateRelevanceScore(result, { domainKeywords: [topic] })
        });
      }
      
      // Look for trend indicators
      const trendWords = ['growth', 'increase', 'decrease', 'trend', 'rising', 'falling'];
      if (trendWords.some(word => content.includes(word))) {
        findings.push({
          type: 'trend',
          content: result.title,
          source: result.url,
          relevance: this.calculateRelevanceScore(result, { domainKeywords: [topic] })
        });
      }
    });
    
    return findings.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  }

  /**
   * Identify trends from search results
   */
  identifyTrends(results) {
    const trends = [];
    const currentYear = new Date().getFullYear();
    
    // Look for year-specific content
    results.forEach(result => {
      const content = `${result.title} ${result.description}`.toLowerCase();
      
      if (content.includes(currentYear.toString())) {
        trends.push({
          trend: result.title,
          source: result.url,
          year: currentYear,
          relevance: this.calculateRelevanceScore(result, { domainKeywords: ['trend'] })
        });
      }
    });
    
    return trends.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }

  /**
   * Generate recommendations based on search results
   */
  generateRecommendations(results, _domain) {
    const recommendations = [];
    
    // Analyze for best practices
    const bestPracticeResults = results.filter(result => 
      result.title.toLowerCase().includes('best practice') ||
      result.description.toLowerCase().includes('best practice')
    );
    
    if (bestPracticeResults.length > 0) {
      recommendations.push({
        type: 'best_practices',
        title: 'Implement Industry Best Practices',
        description: `Found ${bestPracticeResults.length} sources discussing best practices`,
        sources: bestPracticeResults.slice(0, 3).map(r => r.url)
      });
    }
    
    // Analyze for case studies
    const caseStudyResults = results.filter(result => 
      result.title.toLowerCase().includes('case study') ||
      result.description.toLowerCase().includes('case study')
    );
    
    if (caseStudyResults.length > 0) {
      recommendations.push({
        type: 'case_studies',
        title: 'Review Relevant Case Studies',
        description: `Found ${caseStudyResults.length} case studies for reference`,
        sources: caseStudyResults.slice(0, 3).map(r => r.url)
      });
    }
    
    return recommendations;
  }

  /**
   * Extract unique sources from results
   */
  extractSources(results) {
    const sources = new Set();
    results.forEach(result => {
      const domain = new URL(result.url).hostname;
      sources.add(domain);
    });
    return Array.from(sources);
  }

  /**
   * Assess source quality
   */
  assessSourceQuality(results) {
    const totalResults = results.length;
    const authorityResults = results.filter(result => this.isAuthorityDomain(result.url)).length;
    const httpsResults = results.filter(result => result.url.startsWith('https://')).length;
    
    return {
      totalSources: totalResults,
      authoritySources: authorityResults,
      httpsPercentage: (httpsResults / totalResults) * 100,
      qualityScore: ((authorityResults * 2 + httpsResults) / (totalResults * 3)) * 100
    };
  }

  /**
   * Assess topic coverage
   */
  assessTopicCoverage(results, topic) {
    const topicKeywords = topic.toLowerCase().split(' ');
    const coverageResults = results.filter(result => {
      const content = `${result.title} ${result.description}`.toLowerCase();
      return topicKeywords.some(keyword => content.includes(keyword));
    });
    
    return {
      totalResults: results.length,
      relevantResults: coverageResults.length,
      coveragePercentage: (coverageResults.length / results.length) * 100
    };
  }
}

/**
 * Search strategies for different domains
 */
class SearchStrategies {
  constructor() {
    this.strategies = {
      technology: {
        name: 'Technology Enterprise Strategy',
        domainKeywords: ['enterprise', 'cloud', 'digital transformation', 'cybersecurity', 'AI', 'automation'],
        industryTerms: ['IT infrastructure', 'scalability', 'security', 'compliance', 'ROI'],
        targetMarket: 'UK enterprise',
        authorityDomains: ['techcrunch.com', 'wired.com', 'arstechnica.com', 'stackoverflow.com']
      },
      healthcare: {
        name: 'Healthcare Technology Strategy',
        domainKeywords: ['healthtech', 'medical', 'patient care', 'telemedicine', 'health data'],
        industryTerms: ['NHS', 'patient outcomes', 'clinical efficiency', 'medical devices'],
        targetMarket: 'UK healthcare',
        authorityDomains: ['bmj.com', 'healthcareitnews.com', 'digitalhealth.net']
      },
      finance: {
        name: 'Financial Technology Strategy',
        domainKeywords: ['fintech', 'banking', 'payments', 'blockchain', 'regulatory'],
        industryTerms: ['FCA', 'compliance', 'risk management', 'digital banking'],
        targetMarket: 'UK financial services',
        authorityDomains: ['ft.com', 'economist.com', 'reuters.com']
      },
      manufacturing: {
        name: 'Manufacturing Technology Strategy',
        domainKeywords: ['Industry 4.0', 'IoT', 'automation', 'supply chain', 'predictive maintenance'],
        industryTerms: ['operational efficiency', 'quality control', 'lean manufacturing'],
        targetMarket: 'UK manufacturing',
        authorityDomains: ['manufacturingglobal.com', 'themanufacturer.com']
      }
    };
  }

  getStrategy(domain, targetAudience) {
    return this.strategies[domain] || this.strategies.technology;
  }
}

/**
 * Circuit breaker for BraveSearch API calls
 */
class SearchCircuitBreaker {
  constructor(env, options = {}) {
    this.env = env;
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeout = options.resetTimeout || 180000; // 3 minutes
    this.monitoringWindow = options.monitoringWindow || 30000; // 30 seconds
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
        throw new Error('Circuit breaker is OPEN - BraveSearch API temporarily unavailable');
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
      console.error(`Search circuit breaker OPEN: ${this.failures.length} failures`);
    }
  }
}

/**
 * Specialized rate limiter for BraveSearch API
 */
class BraveSearchRateLimiter {
  constructor(env) {
    this.env = env;
    this.rateLimiter = env.RATE_LIMITER.get(
      env.RATE_LIMITER.idFromName('brave-search')
    );
  }

  async checkLimit(cost = 1) {
    return await this.rateLimiter.checkRateLimit('brave-search', cost);
  }

  async updateConfig(config) {
    return await this.rateLimiter.updateConfig({
      algorithm: 'sliding_window',
      windowSize: 60000, // 1 minute
      maxRequests: 30, // 30 requests per minute for BraveSearch
      burstCapacity: 5,
      ...config
    });
  }
}

export default BraveSearchProcessor;
