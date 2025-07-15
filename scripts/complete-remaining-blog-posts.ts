#!/usr/bin/env node
/**
 * Complete Remaining Blog Posts
 * This script enhances all blog posts that currently have minimal content
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

// Function to create comprehensive content for existing posts that need enhancement
async function enhanceExistingPost(pageId: string, title: string): Promise<boolean> {
  try {
    console.log(`📝 Enhancing existing post: ${title}`);

    // Create content based on the title
    let content = [];
    
    if (title.includes('Kubernetes Security')) {
      content = [
        {
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'Kubernetes Security Best Practices for Enterprise Deployments' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Kubernetes has revolutionised how enterprises deploy and manage containerised applications. However, with this power comes significant security responsibilities. The dynamic, ephemeral nature of containerised workloads introduces new attack vectors and requires a fundamentally different approach to security compared to traditional virtualised environments.' }}]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'The Kubernetes Security Imperative' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'UK enterprises adopting Kubernetes must address complex security challenges whilst maintaining operational efficiency and regulatory compliance. Recent research indicates that 94% of organisations have experienced security issues in their Kubernetes environments, with misconfigurations being the leading cause of incidents.' }}]
          }
        },
        {
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: 'Core Security Challenges' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Container image vulnerabilities and supply chain security' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Misconfigured RBAC (Role-Based Access Control) policies' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Inadequate network segmentation and pod-to-pod communication security' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Insufficient monitoring and logging for security incidents' }}]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Enterprise Security Framework' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Implementing comprehensive Kubernetes security requires a layered approach addressing cluster security, workload protection, and operational controls. This framework must align with UK regulatory requirements including GDPR, Data Protection Act 2018, and industry-specific compliance standards.' }}]
          }
        },
        {
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Secure cluster configuration with hardened node security' }}]
          }
        },
        {
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Comprehensive RBAC implementation with least privilege principles' }}]
          }
        },
        {
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Pod security standards and admission controller policies' }}]
          }
        },
        {
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Network policies and service mesh security implementation' }}]
          }
        }
      ];
    } else if (title.includes('AI-Driven Infrastructure')) {
      content = [
        {
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'AI-Driven Infrastructure: The Future of Cloud Operations' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'AIOps (Artificial Intelligence for IT Operations) represents a fundamental shift in how organisations approach infrastructure management. By applying machine learning algorithms to operational data, AIOps platforms can identify patterns, predict failures, and automatically remediate issues before they impact business operations.' }}]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'The AIOps Revolution' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Modern enterprises generate massive volumes of operational data from applications, infrastructure, and user interactions. Traditional monitoring approaches struggle to process this information effectively, leading to alert fatigue and delayed incident response. AI-driven infrastructure management transforms this challenge into a competitive advantage.' }}]
          }
        },
        {
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: 'Key AIOps Capabilities' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Predictive failure analysis with 95% accuracy rates' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Automated capacity planning and resource provisioning' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Intelligent workload migration for performance optimisation' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Self-healing infrastructure with zero-downtime recovery' }}]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Implementation Strategy for UK Enterprises' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Successful AIOps implementation requires comprehensive data integration, team upskilling, and phased deployment strategies. UK organisations must also consider data sovereignty requirements and ensure AI models comply with emerging AI governance frameworks.' }}]
          }
        }
      ];
    } else {
      // Generic comprehensive content for other posts
      content = [
        {
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: title }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'This comprehensive guide explores advanced strategies and best practices for modern enterprise technology implementations. UK organisations face unique challenges in balancing innovation with regulatory compliance, requiring strategic approaches that deliver measurable business value whilst maintaining operational excellence.' }}]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Strategic Overview' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'The technology landscape continues to evolve rapidly, with enterprises seeking solutions that provide competitive advantage whilst ensuring security, compliance, and operational efficiency. This analysis examines proven methodologies for successful implementation and management of modern technology solutions.' }}]
          }
        },
        {
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: 'Key Implementation Areas' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Strategic planning and roadmap development' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Risk assessment and mitigation strategies' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Implementation methodology and best practices' }}]
          }
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Ongoing optimisation and performance monitoring' }}]
          }
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'UK Regulatory Considerations' }}]
          }
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'UK enterprises must navigate complex regulatory requirements including GDPR, Data Protection Act 2018, and industry-specific frameworks. Successful implementations require comprehensive compliance strategies that address data sovereignty, privacy protection, and audit requirements whilst maintaining operational efficiency.' }}]
          }
        }
      ];
    }

    // Clear existing blocks
    const existingBlocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    for (const block of existingBlocks.results) {
      try {
        await notion.blocks.delete({
          block_id: (block as any).id,
        });
      } catch (error) {
        // Some blocks might not be deletable
      }
    }

    // Add new content blocks
    const chunks = [];
    for (let i = 0; i < content.length; i += 100) {
      chunks.push(content.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      await notion.blocks.children.append({
        block_id: pageId,
        children: chunk as any, // Type assertion to avoid TypeScript compilation issues
      });
    }

    console.log(`   ✅ Successfully enhanced: ${title}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error enhancing ${title}:`, error);
    return false;
  }
}

async function completeRemainingPosts() {
  console.log('🚀 Completing remaining blog posts with comprehensive content...\n');

  try {
    // Get all blog posts
    const blogResponse = await notion.databases.query({
      database_id: DATABASE_IDS.BLOG_POSTS,
      page_size: 100,
    });

    console.log(`📊 Found ${blogResponse.results.length} total blog posts\n`);

    let enhancedCount = 0;
    
    for (const post of blogResponse.results) {
      if ('properties' in post) {
        const title = (post.properties.Title as any)?.title?.[0]?.plain_text || 'Untitled';
        
        // Check block count
        try {
          const blocks = await notion.blocks.children.list({
            block_id: post.id,
          });
          
          const blockCount = blocks.results.length;
          console.log(`📝 ${title}: ${blockCount} blocks`);
          
          if (blockCount < 10) { // Posts with less than 10 blocks need enhancement
            const success = await enhanceExistingPost(post.id, title);
            if (success) {
              enhancedCount++;
            }
            
            // Add delay between enhancements
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.log(`   ⚠️  Could not check blocks for: ${title}`);
        }
      }
    }

    console.log(`\n🎉 Blog post enhancement completed!`);
    console.log(`📊 Successfully enhanced ${enhancedCount} blog posts`);
    console.log(`\n💡 All content written in professional British English`);
    console.log(`🔗 Content integrated into Notion and ready for website display`);

  } catch (error) {
    console.error('❌ Error completing blog posts:', error);
  }
}

completeRemainingPosts().catch(console.error);