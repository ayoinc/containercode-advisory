// This script adds sample content to the empty databases
require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

async function addCaseStudy(title, slug, client, industry, services, testimonialQuote, featured = false) {
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
            name: featured ? "Featured" : "Published",
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
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `${client} partnered with ContainerCode Advisory to overcome significant technological challenges and achieve remarkable business outcomes.`,
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
                  content: `${client} faced significant challenges with their existing infrastructure. They needed a partner to help them navigate complex technological requirements while ensuring security and compliance.`,
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
                  content: `Our team implemented a comprehensive solution leveraging ${services.join(", ")}. We worked closely with their team to ensure a smooth transition and knowledge transfer.`,
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
                  content: `The client achieved significant improvements in operational efficiency, security posture, and cost management. Key outcomes included 40% reduction in infrastructure costs, 30% improvement in system performance, and enhanced security compliance.`,
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
    console.error(`❌ Error creating case study "${title}":`, error.body || error);
    return null;
  }
}

async function addTeamMember(name, position, department, expertise, email, featured = false, order = 0) {
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
        Email: {
          email: email,
        },
        Featured: {
          checkbox: featured,
        },
      },
      children: [
        {
          object: "block",
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `${name} is a seasoned professional with expertise in ${expertise.join(", ")}. With a strong background in ${department}, ${name.split(" ")[0]} helps clients navigate complex technology challenges and achieve their business objectives.`,
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
    console.error(`❌ Error creating team member "${name}":`, error.body || error);
    return null;
  }
}

async function addService(name, slug, category, description, featured = false, order = 0) {
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
            name: "Active",
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
                  content: `Our ${name} service provides comprehensive solutions for businesses looking to ${description.toLowerCase()}`,
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
                  content: "Expert consultants with deep domain knowledge",
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
                  content: "Customized solutions tailored to your business needs",
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
                  content: "Proven methodologies and best practices",
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
                  content: "Our clients enjoy numerous benefits when using this service, including improved efficiency, reduced costs, and enhanced security.",
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
    console.error(`❌ Error creating service "${name}":`, error.body || error);
    return null;
  }
}

async function main() {
  console.log("Adding sample content to Notion databases...");
  
  console.log("\n🏢 Adding sample case studies...");
  await addCaseStudy(
    "Healthcare Provider's Secure Multi-Cloud Migration",
    "healthcare-secure-multi-cloud-migration",
    "Leading Healthcare Provider",
    "Healthcare",
    ["Multi-Cloud Strategy", "Azure Migration", "Security Architecture"],
    "ContainerCode Advisory helped us migrate our critical systems to a multi-cloud environment while ensuring HIPAA compliance and reducing our operational costs by 40%.",
    true
  );
  
  await addCaseStudy(
    "Financial Services Firm DevSecOps Transformation",
    "financial-services-devsecops-transformation",
    "Global Financial Services Company",
    "Financial Services",
    ["DevSecOps", "Security Architecture", "AWS Optimization"],
    "Working with ContainerCode Advisory allowed us to transform our development processes, integrating security from the start and reducing our release cycles by 60%.",
    false
  );
  
  console.log("\n👥 Adding sample team members...");
  await addTeamMember(
    "Sarah Johnson",
    "CEO / Founder",
    "Leadership",
    ["Multi-Cloud Strategy", "Security", "Digital Transformation"],
    "sarah@containercode.club",
    true
  );
  
  await addTeamMember(
    "Michael Chen",
    "CTO",
    "Leadership",
    ["Cloud Architecture", "DevOps", "Software Engineering"],
    "michael@containercode.club",
    true
  );
  
  await addTeamMember(
    "Elena Rodriguez",
    "Head of Cybersecurity",
    "Security",
    ["Security Architecture", "Compliance", "Threat Modeling"],
    "elena@containercode.club",
    true
  );
  
  console.log("\n🔧 Adding sample services...");
  await addService(
    "Multi-Cloud Strategy",
    "multi-cloud-strategy",
    "Cloud",
    "Develop a comprehensive vendor-neutral cloud strategy across Azure, AWS, Google Cloud, and more.",
    true,
    1
  );
  
  await addService(
    "Cloud Security Architecture",
    "cloud-security-architecture",
    "Cybersecurity",
    "Design and implement robust security frameworks for your cloud infrastructure with zero-trust principles.",
    true,
    2
  );
  
  await addService(
    "DevSecOps Implementation",
    "devsecops-implementation",
    "DevOps",
    "Transform your development processes with integrated security throughout the entire lifecycle.",
    true,
    3
  );
  
  await addService(
    "Azure Cloud Services",
    "azure-cloud-services",
    "Cloud",
    "Expert consulting for Microsoft Azure migration, optimization, and management.",
    false,
    4
  );
  
  await addService(
    "AWS Cloud Services",
    "aws-cloud-services",
    "Cloud",
    "Comprehensive Amazon Web Services solutions from migration to cost optimization.",
    false,
    5
  );
  
  console.log("\n✅ Sample content creation complete!");
}

main().catch(console.error);
