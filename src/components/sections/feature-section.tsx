import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function FeatureSection() {
  const features: {
    title: string;
    description: string;
    stats: string;
    learnMoreUrl: string;
    highlights: string[];
  }[] = [
    {
      title: "Multi-Cloud Expertise",
      description: "Specialised consulting across all major cloud platforms to prevent vendor lock-in and optimise resources whilst ensuring UK regulatory compliance.",
      stats: "5+ Cloud Platforms",
      learnMoreUrl: "/services/cloud-technologies",
      highlights: ["AWS, Azure, Google Cloud certified architects", "Zero-downtime migration strategies", "Cost optimisation up to 60%"]
    },
    {
      title: "Security-First Approach",
      description: "Integrated security at every level of your technology stack, from infrastructure to application code, with comprehensive UK compliance frameworks.",
      stats: "100% Compliance Success",
      learnMoreUrl: "/services/cybersecurity",
      highlights: ["Zero-trust architecture implementation", "GDPR and UK Data Protection Act compliance", "24/7 threat monitoring"]
    },
    {
      title: "DevOps Excellence",
      description: "Streamlined development pipelines with automation, continuous integration, and deployment for enterprise-grade software delivery.",
      stats: "90% Faster Deployments",
      learnMoreUrl: "/services/devops",
      highlights: ["Enterprise CI/CD automation", "Infrastructure as Code", "Security-integrated pipelines"]
    },
    {
      title: "Digital Transformation",
      description: "Technology solutions aligned with your business goals for measurable ROI and competitive advantage in the digital economy.",
      stats: "300% ROI Average",
      learnMoreUrl: "/services/digital-transformation",
      highlights: ["Process automation and optimisation", "Legacy system modernisation", "AI-driven innovation strategies"]
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose ContainerCode Advisory?
          </h2>
          <p className="text-xl text-white/80">
            Our expert team delivers strategic technology solutions with measurable business impact.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="mb-4">
                <span className="text-4xl font-bold text-aqua-400">
                  {feature.stats}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80 mb-6">
                {feature.description}
              </p>
              
              {/* Feature highlights */}
              <ul className="space-y-2 mb-6">
                {feature.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex} className="flex items-start text-sm text-white/70">
                    <svg className="w-4 h-4 text-aqua-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              
              {/* Learn More button */}
              <Link 
                href={feature.learnMoreUrl as any}
                className="inline-flex items-center text-aqua-400 hover:text-aqua-300 font-medium transition-colors group"
              >
                Learn More About Our {feature.title}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
        
        {/* Additional feature highlight */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                End-to-End Digital Transformation
              </h3>
              <p className="text-white/80 mb-6">
                From strategic planning and cloud migration to optimisation and ongoing management, we provide comprehensive digital transformation services tailored to your business objectives and UK regulatory requirements.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Strategic digital roadmap development with ROI analysis",
                  "Seamless cloud migration with zero downtime guarantee",
                  "Cost optimisation across multiple cloud providers",
                  "Continuous security monitoring and threat detection",
                  "Performance optimisation and intelligent auto-scaling",
                  "Compliance management for UK and EU regulations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-aqua-400 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 bg-aqua-500 hover:bg-aqua-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Explore All Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white hover:bg-white/10 font-semibold rounded-lg transition-colors"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden h-[300px]">
              <Image 
                src="/images/service-digital-transformation.svg"
                alt="Digital transformation and modern technology"
                className="w-full h-full object-cover"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
