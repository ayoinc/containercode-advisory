import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PageHeader } from '@/components/ui/page-header';
import { Section, Container, Card, CardContent } from '@/components/ui';
import { CheckCircle, ArrowRight, Star, Clock, Users, Award } from 'lucide-react';
import { HeroImage } from '@/components/ui/images';
import Link from 'next/link';

// Service data structure
const services = {
  'cloud-technologies': {
    title: 'Multi-Cloud Technologies',
    description: 'Strategic multi-cloud architecture, migration, and optimisation services for UK enterprises seeking scalable, secure, and cost-effective cloud solutions.',
    longDescription: 'Transform your organisation\'s infrastructure with our comprehensive cloud consulting expertise. As certified cloud architects, we specialise in designing robust multi-cloud strategies that leverage the strengths of AWS, Microsoft Azure, Google Cloud Platform, and emerging UK sovereign cloud providers. Our approach ensures regulatory compliance, optimises costs, and delivers enterprise-grade security whilst maintaining operational excellence.',
    hero: {
      title: 'Master Multi-Cloud Excellence',
      subtitle: 'Unlock the full potential of cloud computing with strategic architecture, seamless migrations, and cost-optimized operations.'
    },
    features: [
      {
        title: 'Enterprise Multi-Cloud Architecture',
        description: 'Design resilient, scalable architectures that strategically distribute workloads across AWS, Azure, Google Cloud, and UK sovereign cloud providers. Our architects ensure optimal performance whilst maintaining compliance with UK data protection regulations and industry standards.',
        benefits: ['Eliminate vendor lock-in with cloud-agnostic designs', 'Distribute costs intelligently across platforms for maximum ROI', 'Implement geo-redundancy across UK and European data centres', 'Ensure GDPR and UK Data Protection Act compliance', 'Deploy workload-specific cloud selection strategies']
      },
      {
        title: 'Zero-Downtime Cloud Migration',
        description: 'Execute seamless migrations from legacy on-premises infrastructure to cloud environments with our proven methodology. We\'ve successfully migrated over 150 enterprise workloads with zero unplanned downtime and full data integrity.',
        benefits: ['Comprehensive pre-migration assessment and risk analysis', 'Phased migration approach with rollback strategies', 'Real-time data synchronisation and validation', 'Business continuity planning and disaster recovery', 'Post-migration performance optimisation and monitoring']
      },
      {
        title: 'Intelligent Cost Optimisation',
        description: 'Reduce cloud spending by 30-60% through our AI-powered cost optimisation platform. We continuously monitor usage patterns, recommend rightsizing opportunities, and automate cost-saving measures whilst maintaining performance standards.',
        benefits: ['Automated resource rightsizing based on usage analytics', 'Reserved instance and savings plan optimisation', 'Spot instance orchestration for non-critical workloads', 'Multi-cloud cost arbitrage and intelligent workload placement', 'Real-time cost monitoring with automated spending alerts']
      },
      {
        title: 'Performance Engineering & Monitoring',
        description: 'Maximise application performance across multi-cloud environments with our advanced monitoring and optimisation services. Our platform provides 360-degree visibility into performance metrics, automatically scales resources, and predicts capacity requirements.',
        benefits: ['Advanced auto-scaling with predictive algorithms', 'Global load balancing across multiple cloud regions', 'Application performance monitoring (APM) with AI insights', 'Infrastructure performance tuning and optimisation', 'Proactive capacity planning and resource allocation']
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
    title: 'Cybersecurity Excellence',
    description: 'Advanced cybersecurity solutions encompassing zero-trust architecture, comprehensive threat detection, and UK regulatory compliance for enterprise protection.',
    longDescription: 'Safeguard your organisation with military-grade cybersecurity solutions designed for the modern threat landscape. Our certified security experts deliver comprehensive risk assessments, implement zero-trust architectures, and establish 24/7 threat monitoring capabilities. We specialise in UK regulatory compliance including GDPR, NIS Regulations, and sector-specific frameworks whilst maintaining operational efficiency and business continuity.',
    hero: {
      title: 'Fortify Your Digital Assets',
      subtitle: 'Comprehensive cybersecurity solutions that protect, detect, and respond to evolving threats while ensuring compliance.'
    },
    features: [
      {
        title: 'Advanced Security Assessment & Penetration Testing',
        description: 'Conduct comprehensive security evaluations using OWASP methodologies, automated vulnerability scanning, and manual penetration testing. Our CREST-certified team identifies vulnerabilities across web applications, networks, cloud infrastructure, and mobile platforms, providing detailed remediation roadmaps.',
        benefits: ['CREST-certified penetration testing with detailed reporting', 'Automated vulnerability scanning with risk prioritisation', 'Social engineering and phishing simulation exercises', 'Red team exercises simulating advanced persistent threats', 'Compliance gap analysis for UK and EU regulations']
      },
      {
        title: 'UK Regulatory Compliance & Governance',
        description: 'Navigate complex regulatory requirements with our expert compliance services. We implement and maintain adherence to GDPR, UK Data Protection Act 2018, NIS Regulations, PCI DSS, and sector-specific frameworks including FCA, Ofcom, and NHS Digital standards.',
        benefits: ['GDPR and UK Data Protection Act 2018 compliance implementation', 'ISO 27001 and SOC 2 Type II certification support', 'Financial services compliance (FCA, PRA guidelines)', 'Healthcare compliance (NHS Digital, Cyber Essentials Plus)', 'Continuous compliance monitoring and reporting']
      },
      {
        title: 'AI-Powered Threat Detection & Response',
        description: 'Deploy next-generation Security Operations Centre (SOC) capabilities with AI-driven threat detection, automated incident response, and 24/7 monitoring. Our platform analyses over 10 billion security events daily, providing sub-minute threat detection and response times.',
        benefits: ['AI-powered threat hunting with machine learning algorithms', 'Real-time security incident and event management (SIEM)', 'Automated incident response and threat containment', 'Threat intelligence integration from global security feeds', 'Digital forensics and incident investigation services']
      },
      {
        title: 'Zero-Trust Security Architecture',
        description: 'Design and implement comprehensive zero-trust security models that assume no implicit trust and verify every transaction. Our architecture includes identity and access management, micro-segmentation, endpoint protection, and continuous monitoring across hybrid and multi-cloud environments.',
        benefits: ['Identity and access management (IAM) with multi-factor authentication', 'Network micro-segmentation and software-defined perimeters', 'Endpoint detection and response (EDR) with behavioural analytics', 'Cloud security posture management (CSPM) across multi-cloud', 'Privileged access management (PAM) with just-in-time access']
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
    title: 'DevOps & DevSecOps Excellence',
    description: 'Transform software delivery with enterprise-grade CI/CD automation, infrastructure as code, and integrated security practices for accelerated, reliable deployments.',
    longDescription: 'Revolutionise your software delivery pipeline with our comprehensive DevOps and DevSecOps expertise. We implement enterprise-grade automation, infrastructure as code, and seamlessly integrate security throughout the entire development lifecycle. Our approach reduces deployment times by 90%, increases release frequency by 10x, and maintains 99.9% deployment success rates whilst ensuring compliance with UK regulatory requirements.',
    hero: {
      title: 'Accelerate Innovation with DevOps',
      subtitle: 'Transform your development process with automated pipelines, infrastructure as code, and integrated security practices.'
    },
    features: [
      {
        title: 'Enterprise CI/CD Pipeline Automation',
        description: 'Design and implement sophisticated continuous integration and deployment pipelines that reduce manual effort by 95% whilst maintaining enterprise-grade security and compliance. Our pipelines support complex deployment strategies including blue-green, canary, and rolling deployments across multi-cloud environments.',
        benefits: ['Automated testing with 90%+ code coverage requirements', 'Parallel build execution reducing build times by 70%', 'Multi-environment deployment automation with approval workflows', 'Integrated quality gates and automated rollback mechanisms', 'GitOps-based deployment strategies with audit trails']
      },
      {
        title: 'Infrastructure as Code & Configuration Management',
        description: 'Transform infrastructure management with declarative code using Terraform, Ansible, and CloudFormation. Our IaC practices ensure consistent, reproducible environments whilst enabling rapid scaling and disaster recovery across hybrid and multi-cloud architectures.',
        benefits: ['Version-controlled infrastructure with Git-based workflows', 'Automated infrastructure provisioning and deprovisioning', 'Environment consistency across development, staging, and production', 'Infrastructure drift detection and automatic remediation', 'Compliance as code with automated policy enforcement']
      },
      {
        title: 'Kubernetes & Container Orchestration',
        description: 'Deploy enterprise-grade Kubernetes clusters with advanced features including service mesh, auto-scaling, and multi-cluster management. Our container orchestration strategies support microservices architectures whilst maintaining security, observability, and cost efficiency.',
        benefits: ['Production-ready Kubernetes clusters with high availability', 'Advanced auto-scaling based on custom metrics and predictions', 'Service mesh implementation with Istio for secure service communication', 'Multi-cluster management with centralized monitoring and logging', 'Container security scanning and runtime protection']
      },
      {
        title: 'Integrated Security & Compliance (DevSecOps)',
        description: 'Embed security throughout the development lifecycle with automated security testing, vulnerability management, and compliance validation. Our DevSecOps practices ensure early detection of security issues whilst maintaining development velocity and regulatory compliance.',
        benefits: ['Automated security scanning in CI/CD pipelines with vulnerability reporting', 'Static application security testing (SAST) and dynamic testing (DAST)', 'Container image security scanning and policy enforcement', 'Infrastructure security scanning with misconfiguration detection', 'Compliance validation for SOC 2, ISO 27001, and UK regulations']
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
    title: 'Digital Transformation & Innovation',
    description: 'Comprehensive digital transformation strategies encompassing process automation, legacy modernisation, and AI-driven innovation for competitive advantage in the digital economy.',
    longDescription: 'Navigate the digital revolution with our strategic transformation expertise. We guide UK enterprises through comprehensive digital modernisation, combining process automation, cloud-native architectures, AI integration, and cultural change management. Our methodology has enabled organisations to achieve 300% ROI within 18 months whilst maintaining operational continuity and regulatory compliance.',
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
    title: 'Software Engineering & Development',
    description: 'Bespoke software development encompassing full-stack applications, microservices architecture, API design, and legacy system modernisation for scalable, secure enterprise solutions.',
    longDescription: 'Create exceptional software solutions with our team of senior engineers and architects. We specialise in building scalable, maintainable applications using modern technologies and architectural patterns. Our expertise spans full-stack development, microservices architecture, API design, and legacy system modernisation, delivering solutions that drive business growth whilst ensuring security, performance, and regulatory compliance.',
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
    title: 'Managed IT Support & Operations',
    description: 'Comprehensive IT infrastructure management encompassing 24/7 monitoring, proactive maintenance, help desk services, and strategic technology planning for operational excellence.',
    longDescription: 'Ensure optimal IT performance with our comprehensive managed services and support solutions. Our experienced team provides 24/7 infrastructure monitoring, proactive maintenance, expert help desk support, and strategic technology planning. We maintain 99.9% uptime whilst reducing IT costs by up to 40% through proactive management and optimised resource allocation.'
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
          <HeroImage
            category={(() => {
              const categoryMap: Record<string, string> = {
                'cloud-technologies': 'cloud computing',
                'cybersecurity': 'cybersecurity',
                'devops': 'software development',
                'digital-transformation': 'digital innovation',
                'software-engineering': 'software development',
                'it-support': 'it support'
              };
              return categoryMap[params.slug] || 'technology';
            })()}
            alt={`${service.title} hero background`}
            fill
            className="object-cover"
            sizes="100vw"
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

      {/* Case Studies & Success Stories */}
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Client Success Stories</h2>
            <p className="text-xl text-gray-600">
              Real results from our {service.title.toLowerCase()} implementations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                client: "UK Financial Services Firm",
                challenge: "Legacy infrastructure causing compliance issues and operational inefficiencies",
                solution: `Implemented comprehensive ${service.title.toLowerCase()} strategy with regulatory compliance`,
                results: "99.9% uptime, 60% cost reduction, full regulatory compliance achieved"
              },
              {
                client: "Healthcare Technology Provider",
                challenge: "Scaling challenges and security concerns with sensitive patient data",
                solution: `Deployed enterprise-grade ${service.title.toLowerCase()} solution with enhanced security`,
                results: "300% capacity increase, zero security incidents, NHS Digital approval"
              },
              {
                client: "Manufacturing Enterprise",
                challenge: "Outdated systems limiting digital transformation and competitiveness",
                solution: `Complete ${service.title.toLowerCase()} transformation with modern architecture`,
                results: "50% faster time-to-market, 40% operational cost savings, improved agility"
              }
            ].map((caseStudy, index) => (
              <Card key={index} variant="elevated" hoverable>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm font-medium text-primary-600 mb-2">{caseStudy.client}</div>
                    <h3 className="text-lg font-semibold mb-3">Challenge</h3>
                    <p className="text-gray-600 text-sm mb-4">{caseStudy.challenge}</p>
                    
                    <h3 className="text-lg font-semibold mb-3">Solution</h3>
                    <p className="text-gray-600 text-sm mb-4">{caseStudy.solution}</p>
                    
                    <h3 className="text-lg font-semibold mb-3">Results</h3>
                    <p className="text-green-600 text-sm font-medium">{caseStudy.results}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Industry Recognition & Certifications */}
      <Section spacing="lg" background="slate">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Industry Recognition & Certifications</h2>
            <p className="text-xl text-gray-600">
              Trusted by leading organisations and certified by industry leaders
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'AWS Advanced Consulting Partner', icon: '🏆' },
              { name: 'Microsoft Gold Partner', icon: '🥇' },
              { name: 'Google Cloud Premier Partner', icon: '⭐' },
              { name: 'ISO 27001 Certified', icon: '🛡️' },
              { name: 'Cyber Essentials Plus', icon: '🔒' },
              { name: 'CREST Approved', icon: '✅' },
              { name: 'Prince2 Certified', icon: '📋' },
              { name: 'ITIL v4 Foundation', icon: '⚙️' }
            ].map((cert, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <div className="text-sm font-medium text-gray-700">{cert.name}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" background="navy">
        <Container>
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how our {service.title.toLowerCase()} expertise can deliver measurable results for your organisation. Schedule a complimentary consultation to explore your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Schedule Free Consultation
              </Link>
              <Link 
                href="/services"
                className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Explore All Services
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No obligation • 30-minute consultation • Expert recommendations
            </p>
          </div>
        </Container>
      </Section>
    </main>
  );
}
