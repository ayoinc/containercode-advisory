import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { Section, Container, Card, CardContent } from '@/components/ui';
import { CheckCircle, ArrowRight, Star, Clock, Users, Award } from 'lucide-react';
import Link from 'next/link';

// Service data structure
const services = {
  'cloud-technologies': {
    title: 'Cloud Technologies',
    description: 'Comprehensive cloud migration, optimization, and management across AWS, Azure, and Google Cloud Platform.',
    longDescription: 'Transform your infrastructure with our expert cloud consulting services. We help organizations migrate, optimize, and manage their cloud environments across all major platforms including AWS, Azure, Google Cloud, Oracle Cloud, and IBM Cloud.',
    hero: {
      title: 'Master Multi-Cloud Excellence',
      subtitle: 'Unlock the full potential of cloud computing with strategic architecture, seamless migrations, and cost-optimized operations.'
    },
    features: [
      {
        title: 'Multi-Cloud Architecture',
        description: 'Design robust, scalable architectures that leverage the best of multiple cloud platforms.',
        benefits: ['Vendor lock-in prevention', 'Optimal cost distribution', 'Enhanced redundancy']
      },
      {
        title: 'Cloud Migration Strategy',
        description: 'Seamless migration from on-premises to cloud with minimal downtime and risk.',
        benefits: ['Risk assessment & mitigation', 'Phased migration approach', 'Business continuity assurance']
      },
      {
        title: 'Cost Optimization',
        description: 'Continuous monitoring and optimization to reduce cloud spending while maintaining performance.',
        benefits: ['Resource right-sizing', 'Reserved instance optimization', 'Automated cost controls']
      },
      {
        title: 'Performance Tuning',
        description: 'Optimize application performance and resource utilization across cloud environments.',
        benefits: ['Auto-scaling configuration', 'Load balancing optimization', 'Performance monitoring']
      }
    ],
    technologies: ['AWS', 'Azure', 'Google Cloud', 'Oracle Cloud', 'IBM Cloud', 'Kubernetes', 'Docker', 'Terraform'],
    processes: [
      { step: 'Assessment', description: 'Comprehensive analysis of current infrastructure and requirements' },
      { step: 'Strategy', description: 'Develop detailed migration and optimization roadmap' },
      { step: 'Implementation', description: 'Execute migration with continuous monitoring and support' },
      { step: 'Optimization', description: 'Ongoing performance tuning and cost optimization' }
    ],
    stats: [
      { metric: '99.9%', label: 'Uptime SLA' },
      { metric: '40%', label: 'Average Cost Savings' },
      { metric: '50+', label: 'Cloud Migrations' },
      { metric: '24/7', label: 'Support Available' }
    ]
  },
  'cybersecurity': {
    title: 'Cybersecurity',
    description: 'Comprehensive security assessments, compliance frameworks, and threat protection services.',
    longDescription: 'Protect your organization with enterprise-grade cybersecurity solutions. Our expert team provides comprehensive security assessments, implements compliance frameworks, and establishes robust threat detection and response capabilities.',
    hero: {
      title: 'Fortify Your Digital Assets',
      subtitle: 'Comprehensive cybersecurity solutions that protect, detect, and respond to evolving threats while ensuring compliance.'
    },
    features: [
      {
        title: 'Security Assessments',
        description: 'Comprehensive security audits and vulnerability assessments to identify and remediate risks.',
        benefits: ['Penetration testing', 'Vulnerability scanning', 'Risk assessment reports']
      },
      {
        title: 'Compliance Implementation',
        description: 'Implement and maintain compliance with industry standards and regulations.',
        benefits: ['SOC 2 compliance', 'HIPAA implementation', 'GDPR compliance']
      },
      {
        title: 'Threat Detection',
        description: '24/7 monitoring and threat detection with rapid incident response capabilities.',
        benefits: ['SIEM implementation', 'Real-time monitoring', 'Incident response team']
      },
      {
        title: 'Security Architecture',
        description: 'Design and implement secure architecture patterns and zero-trust security models.',
        benefits: ['Zero-trust implementation', 'Network segmentation', 'Identity management']
      }
    ],
    technologies: ['SIEM', 'Zero Trust', 'IAM', 'Endpoint Protection', 'Network Security', 'Cloud Security', 'Compliance Tools'],
    processes: [
      { step: 'Assessment', description: 'Comprehensive security posture evaluation and risk analysis' },
      { step: 'Planning', description: 'Develop security strategy and compliance roadmap' },
      { step: 'Implementation', description: 'Deploy security controls and monitoring systems' },
      { step: 'Monitoring', description: 'Continuous monitoring and threat response' }
    ],
    stats: [
      { metric: '100%', label: 'Compliance Success' },
      { metric: '<5min', label: 'Threat Response Time' },
      { metric: '0', label: 'Security Breaches' },
      { metric: '24/7', label: 'SOC Monitoring' }
    ]
  },
  'devops': {
    title: 'DevOps & DevSecOps',
    description: 'Streamline development with automated CI/CD pipelines, infrastructure as code, and security integration.',
    longDescription: 'Accelerate your development lifecycle with modern DevOps and DevSecOps practices. We implement automated CI/CD pipelines, infrastructure as code, and integrate security throughout the development process.',
    hero: {
      title: 'Accelerate Innovation with DevOps',
      subtitle: 'Transform your development process with automated pipelines, infrastructure as code, and integrated security practices.'
    },
    features: [
      {
        title: 'CI/CD Pipelines',
        description: 'Automated build, test, and deployment pipelines for faster, more reliable releases.',
        benefits: ['Automated testing', 'Continuous integration', 'Deployment automation']
      },
      {
        title: 'Infrastructure as Code',
        description: 'Manage infrastructure through code for consistency, reliability, and version control.',
        benefits: ['Version-controlled infrastructure', 'Automated provisioning', 'Environment consistency']
      },
      {
        title: 'Container Orchestration',
        description: 'Deploy and manage containerized applications with Kubernetes and Docker.',
        benefits: ['Scalable deployments', 'Resource optimization', 'Service mesh implementation']
      },
      {
        title: 'Security Integration',
        description: 'Integrate security testing and compliance checks throughout the development pipeline.',
        benefits: ['Automated security scanning', 'Compliance validation', 'Vulnerability management']
      }
    ],
    technologies: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible', 'Docker', 'Kubernetes', 'Helm'],
    processes: [
      { step: 'Assessment', description: 'Evaluate current development and deployment processes' },
      { step: 'Design', description: 'Design CI/CD architecture and automation strategy' },
      { step: 'Implementation', description: 'Build and deploy automated pipelines and infrastructure' },
      { step: 'Optimization', description: 'Continuous improvement and performance optimization' }
    ],
    stats: [
      { metric: '10x', label: 'Faster Deployments' },
      { metric: '90%', label: 'Reduced Manual Work' },
      { metric: '99.9%', label: 'Pipeline Reliability' },
      { metric: '50%', label: 'Reduced Lead Time' }
    ]
  },
  'digital-transformation': {
    title: 'Digital Transformation',
    description: 'Strategic digital transformation consulting to modernize business processes and technology.',
    longDescription: 'Lead your organization through comprehensive digital transformation. We help businesses modernize their processes, adopt new technologies, and create digital-first customer experiences.',
    hero: {
      title: 'Transform Your Business for the Digital Future',
      subtitle: 'Strategic digital transformation that modernizes processes, embraces innovation, and delivers exceptional customer experiences.'
    },
    features: [
      {
        title: 'Digital Strategy',
        description: 'Develop comprehensive digital strategies aligned with business objectives.',
        benefits: ['Strategic roadmapping', 'Technology assessment', 'ROI analysis']
      },
      {
        title: 'Process Modernization',
        description: 'Transform legacy processes with automation and digital workflows.',
        benefits: ['Workflow automation', 'Digital process design', 'Efficiency optimization']
      },
      {
        title: 'Legacy System Modernization',
        description: 'Modernize legacy systems with cloud-native architectures and microservices.',
        benefits: ['Application refactoring', 'Database modernization', 'API development']
      },
      {
        title: 'Change Management',
        description: 'Guide teams through digital transformation with training and support.',
        benefits: ['Training programs', 'Change strategy', 'User adoption support']
      }
    ],
    technologies: ['Cloud Platforms', 'Microservices', 'APIs', 'Low-Code Platforms', 'Automation Tools', 'Analytics'],
    processes: [
      { step: 'Discovery', description: 'Assess current state and define transformation goals' },
      { step: 'Strategy', description: 'Develop transformation roadmap and technology strategy' },
      { step: 'Execution', description: 'Implement transformation initiatives in phases' },
      { step: 'Adoption', description: 'Support user adoption and measure success' }
    ],
    stats: [
      { metric: '300%', label: 'ROI Average' },
      { metric: '60%', label: 'Process Efficiency Gain' },
      { metric: '95%', label: 'User Adoption Rate' },
      { metric: '12mo', label: 'Average Transformation Time' }
    ]
  },
  'software-engineering': {
    title: 'Software Engineering',
    description: 'Custom software development, API design, and application modernization services.',
    longDescription: 'Build scalable, maintainable software solutions with our expert engineering team. We specialize in custom application development, API design, microservices architecture, and application modernization.',
    hero: {
      title: 'Engineering Excellence in Every Line of Code',
      subtitle: 'Custom software solutions built with modern architectures, best practices, and scalable design patterns.'
    },
    features: [
      {
        title: 'Custom Development',
        description: 'Full-stack application development tailored to your business requirements.',
        benefits: ['Scalable architecture', 'Modern tech stacks', 'Responsive design']
      },
      {
        title: 'API Design & Integration',
        description: 'Design and implement robust APIs for seamless system integration.',
        benefits: ['RESTful APIs', 'GraphQL implementation', 'Third-party integrations']
      },
      {
        title: 'Microservices Architecture',
        description: 'Break down monolithic applications into scalable microservices.',
        benefits: ['Independent scaling', 'Technology diversity', 'Fault isolation']
      },
      {
        title: 'Application Modernization',
        description: 'Modernize legacy applications with current technologies and patterns.',
        benefits: ['Performance improvements', 'Technology upgrades', 'Security enhancements']
      }
    ],
    technologies: ['React', 'Node.js', 'Python', 'Java', 'C#', 'Go', 'TypeScript', 'Next.js', 'GraphQL'],
    processes: [
      { step: 'Requirements', description: 'Gather and analyze detailed requirements and specifications' },
      { step: 'Design', description: 'Create technical architecture and system design' },
      { step: 'Development', description: 'Implement solution with agile development practices' },
      { step: 'Deployment', description: 'Deploy and maintain applications with ongoing support' }
    ],
    stats: [
      { metric: '100+', label: 'Applications Built' },
      { metric: '99.9%', label: 'Uptime SLA' },
      { metric: '2x', label: 'Faster Time to Market' },
      { metric: '24/7', label: 'Support Available' }
    ]
  },
  'it-support': {
    title: 'IT Support & Management',
    description: 'Comprehensive IT support, system monitoring, and infrastructure management services.',
    longDescription: 'Ensure your IT infrastructure runs smoothly with our comprehensive support and management services. We provide 24/7 monitoring, proactive maintenance, and expert technical support.',
    hero: {
      title: 'Reliable IT Operations, Always On',
      subtitle: 'Comprehensive IT support and management that keeps your systems running smoothly while you focus on your business.'
    },
    features: [
      {
        title: '24/7 Monitoring',
        description: 'Continuous monitoring of your IT infrastructure with proactive issue detection.',
        benefits: ['Real-time alerts', 'Performance monitoring', 'Predictive maintenance']
      },
      {
        title: 'Managed Services',
        description: 'Complete IT infrastructure management with expert oversight and maintenance.',
        benefits: ['Infrastructure management', 'Regular maintenance', 'Capacity planning']
      },
      {
        title: 'Technical Support',
        description: 'Expert technical support for hardware, software, and network issues.',
        benefits: ['Multi-tier support', 'Remote assistance', 'On-site support']
      },
      {
        title: 'Backup & Recovery',
        description: 'Comprehensive backup solutions and disaster recovery planning.',
        benefits: ['Automated backups', 'Disaster recovery', 'Business continuity']
      }
    ],
    technologies: ['Monitoring Tools', 'Help Desk Systems', 'Backup Solutions', 'Network Management', 'Security Tools'],
    processes: [
      { step: 'Assessment', description: 'Evaluate current IT infrastructure and support needs' },
      { step: 'Implementation', description: 'Deploy monitoring and management systems' },
      { step: 'Management', description: 'Ongoing management and proactive maintenance' },
      { step: 'Optimization', description: 'Continuous improvement and optimization' }
    ],
    stats: [
      { metric: '99.9%', label: 'Uptime SLA' },
      { metric: '<15min', label: 'Response Time' },
      { metric: '24/7', label: 'Monitoring Coverage' },
      { metric: '95%', label: 'First Call Resolution' }
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = services[params.slug as keyof typeof services];
  
  if (!service) {
    return {
      title: 'Service Not Found',
      description: 'The requested service page could not be found.'
    };
  }

  return {
    title: `${service.title} | ContainerCode Advisory`,
    description: service.description,
    keywords: [...service.technologies, 'consulting', 'enterprise', 'technology'],
  };
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({
    slug,
  }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services[params.slug as keyof typeof services];

  if (!service) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={(() => {
              const serviceImageMap = {
                'cloud-technologies': '/images/pexels/service-cloud-technologies.jpg',
                'cybersecurity': '/images/pexels/service-cybersecurity.jpg',
                'devops': '/images/pexels/service-devops.jpg',
                'digital-transformation': '/images/pexels/service-digital-transformation.jpg',
                'software-engineering': '/images/pexels/service-software-engineering.jpg',
                'it-support': '/images/pexels/service-it-support.jpg'
              };
              return serviceImageMap[params.slug as keyof typeof serviceImageMap] || '/images/pexels/hero-cloud-computing.jpg';
            })()}
            alt={`${service.title} hero background`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-secondary-900/90" />
        </div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
        <div className="relative container-custom py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              {service.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              {service.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="btn btn-primary btn-lg"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/services"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary-900"
              >
                Explore All Services
              </Link>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {service.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-2">{stat.metric}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Description */}
      <Section spacing="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our {service.title} Services?</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {service.longDescription}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Capabilities</h2>
            <p className="text-xl text-gray-600">
              Comprehensive solutions designed to meet your specific business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.features.map((feature, index) => (
              <Card key={index} variant="elevated" hoverable>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process Section */}
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Proven Process</h2>
            <p className="text-xl text-gray-600">
              A systematic approach that ensures successful outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {service.processes.map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold mb-3">{process.step}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Technologies */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technologies We Use</h2>
            <p className="text-xl text-gray-600">
              Industry-leading tools and platforms for optimal results
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {service.technologies.map((tech, index) => (
              <span 
                key={index}
                className="badge badge-primary text-base px-4 py-2"
              >
                {tech}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" background="navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how our {service.title.toLowerCase()} expertise can transform your business operations and drive success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Schedule Free Consultation
              </Link>
              <Link 
                href="/services"
                className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
