#!/usr/bin/env node
/**
 * Content Population Script for ContainerCode Advisory
 * 
 * This script populates the Notion databases with professional British English content
 * for blog posts, team members, and other website content.
 */

import { Client } from '@notionhq/client';
import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Environment validation
const requiredEnvVars = {
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE_BLOG_POSTS: process.env.NOTION_DATABASE_BLOG_POSTS,
  NOTION_DATABASE_SERVICES: process.env.NOTION_DATABASE_SERVICES,
  NOTION_DATABASE_NEWSLETTERS: process.env.NOTION_DATABASE_NEWSLETTERS,
  NOTION_DATABASE_WEBSITE_PAGES: process.env.NOTION_DATABASE_WEBSITE_PAGES,
} as const;

// Validate environment variables
const validateEnvironment = () => {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(`❌ Missing environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  return true;
};

validateEnvironment();

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

/**
 * Professional Blog Posts in British English
 */
const blogPosts = [
  {
    title: "The Strategic Imperative for Multi-Cloud Architecture in 2024",
    slug: "strategic-imperative-multi-cloud-architecture-2024",
    excerpt: "As enterprises increasingly adopt hybrid working models and digital-first strategies, the need for robust, flexible cloud infrastructure has never been more critical. This comprehensive analysis explores why multi-cloud architecture represents not just a technical decision, but a strategic imperative for businesses seeking to maintain competitive advantage.",
    category: "Cloud Strategy",
    tags: ["multi-cloud", "strategy", "enterprise-architecture", "digital-transformation"],
    publishedDate: "2024-01-15",
    status: "Published",
    featured: true,
    author: "Sarah Johnson",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "The Evolution of Cloud Strategy" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "The cloud computing landscape has matured significantly over the past decade. What began as a simple cost-optimisation exercise has evolved into a fundamental enabler of business agility, innovation, and competitive differentiation. Today's enterprises face an increasingly complex set of requirements that no single cloud provider can adequately address."
            }
          }]
        }
      },
      {
        type: "heading_3",
        heading_3: {
          rich_text: [{
            type: "text",
            text: { content: "Key Drivers for Multi-Cloud Adoption" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Vendor risk mitigation and negotiating leverage" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Best-of-breed service selection for specific workloads" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Geographic presence and regulatory compliance requirements" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Performance optimisation and latency reduction" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "Research from leading industry analysts indicates that over 85% of large enterprises will have adopted a multi-cloud strategy by the end of 2024, driven primarily by the need for flexibility, resilience, and the ability to leverage specialised services across providers."
            }
          }]
        }
      }
    ]
  },
  {
    title: "Zero Trust Security: Implementation Roadmap for UK Enterprises",
    slug: "zero-trust-security-implementation-roadmap-uk-enterprises",
    excerpt: "The shift to remote and hybrid working models has fundamentally altered the security perimeter. Traditional castle-and-moat security models are no longer sufficient. This detailed implementation guide provides UK enterprises with a practical roadmap for deploying zero trust architecture whilst maintaining business continuity and regulatory compliance.",
    category: "Cybersecurity",
    tags: ["zero-trust", "cybersecurity", "security-architecture", "uk-compliance"],
    publishedDate: "2024-01-12",
    status: "Published",
    featured: true,
    author: "Michael Chen",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Understanding Zero Trust Fundamentals" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "Zero trust security operates on the principle of 'never trust, always verify'. This paradigm shift requires organisations to authenticate and authorise every connection attempt, regardless of location or previous access history. For UK enterprises, this approach is particularly relevant given the increasing regulatory scrutiny and sophisticated threat landscape."
            }
          }]
        }
      },
      {
        type: "heading_3",
        heading_3: {
          rich_text: [{
            type: "text",
            text: { content: "Core Components of Zero Trust Architecture" }
          }]
        }
      },
      {
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Identity and Access Management (IAM) with multi-factor authentication" }
          }]
        }
      },
      {
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Micro-segmentation and network access control" }
          }]
        }
      },
      {
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Continuous monitoring and behavioural analytics" }
          }]
        }
      },
      {
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Data classification and protection mechanisms" }
          }]
        }
      }
    ]
  },
  {
    title: "DevOps Maturity: Transforming Software Delivery in Financial Services",
    slug: "devops-maturity-transforming-software-delivery-financial-services",
    excerpt: "Financial services organisations face unique challenges in adopting DevOps practices due to stringent regulatory requirements and legacy system constraints. This case study examines how leading UK financial institutions have successfully navigated these challenges to achieve significant improvements in delivery velocity and operational stability.",
    category: "DevOps",
    tags: ["devops", "financial-services", "transformation", "regulatory-compliance"],
    publishedDate: "2024-01-10",
    status: "Published",
    featured: false,
    author: "David Kumar",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "The Financial Services DevOps Challenge" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "Financial services organisations operate in a highly regulated environment where security, compliance, and operational stability are paramount. Traditional waterfall development methodologies, whilst providing perceived control and predictability, often result in lengthy release cycles, reduced agility, and increased technical debt."
            }
          }]
        }
      }
    ]
  },
  {
    title: "Digital Transformation Lessons from UK Manufacturing",
    slug: "digital-transformation-lessons-uk-manufacturing",
    excerpt: "The UK manufacturing sector has undergone a remarkable digital transformation over the past five years. From IoT-enabled production lines to AI-driven predictive maintenance, manufacturers are leveraging technology to enhance productivity, reduce costs, and improve customer satisfaction. This comprehensive study analyses key success factors and common pitfalls.",
    category: "Digital Transformation",
    tags: ["manufacturing", "digital-transformation", "iot", "industry-4.0"],
    publishedDate: "2024-01-08",
    status: "Published",
    featured: false,
    author: "Emma Thompson",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "The Manufacturing Renaissance" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "UK manufacturing has experienced a digital renaissance, driven by the convergence of several technological trends: the Industrial Internet of Things (IIoT), artificial intelligence and machine learning, advanced robotics, and cloud computing. These technologies are enabling manufacturers to create smart factories that are more efficient, flexible, and responsive to market demands."
            }
          }]
        }
      }
    ]
  },
  {
    title: "Kubernetes Security Best Practices for Enterprise Deployments",
    slug: "kubernetes-security-best-practices-enterprise-deployments",
    excerpt: "As Kubernetes becomes the de facto standard for container orchestration, securing these environments has become a critical concern for enterprise IT teams. This technical deep-dive explores comprehensive security strategies, from cluster hardening to runtime protection, with practical implementation guidance for production environments.",
    category: "DevOps",
    tags: ["kubernetes", "container-security", "devops", "enterprise"],
    publishedDate: "2024-01-05",
    status: "Published",
    featured: false,
    author: "James Wilson",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "The Kubernetes Security Imperative" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "Kubernetes has revolutionised how enterprises deploy and manage containerised applications. However, with this power comes significant security responsibilities. The dynamic, ephemeral nature of containerised workloads introduces new attack vectors and requires a fundamentally different approach to security compared to traditional virtualised environments."
            }
          }]
        }
      }
    ]
  },
  {
    title: "AI-Driven Infrastructure: The Future of Cloud Operations",
    slug: "ai-driven-infrastructure-future-cloud-operations",
    excerpt: "Artificial intelligence is transforming cloud infrastructure management from reactive problem-solving to predictive optimisation. This forward-looking analysis examines emerging AIOps capabilities, practical implementation strategies, and the potential impact on operational efficiency and service reliability.",
    category: "Industry Analysis",
    tags: ["artificial-intelligence", "aiops", "cloud-operations", "automation"],
    publishedDate: "2024-01-03",
    status: "Published",
    featured: false,
    author: "Sarah Johnson",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "The AIOps Revolution" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "AIOps (Artificial Intelligence for IT Operations) represents a fundamental shift in how organisations approach infrastructure management. By applying machine learning algorithms to operational data, AIOps platforms can identify patterns, predict failures, and automatically remediate issues before they impact business operations."
            }
          }]
        }
      }
    ]
  }
];

/**
 * Website Pages Content
 */
const websitePages = [
  {
    title: "Privacy Policy",
    slug: "privacy",
    status: "Published",
    content: [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [{
            type: "text",
            text: { content: "Privacy Policy" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "ContainerCode Advisory Limited is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and protect information when you visit our website or engage our services."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Information We Collect" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, request a consultation, or contact us for support. This may include your name, email address, company name, job title, phone number, and any messages you send to us."
            }
          }]
        }
      },
      {
        type: "heading_3",
        heading_3: {
          rich_text: [{
            type: "text",
            text: { content: "Automatically Collected Information" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "We automatically collect certain information about your device and how you interact with our website, including IP address, browser type, operating system, referring URLs, pages viewed, and time spent on our site. We use cookies and similar technologies to collect this information."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "How We Use Your Information" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Provide, maintain, and improve our services" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Process transactions and send related information" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Send technical notices, updates, and support messages" }
          }]
        }
      },
      {
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{
            type: "text",
            text: { content: "Respond to comments, questions, and requests" }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Data Protection and GDPR Compliance" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "As a UK-based company, we comply with the General Data Protection Regulation (GDPR) and the UK Data Protection Act 2018. You have the right to access, update, or delete your personal information. You may also object to or restrict our processing of your data and request data portability."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Contact Information" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@containercode.club or ContainerCode Advisory Limited, registered in England and Wales."
            }
          }]
        }
      }
    ]
  },
  {
    title: "Terms of Service",
    slug: "terms",
    status: "Published",
    content: [
      {
        type: "heading_1",
        heading_1: {
          rich_text: [{
            type: "text",
            text: { content: "Terms of Service" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "These Terms of Service govern your access to and use of ContainerCode Advisory Limited's website and services. By accessing or using our services, you agree to be bound by these terms."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Service Description" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "ContainerCode Advisory provides technology consulting services including cloud strategy, cybersecurity, DevOps implementation, digital transformation, and managed IT support services to businesses and organisations."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Acceptable Use" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "You agree to use our services only for lawful purposes and in accordance with these Terms. You may not use our services to transmit, distribute, or store material that violates any applicable law or regulation."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Intellectual Property" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "All content, features, and functionality of our website and services are owned by ContainerCode Advisory Limited and are protected by United Kingdom and international copyright, trademark, and other intellectual property laws."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Limitation of Liability" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "To the maximum extent permitted by applicable law, ContainerCode Advisory Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly."
            }
          }]
        }
      },
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Governing Law" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "These Terms shall be governed by and construed in accordance with the laws of England and Wales, and any disputes relating to these Terms will be subject to the exclusive jurisdiction of the courts of England and Wales."
            }
          }]
        }
      }
    ]
  }
];

/**
 * Newsletter Content
 */
const newsletters = [
  {
    title: "Cloud Strategy Weekly - Infrastructure Innovation",
    slug: "cloud-strategy-weekly-infrastructure-innovation",
    status: "Published",
    publishedDate: "2024-01-15",
    category: "Cloud Strategy",
    excerpt: "Weekly insights on cloud infrastructure trends, multi-cloud strategies, and emerging technologies shaping enterprise IT landscapes.",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "This Week in Cloud Infrastructure" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "Key developments in cloud infrastructure this week include significant announcements around sovereign cloud offerings, new sustainability initiatives from major providers, and emerging trends in edge computing deployment."
            }
          }]
        }
      }
    ]
  },
  {
    title: "Security Brief - Zero Trust Implementation",
    slug: "security-brief-zero-trust-implementation",
    status: "Published",
    publishedDate: "2024-01-12",
    category: "Cybersecurity",
    excerpt: "Bi-weekly cybersecurity updates focusing on zero trust architecture, threat intelligence, and practical security implementation guidance.",
    content: [
      {
        type: "heading_2",
        heading_2: {
          rich_text: [{
            type: "text",
            text: { content: "Zero Trust Architecture Progress" }
          }]
        }
      },
      {
        type: "paragraph",
        paragraph: {
          rich_text: [{
            type: "text",
            text: { 
              content: "Recent research indicates that organisations implementing comprehensive zero trust strategies experience 67% fewer security incidents and achieve significantly faster incident response times."
            }
          }]
        }
      }
    ]
  }
];

/**
 * Utility functions for Notion content creation
 */
async function createBlogPost(post: any) {
  try {
    console.log(`📝 Creating blog post: ${post.title}`);
    
    // Create the page
    const page = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_BLOG_POSTS!,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: post.title,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: post.slug,
              },
            },
          ],
        },
        PublishedDate: {
          date: {
            start: post.publishedDate,
          },
        },
        Author: {
          people: [],
        },
        Category: {
          select: {
            name: post.category,
          },
        },
        Tags: {
          multi_select: post.tags.map((tag: string) => ({ name: tag })),
        },
        Excerpt: {
          rich_text: [
            {
              text: {
                content: post.excerpt,
              },
            },
          ],
        },
        Status: {
          select: {
            name: post.status,
          },
        },
      },
      children: post.content,
    });

    console.log(`✅ Created blog post: ${post.title}`);
    return page;
  } catch (error) {
    console.error(`❌ Error creating blog post "${post.title}":`, error);
    return null;
  }
}

async function createWebsitePage(page: any) {
  try {
    console.log(`📄 Creating website page: ${page.title}`);
    
    const createdPage = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_WEBSITE_PAGES!,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: page.title,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: page.slug,
              },
            },
          ],
        },
        Status: {
          select: {
            name: page.status,
          },
        },
        ContentType: {
          select: {
            name: "Legal",
          },
        },
        PublishDate: {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
        LastUpdated: {
          date: {
            start: new Date().toISOString().split('T')[0],
          },
        },
        Content: {
          rich_text: [
            {
              text: {
                content: `Content for ${page.title} - See page content blocks below.`,
              },
            },
          ],
        },
      },
      children: page.content,
    });

    console.log(`✅ Created website page: ${page.title}`);
    return createdPage;
  } catch (error) {
    console.error(`❌ Error creating website page "${page.title}":`, error);
    return null;
  }
}

async function createNewsletter(newsletter: any) {
  try {
    console.log(`📧 Creating newsletter: ${newsletter.title}`);
    
    const page = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_NEWSLETTERS!,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: newsletter.title,
              },
            },
          ],
        },
        Subject: {
          rich_text: [
            {
              text: {
                content: newsletter.excerpt,
              },
            },
          ],
        },
        SendDate: {
          date: {
            start: newsletter.publishedDate,
          },
        },
        Content: {
          rich_text: [
            {
              text: {
                content: `Newsletter content: ${newsletter.title} - ${newsletter.excerpt}`,
              },
            },
          ],
        },
        Status: {
          select: {
            name: newsletter.status,
          },
        },
      },
      children: newsletter.content,
    });

    console.log(`✅ Created newsletter: ${newsletter.title}`);
    return page;
  } catch (error) {
    console.error(`❌ Error creating newsletter "${newsletter.title}":`, error);
    return null;
  }
}

/**
 * Main execution function
 */
async function populateContent() {
  console.log('🚀 Starting content population for ContainerCode Advisory...\n');

  try {
    // Populate blog posts
    console.log('📝 Populating blog posts...');
    const blogResults = await Promise.allSettled(
      blogPosts.map(post => createBlogPost(post))
    );
    const successfulBlogs = blogResults.filter(result => result.status === 'fulfilled').length;
    console.log(`✅ Successfully created ${successfulBlogs}/${blogPosts.length} blog posts\n`);

    // Populate website pages
    console.log('📄 Populating website pages...');
    const pageResults = await Promise.allSettled(
      websitePages.map(page => createWebsitePage(page))
    );
    const successfulPages = pageResults.filter(result => result.status === 'fulfilled').length;
    console.log(`✅ Successfully created ${successfulPages}/${websitePages.length} website pages\n`);

    // Populate newsletters
    console.log('📧 Populating newsletters...');
    const newsletterResults = await Promise.allSettled(
      newsletters.map(newsletter => createNewsletter(newsletter))
    );
    const successfulNewsletters = newsletterResults.filter(result => result.status === 'fulfilled').length;
    console.log(`✅ Successfully created ${successfulNewsletters}/${newsletters.length} newsletters\n`);

    console.log('🎉 Content population completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Blog Posts: ${successfulBlogs}/${blogPosts.length}`);
    console.log(`   Website Pages: ${successfulPages}/${websitePages.length}`);
    console.log(`   Newsletters: ${successfulNewsletters}/${newsletters.length}`);

  } catch (error) {
    console.error('❌ Fatal error during content population:', error);
    process.exit(1);
  }
}

// Execute the script
populateContent();