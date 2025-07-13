import { Metadata } from 'next';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield, 
  Code, 
  Cloud, 
  Zap,
  CheckCircle,
  ArrowRight,
  Building2,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | ContainerCode Advisory',
  description: 'Learn about ContainerCode Advisory - your trusted partner for multi-cloud consulting, cybersecurity, and digital transformation services across the UK and beyond.',
  keywords: ['about containercode', 'cloud consulting company', 'cybersecurity experts', 'digital transformation', 'UK cloud consultancy'],
};

const coreValues = [
  {
    icon: Shield,
    title: 'Security Excellence',
    description: 'Every solution we architect prioritises security and regulatory compliance from the ground up, ensuring your organisation remains protected and compliant.'
  },
  {
    icon: Target,
    title: 'Results-Driven Approach',
    description: 'We measure our success through tangible business outcomes, operational improvements, and measurable return on investment for our clients.'
  },
  {
    icon: Users,
    title: 'Strategic Partnership',
    description: 'We work as an extension of your team, providing ongoing strategic guidance and support rather than simple project delivery.'
  },
  {
    icon: Zap,
    title: 'Innovation Leadership',
    description: 'We leverage cutting-edge technologies and industry best practices to solve complex business challenges and drive competitive advantage.'
  }
];

const achievements = [
  { number: '150+', label: 'Successful Transformations', icon: TrendingUp },
  { number: '99.9%', label: 'Service Reliability', icon: Shield },
  { number: '£50M+', label: 'Cost Savings Delivered', icon: Target },
  { number: '24/7', label: 'Expert Support', icon: Clock }
];

const expertiseAreas = [
  {
    icon: Cloud,
    title: 'Multi-Cloud Excellence',
    description: 'Certified expertise across AWS, Azure, Google Cloud, Oracle, and IBM platforms with deep knowledge of hybrid and multi-cloud architectures.',
    technologies: ['AWS Solutions Architecture', 'Azure Enterprise', 'Google Cloud Platform', 'Oracle Cloud Infrastructure', 'IBM Cloud']
  },
  {
    icon: Shield,
    title: 'Cybersecurity & Compliance',
    description: 'Comprehensive security frameworks including threat detection, incident response, and regulatory compliance across all major standards.',
    technologies: ['ISO 27001', 'SOC 2 Type II', 'GDPR Compliance', 'Cyber Essentials', 'NIST Framework']
  },
  {
    icon: Code,
    title: 'DevOps & Automation',
    description: 'Modern CI/CD pipelines, infrastructure as code, and automated deployment strategies that accelerate delivery whilst maintaining quality.',
    technologies: ['Kubernetes', 'Docker', 'Terraform', 'Ansible', 'GitLab CI/CD']
  },
  {
    icon: Globe,
    title: 'Digital Transformation',
    description: 'Strategic consulting to modernise business processes, technology infrastructure, and operational capabilities for competitive advantage.',
    technologies: ['Business Process Automation', 'Legacy Modernisation', 'Data Analytics', 'API Strategy', 'Change Management']
  }
];

const companyTimeline = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'ContainerCode Advisory was established with a vision to simplify cloud complexity and accelerate digital transformation for UK businesses.'
  },
  {
    year: '2021',
    title: 'Service Expansion',
    description: 'Expanded our offering to include comprehensive cybersecurity services and regulatory compliance consulting across multiple frameworks.'
  },
  {
    year: '2022',
    title: 'Strategic Partnerships',
    description: 'Achieved premier partner status with major cloud providers and launched our DevSecOps practice to meet growing market demand.'
  },
  {
    year: '2023',
    title: 'Market Leadership',
    description: 'Established ourselves as a leading multi-cloud consultancy, serving 50+ enterprise clients with industry-leading SLAs and support.'
  },
  {
    year: '2024',
    title: 'Recognition & Growth',
    description: 'Recognised as an award-winning consultancy with proven expertise in delivering complex transformations across diverse industry sectors.'
  }
];

const professionalCertifications = [
  'AWS Solutions Architect Professional',
  'Azure Solutions Architect Expert',
  'Google Cloud Professional Cloud Architect',
  'Certified Information Systems Security Professional (CISSP)',
  'Certified Kubernetes Administrator (CKA)',
  'HashiCorp Terraform Associate',
  'PRINCE2 Project Management',
  'ITIL v4 Foundation'
];

export default function ProfessionalAboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              About ContainerCode Advisory
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Strategic Technology Partner
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We are a leading technology consultancy specialising in multi-cloud solutions, cybersecurity excellence, 
              and digital transformation. Our mission is to empower organisations with secure, scalable, and innovative 
              technology solutions that drive sustainable growth and competitive advantage.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transforming Businesses Through 
                <span className="text-primary-600"> Technology Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                ContainerCode Advisory combines deep technical expertise with strategic business insight to help 
                organisations navigate the complexities of modern technology. We specialise in multi-cloud architectures, 
                cybersecurity frameworks, and digital transformation initiatives that deliver measurable business value.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our team of certified professionals brings decades of combined experience across all major cloud platforms, 
                enabling us to design and implement solutions that are secure, scalable, and aligned with your business objectives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Partner With Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link 
                  href="/services"
                  className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  View Our Work
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
                <p className="text-lg mb-8 text-gray-300 leading-relaxed">
                  To empower businesses with secure, scalable, and innovative cloud solutions that drive growth, 
                  operational efficiency, and competitive advantage in the digital economy.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-full mx-auto mb-3">
                        <achievement.icon className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-primary-400">{achievement.number}</div>
                      <div className="text-sm text-gray-400 font-medium">{achievement.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide every aspect of our client engagements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Areas of Expertise</h2>
            <p className="text-xl text-gray-600">
              Comprehensive technical knowledge across the entire technology ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl">
                      <area.icon className="w-8 h-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey of Excellence</h2>
            <p className="text-xl text-gray-600">
              Five years of continuous growth, innovation, and client success
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {companyTimeline.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {milestone.year.slice(-2)}
                    </div>
                  </div>
                  <div className="flex-grow bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{milestone.year}</h3>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">{milestone.title}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Certifications & Accreditations</h2>
            <p className="text-xl text-gray-600">
              Our team maintains industry-leading certifications across all major technology platforms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionalCertifications.map((certification, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
              >
                <Award className="w-6 h-6 text-primary-600 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{certification}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With ContainerCode Advisory?</h2>
            <p className="text-xl text-gray-600">
              What distinguishes us in the competitive technology consulting marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Proven Track Record',
                description: 'Over 150 successful transformations across diverse industries with consistently delivered business outcomes and measurable results.',
                benefits: ['99.9% service availability', '£50M+ cost savings delivered', '24/7 expert support coverage']
              },
              {
                title: 'Expert Team',
                description: 'Certified professionals with decades of experience across all major cloud platforms and emerging technologies.',
                benefits: ['Multi-cloud certified architects', 'Cybersecurity specialists', 'DevOps automation experts']
              },
              {
                title: 'Comprehensive Service',
                description: 'From strategic consulting to implementation and ongoing optimisation - we provide end-to-end technology solutions.',
                benefits: ['Strategic consulting', 'Implementation support', 'Continuous optimisation']
              }
            ].map((differentiator, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{differentiator.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{differentiator.description}</p>
                <div className="space-y-3">
                  {differentiator.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
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
              Ready to Accelerate Your Digital Transformation?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Let's discuss how our expertise and proven methodologies can help you achieve your technology 
              objectives with measurable results, reduced risk, and accelerated time-to-value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                href="/services"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition-all duration-300"
              >
                Explore Our Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}