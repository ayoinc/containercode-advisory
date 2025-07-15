#!/usr/bin/env node
/**
 * Improve Notion Content Structure
 * This script improves and restructures existing Notion content with proper body sections
 */

import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

const DATABASE_IDS = {
  BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS!,
};

// Comprehensive blog content with proper structure
const improvedBlogContent = {
  'multi-cloud-architecture-strategies': {
    title: 'Multi-Cloud Architecture Strategies for Modern Enterprises',
    slug: 'multi-cloud-architecture-strategies',
    category: 'Cloud Strategy',
    excerpt: 'A comprehensive guide to designing and implementing multi-cloud architectures that drive business value whilst reducing vendor dependency and operational risk.',
    blocks: [
      {
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'Multi-Cloud Architecture Strategies for Modern Enterprises' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'In today\'s competitive landscape, enterprises increasingly recognise that relying on a single cloud provider presents significant strategic and operational risks. Multi-cloud architecture has emerged as the preferred approach for organisations seeking to maximise flexibility, optimise costs, and ensure business continuity.' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Strategic Benefits of Multi-Cloud Architecture' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Multi-cloud strategies offer several compelling advantages for modern enterprises. Vendor diversification reduces dependency risks and provides greater negotiating leverage. Geographic distribution enables compliance with data sovereignty requirements whilst improving performance through reduced latency.' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Risk mitigation through vendor diversification' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Best-of-breed service selection across providers' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Enhanced disaster recovery and business continuity' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Improved cost optimisation through competitive pricing' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Implementation Framework' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Successful multi-cloud implementation requires a structured approach encompassing governance, architecture, and operational considerations. Begin with a comprehensive assessment of current infrastructure and business requirements.' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Establish clear governance frameworks and policies' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Design consistent networking and security architectures' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Implement unified monitoring and management tools' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Develop cloud-agnostic deployment pipelines' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Best Practices and Considerations' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Effective multi-cloud management requires standardised approaches to security, compliance, and operations. Invest in cloud management platforms that provide unified visibility and control across all environments. Ensure teams receive appropriate training on multiple cloud platforms.' }}]
        }
      }
    ]
  },
  'ai-driven-digital-transformation': {
    title: 'AI-Driven Digital Transformation: A Complete Enterprise Guide',
    slug: 'ai-driven-digital-transformation',
    category: 'Digital Transformation',
    excerpt: 'How artificial intelligence is reshaping enterprise digital transformation strategies, with practical implementation guidance for sustainable competitive advantage.',
    blocks: [
      {
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'AI-Driven Digital Transformation: A Complete Enterprise Guide' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Artificial intelligence is fundamentally transforming how enterprises approach digital transformation. Beyond automation, AI enables organisations to reimagine business processes, enhance customer experiences, and create new value propositions that were previously impossible.' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'The AI Transformation Imperative' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Digital transformation initiatives that integrate artificial intelligence deliver significantly higher returns on investment. McKinsey research indicates that organisations successfully implementing AI-driven transformation achieve 20-30% improvements in operational efficiency and customer satisfaction metrics.' }}]
        }
      },
      {
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: 'Key Application Areas' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Intelligent process automation and optimisation' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Predictive analytics for strategic decision-making' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Personalised customer experience delivery' }}]
        }
      },
      {
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Advanced cybersecurity threat detection' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Implementation Strategy' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Successful AI transformation requires a comprehensive strategy addressing technology, data, people, and processes. Begin with pilot projects that demonstrate clear business value before scaling across the organisation.' }}]
        }
      }
    ]
  },
  'mastering-gitops': {
    title: 'Mastering GitOps: The Future of Continuous Deployment',
    slug: 'mastering-gitops',
    category: 'DevOps',
    excerpt: 'Comprehensive guide to implementing GitOps methodologies for automated, reliable, and secure software delivery at enterprise scale.',
    blocks: [
      {
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'Mastering GitOps: The Future of Continuous Deployment' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'GitOps represents a paradigm shift in continuous deployment, leveraging Git repositories as the single source of truth for both application code and infrastructure configuration. This approach enables teams to achieve unprecedented levels of automation, reliability, and security in their deployment pipelines.' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'GitOps Fundamentals' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'GitOps operates on four core principles: declarative configuration, version control as source of truth, automated deployment, and continuous monitoring. These principles create a robust framework for managing complex deployment scenarios whilst maintaining complete audit trails.' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Declarative infrastructure and application configuration' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Git-based workflow for all changes and deployments' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Automated synchronisation between Git and live environments' }}]
        }
      },
      {
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [{ type: 'text', text: { content: 'Continuous monitoring and drift detection' }}]
        }
      },
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Enterprise Implementation' }}]
        }
      },
      {
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Enterprise GitOps implementation requires careful consideration of security, compliance, and governance requirements. Implement proper access controls, approval workflows, and audit logging to meet regulatory obligations whilst maintaining deployment velocity.' }}]
        }
      }
    ]
  }
};

async function updateBlogContent(pageId: string, content: any) {
  try {
    console.log(`🔄 Updating content for page: ${pageId}`);
    
    // First, get existing blocks
    const existingBlocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    // Delete existing blocks
    for (const block of existingBlocks.results) {
      try {
        await notion.blocks.delete({
          block_id: (block as any).id,
        });
      } catch (error) {
        console.log(`   Warning: Could not delete block ${(block as any).id}`);
      }
    }

    // Add new content blocks
    const chunks = [];
    for (let i = 0; i < content.blocks.length; i += 100) {
      chunks.push(content.blocks.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: chunk,
      });
    }

    console.log(`✅ Successfully updated content for page: ${pageId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating content for page ${pageId}:`, error);
    return false;
  }
}

async function improveAllContent() {
  console.log('🚀 Starting Notion content improvement...\n');

  try {
    // Get all blog posts
    const blogResponse = await notion.databases.query({
      database_id: DATABASE_IDS.BLOG_POSTS,
      page_size: 100,
    });

    console.log(`📝 Found ${blogResponse.results.length} blog posts\n`);

    let updatedCount = 0;

    for (const post of blogResponse.results) {
      if ('properties' in post) {
        const slug = (post.properties.Slug as any)?.rich_text?.[0]?.plain_text || '';
        const title = (post.properties.Title as any)?.title?.[0]?.plain_text || 'Untitled';
        
        console.log(`Processing: ${title}`);
        console.log(`  Slug: ${slug}`);

        // Check if we have improved content for this slug
        const contentKey = Object.keys(improvedBlogContent).find(key => 
          slug.includes(key) || key.includes(slug.replace(/-/g, '-'))
        );

        if (contentKey) {
          const improvedContent = improvedBlogContent[contentKey as keyof typeof improvedBlogContent];
          
          // Update the page properties first
          try {
            await notion.pages.update({
              page_id: post.id,
              properties: {
                Title: {
                  title: [{ text: { content: improvedContent.title } }]
                },
                Slug: {
                  rich_text: [{ text: { content: improvedContent.slug } }]
                },
                Category: {
                  select: { name: improvedContent.category }
                },
                Excerpt: {
                  rich_text: [{ text: { content: improvedContent.excerpt } }]
                },
                Status: {
                  select: { name: 'Published' }
                }
              }
            });
            
            // Update content blocks
            const success = await updateBlogContent(post.id, improvedContent);
            if (success) {
              updatedCount++;
            }
          } catch (error) {
            console.error(`❌ Error updating page properties for ${title}:`, error);
          }
        } else {
          console.log(`  ⚠️  No improved content found for this slug`);
        }
        
        console.log(''); // Empty line for readability
      }
    }

    console.log(`\n🎉 Content improvement completed!`);
    console.log(`📊 Updated ${updatedCount} blog posts successfully`);

  } catch (error) {
    console.error('❌ Error improving content:', error);
  }
}

improveAllContent().catch(console.error);