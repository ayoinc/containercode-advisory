export function FeatureSection() {
  const features = [
    {
      title: "Multi-Cloud Expertise",
      description: "Specialized consulting across all major cloud platforms to prevent vendor lock-in and optimize resources.",
      stats: "5+ Cloud Platforms",
    },
    {
      title: "Security-First Approach",
      description: "Integrated security at every level of your technology stack, from infrastructure to application code.",
      stats: "100% Compliance Success",
    },
    {
      title: "DevOps Excellence",
      description: "Streamlined development pipelines with automation, continuous integration, and deployment.",
      stats: "60% Faster Deployments",
    },
    {
      title: "Business-Focused Results",
      description: "Technology solutions aligned with your business goals for measurable ROI and competitive advantage.",
      stats: "40% Cost Reduction",
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
              <p className="text-white/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Additional feature highlight */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                End-to-End Cloud Transformation
              </h3>
              <p className="text-white/80 mb-6">
                From strategy and migration to optimization and ongoing management, we provide comprehensive cloud transformation services tailored to your business needs.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Strategic cloud roadmap development",
                  "Seamless migration with zero downtime",
                  "Cost optimization across providers",
                  "Continuous security monitoring",
                  "Performance optimization and scaling",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-aqua-400 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-lg overflow-hidden h-[300px]">
              <img 
                src="/images/service-digital-transformation.svg"
                alt="Digital transformation and modern technology"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
