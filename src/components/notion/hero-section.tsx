'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { getHeroSection } from '@/lib/notion-cms';
import { getImageForContent } from '@/lib/pexels';
import type { NotionHeroSection } from '@/lib/notion-cms';

interface HeroSectionProps {
  pageSlug: string;
  fallbackData?: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    imageType: string;
  };
}

export default function NotionHeroSection({ pageSlug, fallbackData }: HeroSectionProps) {
  const [heroData, setHeroData] = useState<NotionHeroSection | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHeroData() {
      try {
        const data = await getHeroSection(pageSlug);
        
        if (data) {
          setHeroData(data);
          
          // Get image from Pexels if no background image is set
          if (!data.backgroundImage && data.imageType) {
            const image = await getImageForContent(data.imageType);
            if (image) {
              setBackgroundImage(image.url);
            }
          }
        } else if (fallbackData) {
          // Use fallback data if no Notion data is available
          const image = await getImageForContent(fallbackData.imageType);
          if (image) {
            setBackgroundImage(image.url);
          }
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadHeroData();
  }, [pageSlug, fallbackData]);

  // Use Notion data if available, otherwise use fallback
  const displayData = heroData || fallbackData;

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded-full w-48 mx-auto mb-6"></div>
              <div className="h-16 bg-gray-700 rounded-lg mb-6"></div>
              <div className="h-6 bg-gray-700 rounded-lg mb-12 max-w-3xl mx-auto"></div>
              <div className="h-12 bg-gray-700 rounded-lg w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!displayData) {
    return null;
  }

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16 overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gray-900/60" />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6 backdrop-blur-sm">
              <Building2 className="w-4 h-4 mr-2" />
              {displayData.subtitle}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {displayData.title}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
              {displayData.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={displayData.ctaLink}
                className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                {displayData.ctaText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}