'use client';

/**
 * Content Recommendations Component
 * Intelligent content suggestions based on user behavior
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Content types
interface Content {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  readTime: number;
  views: number;
  relevanceScore: number;
  image?: string;
  url: string;
  type: 'blog' | 'service' | 'resource';
}

// User behavior tracking
interface UserBehavior {
  viewedCategories: Record<string, number>;
  viewedTags: Record<string, number>;
  timeOnSite: number;
  lastVisit?: Date;
  interests: string[];
}

export interface ContentRecommendationsProps {
  currentContentId?: string;
  maxRecommendations?: number;
  className?: string;
}

// Mock content database
const contentDatabase: Content[] = [
  {
    id: '1',
    title: 'Multi-Cloud Strategy: AWS vs Azure vs Google Cloud',
    description: 'Comprehensive comparison of major cloud providers to help you make the right choice.',
    category: 'Cloud Strategy',
    tags: ['AWS', 'Azure', 'Google Cloud', 'Multi-Cloud'],
    readTime: 8,
    views: 1234,
    relevanceScore: 0.95,
    image: '/images/cloud-comparison.jpg',
    url: '/blog/multi-cloud-strategy',
    type: 'blog',
  },
  {
    id: '2',
    title: 'DevOps Best Practices for Enterprise',
    description: 'Learn how to implement DevOps at scale with proven methodologies.',
    category: 'DevOps',
    tags: ['DevOps', 'CI/CD', 'Automation', 'Enterprise'],
    readTime: 12,
    views: 987,
    relevanceScore: 0.88,
    image: '/images/devops-practices.jpg',
    url: '/blog/devops-best-practices',
    type: 'blog',
  },
  {
    id: '3',
    title: 'Zero Trust Security Implementation',
    description: 'Step-by-step guide to implementing zero trust architecture in your organization.',
    category: 'Cybersecurity',
    tags: ['Security', 'Zero Trust', 'Architecture', 'Compliance'],
    readTime: 15,
    views: 756,
    relevanceScore: 0.92,
    image: '/images/zero-trust.jpg',
    url: '/resources/zero-trust-guide',
    type: 'resource',
  },
  {
    id: '4',
    title: 'Digital Transformation Success: FinTech Consulting',
    description: 'How our strategic consulting helped a leading FinTech company modernize their infrastructure.',
    category: 'Success Stories',
    tags: ['FinTech', 'Digital Transformation', 'Consulting'],
    readTime: 5,
    views: 543,
    relevanceScore: 0.85,
    image: '/images/fintech-consulting.jpg',
    url: '/services/digital-transformation',
    type: 'service',
  },
];

export const ContentRecommendations: React.FC<ContentRecommendationsProps> = ({
  currentContentId,
  maxRecommendations = 3,
  className,
}) => {
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    viewedCategories: {},
    viewedTags: {},
    timeOnSite: 0,
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate user behavior tracking
  useEffect(() => {
    // Load user behavior from localStorage (in real app, this would be from analytics)
    const stored = localStorage.getItem('userBehavior');
    if (stored) {
      setUserBehavior(JSON.parse(stored));
    }

    // Track time on site
    const interval = setInterval(() => {
      setUserBehavior((prev) => ({
        ...prev,
        timeOnSite: prev.timeOnSite + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // AI-powered recommendation algorithm
  const getRecommendations = useCallback(() => {
    setIsLoading(true);

    // Filter out current content
    let availableContent = contentDatabase.filter((c) => c.id !== currentContentId);

    // Calculate relevance scores based on user behavior
    const scoredContent = availableContent.map((content) => {
      let score = content.relevanceScore;

      // Boost score based on viewed categories
      if (userBehavior.viewedCategories[content.category]) {
        score += 0.1 * userBehavior.viewedCategories[content.category];
      }

      // Boost score based on viewed tags
      content.tags.forEach((tag) => {
        if (userBehavior.viewedTags[tag]) {
          score += 0.05 * userBehavior.viewedTags[tag];
        }
      });

      // Boost score based on user interests
      userBehavior.interests.forEach((interest) => {
        if (
          content.title.toLowerCase().includes(interest.toLowerCase()) ||
          content.tags.some((tag) => tag.toLowerCase() === interest.toLowerCase())
        ) {
          score += 0.2;
        }
      });

      // Factor in popularity (views)
      score += Math.min(content.views / 10000, 0.1);

      // Diversity factor - reduce score if category is overrepresented
      const categoryCount = recommendations.filter(
        (r) => r.category === content.category
      ).length;
      if (categoryCount > 0) {
        score -= 0.1 * categoryCount;
      }

      return { ...content, score };
    });

    // Sort by score and take top recommendations
    const topRecommendations = scoredContent
      .sort((a, b) => b.score - a.score)
      .slice(0, maxRecommendations);

    setRecommendations(topRecommendations);
    setIsLoading(false);
  }, [currentContentId, userBehavior.interests, userBehavior.viewedCategories, userBehavior.viewedTags, recommendations, maxRecommendations]);

  // Get recommendations on mount and when dependencies change
  useEffect(() => {
    getRecommendations();
  }, [currentContentId, userBehavior.interests, getRecommendations]);

  // Track content view
  const trackContentView = (content: Content) => {
    setUserBehavior((prev) => {
      const updated = { ...prev };
      
      // Update category views
      updated.viewedCategories[content.category] =
        (updated.viewedCategories[content.category] || 0) + 1;
      
      // Update tag views
      content.tags.forEach((tag) => {
        updated.viewedTags[tag] = (updated.viewedTags[tag] || 0) + 1;
      });
      
      // Save to localStorage
      localStorage.setItem('userBehavior', JSON.stringify(updated));
      
      return updated;
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(maxRecommendations)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-semibold">
          Recommended for You
        </h2>
      </div>

      {/* Recommendations */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-4"
        >
          {recommendations.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
                onClick={() => {
                  trackContentView(content);
                  // Navigate to content (in real app)
                  console.log('Navigate to:', content.url);
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{content.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {content.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Additional metadata */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{content.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{content.views.toLocaleString()} views</span>
                  </div>
                  {content.relevanceScore > 0.9 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Trending</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* View all link */}
      <motion.a
        href="/resources"
        className="inline-flex items-center gap-2 text-primary-600 hover:underline"
        whileHover={{ x: 5 }}
      >
        View all resources
        <ArrowRight className="w-4 h-4" />
      </motion.a>
    </div>
  );
};

// Hook for tracking user interests
export function useContentTracking() {
  const trackInterest = (interest: string) => {
    const stored = localStorage.getItem('userBehavior');
    const behavior: UserBehavior = stored
      ? JSON.parse(stored)
      : {
          viewedCategories: {},
          viewedTags: {},
          timeOnSite: 0,
          interests: [],
        };

    if (!behavior.interests.includes(interest)) {
      behavior.interests.push(interest);
      localStorage.setItem('userBehavior', JSON.stringify(behavior));
    }
  };

  const clearTracking = () => {
    localStorage.removeItem('userBehavior');
  };

  return { trackInterest, clearTracking };
}