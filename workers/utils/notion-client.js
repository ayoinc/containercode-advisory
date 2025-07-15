/**
 * Notion API Client for Newsletter Automation
 * Creates and manages Notion pages for articles with proper formatting
 */

export class NotionClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'https://api.notion.com/v1';
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28'
    };
  }

  /**
   * Create a new article page in Notion
   * @param {Object} article - Article data
   * @param {string} databaseId - Notion database ID
   * @param {string} imageUrl - Generated image URL
   * @returns {Promise<Object>} Created Notion page
   */
  async createArticlePage(article, databaseId, imageUrl) {
    try {
      const pageData = {
        parent: {
          database_id: databaseId
        },
        properties: this.buildPageProperties(article),
        children: this.buildPageContent(article, imageUrl)
      };

      const response = await fetch(`${this.baseUrl}/pages`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(pageData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Notion API error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Notion page:', error);
      throw error;
    }
  }

  /**
   * Build page properties for Notion database
   * @param {Object} article - Article data
   * @returns {Object} Notion page properties
   */
  buildPageProperties(article) {
    return {
      'Name': {
        title: [
          {
            text: {
              content: article.title || 'Untitled Article'
            }
          }
        ]
      },
      'Status': {
        select: {
          name: article.status === 'published' ? 'Published' : 'Draft'
        }
      },
      'Category': {
        select: {
          name: this.capitalizeCategory(article.category)
        }
      },
      'Tags': {
        multi_select: (article.tags || []).map(tag => ({
          name: tag
        }))
      },
      'Author': {
        rich_text: [
          {
            text: {
              content: article.author || 'ContainerCode Advisory Team'
            }
          }
        ]
      },
      'Published Date': {
        date: {
          start: article.published_at || new Date().toISOString()
        }
      },
      'Word Count': {
        number: article.word_count || 0
      },
      'Reading Time': {
        number: article.reading_time || 0
      },
      'SEO Title': {
        rich_text: [
          {
            text: {
              content: article.seo_title || article.title || ''
            }
          }
        ]
      },
      'SEO Description': {
        rich_text: [
          {
            text: {
              content: article.seo_description || article.summary || ''
            }
          }
        ]
      },
      'Source URL': {
        url: article.source_url || null
      },
      'Featured': {
        checkbox: article.featured || false
      },
      'Validation Status': {
        select: {
          name: article.validation_status || 'Pending'
        }
      }
    };
  }

  /**
   * Build page content blocks
   * @param {Object} article - Article data
   * @param {string} imageUrl - Header image URL
   * @returns {Array} Array of Notion blocks
   */
  buildPageContent(article, imageUrl) {
    const blocks = [];

    // Add header image if available
    if (imageUrl) {
      blocks.push({
        object: 'block',
        type: 'image',
        image: {
          type: 'external',
          external: {
            url: imageUrl
          },
          caption: [
            {
              type: 'text',
              text: {
                content: article.title || 'Article Header Image'
              }
            }
          ]
        }
      });
    }

    // Add article summary/excerpt
    if (article.summary) {
      blocks.push({
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: article.summary
              }
            }
          ],
          icon: {
            emoji: '💡'
          },
          color: 'blue_background'
        }
      });
    }

    // Add article metadata
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `📅 Published: ${new Date(article.published_at || Date.now()).toLocaleDateString('en-GB')} | ⏱️ ${article.reading_time || 5} min read | 📝 ${article.word_count || 0} words`
            },
            annotations: {
              color: 'gray'
            }
          }
        ]
      }
    });

    // Add divider
    blocks.push({
      object: 'block',
      type: 'divider',
      divider: {}
    });

    // Convert article content to Notion blocks
    const contentBlocks = this.convertMarkdownToNotionBlocks(article.content || '');
    blocks.push(...contentBlocks);

    // Add footer with source information
    if (article.source_url) {
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {}
      });

      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Source: '
              },
              annotations: {
                bold: true
              }
            },
            {
              type: 'text',
              text: {
                content: article.source_url,
                link: {
                  url: article.source_url
                }
              }
            }
          ]
        }
      });
    }

    // Add ContainerCode footer
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: '---\n\n'
            }
          },
          {
            type: 'text',
            text: {
              content: 'This analysis is provided by ContainerCode Advisory, your trusted partner for enterprise technology consulting.'
            },
            annotations: {
              italic: true,
              color: 'gray'
            }
          }
        ]
      }
    });

    return blocks;
  }

  /**
   * Convert Markdown content to Notion blocks
   * @param {string} markdown - Markdown content
   * @returns {Array} Array of Notion blocks
   */
  convertMarkdownToNotionBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split('\n');
    let currentParagraph = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Handle headings
      if (trimmedLine.startsWith('#')) {
        // Add current paragraph if exists
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join('\n')));
          currentParagraph = [];
        }

        const headingLevel = (trimmedLine.match(/^#+/) || [''])[0].length;
        const headingText = trimmedLine.replace(/^#+\s*/, '');
        
        blocks.push(this.createHeadingBlock(headingText, headingLevel));
      }
      // Handle bullet points
      else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        // Add current paragraph if exists
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join('\n')));
          currentParagraph = [];
        }

        const bulletText = trimmedLine.replace(/^[-*]\s*/, '');
        blocks.push(this.createBulletBlock(bulletText));
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(trimmedLine)) {
        // Add current paragraph if exists
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join('\n')));
          currentParagraph = [];
        }

        const numberText = trimmedLine.replace(/^\d+\.\s*/, '');
        blocks.push(this.createNumberedBlock(numberText));
      }
      // Handle empty lines
      else if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join('\n')));
          currentParagraph = [];
        }
      }
      // Handle regular text
      else {
        currentParagraph.push(line);
      }
    }

    // Add final paragraph if exists
    if (currentParagraph.length > 0) {
      blocks.push(this.createParagraphBlock(currentParagraph.join('\n')));
    }

    return blocks;
  }

  /**
   * Create paragraph block
   * @param {string} text - Paragraph text
   * @returns {Object} Notion paragraph block
   */
  createParagraphBlock(text) {
    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: this.parseRichText(text)
      }
    };
  }

  /**
   * Create heading block
   * @param {string} text - Heading text
   * @param {number} level - Heading level (1-6)
   * @returns {Object} Notion heading block
   */
  createHeadingBlock(text, level) {
    const headingType = level === 1 ? 'heading_1' : 
                       level === 2 ? 'heading_2' : 
                       'heading_3';

    return {
      object: 'block',
      type: headingType,
      [headingType]: {
        rich_text: this.parseRichText(text)
      }
    };
  }

  /**
   * Create bullet list block
   * @param {string} text - Bullet text
   * @returns {Object} Notion bullet block
   */
  createBulletBlock(text) {
    return {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: this.parseRichText(text)
      }
    };
  }

  /**
   * Create numbered list block
   * @param {string} text - Numbered text
   * @returns {Object} Notion numbered block
   */
  createNumberedBlock(text) {
    return {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: this.parseRichText(text)
      }
    };
  }

  /**
   * Parse text for rich formatting
   * @param {string} text - Text to parse
   * @returns {Array} Array of rich text objects
   */
  parseRichText(text) {
    if (!text) return [];

    // For now, return simple text
    // TODO: Add support for **bold**, *italic*, etc.
    return [
      {
        type: 'text',
        text: {
          content: text
        }
      }
    ];
  }

  /**
   * Capitalize category name
   * @param {string} category - Category name
   * @returns {string} Capitalized category
   */
  capitalizeCategory(category) {
    const categoryMap = {
      'ai': 'Artificial Intelligence',
      'devops': 'DevOps',
      'cybersecurity': 'Cybersecurity',
      'cloud': 'Cloud Computing',
      'software_engineering': 'Software Engineering',
      'technology': 'Technology'
    };

    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Update article page in Notion
   * @param {string} pageId - Notion page ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated page
   */
  async updateArticlePage(pageId, updates) {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${pageId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          properties: updates
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Notion API error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating Notion page:', error);
      throw error;
    }
  }

  /**
   * Get article page from Notion
   * @param {string} pageId - Notion page ID
   * @returns {Promise<Object>} Page data
   */
  async getArticlePage(pageId) {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${pageId}`, {
        headers: this.headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Notion API error: ${error.message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Notion page:', error);
      throw error;
    }
  }
}

/**
 * Create article page in Notion
 * @param {Object} article - Article data
 * @param {string} databaseId - Notion database ID
 * @param {string} imageUrl - Generated image URL
 * @param {string} token - Notion API token
 * @returns {Promise<Object>} Created page
 */
export async function createNotionArticle(article, databaseId, imageUrl, token) {
  const client = new NotionClient(token);
  return await client.createArticlePage(article, databaseId, imageUrl);
}

/**
 * Update article status in Notion
 * @param {string} pageId - Notion page ID
 * @param {string} status - New status
 * @param {string} token - Notion API token
 * @returns {Promise<Object>} Updated page
 */
export async function updateNotionArticleStatus(pageId, status, token) {
  const client = new NotionClient(token);
  return await client.updateArticlePage(pageId, {
    'Status': {
      select: {
        name: status
      }
    }
  });
}

export default NotionClient;