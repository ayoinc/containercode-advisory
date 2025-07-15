/**
 * Subscriber Segmentation System
 * Advanced segmentation for targeted content delivery
 * Implements behavioral, demographic, and engagement-based segmentation
 */

import { Client } from '@notionhq/client';

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  company?: string;
  industry?: string;
  jobTitle?: string;
  location?: string;
  signupDate: Date;
  lastActivity?: Date;
  emailOpens: number;
  emailClicks: number;
  emailsSent: number;
  unsubscribed: boolean;
  preferences: {
    topics: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    contentType: 'technical' | 'business' | 'mixed';
  };
  behaviorData: {
    websiteVisits: number;
    pageViews: number;
    downloadedResources: string[];
    webinarAttendance: number;
    eventAttendance: number;
  };
  engagementScore: number;
  segment: string;
  tags: string[];
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  subscriberCount: number;
  engagementRate: number;
  contentPreferences: {
    topics: string[];
    formats: string[];
    frequency: string;
  };
  createdAt: Date;
  lastUpdated: Date;
}

export interface SegmentCriteria {
  demographic?: {
    industries?: string[];
    jobTitles?: string[];
    locations?: string[];
    companies?: string[];
  };
  behavioral?: {
    minEngagementScore?: number;
    maxEngagementScore?: number;
    minEmailOpens?: number;
    minEmailClicks?: number;
    websiteActivity?: 'low' | 'medium' | 'high';
    recentActivity?: number; // days
  };
  preferences?: {
    topics?: string[];
    contentType?: string[];
    frequency?: string[];
  };
  customCriteria?: {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
    value: any;
  }[];
}

export class SubscriberSegmentation {
  private notion: Client;
  private env: any;
  private segments: Map<string, Segment> = new Map();
  
  constructor(env: any) {
    this.env = env;
    this.notion = new Client({ auth: env.NOTION_TOKEN });
    this.initializeDefaultSegments();
  }

  /**
   * Initialize default segments for enterprise audience
   */
  private initializeDefaultSegments() {
    const defaultSegments: Segment[] = [
      {
        id: 'enterprise-executives',
        name: 'Enterprise Executives',
        description: 'C-level executives and senior management in large enterprises',
        criteria: {
          demographic: {
            jobTitles: ['CEO', 'CTO', 'CIO', 'CISO', 'VP', 'Director', 'Chief', 'Head of']
          },
          behavioral: {
            minEngagementScore: 70
          }
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['digital transformation', 'strategy', 'leadership', 'ROI'],
          formats: ['executive summary', 'case study', 'whitepaper'],
          frequency: 'monthly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'technical-professionals',
        name: 'Technical Professionals',
        description: 'Software engineers, architects, and technical specialists',
        criteria: {
          demographic: {
            jobTitles: ['Engineer', 'Developer', 'Architect', 'Technical', 'DevOps', 'Security']
          },
          preferences: {
            contentType: ['technical', 'mixed']
          }
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['cloud architecture', 'cybersecurity', 'AI/ML', 'DevOps', 'automation'],
          formats: ['technical deep-dive', 'tutorial', 'best practices'],
          frequency: 'weekly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'high-engagement',
        name: 'High Engagement Subscribers',
        description: 'Highly engaged subscribers with strong email interaction',
        criteria: {
          behavioral: {
            minEngagementScore: 80,
            minEmailOpens: 10,
            minEmailClicks: 5,
            recentActivity: 30
          }
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['all'],
          formats: ['all'],
          frequency: 'weekly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'new-subscribers',
        name: 'New Subscribers',
        description: 'Recently subscribed users in their first 30 days',
        criteria: {
          behavioral: {
            recentActivity: 30
          },
          customCriteria: [
            {
              field: 'signupDate',
              operator: 'greater_than',
              value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['welcome', 'getting started', 'overview'],
          formats: ['introduction', 'guide', 'overview'],
          frequency: 'weekly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'at-risk',
        name: 'At-Risk Subscribers',
        description: 'Subscribers with declining engagement who may unsubscribe',
        criteria: {
          behavioral: {
            maxEngagementScore: 30,
            recentActivity: 90
          },
          customCriteria: [
            {
              field: 'lastActivity',
              operator: 'less_than',
              value: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['re-engagement', 'value proposition', 'success stories'],
          formats: ['success story', 'case study', 'special offer'],
          frequency: 'monthly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'industry-fintech',
        name: 'Financial Technology',
        description: 'Subscribers from financial services and fintech industry',
        criteria: {
          demographic: {
            industries: ['Financial Services', 'Fintech', 'Banking', 'Insurance']
          }
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['fintech', 'regulatory compliance', 'digital banking', 'blockchain'],
          formats: ['case study', 'regulatory update', 'industry analysis'],
          frequency: 'bi-weekly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      },
      {
        id: 'industry-healthcare',
        name: 'Healthcare Technology',
        description: 'Subscribers from healthcare and medical technology sector',
        criteria: {
          demographic: {
            industries: ['Healthcare', 'Medical Technology', 'Pharmaceuticals', 'Health IT']
          }
        },
        subscriberCount: 0,
        engagementRate: 0,
        contentPreferences: {
          topics: ['healthcare IT', 'patient data', 'telemedicine', 'medical devices'],
          formats: ['clinical study', 'regulatory guide', 'technology overview'],
          frequency: 'monthly'
        },
        createdAt: new Date(),
        lastUpdated: new Date()
      }
    ];

    defaultSegments.forEach(segment => {
      this.segments.set(segment.id, segment);
    });
  }

  /**
   * Segment subscribers based on criteria
   */
  async segmentSubscribers(subscribers: Subscriber[]): Promise<Map<string, Subscriber[]>> {
    const segmentedSubscribers = new Map<string, Subscriber[]>();
    
    // Initialize segment arrays
    this.segments.forEach((segment, id) => {
      segmentedSubscribers.set(id, []);
    });
    
    // Process each subscriber
    for (const subscriber of subscribers) {
      const subscriberSegments = await this.getSubscriberSegments(subscriber);
      
      // Add subscriber to matching segments
      subscriberSegments.forEach(segmentId => {
        const segmentSubscribers = segmentedSubscribers.get(segmentId) || [];
        segmentSubscribers.push(subscriber);
        segmentedSubscribers.set(segmentId, segmentSubscribers);
      });
    }
    
    // Update segment counts
    this.updateSegmentCounts(segmentedSubscribers);
    
    return segmentedSubscribers;
  }

  /**
   * Get segments for a specific subscriber
   */
  async getSubscriberSegments(subscriber: Subscriber): Promise<string[]> {
    const matchingSegments: string[] = [];
    
    for (const [segmentId, segment] of this.segments) {
      if (await this.matchesSegmentCriteria(subscriber, segment.criteria)) {
        matchingSegments.push(segmentId);
      }
    }
    
    return matchingSegments;
  }

  /**
   * Check if subscriber matches segment criteria
   */
  private async matchesSegmentCriteria(subscriber: Subscriber, criteria: SegmentCriteria): Promise<boolean> {
    // Check demographic criteria
    if (criteria.demographic) {
      if (!this.matchesDemographicCriteria(subscriber, criteria.demographic)) {
        return false;
      }
    }
    
    // Check behavioral criteria
    if (criteria.behavioral) {
      if (!this.matchesBehavioralCriteria(subscriber, criteria.behavioral)) {
        return false;
      }
    }
    
    // Check preference criteria
    if (criteria.preferences) {
      if (!this.matchesPreferenceCriteria(subscriber, criteria.preferences)) {
        return false;
      }
    }
    
    // Check custom criteria
    if (criteria.customCriteria) {
      if (!this.matchesCustomCriteria(subscriber, criteria.customCriteria)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check demographic criteria match
   */
  private matchesDemographicCriteria(subscriber: Subscriber, demographic: any): boolean {
    if (demographic.industries && subscriber.industry) {
      if (!demographic.industries.includes(subscriber.industry)) {
        return false;
      }
    }
    
    if (demographic.jobTitles && subscriber.jobTitle) {
      const jobTitleMatch = demographic.jobTitles.some((title: string) => 
        subscriber.jobTitle?.toLowerCase().includes(title.toLowerCase())
      );
      if (!jobTitleMatch) {
        return false;
      }
    }
    
    if (demographic.locations && subscriber.location) {
      if (!demographic.locations.includes(subscriber.location)) {
        return false;
      }
    }
    
    if (demographic.companies && subscriber.company) {
      if (!demographic.companies.includes(subscriber.company)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check behavioral criteria match
   */
  private matchesBehavioralCriteria(subscriber: Subscriber, behavioral: any): boolean {
    if (behavioral.minEngagementScore && subscriber.engagementScore < behavioral.minEngagementScore) {
      return false;
    }
    
    if (behavioral.maxEngagementScore && subscriber.engagementScore > behavioral.maxEngagementScore) {
      return false;
    }
    
    if (behavioral.minEmailOpens && subscriber.emailOpens < behavioral.minEmailOpens) {
      return false;
    }
    
    if (behavioral.minEmailClicks && subscriber.emailClicks < behavioral.minEmailClicks) {
      return false;
    }
    
    if (behavioral.recentActivity && subscriber.lastActivity) {
      const daysSinceActivity = Math.floor((Date.now() - subscriber.lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceActivity > behavioral.recentActivity) {
        return false;
      }
    }
    
    if (behavioral.websiteActivity && subscriber.behaviorData) {
      const websiteActivityLevel = this.calculateWebsiteActivityLevel(subscriber.behaviorData);
      if (websiteActivityLevel !== behavioral.websiteActivity) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check preference criteria match
   */
  private matchesPreferenceCriteria(subscriber: Subscriber, preferences: any): boolean {
    if (preferences.topics && subscriber.preferences.topics) {
      const topicMatch = preferences.topics.some((topic: string) => 
        subscriber.preferences.topics.includes(topic)
      );
      if (!topicMatch) {
        return false;
      }
    }
    
    if (preferences.contentType && subscriber.preferences.contentType) {
      if (!preferences.contentType.includes(subscriber.preferences.contentType)) {
        return false;
      }
    }
    
    if (preferences.frequency && subscriber.preferences.frequency) {
      if (!preferences.frequency.includes(subscriber.preferences.frequency)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check custom criteria match
   */
  private matchesCustomCriteria(subscriber: Subscriber, customCriteria: any[]): boolean {
    for (const criteria of customCriteria) {
      const fieldValue = (subscriber as any)[criteria.field];
      
      switch (criteria.operator) {
        case 'equals':
          if (fieldValue !== criteria.value) return false;
          break;
        case 'contains':
          if (!fieldValue || !fieldValue.toString().includes(criteria.value)) return false;
          break;
        case 'greater_than':
          if (fieldValue <= criteria.value) return false;
          break;
        case 'less_than':
          if (fieldValue >= criteria.value) return false;
          break;
        case 'in':
          if (!Array.isArray(criteria.value) || !criteria.value.includes(fieldValue)) return false;
          break;
      }
    }
    
    return true;
  }

  /**
   * Calculate website activity level
   */
  private calculateWebsiteActivityLevel(behaviorData: any): 'low' | 'medium' | 'high' {
    const totalActivity = behaviorData.websiteVisits + behaviorData.pageViews + 
                         behaviorData.downloadedResources.length + behaviorData.webinarAttendance;
    
    if (totalActivity >= 50) return 'high';
    if (totalActivity >= 20) return 'medium';
    return 'low';
  }

  /**
   * Update segment counts based on segmented subscribers
   */
  private updateSegmentCounts(segmentedSubscribers: Map<string, Subscriber[]>) {
    segmentedSubscribers.forEach((subscribers, segmentId) => {
      const segment = this.segments.get(segmentId);
      if (segment) {
        segment.subscriberCount = subscribers.length;
        segment.engagementRate = this.calculateSegmentEngagementRate(subscribers);
        segment.lastUpdated = new Date();
      }
    });
  }

  /**
   * Calculate engagement rate for a segment
   */
  private calculateSegmentEngagementRate(subscribers: Subscriber[]): number {
    if (subscribers.length === 0) return 0;
    
    const totalEngagement = subscribers.reduce((sum, subscriber) => sum + subscriber.engagementScore, 0);
    return totalEngagement / subscribers.length;
  }

  /**
   * Create custom segment
   */
  async createCustomSegment(segment: Omit<Segment, 'id' | 'subscriberCount' | 'engagementRate' | 'createdAt' | 'lastUpdated'>): Promise<Segment> {
    const id = `custom-${Date.now()}`;
    const newSegment: Segment = {
      id,
      ...segment,
      subscriberCount: 0,
      engagementRate: 0,
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    this.segments.set(id, newSegment);
    
    // Save to Notion database
    await this.saveSegmentToNotion(newSegment);
    
    return newSegment;
  }

  /**
   * Get segment by ID
   */
  getSegment(segmentId: string): Segment | undefined {
    return this.segments.get(segmentId);
  }

  /**
   * Get all segments
   */
  getAllSegments(): Segment[] {
    return Array.from(this.segments.values());
  }

  /**
   * Get targeted content recommendations for segment
   */
  getTargetedContentRecommendations(segmentId: string): {
    topics: string[];
    formats: string[];
    frequency: string;
    tone: string;
    callToAction: string;
  } | null {
    const segment = this.segments.get(segmentId);
    if (!segment) return null;
    
    const recommendations = {
      topics: segment.contentPreferences.topics,
      formats: segment.contentPreferences.formats,
      frequency: segment.contentPreferences.frequency,
      tone: this.getRecommendedTone(segmentId),
      callToAction: this.getRecommendedCallToAction(segmentId)
    };
    
    return recommendations;
  }

  /**
   * Get recommended tone for segment
   */
  private getRecommendedTone(segmentId: string): string {
    const toneMapping: { [key: string]: string } = {
      'enterprise-executives': 'executive, strategic, outcome-focused',
      'technical-professionals': 'technical, detailed, implementation-focused',
      'high-engagement': 'personalized, insider, exclusive',
      'new-subscribers': 'welcoming, educational, supportive',
      'at-risk': 'value-driven, re-engaging, compelling',
      'industry-fintech': 'regulatory-aware, security-focused, compliance-oriented',
      'industry-healthcare': 'clinical, evidence-based, patient-focused'
    };
    
    return toneMapping[segmentId] || 'professional, informative';
  }

  /**
   * Get recommended call-to-action for segment
   */
  private getRecommendedCallToAction(segmentId: string): string {
    const ctaMapping: { [key: string]: string } = {
      'enterprise-executives': 'Schedule a strategic consultation',
      'technical-professionals': 'Download technical implementation guide',
      'high-engagement': 'Join our exclusive expert community',
      'new-subscribers': 'Explore our getting started resources',
      'at-risk': 'Discover what you\'ve been missing',
      'industry-fintech': 'Learn about compliance solutions',
      'industry-healthcare': 'See patient outcome improvements'
    };
    
    return ctaMapping[segmentId] || 'Learn more about our solutions';
  }

  /**
   * Calculate engagement score for subscriber
   */
  calculateEngagementScore(subscriber: Subscriber): number {
    let score = 0;
    
    // Email engagement (40% weight)
    if (subscriber.emailsSent > 0) {
      const openRate = subscriber.emailOpens / subscriber.emailsSent;
      const clickRate = subscriber.emailClicks / subscriber.emailsSent;
      score += (openRate * 20) + (clickRate * 20);
    }
    
    // Website engagement (30% weight)
    if (subscriber.behaviorData) {
      const websiteScore = Math.min(30, 
        (subscriber.behaviorData.websiteVisits * 2) + 
        (subscriber.behaviorData.pageViews * 1) + 
        (subscriber.behaviorData.downloadedResources.length * 5)
      );
      score += websiteScore;
    }
    
    // Recency (20% weight)
    if (subscriber.lastActivity) {
      const daysSinceActivity = (Date.now() - subscriber.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      const recencyScore = Math.max(0, 20 - (daysSinceActivity * 0.5));
      score += recencyScore;
    }
    
    // Profile completeness (10% weight)
    const profileFields = [subscriber.name, subscriber.company, subscriber.industry, subscriber.jobTitle];
    const completenessScore = (profileFields.filter(field => field).length / profileFields.length) * 10;
    score += completenessScore;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Save segment to Notion database
   */
  private async saveSegmentToNotion(segment: Segment): Promise<void> {
    try {
      await this.notion.pages.create({
        parent: { database_id: this.env.NOTION_DATABASE_SUBSCRIBERS },
        properties: {
          'Segment Name': {
            title: [{ text: { content: segment.name } }]
          },
          'Description': {
            rich_text: [{ text: { content: segment.description } }]
          },
          'Subscriber Count': {
            number: segment.subscriberCount
          },
          'Engagement Rate': {
            number: segment.engagementRate
          },
          'Created Date': {
            date: { start: segment.createdAt.toISOString() }
          },
          'Last Updated': {
            date: { start: segment.lastUpdated.toISOString() }
          }
        }
      });
    } catch (error) {
      console.error('Failed to save segment to Notion:', error);
    }
  }

  /**
   * Get segment performance analytics
   */
  getSegmentAnalytics(segmentId: string): {
    subscriberCount: number;
    engagementRate: number;
    growthRate: number;
    topTopics: string[];
    preferredFormats: string[];
    optimalSendTime: string;
  } | null {
    const segment = this.segments.get(segmentId);
    if (!segment) return null;
    
    return {
      subscriberCount: segment.subscriberCount,
      engagementRate: segment.engagementRate,
      growthRate: this.calculateSegmentGrowthRate(segmentId),
      topTopics: segment.contentPreferences.topics.slice(0, 3),
      preferredFormats: segment.contentPreferences.formats.slice(0, 3),
      optimalSendTime: this.getOptimalSendTime(segmentId)
    };
  }

  /**
   * Calculate segment growth rate
   */
  private calculateSegmentGrowthRate(segmentId: string): number {
    // This would typically compare current count to historical data
    // For now, return a placeholder calculation
    return Math.random() * 10 - 5; // -5% to +5%
  }

  /**
   * Get optimal send time for segment
   */
  private getOptimalSendTime(segmentId: string): string {
    const timeMapping: { [key: string]: string } = {
      'enterprise-executives': '9:00 AM Tuesday',
      'technical-professionals': '2:00 PM Wednesday',
      'high-engagement': '10:00 AM Thursday',
      'new-subscribers': '11:00 AM Monday',
      'at-risk': '3:00 PM Friday',
      'industry-fintech': '8:00 AM Tuesday',
      'industry-healthcare': '1:00 PM Thursday'
    };
    
    return timeMapping[segmentId] || '10:00 AM Wednesday';
  }
}

export default SubscriberSegmentation;
