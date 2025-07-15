'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';
import { getTestimonials } from '@/lib/notion-cms';
import { getImageForContent } from '@/lib/pexels';
import type { NotionTestimonial } from '@/lib/notion-cms';

interface TestimonialsSectionProps {
  featuredOnly?: boolean;
  maxItems?: number;
  showRating?: boolean;
}

export default function NotionTestimonialsSection({ 
  featuredOnly = false, 
  maxItems = 3, 
  showRating = true 
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<NotionTestimonial[]>([]);
  const [clientImages, setClientImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const testimonialsData = await getTestimonials(featuredOnly);
        const displayTestimonials = testimonialsData.slice(0, maxItems);
        setTestimonials(displayTestimonials);

        // Load images for clients
        const imagePromises = displayTestimonials.map(async (testimonial) => {
          const image = await getImageForContent('business professional');
          return { id: testimonial.id, image: image?.url || '' };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, { id, image }) => {
          acc[id] = image;
          return acc;
        }, {} as Record<string, string>);

        setClientImages(imageMap);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTestimonials();
  }, [featuredOnly, maxItems]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: maxItems }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-400 rounded-full mr-4"></div>
                <div className="flex-grow">
                  <div className="h-4 bg-gray-400 rounded mb-2"></div>
                  <div className="h-3 bg-gray-400 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No testimonials available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => {
        const clientImage = clientImages[testimonial.id];

        return (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
          >
            {/* Quote Icon */}
            <div className="flex items-center justify-between mb-6">
              <Quote className="h-8 w-8 text-primary-600" />
              {showRating && testimonial.rating && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Testimonial Content */}
            <blockquote className="text-gray-700 leading-relaxed mb-6">
              "{testimonial.content}"
            </blockquote>

            {/* Client Info */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {clientImage ? (
                  <img
                    src={clientImage}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-600">
                  {testimonial.position}
                  {testimonial.company && (
                    <span className="text-gray-500"> at {testimonial.company}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Service Used Badge */}
            {testimonial.serviceUsed && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  {testimonial.serviceUsed} service
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}