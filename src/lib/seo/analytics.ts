/**
 * Analytics and Conversion Tracking
 * Advanced analytics integration and event tracking
 */

// Event types
export type EventCategory = 'engagement' | 'conversion' | 'navigation' | 'form' | 'error';

export interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  properties?: Record<string, any>;
}

// Conversion goals
export interface ConversionGoal {
  id: string;
  name: string;
  value?: number;
  currency?: string;
  items?: Array<{
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity?: number;
  }>;
}

// Page view data
export interface PageViewData {
  path: string;
  title: string;
  referrer?: string;
  userId?: string;
  sessionId?: string;
  properties?: Record<string, any>;
}

// Analytics service interface
export interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(data: PageViewData): void;
  trackConversion(goal: ConversionGoal): void;
  setUser(userId: string, properties?: Record<string, any>): void;
  reset(): void;
}

// Google Analytics 4 implementation
class GoogleAnalytics4 implements AnalyticsService {
  private gtag: any;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      this.gtag = (window as any).gtag;
    }
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.gtag) return;

    this.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      user_id: event.userId,
      ...event.properties,
    });
  }

  trackPageView(data: PageViewData): void {
    if (!this.gtag) return;

    this.gtag('event', 'page_view', {
      page_path: data.path,
      page_title: data.title,
      page_referrer: data.referrer,
      user_id: data.userId,
      session_id: data.sessionId,
      ...data.properties,
    });
  }

  trackConversion(goal: ConversionGoal): void {
    if (!this.gtag) return;

    if (goal.items) {
      // E-commerce conversion
      this.gtag('event', 'purchase', {
        transaction_id: goal.id,
        value: goal.value,
        currency: goal.currency || 'USD',
        items: goal.items,
      });
    } else {
      // Custom conversion
      this.gtag('event', 'conversion', {
        send_to: goal.id,
        value: goal.value,
        currency: goal.currency || 'USD',
      });
    }
  }

  setUser(userId: string, properties?: Record<string, any>): void {
    if (!this.gtag) return;

    this.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      user_id: userId,
      user_properties: properties,
    });
  }

  reset(): void {
    if (!this.gtag) return;

    // Reset user properties
    this.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      user_id: null,
    });
  }
}

// Analytics manager
class AnalyticsManager {
  private services: AnalyticsService[] = [];
  private queue: Array<() => void> = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private initialize(): void {
    // Initialize Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      this.services.push(new GoogleAnalytics4());
    }

    // Add other analytics services here
    // this.services.push(new Segment());
    // this.services.push(new Mixpanel());

    this.isInitialized = true;

    // Process queued events
    this.queue.forEach((fn) => fn());
    this.queue = [];
  }

  private execute(fn: () => void): void {
    if (this.isInitialized) {
      fn();
    } else {
      this.queue.push(fn);
    }
  }

  trackEvent(event: AnalyticsEvent): void {
    this.execute(() => {
      this.services.forEach((service) => service.trackEvent(event));
    });
  }

  trackPageView(data: PageViewData): void {
    this.execute(() => {
      this.services.forEach((service) => service.trackPageView(data));
    });
  }

  trackConversion(goal: ConversionGoal): void {
    this.execute(() => {
      this.services.forEach((service) => service.trackConversion(goal));
    });
  }

  setUser(userId: string, properties?: Record<string, any>): void {
    this.execute(() => {
      this.services.forEach((service) => service.setUser(userId, properties));
    });
  }

  reset(): void {
    this.execute(() => {
      this.services.forEach((service) => service.reset());
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsManager();

// React hooks for analytics (client-side only)
export function createAnalyticsHooks() {
  return {
    usePageView: () => {
      // Implementation would be in client components
    },
    useEventTracking: () => {
      // Implementation would be in client components  
    }
  };
}

// Conversion tracking helpers
export const conversionGoals = {
  consultation: (data: { email: string; service: string }) => ({
    id: 'consultation_booking',
    name: 'Consultation Booking',
    value: 500,
    properties: data,
  }),

  newsletter: (email: string) => ({
    id: 'newsletter_signup',
    name: 'Newsletter Signup',
    value: 10,
    properties: { email },
  }),

  download: (resource: string) => ({
    id: 'resource_download',
    name: 'Resource Download',
    value: 25,
    properties: { resource },
  }),

  contact: (data: { email: string; subject: string }) => ({
    id: 'contact_form',
    name: 'Contact Form Submission',
    value: 100,
    properties: data,
  }),
};

// Enhanced Core Web Vitals tracking
export function trackWebVitals(metric: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}) {
  analytics.trackEvent({
    category: 'engagement',
    action: 'web_vitals',
    label: metric.name,
    value: Math.round(metric.value),
    properties: {
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
    },
  });
}

// Helper functions for tracking (to be used in client components)
export const trackingHelpers = {
  scrollDepth: (percentage: number) => {
    analytics.trackEvent({
      category: 'engagement',
      action: 'scroll_depth',
      label: `${percentage}%`,
      value: percentage,
    });
  },
  
  timeOnPage: (seconds: number, page: string) => {
    analytics.trackEvent({
      category: 'engagement',
      action: 'time_on_page',
      value: seconds,
      properties: {
        page,
        seconds,
      },
    });
  }
};