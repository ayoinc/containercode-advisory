import Link from 'next/link';
import { ArrowRight, Cloud, Shield, Code, Database, Zap, Settings, CheckCircle, Users, Award, Clock, Target, Building2 } from 'lucide-react';
import { ServiceImage, HeroImage } from '@/components/ui/images/smart-image';

const professionalServices = [
  {
    id: 'cloud-technologies',
    icon: Cloud,
    title: 'Multi-Cloud Technologies',
    description: 'Strategic cloud adoption and optimisation across AWS, Azure, Google Cloud, Oracle, and IBM platforms with seamless integration and cost efficiency.',
    color: 'blue',
    service: 'cloud' as const,
    features: [
      'Multi-cloud architecture design and implementation',
      'Strategic cloud migration and modernisation',
      'Cost optimisation and performance monitoring',
      'Hybrid cloud solutions and integration'
    ],
    outcomes: ['60% average cost reduction', '99.9% uptime SLA', '300% faster deployments'],
    href: '/services/cloud-technologies'
  },
  {
    id: 'cybersecurity',
    icon: Shield,
    title: 'Cybersecurity Excellence',
    description: 'Comprehensive security frameworks with proactive threat detection, regulatory compliance, and enterprise-grade protection across all business functions.',
    color: 'red',
    service: 'security' as const,
    features: [
      'Security assessments and vulnerability management',
      'Compliance framework implementation (SOC 2, GDPR)',
      'Incident response and threat intelligence',
      'Zero-trust security architecture'
    ],
    outcomes: ['100% compliance achievement', '75% threat reduction', '50% faster incident response'],
    href: '/services/cybersecurity'
  },
  {
    id: 'devops-devsecops',
    icon: Code,
    title: 'DevOps & DevSecOps',
    description: 'Streamlined development workflows with automated CI/CD pipelines, infrastructure as code, and integrated security practices for accelerated delivery.',
    color: 'green',
    service: 'devops' as const,
    features: [
      'CI/CD pipeline automation and optimisation',
      'Infrastructure as code and configuration management',
      'Container orchestration with Kubernetes',
      'Security integration throughout development lifecycle'
    ],
    outcomes: ['80% faster deployments', '90% error reduction', '24/7 automated monitoring'],
    href: '/services/devops'
  },
  {
    id: 'digital-transformation',
    icon: Database,
    title: 'Digital Transformation',
    description: 'Strategic business modernisation with technology-driven solutions that enhance operational efficiency, customer experience, and competitive positioning.',
    color: 'purple',
    service: 'innovation' as const,
    features: [
      'Digital strategy development and roadmapping',
      'Legacy system modernisation and integration',
      'Business process automation and optimisation',
      'Change management and organisational adoption'
    ],
    outcomes: ['40% operational efficiency gains', '70% process automation', '6-month faster time-to-market'],
    href: '/services/digital-transformation'
  },
  {
    id: 'software-engineering',
    icon: Zap,
    title: 'Software Engineering',
    description: 'Bespoke software development with modern architectural patterns, scalable solutions, and maintainable codebases that drive business innovation.',
    color: 'yellow',
    service: 'devops' as const,
    features: [
      'Custom application development and modernisation',
      'API design, development, and integration',
      'Microservices architecture and implementation',
      'Quality assurance and performance optimisation'
    ],
    outcomes: ['50% development acceleration', '95% code quality scores', '99% API reliability'],
    href: '/services/software-engineering'
  },
  {
    id: 'it-support-management',
    icon: Settings,
    title: 'Managed IT Support',
    description: 'Comprehensive IT support services with proactive monitoring, rapid issue resolution, and strategic technology guidance for operational excellence.',
    color: 'teal',
    service: 'innovation' as const,
    features: [
      '24/7 system monitoring and alerting',
      'Proactive maintenance and optimisation',
      'Help desk and technical support services',
      'Strategic IT planning and consultancy'
    ],
    outcomes: ['99.9% system availability', '15-minute response times', '95% first-call resolution'],
    href: '/services/it-support'
  }
];

const competitiveAdvantages = [
  {
    icon: Award,
    title: 'Certified Excellence',
    description: 'Our team maintains industry-leading certifications across all major cloud platforms, security frameworks, and emerging technologies.',
    metrics: '50+ professional certifications'
  },
  {
    icon: Users,
    title: 'Strategic Partnership',
    description: 'We work as an extension of your team, providing dedicated support, transparent communication, and long-term strategic guidance.',
    metrics: '98% client retention rate'
  },
  {
    icon: Target,
    title: 'Proven Methodology',
    description: 'Battle-tested processes and frameworks that have consistently delivered successful outcomes across 150+ complex transformations.',
    metrics: '100% project success rate'
  },
  {
    icon: Clock,
    title: 'Measurable Results',
    description: 'We guarantee measurable business outcomes with performance SLAs, cost savings commitments, and operational improvements.',
    metrics: '£50M+ cost savings delivered'
  }
];

export default function ProfessionalServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <HeroImage 
            alt="Professional technology services and consulting"
            className="w-full h-full object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gray-900/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6 backdrop-blur-sm">
              <Building2 className="w-4 h-4 mr-2" />
              Professional Services
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Comprehensive Technology Solutions
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Expert consulting services designed to accelerate your digital transformation, enhance security posture, 
              and deliver measurable business outcomes across all technology domains.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Portfolio</h2>
            <p className="text-xl text-gray-600">
              End-to-end technology solutions delivering measurable business value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden">
                {/* Service Image */}
                <div className="relative h-48">
                  <ServiceImage 
                    category={
                      service.service === 'cloud' ? 'cloud computing' :
                      service.service === 'security' ? 'cybersecurity' :
                      service.service === 'devops' ? 'software development' :
                      service.service === 'innovation' ? 'digital innovation' :
                      'cloud computing' // fallback
                    }
                    alt={`${service.title} professional services`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Icon overlay */}
                  <div className={`absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${service.color}-100 shadow-lg backdrop-blur-sm`}>
                    <service.icon className={`h-6 w-6 text-${service.color}-600`} />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-sm text-gray-700">Key Capabilities:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm text-gray-700">Typical Outcomes:</h4>
                    <div className="space-y-1">
                      {service.outcomes.map((outcome, index) => (
                        <div key={index} className="text-sm text-gray-600 font-medium">
                          • {outcome}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Link 
                      href={service.href as any}
                      className={`inline-flex items-center text-${service.color}-600 hover:text-${service.color}-700 font-semibold transition-colors`}
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ContainerCode Advisory?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine deep technical expertise with proven business results to deliver transformational 
              outcomes that drive sustainable competitive advantage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
                  <advantage.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{advantage.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{advantage.description}</p>
                <div className="text-sm font-semibold text-primary-600">{advantage.metrics}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Delivery Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Delivery Methodology</h2>
            <p className="text-xl text-gray-600">
              A proven framework that ensures successful outcomes for every client engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: 'Discovery & Assessment', 
                description: 'Comprehensive analysis of your current state, challenges, opportunities, and strategic objectives through detailed stakeholder engagement.',
                duration: '2-4 weeks'
              },
              { 
                step: '02', 
                title: 'Strategy & Planning', 
                description: 'Development of detailed roadmap with clear milestones, success metrics, risk mitigation strategies, and resource requirements.',
                duration: '2-3 weeks'
              },
              { 
                step: '03', 
                title: 'Implementation & Delivery', 
                description: 'Agile execution with regular progress reviews, quality gates, continuous stakeholder communication, and adaptive planning.',
                duration: '8-24 weeks'
              },
              { 
                step: '04', 
                title: 'Optimisation & Support', 
                description: 'Ongoing monitoring, performance optimisation, knowledge transfer, and continuous improvement to ensure sustained success.',
                duration: 'Ongoing'
              }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-4">{phase.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{phase.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{phase.description}</p>
                <div className="text-sm font-semibold text-primary-600">{phase.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-600">
              Specialised expertise across diverse sectors with deep understanding of industry-specific requirements
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Financial Services', icon: '🏦', description: 'Banking, Insurance, FinTech' },
              { name: 'Healthcare', icon: '🏥', description: 'NHS, Private Healthcare, MedTech' },
              { name: 'E-commerce', icon: '🛒', description: 'Retail, Marketplaces, B2B' },
              { name: 'Manufacturing', icon: '🏭', description: 'Industrial, Automotive, Aerospace' },
              { name: 'Technology', icon: '💻', description: 'SaaS, Software, Startups' },
              { name: 'Education', icon: '🎓', description: 'Universities, EdTech, Training' },
              { name: 'Government', icon: '🏛️', description: 'Public Sector, Councils, Agencies' },
              { name: 'Energy', icon: '⚡', description: 'Utilities, Renewables, Oil & Gas' }
            ].map((industry) => (
              <div key={industry.name} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{industry.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Flexible Engagement Models</h2>
            <p className="text-xl text-gray-600">
              Choose the engagement model that best fits your requirements and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Strategic Consulting',
                description: 'High-level strategic guidance and roadmap development',
                features: ['Executive advisory sessions', 'Strategic roadmap development', 'Technology assessments', 'Business case development'],
                ideal: 'C-level executives and strategic planning teams'
              },
              {
                name: 'Implementation Services',
                description: 'End-to-end project delivery and technical implementation',
                features: ['Full project delivery', 'Technical implementation', 'Change management', 'Training and knowledge transfer'],
                ideal: 'Organisations requiring complete solution delivery'
              },
              {
                name: 'Managed Services',
                description: 'Ongoing support, monitoring, and optimisation',
                features: ['24/7 monitoring and support', 'Proactive optimisation', 'Regular health checks', 'Continuous improvement'],
                ideal: 'Businesses needing ongoing operational support'
              }
            ].map((model, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{model.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{model.description}</p>
                <ul className="space-y-3 mb-6">
                  {model.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong>Ideal for:</strong> {model.ideal}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Accelerate Your Digital Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Let&apos;s discuss how our comprehensive service portfolio can help you achieve your technology 
              objectives with proven methodologies, expert guidance, and measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Schedule Free Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition-all duration-300"
              >
                View Success Stories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}