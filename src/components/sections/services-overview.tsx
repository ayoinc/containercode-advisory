import { getServices } from '@/lib/notion';
import Link from 'next/link';
import Image from 'next/image';
import { Section, Card, CardContent, Button, StaggerContainer, InViewAnimation } from '@/components/ui';
import { ArrowRight, Cloud, Shield, Code, Database, Zap, Settings } from 'lucide-react';

// Service icons mapping
const serviceIcons = {
  'cloud': Cloud,
  'security': Shield,
  'development': Code,
  'database': Database,
  'performance': Zap,
  'consulting': Settings,
} as const;

export async function ServicesOverview() {
  // Fetch services from Notion
  const { results: services } = await getServices({
    filter: {
      and: [
        {
          property: "Status",
          select: {
            equals: "Active",
          },
        },
        {
          property: "Featured",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });

  return (
    <Section spacing="xl" background="slate" pattern="grid">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <InViewAnimation
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Comprehensive Technology Consulting
          </h2>
          <p className="text-xl text-gray-600">
            From cloud migration to cybersecurity, our expert team delivers end-to-end solutions for your technology needs.
          </p>
        </InViewAnimation>
      </div>
      
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => {
          // Try to determine icon based on service title or category
          const iconKey = Object.keys(serviceIcons).find(key => 
            service.title.toLowerCase().includes(key) || 
            service.category?.toLowerCase().includes(key)
          ) as keyof typeof serviceIcons;
          
          const IconComponent = iconKey ? serviceIcons[iconKey] : Code;
          
          return (
            <InViewAnimation
              key={service.id}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
              }}
            >
              <Card 
                variant="elevated" 
                hoverable 
                className="group h-full transition-all duration-300 hover:scale-105"
              >
                <Link href={{ pathname: `/services/${service.slug}` }} className="block h-full">
                  <div className="relative h-48 bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden rounded-t-lg">
                    {service.featuredImage ? (
                      <Image
                        src={service.featuredImage}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                          <IconComponent className="h-12 w-12 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-gray-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center text-gray-700 font-medium group-hover:text-teal-600 transition-colors">
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </InViewAnimation>
          );
        })}
        
        {/* Empty state */}
        {services.length === 0 && (
          <div className="col-span-full">
            <Card variant="elevated" className="text-center py-16">
              <CardContent>
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600">
                  Please set up services in your Notion database.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </StaggerContainer>
      
      <div className="text-center mt-12">
        <InViewAnimation
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { delay: 0.4 } }
          }}
        >
          <Link href="/services">
            <Button 
              variant="outline"
              size="lg"
              animation="scale"
            >
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </InViewAnimation>
      </div>
    </Section>
  );
}
