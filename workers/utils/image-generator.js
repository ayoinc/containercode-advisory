/**
 * Image Generator for Newsletter Automation
 * Uses Cloudflare Workers AI to generate article header images
 */

export class ImageGenerator {
  constructor(ai, r2Bucket) {
    this.ai = ai;
    this.r2Bucket = r2Bucket;
    this.defaultStyle = 'professional, clean, modern, technology consulting, blue and white color scheme, minimal, corporate';
  }

  /**
   * Generate header image for article using Pexels API
   * @param {Object} article - Article data
   * @param {string} pexelsApiKey - Pexels API key
   * @returns {Promise<string>} Image URL from Pexels
   */
  async generateArticleImage(article, pexelsApiKey = null) {
    try {
      // First try to get image from Pexels API
      if (pexelsApiKey) {
        const pexelsImageUrl = await this.fetchPexelsImage(article, pexelsApiKey);
        if (pexelsImageUrl) {
          return pexelsImageUrl;
        }
      }
      
      // Fallback to AI-generated image if Pexels fails
      const imagePrompt = this.createImagePrompt(article);
      const imageBlob = await this.generateImage(imagePrompt);
      
      // Store image in R2 bucket
      const imageUrl = await this.storeImage(imageBlob, article);
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating article image:', error);
      // Return fallback image URL
      return this.getFallbackImage(article.category);
    }
  }

  /**
   * Fetch relevant image from Pexels API
   * @param {Object} article - Article data
   * @param {string} apiKey - Pexels API key
   * @returns {Promise<string|null>} Pexels image URL or null if failed
   */
  async fetchPexelsImage(article, apiKey) {
    try {
      // Create search query based on article content
      const searchQuery = this.createPexelsSearchQuery(article);
      
      console.log('🖼️ Searching Pexels for:', searchQuery);
      
      const params = new URLSearchParams({
        query: searchQuery,
        per_page: '10',
        orientation: 'landscape',
        size: 'large',
        color: 'blue'
      });

      const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
          'User-Agent': 'ContainerCode Advisory/1.0'
        }
      });

      if (!response.ok) {
        console.error('Pexels API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      
      if (data.photos && data.photos.length > 0) {
        // Select the best image (first result is usually most relevant)
        const selectedPhoto = data.photos[0];
        
        // Return the large image URL
        const imageUrl = selectedPhoto.src.large;
        
        console.log('✅ Found Pexels image:', imageUrl);
        
        // Store metadata about the image usage
        await this.storePexelsImageMetadata(selectedPhoto, article);
        
        return imageUrl;
      } else {
        console.log('No Pexels images found for query:', searchQuery);
        return null;
      }
    } catch (error) {
      console.error('Error fetching image from Pexels:', error);
      return null;
    }
  }

  /**
   * Create search query for Pexels based on article
   * @param {Object} article - Article data
   * @returns {string} Search query for Pexels
   */
  createPexelsSearchQuery(article) {
    const categoryKeywords = {
      'ai': ['artificial intelligence', 'machine learning', 'neural networks', 'automation', 'robots', 'data analysis'],
      'devops': ['software development', 'computer coding', 'servers', 'cloud computing', 'automation', 'technology'],
      'cybersecurity': ['cyber security', 'network security', 'digital security', 'computer security', 'data protection'],
      'cloud': ['cloud computing', 'data center', 'servers', 'network infrastructure', 'technology'],
      'software_engineering': ['software development', 'coding', 'programming', 'computer', 'technology'],
      'technology': ['technology', 'business technology', 'digital', 'innovation', 'computing'],
      'digital_transformation': ['business technology', 'digital transformation', 'innovation', 'enterprise'],
    };

    // Get keywords for the category
    const keywords = categoryKeywords[article.category] || categoryKeywords['technology'];
    
    // Select a random keyword to get variety
    const primaryKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    // Add context words for business/professional imagery
    const contextWords = ['business', 'professional', 'corporate', 'modern'];
    const context = contextWords[Math.floor(Math.random() * contextWords.length)];
    
    return `${primaryKeyword} ${context}`;
  }

  /**
   * Store metadata about Pexels image usage
   * @param {Object} photo - Pexels photo object
   * @param {Object} article - Article data
   */
  async storePexelsImageMetadata(photo, article) {
    try {
      const metadata = {
        articleId: article.id?.toString() || 'unknown',
        articleTitle: article.title || 'untitled',
        pexelsId: photo.id,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        imageUrl: photo.src.large,
        usedAt: new Date().toISOString()
      };

      // Store in R2 as metadata file
      const metadataKey = `pexels-usage/${article.slug || 'unknown'}-${photo.id}.json`;
      
      await this.r2Bucket.put(metadataKey, JSON.stringify(metadata, null, 2), {
        httpMetadata: {
          contentType: 'application/json',
        },
        customMetadata: {
          type: 'pexels-usage-metadata'
        }
      });

      console.log('📋 Stored Pexels usage metadata for photo:', photo.id);
    } catch (error) {
      console.error('Error storing Pexels metadata:', error);
    }
  }

  /**
   * Create image generation prompt
   * @param {Object} article - Article data
   * @returns {string} Image generation prompt
   */
  createImagePrompt(article) {
    const categoryPrompts = {
      'ai': 'artificial intelligence, neural networks, machine learning, futuristic technology, brain circuits, data visualization',
      'devops': 'software development, continuous integration, deployment pipeline, code collaboration, automation, servers',
      'cybersecurity': 'digital security, shield, lock, network protection, cyber defense, secure systems',
      'cloud': 'cloud computing, servers, data centers, network infrastructure, scalable architecture, distributed systems',
      'software_engineering': 'code development, programming, software architecture, clean code, system design, development team',
      'technology': 'modern technology, digital transformation, innovation, enterprise solutions, business technology'
    };

    const categoryStyle = categoryPrompts[article.category] || 'technology, consulting, professional';
    
    const prompt = `
Professional header image for a technology consulting blog article.
Title: "${article.title}"
Category: ${article.category}
Style: ${categoryStyle}, ${this.defaultStyle}
Requirements: 
- Clean, professional appearance suitable for enterprise audience
- Technology-focused visual elements
- Modern design with blue and white color scheme
- No text or words in the image
- Landscape orientation (16:9 ratio)
- High quality, suitable for web use
- Minimalist design with clear focal point
`.trim();

    return prompt;
  }

  /**
   * Generate image using Stable Diffusion
   * @param {string} prompt - Image generation prompt
   * @returns {Promise<Blob>} Generated image blob
   */
  async generateImage(prompt) {
    try {
      console.log('Generating image with prompt:', prompt);
      
      const response = await this.ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
        prompt,
        num_steps: 20,
        strength: 1.0,
        guidance: 7.5,
        width: 1024,
        height: 576 // 16:9 aspect ratio
      });

      if (!response) {
        throw new Error('No response from AI model');
      }

      return response;
    } catch (error) {
      console.error('Error generating image with Stable Diffusion:', error);
      
      // Try alternative model
      try {
        const response = await this.ai.run('@cf/black-forest-labs/flux-1-schnell', {
          prompt,
          num_steps: 4,
          width: 1024,
          height: 576
        });

        return response;
      } catch (fallbackError) {
        console.error('Error with fallback model:', fallbackError);
        throw new Error('Failed to generate image with both models');
      }
    }
  }

  /**
   * Store generated image in R2 bucket
   * @param {Blob} imageBlob - Generated image blob
   * @param {Object} article - Article data
   * @returns {Promise<string>} Image URL
   */
  async storeImage(imageBlob, article) {
    try {
      const filename = this.generateImageFilename(article);
      const key = `blog-images/${filename}`;
      
      await this.r2Bucket.put(key, imageBlob, {
        httpMetadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000', // 1 year
        },
        customMetadata: {
          articleId: article.id?.toString() || 'unknown',
          category: article.category || 'general',
          title: article.title || 'untitled',
          generatedAt: new Date().toISOString()
        }
      });

      // Return public URL
      return `https://pub-your-bucket-id.r2.dev/${key}`;
    } catch (error) {
      console.error('Error storing image:', error);
      throw error;
    }
  }

  /**
   * Generate unique filename for image
   * @param {Object} article - Article data
   * @returns {string} Image filename
   */
  generateImageFilename(article) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const slug = article.slug || this.generateSlug(article.title);
    return `${slug}-${timestamp}.png`;
  }

  /**
   * Generate URL-friendly slug
   * @param {string} title - Article title
   * @returns {string} URL slug
   */
  generateSlug(title) {
    return (title || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }

  /**
   * Get fallback image URL for category
   * @param {string} category - Article category
   * @returns {string} Fallback image URL
   */
  getFallbackImage(category) {
    const fallbackImages = {
      'ai': '/images/hero-innovation.svg',
      'devops': '/images/hero-devops.svg',
      'cybersecurity': '/images/hero-cybersecurity.svg',
      'cloud': '/images/hero-cloud-computing.svg',
      'software_engineering': '/images/development-code.svg',
      'technology': '/images/hero-main.svg'
    };

    return fallbackImages[category] || '/images/hero-main.svg';
  }

  /**
   * Generate multiple image variations
   * @param {Object} article - Article data
   * @param {number} count - Number of variations to generate
   * @returns {Promise<Array>} Array of image URLs
   */
  async generateImageVariations(article, count = 3) {
    const variations = [];
    const basePrompt = this.createImagePrompt(article);
    
    const styleVariations = [
      'minimalist, clean lines, geometric shapes',
      'gradient background, modern icons, abstract elements',
      'isometric illustration, 3D elements, depth'
    ];

    for (let i = 0; i < Math.min(count, styleVariations.length); i++) {
      try {
        const variantPrompt = `${basePrompt}, ${styleVariations[i]}`;
        const imageBlob = await this.generateImage(variantPrompt);
        const imageUrl = await this.storeImage(imageBlob, { 
          ...article, 
          slug: `${article.slug}-variant-${i + 1}` 
        });
        variations.push(imageUrl);
      } catch (error) {
        console.error(`Error generating image variation ${i + 1}:`, error);
      }
    }

    return variations;
  }

  /**
   * Generate newsletter header image
   * @param {Object} newsletter - Newsletter data
   * @returns {Promise<string>} Newsletter header image URL
   */
  async generateNewsletterImage(newsletter) {
    try {
      const prompt = `
Professional newsletter header image for ContainerCode Advisory.
Subject: "${newsletter.subject}"
Style: ${this.defaultStyle}
Requirements:
- Corporate newsletter design
- ContainerCode Advisory branding feel
- Professional technology consulting theme
- Email header format (wide aspect ratio)
- Clean, modern design
- Blue and white color scheme
- No text or words in the image
`.trim();

      const imageBlob = await this.generateImage(prompt);
      const imageUrl = await this.storeImage(imageBlob, {
        slug: `newsletter-${newsletter.issue_number}`,
        category: 'newsletter',
        title: newsletter.subject
      });

      return imageUrl;
    } catch (error) {
      console.error('Error generating newsletter image:', error);
      return '/images/containercode-logo-horizontal.svg';
    }
  }

  /**
   * Cleanup old images from R2 bucket
   * @param {number} daysOld - Delete images older than this many days
   * @returns {Promise<number>} Number of images deleted
   */
  async cleanupOldImages(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const objects = await this.r2Bucket.list({ prefix: 'blog-images/' });
      let deletedCount = 0;

      for (const object of objects.objects) {
        if (object.uploaded < cutoffDate) {
          await this.r2Bucket.delete(object.key);
          deletedCount++;
        }
      }

      console.log(`Cleaned up ${deletedCount} old images`);
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up old images:', error);
      return 0;
    }
  }
}

/**
 * Generate image for article
 * @param {Object} article - Article data
 * @param {Object} ai - AI binding
 * @param {Object} r2Bucket - R2 bucket binding
 * @param {string} pexelsApiKey - Pexels API key
 * @returns {Promise<string>} Generated image URL
 */
export async function generateArticleImage(article, ai, r2Bucket, pexelsApiKey = null) {
  const generator = new ImageGenerator(ai, r2Bucket);
  return await generator.generateArticleImage(article, pexelsApiKey);
}

/**
 * Generate newsletter header image
 * @param {Object} newsletter - Newsletter data
 * @param {Object} ai - AI binding
 * @param {Object} r2Bucket - R2 bucket binding
 * @returns {Promise<string>} Generated image URL
 */
export async function generateNewsletterImage(newsletter, ai, r2Bucket) {
  const generator = new ImageGenerator(ai, r2Bucket);
  return await generator.generateNewsletterImage(newsletter);
}

export default ImageGenerator;