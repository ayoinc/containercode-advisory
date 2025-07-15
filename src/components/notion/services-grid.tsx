'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Cloud, Shield, Code, Database, Zap, Settings } from 'lucide-react';
import Link from 'next/link';
import { getServices } from '@/lib/notion-cms';
import { getImageForContent } from '@/lib/pexels';
import type { NotionService } from '@/lib/notion-cms';

interface ServicesGridProps {
  showAll?: boolean;
  maxItems?: number;
}

const iconMap = {
  'Cloud': Cloud,
  'Shield': Shield,
  'Code': Code,
  'Database': Database,
  'Zap': Zap,
  'Settings': Settings,
};

export default function NotionServicesGrid({ showAll = false, maxItems = 6 }: ServicesGridProps) {
  const [services, setServices] = useState<NotionService[]>([]);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const servicesData = await getServices();
        const displayServices = showAll ? servicesData : servicesData.slice(0, maxItems);
        setServices(displayServices);

        // Load images for each service
        const imagePromises = displayServices.map(async (service) => {
          if (service.imageType) {
            const image = await getImageForContent(service.imageType);
            return { id: service.id, image: image?.url || '' };
          }
          return { id: service.id, image: '' };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {} as Record<string, string>);

        setServiceImages(imageMap);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, [showAll, maxItems]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: maxItems }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-2xl h-48 mb-4"></div>
            <div className="bg-gray-300 h-6 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 rounded"></div>
              <div className="bg-gray-300 h-4 rounded"></div>
              <div className="bg-gray-300 h-4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => {
        const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Cloud;
        const serviceImage = serviceImages[service.id];

        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col overflow-hidden"
          >
            {/* Service Image */}
            <div className="relative h-48">
              {serviceImage ? (
                <img
                  src={serviceImage}
                  alt={`${service.title} professional services`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <IconComponent className="w-16 h-16 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Icon overlay */}
              <div className={`absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${service.color}-100 shadow-lg backdrop-blur-sm`}>
                <IconComponent className={`h-6 w-6 text-${service.color}-600`} />
              </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                {service.description}
              </p>
              
              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm text-gray-700">Key Capabilities:</h4>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes */}
              {service.outcomes && service.outcomes.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm text-gray-700">Typical Outcomes:</h4>
                  <div className="space-y-1">
                    {service.outcomes.slice(0, 3).map((outcome, idx) => (
                      <div key={idx} className="text-sm text-gray-600 font-medium">
                        • {outcome}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-auto">
                <Link 
                  href={service.href}
                  className={`inline-flex items-center text-${service.color}-600 hover:text-${service.color}-700 font-semibold transition-colors`}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}