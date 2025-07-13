/**
 * Comprehensive Analytics Tracking System
 * Advanced analytics with Core Web Vitals, user behavior, and conversion tracking
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

// Global gtag declaration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Alias for easier access
const gtag = typeof window !== 'undefined' ? window.gtag : undefined;

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  pageViews: number;
  events: AnalyticsEvent[];
  deviceInfo: DeviceInfo;
  trafficSource: TrafficSource;
}

export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  viewport: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  browser: string;
  os: string;
  connection?: string;
}

export interface TrafficSource {
  source: string;
  medium: string;
  campaign?: string;
  referrer?: string;
  utmParams: Record<string, string>;
}

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private userId?: string;
  private session: UserSession;
  private vitalsMetrics: WebVitalsMetric[] = [];
  private conversionGoals: Record<string, boolean> = {};
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.session = this.initializeSession();
    this.initializeWebVitals();
    this.initializeEventListeners();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): UserSession {
    return {
      sessionId: this.sessionId,
      userId: this.getUserId(),
      startTime: Date.now(),
      pageViews: 0,
      events: [],
      deviceInfo: this.getDeviceInfo(),
      trafficSource: this.getTrafficSource()
    };
  }

  private getUserId(): string | undefined {
    // Check for existing user ID in localStorage or cookies
    const existingId = localStorage.getItem('cc_user_id');
    if (existingId) return existingId;
    
    // Generate new user ID
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cc_user_id', newId);
    return newId;
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const screen = window.screen;
    
    return {
      userAgent: ua,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: this.getDeviceType(),
      browser: this.getBrowserName(),
      os: this.getOperatingSystem(),
      connection: this.getConnectionInfo()
    };
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowserName(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOperatingSystem(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getConnectionInfo(): string {
    // @ts-ignore - Connection API may not be available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      return `${connection.effectiveType || 'unknown'}-${connection.downlink || 0}mbps`;
    }
    return 'unknown';
  }

  private getTrafficSource(): TrafficSource {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    const utmParams: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = urlParams.get(param);
      if (value) utmParams[param] = value;
    });

    let source = 'direct';
    let medium = 'none';

    if (utmParams.utm_source) {
      source = utmParams.utm_source;
      medium = utmParams.utm_medium || 'unknown';
    } else if (referrer) {
      const referrerDomain = new URL(referrer).hostname;
      if (referrerDomain.includes('google')) {
        source = 'google';
        medium = 'organic';
      } else if (referrerDomain.includes('bing')) {
        source = 'bing';
        medium = 'organic';
      } else if (referrerDomain.includes('linkedin')) {
        source = 'linkedin';
        medium = 'social';
      } else if (referrerDomain.includes('twitter')) {
        source = 'twitter';
        medium = 'social';
      } else {
        source = referrerDomain;
        medium = 'referral';
      }
    }

    return {
      source,
      medium,
      campaign: utmParams.utm_campaign,
      referrer,
      utmParams
    };
  }

  private initializeWebVitals(): void {
    // Core Web Vitals tracking
    onCLS((metric) => this.handleWebVital('CLS', metric));
    onINP((metric: any) => this.handleWebVital('INP', metric));
    onFCP((metric) => this.handleWebVital('FCP', metric));
    onLCP((metric) => this.handleWebVital('LCP', metric));
    onTTFB((metric) => this.handleWebVital('TTFB', metric));
    onINP((metric) => this.handleWebVital('INP', metric));
  }

  private handleWebVital(name: string, metric: any): void {
    const vitalsMetric: WebVitalsMetric = {
      name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown'
    };

    this.vitalsMetrics.push(vitalsMetric);
    
    // Send to analytics
    this.trackEvent({
      event: 'web_vitals',
      category: 'Performance',
      action: name,
      value: Math.round(metric.value),
      custom_parameters: {
        rating: metric.rating,
        delta: metric.delta,
        navigation_type: metric.navigationType
      }
    });
  }

  private initializeEventListeners(): void {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent({
        event: 'page_visibility',
        category: 'Engagement',
        action: document.hidden ? 'hidden' : 'visible'
      });
    });

    // Scroll depth tracking
    this.initializeScrollTracking();
    
    // Click tracking for important elements
    this.initializeClickTracking();
    
    // Form interaction tracking
    this.initializeFormTracking();
    
    // Page unload tracking
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });
  }

  private initializeScrollTracking(): void {
    let maxScroll = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);
      
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          this.trackEvent({
            event: 'scroll_depth',
            category: 'Engagement',
            action: 'scroll',
            label: `${milestone}%`,
            value: milestone
          });
        }
      });
    };

    let throttleTimer: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(throttleTimer);
      throttleTimer = setTimeout(handleScroll, 100);
    });
  }

  private initializeClickTracking(): void {
    // Track clicks on important elements
    const selectors = [
      'a[href*="contact"]',
      'a[href*="consultation"]',
      'button[type="submit"]',
      '.cta-button',
      '.btn-primary',
      '[data-track="click"]'
    ];

    selectors.forEach(selector => {
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches(selector) || target.closest(selector)) {
          const element = target.matches(selector) ? target : target.closest(selector) as HTMLElement;
          this.trackEvent({
            event: 'click',
            category: 'Interaction',
            action: 'click',
            label: this.getElementIdentifier(element),
            custom_parameters: {
              element_type: element.tagName.toLowerCase(),
              element_text: element.textContent?.trim().substring(0, 50),
              href: element.getAttribute('href'),
              page_url: window.location.pathname
            }
          });
        }
      });
    });
  }

  private initializeFormTracking(): void {
    // Track form interactions
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target.matches('input, textarea, select')) {
        this.trackEvent({
          event: 'form_interaction',
          category: 'Form',
          action: 'field_focus',
          label: target.getAttribute('name') || target.getAttribute('id') || 'unknown'
        });
      }
    });

    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      const formId = form.getAttribute('id') || form.getAttribute('name') || 'unknown';
      
      this.trackEvent({
        event: 'form_submission',
        category: 'Form',
        action: 'submit',
        label: formId,
        custom_parameters: {
          form_url: window.location.pathname,
          form_fields: this.getFormFields(form)
        }
      });

      // Track conversion goals
      this.trackConversionGoal('form_submission', formId);
    });
  }

  private getElementIdentifier(element: HTMLElement): string {
    return element.getAttribute('data-track-label') ||
           element.getAttribute('id') ||
           element.className.split(' ')[0] ||
           element.tagName.toLowerCase();
  }

  private getFormFields(form: HTMLFormElement): string[] {
    const inputs = form.querySelectorAll('input, textarea, select');
    return Array.from(inputs).map(input => 
      input.getAttribute('name') || input.getAttribute('id') || 'unknown'
    );
  }

  // Public methods
  public trackPageView(path: string, title: string): void {
    this.session.pageViews++;
    
    this.trackEvent({
      event: 'page_view',
      category: 'Navigation',
      action: 'view',
      label: path,
      custom_parameters: {
        page_title: title,
        page_url: path,
        referrer: document.referrer
      }
    });
  }

  public trackEvent(event: AnalyticsEvent): void {
    this.session.events.push({
      ...event,
      custom_parameters: {
        ...event.custom_parameters,
        timestamp: Date.now(),
        session_id: this.sessionId,
        user_id: this.userId,
        page_url: window.location.pathname
      }
    });

    // Send to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameters: event.custom_parameters
      });
    }

    // Send to custom analytics endpoint
    this.sendToCustomAnalytics(event);
  }

  public trackConversionGoal(goalType: string, goalValue: string): void {
    const goalKey = `${goalType}_${goalValue}`;
    if (!this.conversionGoals[goalKey]) {
      this.conversionGoals[goalKey] = true;
      
      this.trackEvent({
        event: 'conversion',
        category: 'Goal',
        action: goalType,
        label: goalValue,
        value: 1,
        custom_parameters: {
          goal_type: goalType,
          goal_value: goalValue,
          session_duration: Date.now() - this.session.startTime
        }
      });
    }
  }

  public trackCustomEvent(eventName: string, properties: Record<string, any>): void {
    this.trackEvent({
      event: eventName,
      category: 'Custom',
      action: eventName,
      custom_parameters: properties
    });
  }

  public trackUserIdentification(userId: string, properties?: Record<string, any>): void {
    this.userId = userId;
    this.session.userId = userId;
    localStorage.setItem('cc_user_id', userId);
    
    this.trackEvent({
      event: 'user_identification',
      category: 'User',
      action: 'identify',
      label: userId,
      custom_parameters: properties
    });
  }

  public trackNewsletterSubscription(email: string, frequency: string, interests: string[]): void {
    this.trackEvent({
      event: 'newsletter_subscription',
      category: 'Conversion',
      action: 'subscribe',
      label: frequency,
      value: 1,
      custom_parameters: {
        email_domain: email.split('@')[1],
        frequency,
        interests,
        subscription_source: window.location.pathname
      }
    });

    this.trackConversionGoal('newsletter_subscription', frequency);
  }

  public trackContactFormSubmission(formData: Record<string, any>): void {
    this.trackEvent({
      event: 'contact_form_submission',
      category: 'Conversion',
      action: 'submit',
      label: formData.subject || 'unknown',
      value: 1,
      custom_parameters: {
        company: formData.company,
        services: formData.services,
        budget: formData.budget,
        timeline: formData.timeline
      }
    });

    this.trackConversionGoal('contact_form_submission', 'contact');
  }

  public getSessionData(): UserSession {
    return {
      ...this.session,
      events: [...this.session.events]
    };
  }

  public getWebVitalsData(): WebVitalsMetric[] {
    return [...this.vitalsMetrics];
  }

  private trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.session.startTime;
    
    this.trackEvent({
      event: 'session_end',
      category: 'Session',
      action: 'end',
      value: Math.round(sessionDuration / 1000), // Duration in seconds
      custom_parameters: {
        session_duration: sessionDuration,
        page_views: this.session.pageViews,
        total_events: this.session.events.length,
        conversion_goals: Object.keys(this.conversionGoals).length
      }
    });

    // Send final session data
    this.sendSessionData();
  }

  private async sendToCustomAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // Send to your custom analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event,
          session: this.session,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private async sendSessionData(): Promise<void> {
    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session: this.session,
          vitals: this.vitalsMetrics,
          conversions: this.conversionGoals
        })
      });
    } catch (error) {
      console.warn('Failed to send session data:', error);
    }
  }
}

// Singleton instance
let analyticsInstance: AnalyticsTracker | null = null;

export function getAnalytics(): AnalyticsTracker {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsTracker();
  }
  return analyticsInstance;
}

// Convenience functions
export function trackPageView(path: string, title: string): void {
  getAnalytics().trackPageView(path, title);
}

export function trackEvent(event: AnalyticsEvent): void {
  getAnalytics().trackEvent(event);
}

export function trackCustomEvent(eventName: string, properties: Record<string, any>): void {
  getAnalytics().trackCustomEvent(eventName, properties);
}

export function trackConversion(goalType: string, goalValue: string): void {
  getAnalytics().trackConversionGoal(goalType, goalValue);
}

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageView,
    trackEvent,
    trackCustomEvent,
    trackConversion,
    trackNewsletterSubscription: (email: string, frequency: string, interests: string[]) =>
      getAnalytics().trackNewsletterSubscription(email, frequency, interests),
    trackContactFormSubmission: (formData: Record<string, any>) =>
      getAnalytics().trackContactFormSubmission(formData),
    trackUserIdentification: (userId: string, properties?: Record<string, any>) =>
      getAnalytics().trackUserIdentification(userId, properties)
  };
}