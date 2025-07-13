/**
 * GDPR Compliance System
 * Comprehensive privacy and data protection features
 */

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  consentId: string;
}

export interface DataProcessingPurpose {
  id: string;
  name: string;
  description: string;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  dataTypes: string[];
  retentionPeriod: string;
  recipients: string[];
  required: boolean;
}

export interface PrivacySettings {
  cookieConsent: ConsentPreferences;
  dataProcessing: Record<string, boolean>;
  communicationPreferences: {
    newsletter: boolean;
    productUpdates: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
  };
  rightToBeJetisoned: boolean;
  dataPortability: boolean;
}

export interface DataSubjectRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  email: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedAt: string;
  completedAt?: string;
  description: string;
  response?: string;
  attachments?: string[];
}

class GDPRComplianceManager {
  private readonly CONSENT_COOKIE_NAME = 'cc_gdpr_consent';
  private readonly PREFERENCES_STORAGE_KEY = 'cc_privacy_preferences';

  // Data processing purposes for ContainerCode Advisory
  private readonly processingPurposes: DataProcessingPurpose[] = [
    {
      id: 'website_functionality',
      name: 'Website Functionality',
      description: 'Essential cookies and data processing required for website operation',
      legalBasis: 'legitimate_interests',
      dataTypes: ['session_data', 'preferences', 'security_logs'],
      retentionPeriod: '2 years',
      recipients: ['Cloudflare (CDN)', 'Vercel (Hosting)'],
      required: true
    },
    {
      id: 'analytics',
      name: 'Analytics and Performance',
      description: 'Understanding how visitors use our website to improve user experience',
      legalBasis: 'consent',
      dataTypes: ['page_views', 'user_interactions', 'performance_metrics', 'device_info'],
      retentionPeriod: '26 months',
      recipients: ['Google Analytics', 'Internal Analytics'],
      required: false
    },
    {
      id: 'newsletter',
      name: 'Newsletter and Communications',
      description: 'Sending newsletters and updates about our services',
      legalBasis: 'consent',
      dataTypes: ['email_address', 'name', 'preferences', 'engagement_data'],
      retentionPeriod: 'Until unsubscribe + 3 years for legal compliance',
      recipients: ['Resend (Email Service)', 'Notion (Database)'],
      required: false
    },
    {
      id: 'customer_support',
      name: 'Customer Support',
      description: 'Providing customer support and handling inquiries',
      legalBasis: 'legitimate_interests',
      dataTypes: ['contact_information', 'inquiry_details', 'communication_history'],
      retentionPeriod: '7 years',
      recipients: ['Internal Support Team', 'Notion (Database)'],
      required: false
    },
    {
      id: 'ai_services',
      name: 'AI-Powered Services',
      description: 'Providing AI chatbot and personalized recommendations',
      legalBasis: 'consent',
      dataTypes: ['conversation_history', 'preferences', 'usage_patterns'],
      retentionPeriod: '1 year',
      recipients: ['DeepSeek (AI Service)', 'Internal Processing'],
      required: false
    }
  ];

  // Check if GDPR applies (EU visitors)
  isGDPRApplicable(request?: Request): boolean {
    if (!request) return true; // Default to GDPR compliance

    const cfCountry = request.headers.get('CF-IPCountry');
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];

    return !cfCountry || euCountries.includes(cfCountry);
  }

  // Generate consent record
  generateConsentRecord(preferences: Partial<ConsentPreferences>, request?: Request): ConsentPreferences {
    return {
      necessary: true, // Always true
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      functional: preferences.functional || false,
      timestamp: new Date().toISOString(),
      ipAddress: this.getClientIP(request),
      userAgent: request?.headers.get('User-Agent') || undefined,
      consentId: this.generateConsentId()
    };
  }

  // Get client IP (respecting privacy)
  private getClientIP(request?: Request): string | undefined {
    if (!request) return undefined;

    // Hash IP for privacy
    const ip = request.headers.get('CF-Connecting-IP') || 
               request.headers.get('X-Forwarded-For') || 
               request.headers.get('X-Real-IP');
    
    if (ip) {
      // Return hashed IP for privacy
      return this.hashData(ip).substring(0, 16);
    }
    
    return undefined;
  }

  // Generate unique consent ID
  private generateConsentId(): string {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Hash sensitive data
  private hashData(data: string): string {
    // Simple hash for demo - use proper crypto in production
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Validate consent preferences
  validateConsent(preferences: Partial<ConsentPreferences>): boolean {
    // Necessary cookies are always required
    return preferences.necessary === true;
  }

  // Generate privacy policy content
  generatePrivacyPolicy(): any {
    return {
      lastUpdated: '2024-07-12',
      version: '1.0',
      sections: {
        dataController: {
          name: 'ContainerCode Advisory',
          email: 'privacy@containercode.com',
          address: 'Data Protection Officer, ContainerCode Advisory'
        },
        dataProcessing: this.processingPurposes,
        rights: [
          {
            right: 'Access',
            description: 'Request a copy of your personal data'
          },
          {
            right: 'Rectification',
            description: 'Request correction of inaccurate personal data'
          },
          {
            right: 'Erasure',
            description: 'Request deletion of your personal data'
          },
          {
            right: 'Portability',
            description: 'Request transfer of your data to another service'
          },
          {
            right: 'Restriction',
            description: 'Request limitation of processing'
          },
          {
            right: 'Objection',
            description: 'Object to processing based on legitimate interests'
          }
        ],
        cookies: [
          {
            name: 'cc_gdpr_consent',
            purpose: 'Store GDPR consent preferences',
            type: 'Necessary',
            duration: '1 year'
          },
          {
            name: '_ga',
            purpose: 'Google Analytics tracking',
            type: 'Analytics',
            duration: '2 years'
          },
          {
            name: 'cc_user_id',
            purpose: 'User identification for analytics',
            type: 'Analytics',
            duration: '1 year'
          }
        ],
        thirdParties: [
          {
            name: 'Google Analytics',
            purpose: 'Website analytics',
            privacyPolicy: 'https://policies.google.com/privacy'
          },
          {
            name: 'Cloudflare',
            purpose: 'CDN and security',
            privacyPolicy: 'https://www.cloudflare.com/privacy/'
          },
          {
            name: 'Vercel',
            purpose: 'Website hosting',
            privacyPolicy: 'https://vercel.com/legal/privacy-policy'
          },
          {
            name: 'Notion',
            purpose: 'Data storage',
            privacyPolicy: 'https://www.notion.so/Privacy-Policy'
          },
          {
            name: 'Resend',
            purpose: 'Email delivery',
            privacyPolicy: 'https://resend.com/legal/privacy-policy'
          }
        ]
      }
    };
  }

  // Handle data subject requests
  async processDataSubjectRequest(request: Omit<DataSubjectRequest, 'id' | 'status' | 'submittedAt'>): Promise<DataSubjectRequest> {
    const dsrId = `dsr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const dataSubjectRequest: DataSubjectRequest = {
      id: dsrId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      ...request
    };

    // In a real implementation, this would be stored in a database
    // and trigger appropriate workflows
    console.log('Data Subject Request received:', dataSubjectRequest);

    // Auto-process simple requests
    if (request.type === 'access') {
      // Generate data export
      const userData = await this.generateUserDataExport(request.email);
      dataSubjectRequest.status = 'completed';
      dataSubjectRequest.completedAt = new Date().toISOString();
      dataSubjectRequest.response = 'Data export generated and sent via email';
    }

    return dataSubjectRequest;
  }

  // Generate user data export
  private async generateUserDataExport(email: string): Promise<any> {
    // In a real implementation, this would query all systems
    // and generate a comprehensive data export
    return {
      email,
      exportedAt: new Date().toISOString(),
      data: {
        profile: {
          email,
          consentPreferences: 'Retrieved from storage',
          newsletterSubscription: 'Retrieved from Notion'
        },
        activity: {
          websiteVisits: 'Retrieved from analytics',
          emailEngagement: 'Retrieved from email service',
          supportTickets: 'Retrieved from support system'
        },
        technical: {
          ipAddresses: 'Hashed for privacy',
          userAgents: 'Last 10 recorded',
          sessions: 'Session metadata only'
        }
      }
    };
  }

  // Data anonymization
  anonymizeUserData(data: any): any {
    const anonymized = { ...data };
    
    // Remove or hash personally identifiable information
    if (anonymized.email) {
      anonymized.email = this.hashData(anonymized.email);
    }
    
    if (anonymized.ipAddress) {
      anonymized.ipAddress = this.hashData(anonymized.ipAddress);
    }
    
    if (anonymized.name) {
      delete anonymized.name;
    }
    
    if (anonymized.phone) {
      delete anonymized.phone;
    }

    return anonymized;
  }

  // Generate consent management interface data
  getConsentManagementData(): any {
    return {
      purposes: this.processingPurposes.map(purpose => ({
        id: purpose.id,
        name: purpose.name,
        description: purpose.description,
        required: purpose.required,
        legalBasis: purpose.legalBasis
      })),
      settings: {
        granularConsent: true,
        withdrawalMechanism: true,
        consentRecords: true,
        dataPortability: true
      }
    };
  }

  // Validate data retention compliance
  checkRetentionCompliance(dataType: string, createdAt: string): boolean {
    const purpose = this.processingPurposes.find(p => p.dataTypes.includes(dataType));
    if (!purpose) return false;

    const retentionMap: Record<string, number> = {
      '2 years': 2 * 365 * 24 * 60 * 60 * 1000,
      '26 months': 26 * 30 * 24 * 60 * 60 * 1000,
      '1 year': 365 * 24 * 60 * 60 * 1000,
      '7 years': 7 * 365 * 24 * 60 * 60 * 1000
    };

    const retentionPeriod = retentionMap[purpose.retentionPeriod];
    if (!retentionPeriod) return true; // Indefinite retention

    const dataAge = Date.now() - new Date(createdAt).getTime();
    return dataAge < retentionPeriod;
  }
}

// Cookie consent banner configuration
export interface CookieBannerConfig {
  show: boolean;
  position: 'top' | 'bottom';
  style: 'banner' | 'modal' | 'floating';
  acceptAllButton: boolean;
  rejectAllButton: boolean;
  customizeButton: boolean;
  showManageLink: boolean;
}

// Privacy preferences hook data
export interface PrivacyPreferencesHook {
  consent: ConsentPreferences | null;
  updateConsent: (preferences: Partial<ConsentPreferences>) => void;
  showBanner: boolean;
  dismissBanner: () => void;
  resetConsent: () => void;
  exportData: () => Promise<void>;
  deleteData: () => Promise<void>;
}

// Export singleton instance
export const gdprManager = new GDPRComplianceManager();

// Utility functions
export function isGDPRApplicable(request?: Request): boolean {
  return gdprManager.isGDPRApplicable(request);
}

export function generateConsentRecord(preferences: Partial<ConsentPreferences>, request?: Request): ConsentPreferences {
  return gdprManager.generateConsentRecord(preferences, request);
}

export function getPrivacyPolicyData(): any {
  return gdprManager.generatePrivacyPolicy();
}

export function getConsentManagementData(): any {
  return gdprManager.getConsentManagementData();
}

export async function processDataSubjectRequest(request: Omit<DataSubjectRequest, 'id' | 'status' | 'submittedAt'>): Promise<DataSubjectRequest> {
  return gdprManager.processDataSubjectRequest(request);
}

export { GDPRComplianceManager };