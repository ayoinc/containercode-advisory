'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { getFAQs } from '@/lib/notion-cms';
import type { NotionFAQ } from '@/lib/notion-cms';

interface FAQSectionProps {
  category?: string;
  maxItems?: number;
  showCategory?: boolean;
}

export default function NotionFAQSection({ 
  category, 
  maxItems = 6, 
  showCategory = false 
}: FAQSectionProps) {
  const [faqs, setFaqs] = useState<NotionFAQ[]>([]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFAQs() {
      try {
        const faqsData = await getFAQs(category);
        const displayFAQs = faqsData.slice(0, maxItems);
        setFaqs(displayFAQs);
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFAQs();
  }, [category, maxItems]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: maxItems }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-300 rounded-lg p-6">
              <div className="h-6 bg-gray-400 rounded mb-2"></div>
              <div className="h-4 bg-gray-400 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No FAQs available</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'general': 'bg-blue-100 text-blue-800',
      'services': 'bg-green-100 text-green-800',
      'pricing': 'bg-purple-100 text-purple-800',
      'technical': 'bg-orange-100 text-orange-800',
      'support': 'bg-red-100 text-red-800',
      'security': 'bg-indigo-100 text-indigo-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openItems.has(faq.id);

        return (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleItem(faq.id)}
              className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  {showCategory && faq.category && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(faq.category)}`}>
                      {faq.category}
                    </span>
                  )}
                </div>
                <div className="flex-shrink-0 ml-4">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                      
                      {/* Related Service Tag */}
                      {faq.relatedService && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-600">
                            Related to: 
                            <span className="ml-1 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800">
                              {faq.relatedService}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}