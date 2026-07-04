import { Metadata } from 'next';
import { Section, Container, Card, CardContent } from '@/components/ui';
import { PageHeader } from '@/components/ui/page-header';
import { NewsletterSignup } from './newsletter-signup';
import { Download, ExternalLink, BookOpen, Wrench, Shield, Cloud, Code, Database } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Resources | ContainerCode Advisory',
  description: 'Whitepapers, tools, guides, and resources to accelerate your cloud transformation journey. Expert insights on multi-cloud, security, and DevOps.',
};

const resources = [
  {
    category: 'Whitepapers & Guides',
    icon: BookOpen,
    items: [
      {
        title: 'Multi-Cloud Strategy Guide 2025',
        description: 'Comprehensive guide to planning and implementing a successful multi-cloud strategy across AWS, Azure, and GCP.',
        type: 'PDF',
        downloadUrl: '/resources/multi-cloud-strategy-2025.pdf',
        featured: true
      },
      {
        title: 'Cloud Security Best Practices',
        description: 'Essential security practices for cloud environments, including compliance frameworks and threat protection.',
        type: 'PDF',
        downloadUrl: '/resources/cloud-security-best-practices.pdf'
      },
      {
        title: 'DevOps Transformation Playbook',
        description: 'Step-by-step guide to implementing DevOps practices and CI/CD pipelines in your organization.',
        type: 'PDF',
        downloadUrl: '/resources/devops-transformation-playbook.pdf'
      },
      {
        title: 'Cloud Cost Optimization Checklist',
        description: '50-point checklist to optimize your cloud spending and eliminate waste across all major platforms.',
        type: 'PDF',
        downloadUrl: '/resources/cloud-cost-optimization-checklist.pdf'
      }
    ]
  },
  {
    category: 'Tools & Calculators',
    icon: Wrench,
    items: [
      {
        title: 'Cloud Migration Cost Calculator',
        description: 'Estimate the costs and timeline for migrating your infrastructure to the cloud.',
        type: 'Tool',
        externalUrl: '/tools/migration-calculator',
        featured: true
      },
      {
        title: 'Security Assessment Tool',
        description: 'Quick assessment to identify potential security vulnerabilities in your cloud environment.',
        type: 'Tool',
        externalUrl: '/tools/security-assessment'
      },
      {
        title: 'ROI Calculator for DevOps',
        description: 'Calculate the potential return on investment for implementing DevOps practices.',
        type: 'Tool',
        externalUrl: '/tools/devops-roi-calculator'
      },
      {
        title: 'Cloud Readiness Assessment',
        description: 'Evaluate your organization\'s readiness for cloud migration and transformation.',
        type: 'Tool',
        externalUrl: '/tools/cloud-readiness'
      }
    ]
  },
  {
    category: 'Technical Documentation',
    icon: Code,
    items: [
      {
        title: 'Infrastructure as Code Templates',
        description: 'Terraform and CloudFormation templates for common cloud architectures.',
        type: 'GitHub',
        externalUrl: 'https://github.com/containercode/iac-templates'
      },
      {
        title: 'Kubernetes Security Policies',
        description: 'Collection of Pod Security Policies and Network Policies for Kubernetes clusters.',
        type: 'GitHub',
        externalUrl: 'https://github.com/containercode/k8s-security'
      },
      {
        title: 'CI/CD Pipeline Examples',
        description: 'Production-ready CI/CD pipeline configurations for various platforms and tools.',
        type: 'GitHub',
        externalUrl: 'https://github.com/containercode/cicd-examples'
      },
      {
        title: 'Cloud Architecture Patterns',
        description: 'Reference architectures and design patterns for scalable cloud applications.',
        type: 'GitHub',
        externalUrl: 'https://github.com/containercode/architecture-patterns'
      }
    ]
  },
  {
    category: 'Industry Reports',
    icon: Database,
    items: [
      {
        title: 'State of Multi-Cloud 2025',
        description: 'Annual report on multi-cloud adoption trends, challenges, and opportunities.',
        type: 'PDF',
        downloadUrl: '/resources/state-of-multicloud-2025.pdf'
      },
      {
        title: 'Cloud Security Trends Report',
        description: 'Analysis of current cloud security threats and emerging protection strategies.',
        type: 'PDF',
        downloadUrl: '/resources/cloud-security-trends-2025.pdf'
      },
      {
        title: 'DevOps Adoption Survey Results',
        description: 'Insights from our survey of 1000+ organizations on their DevOps journey.',
        type: 'PDF',
        downloadUrl: '/resources/devops-adoption-survey-2025.pdf'
      }
    ]
  }
];

const webinars = [
  {
    title: 'Multi-Cloud Architecture Masterclass',
    date: 'March 15, 2025',
    duration: '60 minutes',
    description: 'Learn how to design resilient, scalable architectures across multiple cloud providers.',
    registrationUrl: '/webinars/multicloud-masterclass',
    upcoming: true
  },
  {
    title: 'Zero Trust Security in the Cloud',
    date: 'March 22, 2025',
    duration: '45 minutes',
    description: 'Implementing Zero Trust security principles in your cloud infrastructure.',
    registrationUrl: '/webinars/zero-trust-security',
    upcoming: true
  },
  {
    title: 'DevSecOps Best Practices',
    date: 'February 28, 2025',
    duration: '55 minutes',
    description: 'Integrating security into your DevOps pipeline without slowing down development.',
    registrationUrl: '/webinars/devsecops-practices',
    upcoming: false
  }
];

function ResourceCard({ resource, categoryIcon: CategoryIcon }: { resource: any; categoryIcon: any }) {
  const isDownload = resource.downloadUrl;
  const isExternal = resource.externalUrl;
  
  return (
    <Card variant="elevated" hoverable className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-aqua-500/10 rounded-lg">
              <CategoryIcon className="h-5 w-5 text-aqua-400" />
            </div>
            <span className="text-sm font-medium text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-2 py-1 rounded">
              {resource.type}
            </span>
          </div>
          {resource.featured && (
            <span className="text-xs font-bold text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-2 py-1 rounded-full">
              FEATURED
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
        <p className="text-navy-300 mb-4 flex-grow">{resource.description}</p>
        
        <div className="mt-auto">
          {isDownload && (
            <a
              href={resource.downloadUrl}
              className="inline-flex items-center gap-2 text-aqua-400 hover:text-aqua-300 font-medium"
              download
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
          {isExternal && (
            <a
              href={resource.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-aqua-400 hover:text-aqua-300 font-medium"
            >
              {resource.type === 'Tool' ? 'Launch Tool' : 'View Resource'}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResourcesPage() {
  return (
    <main>
      <PageHeader
        title="Resources & Tools"
        description="Whitepapers, tools, guides, and resources to accelerate your cloud transformation journey. Expert insights from our team of multi-cloud specialists."
      />

      {/* Featured Resources */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Resources</h2>
            <p className="text-xl text-navy-300">
              Our most popular and valuable resources to jumpstart your cloud journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.flatMap(category => 
              category.items.filter(item => item.featured).map(item => (
                <ResourceCard 
                  key={item.title} 
                  resource={item} 
                  categoryIcon={category.icon} 
                />
              ))
            )}
          </div>
        </Container>
      </Section>

      {/* All Resources by Category */}
      <Section spacing="xl">
        <Container>
          {resources.map((category, index) => (
            <div key={index} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-aqua-500/10 rounded-lg">
                  <category.icon className="h-6 w-6 text-aqua-400" />
                </div>
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((resource, resourceIndex) => (
                  <ResourceCard 
                    key={resourceIndex} 
                    resource={resource} 
                    categoryIcon={category.icon} 
                  />
                ))}
              </div>
            </div>
          ))}
        </Container>
      </Section>

      {/* Webinars Section */}
      <Section spacing="lg" background="navy">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Upcoming Webinars</h2>
            <p className="text-xl text-navy-200">
              Join our expert-led webinars to stay ahead of cloud technology trends
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <Card key={index} variant="elevated" className="bg-navy-850 border border-navy-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-2 py-1 rounded">
                      {webinar.duration}
                    </span>
                    {webinar.upcoming && (
                      <span className="text-xs font-bold text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-2 py-1 rounded-full">
                        UPCOMING
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{webinar.title}</h3>
                  <p className="text-sm text-aqua-400 font-medium mb-2">{webinar.date}</p>
                  <p className="text-navy-300 mb-6">{webinar.description}</p>

                  <a
                    href={webinar.registrationUrl}
                    className={`inline-block w-full text-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      webinar.upcoming
                        ? 'bg-aqua-500 hover:bg-aqua-400 text-navy-950'
                        : 'bg-navy-800 hover:bg-navy-700 text-navy-200'
                    }`}
                  >
                    {webinar.upcoming ? 'Register Now' : 'Watch Recording'}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Newsletter Signup */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-navy-300 mb-8">
              Subscribe to our newsletter for the latest resources, insights, and cloud technology updates.
            </p>
            <NewsletterSignup />
          </div>
        </Container>
      </Section>
    </main>
  );
}
