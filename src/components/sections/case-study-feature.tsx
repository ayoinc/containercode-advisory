import Link from 'next/link';

export function CaseStudyFeature() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Client Success Stories
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300">
            Real results for businesses across industries.
          </p>
        </div>
        
        {/* Main case study feature */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-elevated overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-gradient-to-br from-navy-800 to-navy-600 p-12 flex items-center">
              {/* This would be replaced with an actual image */}
              <div className="text-center w-full">
                <div className="bg-white/10 p-8 rounded-lg border border-white/20 inline-block mb-4">
                  <span className="text-6xl">🏥</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Healthcare Provider</h3>
                <p className="text-white/80">Cloud Migration & Security</p>
              </div>
            </div>
            
            <div className="p-12">
              <div className="text-sm font-medium text-aqua-600 dark:text-aqua-400 mb-2">SUCCESS STORY</div>
              <h3 className="text-2xl font-bold mb-4">
                40% Cost Reduction with Enhanced Security
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                A leading healthcare provider needed to migrate their legacy infrastructure to the cloud while ensuring HIPAA compliance and minimizing operational costs.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-navy-600 dark:text-aqua-400 mb-2">40%</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Reduction in cloud costs</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-navy-600 dark:text-aqua-400 mb-2">100%</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">HIPAA compliance achieved</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-navy-600 dark:text-aqua-400 mb-2">0</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Minutes of downtime</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-navy-600 dark:text-aqua-400 mb-2">3x</div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Improved performance</p>
                </div>
              </div>
              
              <Link href="/case-studies/healthcare-provider" className="btn-primary btn-lg">
                Read Case Study
              </Link>
            </div>
          </div>
        </div>
        
        {/* Additional case studies */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              industry: "Financial Services",
              title: "Multi-Cloud Security Implementation",
              results: "Achieved SOC2 compliance with 99.99% uptime",
              icon: "🏦"
            },
            {
              industry: "E-Commerce",
              title: "DevOps Transformation",
              results: "70% faster deployments with zero downtime",
              icon: "🛒"
            },
            {
              industry: "Manufacturing",
              title: "Digital Transformation",
              results: "35% increase in operational efficiency",
              icon: "🏭"
            }
          ].map((casestudy, index) => (
            <Link 
              key={index}
              href={`/case-studies/${casestudy.industry.toLowerCase().replace(/\s+/g, '-')}`}
              className="card p-6 hover:border-navy-500 dark:hover:border-aqua-500 border-2 border-transparent transition-colors group"
            >
              <div className="bg-slate-100 dark:bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">{casestudy.icon}</span>
              </div>
              <div className="text-sm text-navy-600 dark:text-aqua-400 font-medium mb-2">
                {casestudy.industry}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-navy-600 dark:group-hover:text-aqua-500 transition-colors">
                {casestudy.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {casestudy.results}
              </p>
              <div className="inline-flex items-center text-navy-600 dark:text-aqua-500 font-medium group-hover:underline">
                View Case Study
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
