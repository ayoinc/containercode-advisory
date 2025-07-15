/**
 * Article Generator Worker
 * Main worker that orchestrates RSS parsing, content generation, validation, and Notion publishing
 */

import { parseRSSFeeds } from './utils/rss-parser.js';
import { generateArticle } from './utils/content-generator.js';
import { validateArticle, autoFixArticle } from './utils/content-validator.js';
import { createNotionArticle } from './utils/notion-client.js';
import { generateArticleImage } from './utils/image-generator.js';

export default {
  /**
   * Scheduled event handler for daily article generation
   * @param {ScheduledEvent} event - Scheduled event
   * @param {Object} env - Environment variables and bindings
   * @param {Object} ctx - Execution context
   */
  async scheduled(event, env, ctx) {
    console.log('🚀 Starting scheduled article generation job');
    
    // Log job start
    const jobId = await this.logJobStart(env, 'article-generation');
    let processedCount = 0;
    let errorCount = 0;

    try {
      // Parse RSS feeds and get relevant articles
      console.log('📡 Parsing RSS feeds...');
      const rssArticles = await parseRSSFeeds(env);
      console.log(`Found ${rssArticles.length} relevant articles from RSS feeds`);

      if (rssArticles.length === 0) {
        console.log('No new articles found, skipping generation');
        await this.logJobEnd(env, jobId, 'completed', 'No new articles found', 0);
        return;
      }

      // Process each article
      for (const rssArticle of rssArticles.slice(0, 5)) { // Limit to 5 articles per run
        try {
          console.log(`\n📝 Processing article: "${rssArticle.title}"`);
          
          // Check if article already exists
          const existingArticle = await this.checkExistingArticle(env, rssArticle);
          if (existingArticle) {
            console.log('Article already exists, skipping...');
            continue;
          }

          // Generate comprehensive article content
          console.log('🤖 Generating article content with AI...');
          const generatedArticle = await generateArticle(rssArticle, rssArticle.category, env.AI);
          
          // Validate and fix article
          console.log('✅ Validating article content...');
          const validation = await validateArticle(generatedArticle);
          
          let finalArticle = generatedArticle;
          if (!validation.isValid) {
            console.log('🔧 Auto-fixing article issues...');
            finalArticle = autoFixArticle(generatedArticle);
            
            // Re-validate after fixes
            const revalidation = await validateArticle(finalArticle);
            if (!revalidation.isValid) {
              console.log('❌ Article validation failed, skipping:', revalidation.errors);
              errorCount++;
              continue;
            }
          }

          // Generate header image
          console.log('🎨 Generating header image...');
          const imageUrl = await generateArticleImage(finalArticle, env.AI, env.IMAGES);
          
          // Store article in database
          console.log('💾 Storing article in database...');
          const dbResult = await env.DB.prepare(`
            INSERT INTO articles (
              title, content, summary, excerpt, slug, image_url, 
              category, tags, author, word_count, reading_time,
              source_url, source_feed, seo_title, seo_description,
              status, validation_status, created_at, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            finalArticle.title,
            finalArticle.content,
            finalArticle.summary,
            finalArticle.excerpt,
            finalArticle.slug,
            imageUrl,
            finalArticle.category,
            JSON.stringify(finalArticle.tags || []),
            finalArticle.author,
            finalArticle.word_count,
            finalArticle.reading_time,
            finalArticle.source_url,
            finalArticle.source_feed,
            finalArticle.seo_title,
            finalArticle.seo_description,
            'published',
            'valid',
            new Date().toISOString(),
            new Date().toISOString()
          ).run();

          const articleId = dbResult.meta.last_row_id;
          
          // Create Notion page
          console.log('📋 Creating Notion page...');
          const notionPage = await createNotionArticle(
            { ...finalArticle, id: articleId },
            env.NOTION_DATABASE_GENERATED_ARTICLES,
            imageUrl,
            env.NOTION_TOKEN
          );

          // Update article with Notion page ID
          await env.DB.prepare(`
            UPDATE articles SET notion_page_id = ? WHERE id = ?
          `).bind(notionPage.id, articleId).run();

          // Store validation results
          await env.DB.prepare(`
            INSERT INTO content_validations (
              article_id, validation_type, is_valid, errors, warnings, validated_at
            ) VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            articleId,
            'comprehensive',
            validation.isValid,
            JSON.stringify(validation.errors || []),
            JSON.stringify(validation.warnings || []),
            new Date().toISOString()
          ).run();

          processedCount++;
          console.log(`✅ Successfully processed article: "${finalArticle.title}"`);
          
        } catch (error) {
          console.error(`❌ Error processing article "${rssArticle.title}":`, error);
          errorCount++;
        }
      }

      console.log(`\n🎉 Article generation completed. Processed: ${processedCount}, Errors: ${errorCount}`);
      
      // Log job completion
      await this.logJobEnd(env, jobId, 'completed', `Processed ${processedCount} articles`, processedCount);
      
      // Clean up old images if needed
      if (processedCount > 0) {
        console.log('🧹 Cleaning up old images...');
        try {
          const imageGenerator = new (await import('./utils/image-generator.js')).ImageGenerator(env.AI, env.IMAGES);
          await imageGenerator.cleanupOldImages(30);
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      }

    } catch (error) {
      console.error('❌ Fatal error in article generation job:', error);
      await this.logJobEnd(env, jobId, 'failed', error.message, processedCount);
    }
  },

  /**
   * HTTP request handler for manual article generation
   * @param {Request} request - HTTP request
   * @param {Object} env - Environment variables and bindings
   * @param {Object} ctx - Execution context
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/generate' && request.method === 'POST') {
      try {
        const body = await request.json();
        
        // Validate request
        if (!body.rss_url || !body.category) {
          return new Response(JSON.stringify({
            error: 'Missing required fields: rss_url, category'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Parse single RSS feed
        const rssParser = new (await import('./utils/rss-parser.js')).RSSParser();
        const articles = await rssParser.parseFeed(body.rss_url, body.category);
        
        if (articles.length === 0) {
          return new Response(JSON.stringify({
            error: 'No articles found in RSS feed'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Generate article from first result
        const rssArticle = articles[0];
        const generatedArticle = await generateArticle(rssArticle, body.category, env.AI);
        
        // Validate article
        const validation = await validateArticle(generatedArticle);
        
        let articleId = null;
        let notionPage = null;
        
        // Save to database if requested
        if (body.save_to_db || body.publish_to_notion) {
          console.log('💾 Saving article to database...');
          
          // Auto-fix article if needed
          const finalArticle = validation.isValid ? generatedArticle : await autoFixArticle(generatedArticle, validation);
          
          // Generate image if requested
          let imageUrl = null;
          if (body.generate_image) {
            console.log('🎨 Generating article image...');
            try {
              const imageGenerator = new (await import('./utils/image-generator.js')).ImageGenerator(env.AI, env.IMAGES);
              imageUrl = await imageGenerator.generateArticleImage(finalArticle);
            } catch (imageError) {
              console.error('Error generating image:', imageError);
            }
          }
          
          // Insert into database
          const dbResult = await env.DB.prepare(`
            INSERT INTO articles (
              title, content, summary, excerpt, slug, image_url, category, tags, author,
              word_count, reading_time, source_url, source_feed, seo_title, seo_description,
              status, validation_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            finalArticle.title,
            finalArticle.content,
            finalArticle.summary,
            finalArticle.excerpt,
            finalArticle.slug,
            imageUrl,
            finalArticle.category,
            JSON.stringify(finalArticle.tags || []),
            finalArticle.author,
            finalArticle.word_count,
            finalArticle.reading_time,
            finalArticle.source_url,
            finalArticle.source_feed,
            finalArticle.seo_title,
            finalArticle.seo_description,
            body.test ? 'draft' : 'published',
            validation.isValid ? 'valid' : 'pending',
            new Date().toISOString(),
            new Date().toISOString()
          ).run();

          articleId = dbResult.meta.last_row_id;
          console.log(`📝 Article saved to database with ID: ${articleId}`);
          
          // Create Notion page if requested
          if (body.publish_to_notion) {
            console.log('📋 Creating Notion page...');
            try {
              notionPage = await createNotionArticle(
                { ...finalArticle, id: articleId },
                env.NOTION_DATABASE_GENERATED_ARTICLES,
                imageUrl,
                env.NOTION_TOKEN
              );

              // Update article with Notion page ID
              await env.DB.prepare(`
                UPDATE articles SET notion_page_id = ? WHERE id = ?
              `).bind(notionPage.id, articleId).run();
              
              console.log(`📋 Notion page created: ${notionPage.url}`);
            } catch (notionError) {
              console.error('Error creating Notion page:', notionError);
            }
          }
        }
        
        return new Response(JSON.stringify({
          article: generatedArticle,
          validation: validation,
          saved: !!articleId,
          articleId: articleId,
          notionPage: notionPage
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({
          error: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (url.pathname === '/status') {
      const stats = await this.getJobStats(env);
      return new Response(JSON.stringify(stats), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Article Generator Worker\n\nEndpoints:\n- POST /generate\n- GET /status', {
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  /**
   * Check if article already exists in database
   * @param {Object} env - Environment bindings
   * @param {Object} rssArticle - RSS article data
   * @returns {Promise<boolean>} True if article exists
   */
  async checkExistingArticle(env, rssArticle) {
    const existing = await env.DB.prepare(`
      SELECT id FROM articles 
      WHERE source_url = ? OR title = ?
      LIMIT 1
    `).bind(rssArticle.link, rssArticle.title).first();
    
    return !!existing;
  },

  /**
   * Log job start
   * @param {Object} env - Environment bindings
   * @param {string} jobName - Job name
   * @returns {Promise<number>} Job ID
   */
  async logJobStart(env, jobName) {
    const result = await env.DB.prepare(`
      INSERT INTO cron_logs (job_name, status, start_time) 
      VALUES (?, ?, ?)
    `).bind(jobName, 'started', new Date().toISOString()).run();
    
    return result.meta.last_row_id;
  },

  /**
   * Log job completion
   * @param {Object} env - Environment bindings
   * @param {number} jobId - Job ID
   * @param {string} status - Job status
   * @param {string} result - Job result
   * @param {number} recordsProcessed - Records processed
   */
  async logJobEnd(env, jobId, status, result, recordsProcessed) {
    const endTime = new Date().toISOString();
    
    await env.DB.prepare(`
      UPDATE cron_logs 
      SET status = ?, end_time = ?, result = ?, records_processed = ?
      WHERE id = ?
    `).bind(status, endTime, result, recordsProcessed, jobId).run();
  },

  /**
   * Get job statistics
   * @param {Object} env - Environment bindings
   * @returns {Promise<Object>} Job statistics
   */
  async getJobStats(env) {
    const recentJobs = await env.DB.prepare(`
      SELECT * FROM cron_logs 
      WHERE job_name = 'article-generation' 
      ORDER BY start_time DESC 
      LIMIT 10
    `).all();

    const articleCount = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM articles
    `).first();

    const todaysArticles = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM articles 
      WHERE DATE(created_at) = DATE('now')
    `).first();

    return {
      total_articles: articleCount.count,
      todays_articles: todaysArticles.count,
      recent_jobs: recentJobs.results
    };
  }
};