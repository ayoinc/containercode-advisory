// This script adds sample content to Notion databases for the ContainerCode website
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function addBlogPost(title, slug, excerpt, category, tags, status = "Published", featured = false) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_BLOG_POSTS,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: slug,
              },
            },
          ],
        },
        Status: {
          select: {
            name: status,
          },
        },
        PublishedDate: {
          date: {
            start: new Date().toISOString(),
          },
        },
        Category: {
          select: {
            name: category,
          },
        },
        Tags: {
          multi_select: tags.map(tag => ({ name: tag })),
        },
        Excerpt: {
          rich_text: [
            {
              text: {
                content: excerpt,
              },
            },
          ],
        },
        Featured: {
          checkbox: featured,
        },
        SEOTitle: {
          rich_text: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        SEODescription: {
          rich_text: [
            {
              text: {
                content: excerpt,
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "This is a sample paragraph for the blog post. Replace with actual content.",
                },
              },
            ],
          },
        },
      ],
    });
    
    console.log(`✅ Created blog post: "${title}"`);
    return response.id;
  } catch (error) {
    console.error(`❌ Error creating blog post "${title}":`, error);
    return null;
  }
}

async function addCaseStudy(title, slug, client, industry, services, testimonialQuote, status = "Published", featured = false) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_CASE_STUDIES,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: slug,
              },
            },
          ],
        },
        Client: {
          rich_text: [
            {
              text: {
                content: client,
              },
            },
          ],
        },
        Industry: {
          select: {
            name: industry,
          },
        },
        Services: {
          multi_select: services.map(service => ({ name: service })),
        },
        Status: {
          select: {
            name: status,
          },
        },
        TestimonialQuote: {
          rich_text: [
            {
              text: {
                content: testimonialQuote,
              },
            },
          ],
        },
        TestimonialAuthor: {
          rich_text: [
            {
              text: {
                content: "John Smith",
              },
            },
          ],
        },
        TestimonialPosition: {
          rich_text: [
            {
              text: {
                content: "CTO",
              },
            },
          ],
        },
        TestimonialCompany: {
          rich_text: [
            {
              text: {
                content: client,
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Challenge",
                },
              },
            ],
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "This client faced significant challenges with their existing infrastructure. Replace with actual content.",
                },
              },
            ],
          },
        },
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Solution",
                },
              },
            ],
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "Our team implemented a comprehensive solution. Replace with actual content.",
                },
              },
            ],
          },
        },
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Results",
                },
              },
            ],
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "The client achieved significant improvements. Replace with actual content.",
                },
              },
            ],
          },
        },
      ],
    });
    
    console.log(`✅ Created case study: "${title}"`);
    return response.id;
  } catch (error) {
    console.error(`❌ Error creating case study "${title}":`, error);
    return null;
  }
}

async function addTeamMember(name, position, department, expertise, certifications, linkedin, email, featured = false, order = 0) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_TEAM_MEMBERS,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Position: {
          rich_text: [
            {
              text: {
                content: position,
              },
            },
          ],
        },
        Department: {
          select: {
            name: department,
          },
        },
        Expertise: {
          multi_select: expertise.map(skill => ({ name: skill })),
        },
        Certifications: {
          multi_select: certifications.map(cert => ({ name: cert })),
        },
        LinkedIn: {
          url: linkedin,
        },
        Email: {
          email: email,
        },
        Featured: {
          checkbox: featured,
        },
        Order: {
          number: order,
        },
      },
      children: [
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `${name} is a seasoned professional with expertise in ${expertise.join(", ")}. Replace with actual bio.`,
                },
              },
            ],
          },
        },
      ],
    });
    
    console.log(`✅ Created team member: "${name}"`);
    return response.id;
  } catch (error) {
    console.error(`❌ Error creating team member "${name}":`, error);
    return null;
  }
}

async function addService(name, slug, category, description, status = "Active", featured = false, order = 0) {
  try {
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_SERVICES,
      },
      properties: {
        "Service Name": {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Slug: {
          rich_text: [
            {
              text: {
                content: slug,
              },
            },
          ],
        },
        Category: {
          select: {
            name: category,
          },
        },
        ShortDescription: {
          rich_text: [
            {
              text: {
                content: description,
              },
            },
          ],
        },
        Status: {
          select: {
            name: status,
          },
        },
        Featured: {
          checkbox: featured,
        },
        Order: {
          number: order,
        },
      },
      children: [
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Overview",
                },
              },
            ],
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `Our ${name} service provides comprehensive solutions for businesses. Replace with actual content.`,
                },
              },
            ],
          },
        },
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Features",
                },
              },
            ],
          },
        },
        {
          object: "block",
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: "Feature 1: Replace with actual feature",
                },
              },
            ],
          },
        },
        {
          object: "block",
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: "Feature 2: Replace with actual feature",
                },
              },
            ],
          },
        },
        {
          object: "block",
          bulleted_list_item: {
            rich_text: [
              {
                text: {
                  content: "Feature 3: Replace with actual feature",
                },
              },
            ],
          },
        },
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: "Benefits",
                },
              },
            ],
          },
        },
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: "Our clients enjoy numerous benefits when using this service. Replace with actual content.",
                },
              },
            ],
          },
        },
      ],
    });
    
    console.log(`✅ Created service: "${name}"`);
    return response.id;
  } catch (error) {
    console.error(`❌ Error creating service "${name}":`, error);
    return null;
  }
}

async function main() {
  // Check if database IDs are configured
  if (!process.env.NOTION_DATABASE_BLOG_POSTS || 
      !process.env.NOTION_DATABASE_CASE_STUDIES || 
      !process.env.NOTION_DATABASE_TEAM_MEMBERS || 
      !process.env.NOTION_DATABASE_SERVICES) {
    console.error("❌ Error: Please make sure all Notion database IDs are configured in .env.local");
    return;
  }
  
  console.log("📝 Adding sample blog posts...");
  await addBlogPost(
    "Multi-Cloud Strategy: Avoiding Vendor Lock-in in 2025",
    "multi-cloud-strategy-avoiding-vendor-lock-in",
    "Learn how to implement a vendor-neutral multi-cloud strategy that maximizes flexibility while minimizing costs and complexity.",
    "Multi-Cloud",
    ["AWS", "Azure", "Google Cloud", "Best Practices"],
    "Published",
    true
  );
  
  await addBlogPost(
    "Zero Trust Architecture for Cloud Environments",
    "zero-trust-architecture-cloud-environments",
    "Discover how to implement a comprehensive Zero Trust security model across your multi-cloud infrastructure.",
    "Security",
    ["Security", "Best Practices", "Compliance"],
    "Published",
    true
  );
  
  await addBlogPost(
    "DevSecOps Pipeline Implementation: Best Practices",
    "devsecops-pipeline-implementation-best-practices",
    "A step-by-step guide to building robust DevSecOps pipelines that integrate security throughout the development lifecycle.",
    "DevOps",
    ["DevSecOps", "Security", "Best Practices"],
    "Published",
    false
  );
  
  console.log("🏢 Adding sample case studies...");
  await addCaseStudy(
    "Healthcare Provider's Secure Multi-Cloud Migration",
    "healthcare-secure-multi-cloud-migration",
    "Leading Healthcare Provider",
    "Healthcare",
    ["Multi-Cloud Strategy", "Azure Migration", "Security Architecture"],
    "ContainerCode Advisory helped us migrate our critical systems to a multi-cloud environment while ensuring HIPAA compliance and reducing our operational costs by 40%.",
    "Published",
    true
  );
  
  await addCaseStudy(
    "Financial Services Firm DevSecOps Transformation",
    "financial-services-devsecops-transformation",
    "Global Financial Services Company",
    "Financial Services",
    ["DevSecOps", "Security Architecture", "AWS Optimization"],
    "Working with ContainerCode Advisory allowed us to transform our development processes, integrating security from the start and reducing our release cycles by 60%.",
    "Published",
    true
  );
  
  console.log("👥 Adding sample team members...");
  await addTeamMember(
    "Sarah Johnson",
    "CEO / Founder",
    "Leadership",
    ["Multi-Cloud Strategy", "Security", "Digital Transformation"],
    ["AWS Solutions Architect", "Azure Security Engineer", "CISSP"],
    "https://linkedin.com/in/sarah-johnson",
    "sarah@containercode.club",
    true,
    1
  );
  
  await addTeamMember(
    "Michael Chen",
    "CTO",
    "Leadership",
    ["Cloud Architecture", "DevSecOps", "Software Engineering"],
    ["Google Cloud Professional Architect", "Kubernetes CKA", "AWS DevOps Professional"],
    "https://linkedin.com/in/michael-chen",
    "michael@containercode.club",
    true,
    2
  );
  
  await addTeamMember(
    "Elena Rodriguez",
    "Head of Cybersecurity",
    "Security",
    ["Security Architecture", "Compliance", "Threat Modeling"],
    ["CISSP", "CEH", "AWS Security Specialty"],
    "https://linkedin.com/in/elena-rodriguez",
    "elena@containercode.club",
    true,
    3
  );
  
  console.log("🔧 Adding sample services...");
  await addService(
    "Multi-Cloud Strategy",
    "multi-cloud-strategy",
    "Cloud",
    "Develop a comprehensive vendor-neutral cloud strategy across Azure, AWS, Google Cloud, and more.",
    "Active",
    true,
    1
  );
  
  await addService(
    "Cloud Security Architecture",
    "cloud-security-architecture",
    "Cybersecurity",
    "Design and implement robust security frameworks for your cloud infrastructure with zero-trust principles.",
    "Active",
    true,
    2
  );
  
  await addService(
    "DevSecOps Implementation",
    "devsecops-implementation",
    "DevOps",
    "Transform your development processes with integrated security throughout the entire lifecycle.",
    "Active",
    true,
    3
  );
  
  await addService(
    "Azure Cloud Services",
    "azure-cloud-services",
    "Cloud",
    "Expert consulting for Microsoft Azure migration, optimization, and management.",
    "Active",
    false,
    4
  );
  
  await addService(
    "AWS Cloud Services",
    "aws-cloud-services",
    "Cloud",
    "Comprehensive Amazon Web Services solutions from migration to cost optimization.",
    "Active",
    false,
    5
  );
  
  console.log("✅ Sample content creation complete!");
}

main().catch(console.error);
