/**
 * Content Generator for Newsletter Automation
 * Uses AI to generate comprehensive articles from RSS feed content
 */

export class ContentGenerator {
  constructor(ai) {
    this.ai = ai;
  }

  /**
   * Generate a comprehensive article from RSS feed item
   * @param {Object} rssItem - RSS feed item
   * @param {string} category - Article category
   * @returns {Promise<Object>} Generated article
   */
  async generateArticle(rssItem, category) {
    try {
      // Generate article content using AI
      const articleContent = await this.generateArticleContent(rssItem, category);
      
      // Generate SEO-optimized title and description
      const seoContent = await this.generateSEOContent(articleContent.title, articleContent.content);
      
      // Generate article summary and excerpt
      const summary = await this.generateSummary(articleContent.content);
      const excerpt = await this.generateExcerpt(articleContent.content);
      
      // Generate slug
      const slug = this.generateSlug(articleContent.title);
      
      // Calculate reading time
      const readingTime = this.calculateReadingTime(articleContent.content);
      const wordCount = this.countWords(articleContent.content);

      return {
        title: articleContent.title,
        content: articleContent.content,
        summary,
        excerpt,
        slug,
        seo_title: seoContent.title,
        seo_description: seoContent.description,
        category,
        tags: this.extractTags(articleContent.content, category),
        reading_time: readingTime,
        word_count: wordCount,
        source_url: rssItem.link,
        source_feed: rssItem.source,
        author: 'ContainerCode Advisory Team',
        status: 'draft',
        validation_status: 'pending'
      };
    } catch (error) {
      console.error('Error generating article:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive article content using AI
   * @param {Object} rssItem - RSS feed item
   * @param {string} category - Article category
   * @returns {Promise<Object>} Generated content
   */
  async generateArticleContent(rssItem, category) {
    const prompt = `
You are a senior technology consultant writing for ContainerCode Advisory, a UK-based technology consulting firm specializing in cloud technologies, cybersecurity, DevOps, and digital transformation.

Based on the following RSS feed item, create a comprehensive, professional article that provides valuable insights to enterprise technology decision-makers:

RSS Item:
- Title: ${rssItem.title}
- Description: ${rssItem.description}
- Content: ${rssItem.content.substring(0, 2000)}
- Category: ${category}
- Source: ${rssItem.source}

Requirements:
1. Write in British English (use "colour", "realise", "centre", etc.)
2. Target audience: CTOs, IT Directors, and senior technology managers
3. Focus on practical business implications and strategic considerations
4. Include actionable insights and recommendations
5. Maintain a professional, authoritative tone
6. Length: 1500-2500 words
7. Structure with clear headings and subheadings
8. Include relevant technical depth without being overly complex
9. Reference current industry trends and best practices
10. Conclude with specific next steps or recommendations

Please provide:
- A compelling, professional title (different from the RSS title)
- Comprehensive article content with proper structure
- Business-focused perspective on the technology topic

Format the response as JSON with 'title' and 'content' fields.
`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt,
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9,
      });

      // Try to parse as JSON, fallback to text parsing
      let result;
      try {
        result = JSON.parse(response.response);
      } catch (parseError) {
        // Extract title and content from text response
        const lines = response.response.split('\n');
        const titleMatch = lines.find(line => line.includes('Title:') || line.includes('title:'));
        const title = titleMatch ? titleMatch.replace(/.*title:\s*/i, '').trim() : rssItem.title;
        
        const contentStart = lines.findIndex(line => line.includes('Content:') || line.includes('content:'));
        const content = contentStart > -1 ? lines.slice(contentStart + 1).join('\n').trim() : response.response;
        
        result = { title, content };
      }

      return {
        title: result.title || rssItem.title,
        content: result.content || response.response
      };
    } catch (error) {
      console.error('Error generating article content:', error);
      // Fallback to basic article generation
      return {
        title: `${rssItem.title} - A ContainerCode Advisory Analysis`,
        content: this.generateFallbackContent(rssItem, category)
      };
    }
  }

  /**
   * Generate SEO-optimized title and description
   * @param {string} title - Article title
   * @param {string} content - Article content
   * @returns {Promise<Object>} SEO content
   */
  async generateSEOContent(title, content) {
    const prompt = `
Generate SEO-optimized title and meta description for a technology consulting article.

Article Title: ${title}
Article Content: ${content.substring(0, 1000)}...

Requirements:
1. SEO Title: 50-60 characters, include main keyword
2. Meta Description: 150-160 characters, compelling and informative
3. Focus on UK technology consulting keywords
4. Include relevant technical terms
5. Make it appealing to enterprise decision-makers

Format as JSON with 'title' and 'description' fields.
`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt,
        max_tokens: 300,
        temperature: 0.5,
      });

      const result = JSON.parse(response.response);
      return {
        title: result.title || title,
        description: result.description || content.substring(0, 160) + '...'
      };
    } catch (error) {
      console.error('Error generating SEO content:', error);
      return {
        title: title.substring(0, 60),
        description: content.substring(0, 160) + '...'
      };
    }
  }

  /**
   * Generate article summary
   * @param {string} content - Article content
   * @returns {Promise<string>} Summary
   */
  async generateSummary(content) {
    const prompt = `
Create a concise, professional summary of this technology article in 2-3 sentences.
Focus on the key insights and business implications.

Article Content: ${content.substring(0, 2000)}...

Requirements:
1. Use British English
2. Professional tone
3. Highlight main benefits and implications
4. 2-3 sentences maximum
`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt,
        max_tokens: 200,
        temperature: 0.5,
      });

      return response.response.trim();
    } catch (error) {
      console.error('Error generating summary:', error);
      return content.substring(0, 200) + '...';
    }
  }

  /**
   * Generate article excerpt
   * @param {string} content - Article content
   * @returns {Promise<string>} Excerpt
   */
  async generateExcerpt(content) {
    const prompt = `
Create a compelling 1-sentence excerpt from this technology article.
Make it engaging and informative for enterprise technology leaders.

Article Content: ${content.substring(0, 1000)}...

Requirements:
1. One sentence only
2. Engaging and professional
3. Use British English
4. Include main benefit or insight
`;

    try {
      const response = await this.ai.run('@cf/meta/llama-3.1-8b-instruct', {
        prompt,
        max_tokens: 100,
        temperature: 0.6,
      });

      return response.response.trim();
    } catch (error) {
      console.error('Error generating excerpt:', error);
      return content.substring(0, 100) + '...';
    }
  }

  /**
   * Generate fallback content when AI fails
   * @param {Object} rssItem - RSS feed item
   * @param {string} category - Article category
   * @returns {string} Fallback content
   */
  generateFallbackContent(rssItem, category) {
    return `
# ${rssItem.title}

## Introduction

This article explores the latest developments in ${category} and their implications for enterprise technology strategy.

## Key Insights

${rssItem.description}

## Business Implications

${rssItem.content}

## ContainerCode Advisory Perspective

As technology consultants specialising in ${category}, we believe these developments present both opportunities and challenges for enterprise organisations.

## Next Steps

For organisations looking to leverage these technologies:

1. Assess current infrastructure and capabilities
2. Develop a strategic implementation roadmap
3. Consider partnering with experienced consultants
4. Focus on security and compliance requirements
5. Plan for ongoing maintenance and support

## Conclusion

The evolving landscape of ${category} continues to present new opportunities for digital transformation and operational excellence.

---

*This analysis is provided by ContainerCode Advisory, your trusted partner for enterprise technology consulting.*
`;
  }

  /**
   * Extract relevant tags from content
   * @param {string} content - Article content
   * @param {string} category - Article category
   * @returns {Array} Array of tags
   */
  extractTags(content, category) {
    const contentLower = content.toLowerCase();
    const tagMap = {
      'ai': ['artificial intelligence', 'machine learning', 'automation', 'ai strategy', 'ml ops'],
      'devops': ['kubernetes', 'docker', 'ci/cd', 'infrastructure', 'automation', 'monitoring'],
      'cybersecurity': ['security', 'compliance', 'threat detection', 'zero trust', 'data protection'],
      'cloud': ['aws', 'azure', 'gcp', 'cloud migration', 'multi-cloud', 'hybrid cloud'],
      'software_engineering': ['architecture', 'microservices', 'api', 'scalability', 'performance'],
      'technology': ['digital transformation', 'innovation', 'enterprise', 'strategy']
    };

    const tags = [category];
    const relevantTags = tagMap[category] || [];

    relevantTags.forEach(tag => {
      if (contentLower.includes(tag)) {
        tags.push(tag);
      }
    });

    return [...new Set(tags)];
  }

  /**
   * Generate URL-friendly slug
   * @param {string} title - Article title
   * @returns {string} URL slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }

  /**
   * Calculate reading time in minutes
   * @param {string} content - Article content
   * @returns {number} Reading time in minutes
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = this.countWords(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Count words in content
   * @param {string} content - Article content
   * @returns {number} Word count
   */
  countWords(content) {
    return content.trim().split(/\s+/).length;
  }
}

/**
 * Main function to generate article from RSS item
 * @param {Object} rssItem - RSS feed item
 * @param {string} category - Article category
 * @param {Object} ai - AI binding
 * @returns {Promise<Object>} Generated article
 */
export async function generateArticle(rssItem, category, ai) {
  const generator = new ContentGenerator(ai);
  return await generator.generateArticle(rssItem, category);
}

export default ContentGenerator;