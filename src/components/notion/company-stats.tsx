'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCompanyInfo } from '@/lib/notion-cms';
import type { NotionCompanyInfo } from '@/lib/notion-cms';

interface CompanyStatsProps {
  category?: string;
  layout?: 'grid' | 'horizontal';
  showDescription?: boolean;
}

export default function NotionCompanyStats({ 
  category = 'stats', 
  layout = 'horizontal',
  showDescription = false 
}: CompanyStatsProps) {
  const [stats, setStats] = useState<NotionCompanyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const companyData = await getCompanyInfo();
        const statsData = companyData.filter(item => item.category === category);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading company stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [category]);

  if (isLoading) {
    const skeletonItems = Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="animate-pulse text-center">
        <div className="h-8 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded"></div>
      </div>
    ));

    return (
      <div className={layout === 'grid' ? 
        'grid grid-cols-2 md:grid-cols-4 gap-8' : 
        'grid grid-cols-2 md:grid-cols-4 gap-8'
      }>
        {skeletonItems}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No statistics available</p>
      </div>
    );
  }

  const formatStatValue = (value: string) => {
    // Handle different stat formats
    if (value.includes('%')) {
      return value;
    }
    if (value.includes('£')) {
      return value;
    }
    if (value.includes('+')) {
      return value;
    }
    if (value.includes('/')) {
      return value;
    }
    if (value.includes('<') || value.includes('>')) {
      return value;
    }
    return value;
  };

  const getStatColor = (key: string) => {
    const colorMap: Record<string, string> = {
      'clients_served': 'text-blue-600',
      'enterprise_clients': 'text-green-600',
      'cost_savings_delivered': 'text-purple-600',
      'uptime_sla': 'text-emerald-600',
      'client_satisfaction': 'text-yellow-600',
      'response_time': 'text-red-600',
      'certifications': 'text-indigo-600',
    };
    return colorMap[key] || 'text-primary-600';
  };

  const getStatLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      'clients_served': 'Successful Projects',
      'enterprise_clients': 'Enterprise Clients',
      'cost_savings_delivered': 'Cost Savings Delivered',
      'uptime_sla': 'Service Availability',
      'client_satisfaction': 'Client Satisfaction',
      'response_time': 'Support Response',
      'certifications': 'Professional Certifications',
    };
    return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={layout === 'grid' ? 
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8' : 
      'grid grid-cols-2 md:grid-cols-4 gap-8'
    }>
      {stats.map((stat, index) => {
        const statColor = getStatColor(stat.key);
        const statLabel = getStatLabel(stat.key);
        const statValue = formatStatValue(stat.value);

        return (
          <motion.div
            key={stat.id}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={`text-3xl md:text-4xl font-bold ${statColor} mb-2`}>
              {statValue}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {statLabel}
            </div>
            {showDescription && stat.description && (
              <div className="text-xs text-gray-500 mt-1">
                {stat.description}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}