/**
 * ContainerCode Advisory - Content Automation Strategy
 * Comprehensive keyword and topic strategy for automated content generation
 * Based on business analysis: Multi-cloud consulting, cybersecurity, DevOps, digital transformation
 */

// ===================================================================
// CORE BUSINESS KEYWORDS & SEARCH TERMS
// ===================================================================

const CORE_KEYWORDS = {
  // Primary Business Focus
  primary: [
    "multi-cloud consulting",
    "cloud migration strategy", 
    "cybersecurity consulting",
    "DevOps implementation",
    "digital transformation consulting",
    "cloud security architecture",
    "enterprise cloud solutions"
  ],

  // Cloud Platform Specific
  cloud_platforms: [
    "AWS consulting services",
    "Microsoft Azure consulting", 
    "Google Cloud Platform consulting",
    "Oracle Cloud consulting",
    "IBM Cloud solutions",
    "multi-cloud architecture",
    "hybrid cloud strategy",
    "cloud vendor comparison"
  ],

  // Security & Compliance
  security: [
    "cloud security assessment",
    "SOC 2 compliance consulting",
    "GDPR compliance automation",
    "zero trust architecture",
    "cybersecurity framework implementation",
    "ISO 27001 certification",
    "security incident response",
    "threat detection automation"
  ],

  // DevOps & Technical
  devops: [
    "DevSecOps implementation",
    "CI/CD pipeline automation",
    "Kubernetes consulting",
    "infrastructure as code",
    "container orchestration",
    "microservices architecture",
    "automated deployment strategies",
    "cloud-native development"
  ],

  // Business & Industry
  business: [
    "digital transformation strategy",
    "cloud cost optimization",
    "IT modernization consulting",
    "business process automation",
    "enterprise software development",
    "cloud ROI optimization",
    "technology roadmap planning",
    "IT infrastructure assessment"
  ]
};

// ===================================================================
// TRENDING TOPICS & SEARCH QUERIES
// ===================================================================

const TRENDING_TOPICS = {
  // 2025 Technology Trends
  current_trends: [
    "AI automation trends 2025",
    "cloud security trends 2025", 
    "multi-cloud management 2025",
    "DevOps best practices 2025",
    "cybersecurity predictions 2025",
    "enterprise AI adoption",
    "sustainable cloud computing",
    "edge computing strategies"
  ],

  // Industry-Specific
  industry_specific: [
    "healthcare cloud compliance",
    "financial services cybersecurity",
    "retail digital transformation",
    "manufacturing IoT security",
    "education technology modernization",
    "government cloud migration",
    "startup cloud strategy",
    "enterprise cloud governance"
  ],

  // Problem-Solution Focused
  problem_solution: [
    "cloud vendor lock-in solutions",
    "multi-cloud cost optimization",
    "cloud security breaches prevention",
    "DevOps automation challenges",
    "legacy system modernization",
    "cloud migration risks mitigation",
    "compliance automation strategies",
    "scalability planning best practices"
  ],

  // Competitive & Comparison
  competitive: [
    "AWS vs Azure vs Google Cloud",
    "best cloud migration tools",
    "top cybersecurity frameworks",
    "DevOps tools comparison 2025",
    "cloud cost management platforms",
    "multi-cloud orchestration tools",
    "enterprise security solutions",
    "cloud consulting services comparison"
  ]
};

// ===================================================================
// CONTENT CATEGORIES & TYPES
// ===================================================================

const CONTENT_CATEGORIES = {
  // Educational & Thought Leadership
  educational: [
    "how-to guides",
    "best practices",
    "case studies",
    "white papers",
    "technical tutorials",
    "industry reports",
    "expert interviews",
    "webinar summaries"
  ],

  // Business & Strategy
  strategic: [
    "ROI calculators",
    "strategy frameworks",
    "implementation roadmaps",
    "cost-benefit analysis",
    "risk assessments",
    "vendor evaluations",
    "technology comparisons",
    "market analysis"
  ],

  // Technical & Implementation
  technical: [
    "architecture blueprints",
    "configuration guides",
    "troubleshooting solutions",
    "security checklists",
    "deployment scripts",
    "monitoring strategies",
    "optimization techniques",
    "integration patterns"
  ]
};

// ===================================================================
// SEARCH INTENT MAPPING
// ===================================================================

const SEARCH_INTENT = {
  // Informational (Research Phase)
  informational: [
    "what is multi-cloud strategy",
    "benefits of DevSecOps",
    "cloud security best practices",
    "digital transformation examples",
    "AWS vs Azure comparison",
    "cybersecurity compliance requirements",
    "cloud migration checklist",
    "DevOps automation tools"
  ],

  // Commercial (Evaluation Phase)
  commercial: [
    "best cloud consulting services",
    "top cybersecurity firms UK",
    "DevOps implementation partners",
    "multi-cloud consulting companies",
    "enterprise cloud migration services",
    "cybersecurity assessment providers",
    "cloud cost optimization consultants",
    "digital transformation agencies"
  ],

  // Transactional (Decision Phase)
  transactional: [
    "hire cloud consultant",
    "cybersecurity assessment quote",
    "DevOps implementation cost",
    "cloud migration consultation",
    "security audit services",
    "multi-cloud strategy consulting",
    "digital transformation partner",
    "enterprise cloud support"
  ]
};

// ===================================================================
// GEOGRAPHIC & MARKET TARGETING
// ===================================================================

const GEOGRAPHIC_KEYWORDS = {
  uk_market: [
    "UK cloud consulting",
    "London cybersecurity services", 
    "UK digital transformation",
    "British cloud migration experts",
    "UK compliance consulting",
    "London DevOps consultants",
    "UK enterprise cloud services",
    "British technology consulting"
  ],

  global_market: [
    "international cloud consulting",
    "global cybersecurity services",
    "worldwide digital transformation",
    "international compliance consulting",
    "global cloud migration",
    "enterprise cloud consulting worldwide",
    "international DevOps services",
    "global technology transformation"
  ]
};

// ===================================================================
// SEASONAL & EVENT-BASED KEYWORDS
// ===================================================================

const SEASONAL_KEYWORDS = {
  quarterly: [
    "Q1 cloud strategy planning",
    "Q2 cybersecurity assessment",
    "Q3 digital transformation projects",
    "Q4 cloud cost optimization",
    "year-end security review",
    "new year technology planning",
    "budget planning cloud services",
    "annual compliance audit"
  ],

  events: [
    "AWS re:Invent insights",
    "Microsoft Build updates",
    "Google Cloud Next announcements",
    "RSA Conference security trends",
    "KubeCon DevOps updates",
    "industry conference takeaways",
    "technology summit highlights",
    "cybersecurity conference insights"
  ]
};

// ===================================================================
// LONG-TAIL KEYWORDS FOR SPECIFIC SERVICES
// ===================================================================

const LONG_TAIL_KEYWORDS = {
  specific_services: [
    "multi-cloud architecture design and implementation",
    "zero trust security framework implementation",
    "CI/CD pipeline automation with security integration",
    "cloud migration strategy for legacy systems",
    "SOC 2 Type II compliance consulting services",
    "Kubernetes orchestration for enterprise applications",
    "AWS to Azure migration planning and execution",
    "cybersecurity incident response planning and testing"
  ],

  problem_solving: [
    "how to prevent cloud vendor lock-in strategies",
    "reduce cloud costs without compromising security",
    "implement DevSecOps in existing development workflows",
    "migrate legacy applications to microservices architecture",
    "achieve GDPR compliance in multi-cloud environments",
    "optimize cloud performance while maintaining security",
    "integrate multiple cloud platforms seamlessly",
    "automate compliance reporting across cloud providers"
  ]
};

// ===================================================================
// AUTOMATION SEARCH QUERIES
// ===================================================================

const AUTOMATION_QUERIES = {
  // Research Queries for Brave Search
  research_queries: [
    ...CORE_KEYWORDS.primary,
    ...TRENDING_TOPICS.current_trends,
    ...SEARCH_INTENT.informational,
    ...SEASONAL_KEYWORDS.quarterly
  ],

  // Content Generation Prompts
  content_prompts: [
    "latest developments in",
    "best practices for",
    "implementation guide for",
    "case study about",
    "expert analysis of", 
    "future trends in",
    "ROI analysis of",
    "security considerations for"
  ],

  // Newsletter Topics
  newsletter_topics: [
    "weekly cloud technology updates",
    "cybersecurity threat intelligence",
    "DevOps automation innovations",
    "digital transformation success stories",
    "compliance and regulation updates",
    "cost optimization strategies",
    "industry partnership announcements",
    "technology event highlights"
  ]
};

// ===================================================================
// EXPORT CONFIGURATION
// ===================================================================

module.exports = {
  CORE_KEYWORDS,
  TRENDING_TOPICS,
  CONTENT_CATEGORIES,
  SEARCH_INTENT,
  GEOGRAPHIC_KEYWORDS,
  SEASONAL_KEYWORDS,
  LONG_TAIL_KEYWORDS,
  AUTOMATION_QUERIES,
  
  // Helper function to get random keywords for automation
  getRandomKeywords: (category = 'primary', count = 5) => {
    const keywords = CORE_KEYWORDS[category] || CORE_KEYWORDS.primary;
    return keywords.sort(() => 0.5 - Math.random()).slice(0, count);
  },

  // Helper function to get trending topics
  getTrendingTopics: (category = 'current_trends', count = 3) => {
    const topics = TRENDING_TOPICS[category] || TRENDING_TOPICS.current_trends;
    return topics.sort(() => 0.5 - Math.random()).slice(0, count);
  },

  // Helper function to generate search queries
  generateSearchQuery: (baseKeyword, intent = 'informational') => {
    const prompts = AUTOMATION_QUERIES.content_prompts;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return `${randomPrompt} ${baseKeyword} 2025`;
  }
};

console.log("🎯 ContainerCode Advisory Content Strategy Loaded");
console.log("📊 Total Keywords:", Object.values(CORE_KEYWORDS).flat().length);
console.log("🔍 Trending Topics:", Object.values(TRENDING_TOPICS).flat().length);
console.log("🎪 Ready for automated content generation!");
