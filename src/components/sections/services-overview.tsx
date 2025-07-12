import Link from 'next/link';
import { 
  Cloud, 
  Shield, 
  Code, 
  BarChart, 
  Cpu, 
  HeadphonesIcon 
} from 'lucide-react';

export function ServicesOverview() {
  const services = [
    {
      title: "Cloud Technologies",
      description: "Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated security and optimization.",
      icon: Cloud,
      href: "/services/cloud-technologies",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Cybersecurity",
      description: "Comprehensive security solutions including assessments, compliance, and incident response planning.",
      icon: Shield,
      href: "/services/cybersecurity",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "DevOps & DevSecOps",
      description: "Streamline your development pipeline with CI/CD, container orchestration, and integrated security.",
      icon: Code,
      href: "/services/devops",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Digital Transformation",
      description: "Strategic consulting to help businesses leverage technology for competitive advantage.",
      icon: BarChart,
      href: "/services/digital-transformation",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Software Engineering",
      description: "Custom development, legacy modernization, API integration, and cloud-native applications.",
      icon: Cpu,
      href: "/services/software-engineering",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "IT Support & Management",
      description: "24/7 monitoring, cloud migration services, and infrastructure modernization.",
      icon: HeadphonesIcon,
      href: "/services/it-support",
      color: "text-teal-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Technology Consulting
          </h2>
          <p className="text-xl text-slate-700 dark:text-slate-300">
            From cloud migration to cybersecurity, our expert team delivers end-to-end solutions for your technology needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="card p-6 group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300`}>
                <service.icon className={`h-6 w-6 ${service.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-navy-600 dark:group-hover:text-aqua-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {service.description}
              </p>
              <Link 
                href={service.href} 
                className="inline-flex items-center text-navy-600 dark:text-aqua-500 font-medium group-hover:underline"
              >
                Learn More
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
