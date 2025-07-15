/**
 * RSS Feed Parser for Newsletter Automation
 * Parses RSS feeds and extracts article information
 */

import { XMLParser } from 'fast-xml-parser';

export class RSSParser {
  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: true,
      trimValues: true,
      parseTrueNumberOnly: false,
      parseNodeValue: true,
      parseTagValue: true,
      ignoreNameSpace: false,
      removeNSPrefix: false,
      allowBooleanAttributes: true,
      parseAttributeValue: false,
      trimValues: true,
      cdataPropName: '__cdata',
      textNodeName: '#text',
      ignoreDeclaration: true,
      ignorePiTags: true,
      parseAttributeValue: true,
      removeNSPrefix: false,
    });
  }

  /**
   * Parse RSS feed and extract articles
   * @param {string} feedUrl - RSS feed URL
   * @param {string} category - Article category
   * @returns {Promise<Array>} Array of parsed articles
   */
  async parseFeed(feedUrl, category) {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'ContainerCode Advisory RSS Parser/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlData = await response.text();
      const parsed = this.parser.parse(xmlData);

      // Handle different RSS formats
      let items = [];
      if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
        items = Array.isArray(parsed.rss.channel.item) 
          ? parsed.rss.channel.item 
          : [parsed.rss.channel.item];
      } else if (parsed.feed && parsed.feed.entry) {
        // Atom feed format
        items = Array.isArray(parsed.feed.entry) 
          ? parsed.feed.entry 
          : [parsed.feed.entry];
      }

      return items.map(item => this.normalizeArticle(item, category, feedUrl));
    } catch (error) {
      console.error(`Error parsing RSS feed ${feedUrl}:`, error);
      return [];
    }
  }

  /**
   * Normalize article data from different RSS formats
   * @param {Object} item - RSS item
   * @param {string} category - Article category
   * @param {string} feedUrl - Source feed URL
   * @returns {Object} Normalized article object
   */
  normalizeArticle(item, category, feedUrl) {
    // Handle RSS 2.0 format
    if (item.title && item.link) {
      return {
        title: this.cleanText(item.title),
        link: item.link,
        description: this.cleanText(item.description || ''),
        content: this.cleanText(item['content:encoded'] || item.description || ''),
        publishedDate: this.parseDate(item.pubDate),
        author: item.author || item['dc:creator'] || 'Unknown',
        category: category,
        tags: this.extractTags(item),
        source: feedUrl,
        guid: item.guid || item.link,
      };
    }

    // Handle Atom format
    if (item.title && item.link) {
      return {
        title: this.cleanText(item.title['#text'] || item.title),
        link: item.link['@_href'] || item.link,
        description: this.cleanText(item.summary || ''),
        content: this.cleanText(item.content || item.summary || ''),
        publishedDate: this.parseDate(item.published || item.updated),
        author: item.author?.name || 'Unknown',
        category: category,
        tags: this.extractTags(item),
        source: feedUrl,
        guid: item.id || item.link,
      };
    }

    return null;
  }

  /**
   * Clean and sanitize text content
   * @param {string} text - Raw text
   * @returns {string} Cleaned text
   */
  cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, '') // Remove HTML entities
      .trim()
      .substring(0, 5000); // Limit length
  }

  /**
   * Parse date from various formats
   * @param {string} dateString - Date string
   * @returns {Date} Parsed date
   */
  parseDate(dateString) {
    if (!dateString) return new Date();
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  /**
   * Extract tags from RSS item
   * @param {Object} item - RSS item
   * @returns {Array} Array of tags
   */
  extractTags(item) {
    const tags = [];
    
    if (item.category) {
      if (Array.isArray(item.category)) {
        tags.push(...item.category.map(cat => cat['#text'] || cat));
      } else {
        tags.push(item.category['#text'] || item.category);
      }
    }

    if (item['dc:subject']) {
      tags.push(item['dc:subject']);
    }

    return tags.filter(tag => tag && tag.length > 0);
  }

  /**
   * Filter articles by relevance to tech consulting
   * @param {Array} articles - Array of articles
   * @returns {Array} Filtered articles
   */
  filterRelevantArticles(articles) {
    const relevantKeywords = [
      'cloud', 'devops', 'kubernetes', 'docker', 'aws', 'azure', 'gcp',
      'cybersecurity', 'security', 'artificial intelligence', 'ai', 'machine learning',
      'software engineering', 'architecture', 'microservices', 'api',
      'digital transformation', 'automation', 'ci/cd', 'infrastructure',
      'consulting', 'enterprise', 'scalability', 'performance', 'monitoring',
      'database', 'analytics', 'data science', 'blockchain', 'fintech',
      'healthcare tech', 'startup', 'innovation', 'technology trends'
    ];

    return articles.filter(article => {
      const searchText = `${article.title} ${article.description} ${article.content}`.toLowerCase();
      
      return relevantKeywords.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
    });
  }

  /**
   * Remove duplicate articles based on title similarity
   * @param {Array} articles - Array of articles
   * @returns {Array} Deduplicated articles
   */
  removeDuplicates(articles) {
    const seen = new Set();
    const uniqueArticles = [];

    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!seen.has(normalizedTitle)) {
        seen.add(normalizedTitle);
        uniqueArticles.push(article);
      }
    }

    return uniqueArticles;
  }

  /**
   * Score articles by relevance and recency
   * @param {Array} articles - Array of articles
   * @returns {Array} Scored and sorted articles
   */
  scoreArticles(articles) {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    return articles.map(article => {
      let score = 0;
      
      // Recency score (newer articles get higher score)
      const age = (now - article.publishedDate) / dayMs;
      score += Math.max(0, 10 - age); // Max 10 points for articles < 1 day old

      // Length score (prefer articles with substantial content)
      const contentLength = article.content.length;
      if (contentLength > 500) score += 5;
      if (contentLength > 1000) score += 3;
      if (contentLength > 2000) score += 2;

      // Keyword relevance score
      const title = article.title.toLowerCase();
      const highValueKeywords = [
        'kubernetes', 'docker', 'aws', 'azure', 'cloud native',
        'cybersecurity', 'zero trust', 'devsecops', 'ai', 'machine learning',
        'digital transformation', 'enterprise', 'scalability'
      ];
      
      highValueKeywords.forEach(keyword => {
        if (title.includes(keyword)) score += 3;
      });

      return { ...article, score };
    }).sort((a, b) => b.score - a.score);
  }
}

/**
 * Main function to parse multiple RSS feeds
 * @param {Object} env - Worker environment
 * @returns {Promise<Array>} Array of parsed articles
 */
export async function parseRSSFeeds(env) {
  const parser = new RSSParser();
  const allArticles = [];

  try {
    // Get active RSS feeds from database
    const feeds = await env.DB.prepare(
      'SELECT * FROM rss_feeds WHERE active = 1'
    ).all();

    // Parse each feed
    for (const feed of feeds.results) {
      console.log(`Parsing RSS feed: ${feed.name} (${feed.url})`);
      
      const articles = await parser.parseFeed(feed.url, feed.category);
      
      // Update last fetched time
      await env.DB.prepare(
        'UPDATE rss_feeds SET last_fetched = ? WHERE id = ?'
      ).bind(new Date().toISOString(), feed.id).run();

      allArticles.push(...articles);
    }

    // Filter, deduplicate, and score articles
    const filteredArticles = parser.filterRelevantArticles(allArticles);
    const uniqueArticles = parser.removeDuplicates(filteredArticles);
    const scoredArticles = parser.scoreArticles(uniqueArticles);

    // Return top 20 articles
    return scoredArticles.slice(0, 20);

  } catch (error) {
    console.error('Error parsing RSS feeds:', error);
    return [];
  }
}

export default RSSParser;