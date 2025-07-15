'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Cloud, 
  Headphones, 
  Target, 
  Users, 
  Award,
  CheckCircle,
  Star,
  Clock
} from 'lucide-react';
import { getFeatures } from '@/lib/notion-cms';
import type { NotionFeature } from '@/lib/notion-cms';

interface FeaturesShowcaseProps {
  category?: string;
  maxItems?: number;
  layout?: 'grid' | 'list';
}

const iconMap = {
  'Shield': Shield,
  'Cloud': Cloud,
  'Headphones': Headphones,
  'Target': Target,
  'Users': Users,
  'Award': Award,
  'CheckCircle': CheckCircle,
  'Star': Star,
  'Clock': Clock,
};

export default function NotionFeaturesShowcase({ 
  category, 
  maxItems = 6, 
  layout = 'grid' 
}: FeaturesShowcaseProps) {
  const [features, setFeatures] = useState<NotionFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatures() {
      try {
        const featuresData = await getFeatures(category);
        const displayFeatures = featuresData.slice(0, maxItems);
        setFeatures(displayFeatures);
      } catch (error) {
        console.error('Error loading features:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFeatures();
  }, [category, maxItems]);

  if (isLoading) {
    const skeletonItems = Array.from({ length: maxItems }, (_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-300 rounded-2xl p-6">
          <div className="w-12 h-12 bg-gray-400 rounded-xl mb-4"></div>
          <div className="h-6 bg-gray-400 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded"></div>
            <div className="h-4 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    ));

    return (
      <div className={layout === 'grid' ? 
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 
        'space-y-6'
      }>
        {skeletonItems}
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No features available</p>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className="space-y-6">
        {features.map((feature, index) => {
          const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || CheckCircle;

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 p-3 bg-primary-100 rounded-xl">
                <IconComponent className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-2">
                  {feature.description}
                </p>
                {feature.benefit && (
                  <p className="text-sm text-primary-600 font-medium">
                    ✓ {feature.benefit}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || CheckCircle;

        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
              <IconComponent className="h-8 w-8 text-primary-600" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {feature.title}
            </h3>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              {feature.description}
            </p>
            
            {feature.benefit && (
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700 font-medium">
                  ✓ {feature.benefit}
                </p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}