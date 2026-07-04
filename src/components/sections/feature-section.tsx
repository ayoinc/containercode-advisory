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
    <section className="py-24 bg-navy-900 text-navy-100 relative">
      <div aria-hidden className="absolute inset-0 bg-tech-grid opacity-40" />
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mb-16">
          <span className="tech-label">[ 02 ] — Why ContainerCode</span>
          <h2 className="mt-4 mb-4 text-navy-100">
            Why Choose ContainerCode Advisory?
          </h2>
          <p className="text-xl text-navy-200">
            Our expert team delivers strategic technology solutions with measurable business impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-navy-850 border border-navy-700 rounded-lg p-8 hover:border-aqua-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4">
                <span className="font-display text-4xl font-bold text-gradient-aqua">
                  {feature.stats}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-navy-100">
                {feature.title}
              </h3>
              <p className="text-navy-300 mb-6">
                {feature.description}
              </p>
              
              {/* Feature highlights */}
              <ul className="space-y-2 mb-6">
                {feature.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex} className="flex items-start text-sm text-navy-200">
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
        <div className="mt-16 bg-navy-850 border border-navy-700 rounded-xl p-8 lg:p-12 card-featured">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-navy-100">
                End-to-End Digital Transformation
              </h3>
              <p className="text-navy-300 mb-6">
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
                  <li key={i} className="flex items-start text-navy-200">
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
                  className="inline-flex items-center justify-center px-6 py-3 bg-aqua-500 hover:bg-aqua-400 text-navy-950 font-semibold rounded transition-colors"
                >
                  Explore All Services
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-navy-600 text-navy-100 hover:border-aqua-500/50 hover:bg-navy-800 font-semibold rounded transition-colors"
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden h-[300px] border border-navy-700 bg-navy-900">
              <Image
                src="/images/service-digital-transformation.svg"
                alt="Digital transformation and modern technology"
                className="w-full h-full object-cover"
                width={400}
                height={300}
                quality={85}
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
