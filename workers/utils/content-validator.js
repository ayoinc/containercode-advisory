/**
 * Content Validator for Newsletter Automation
 * Validates article content for quality, formatting, and British English usage
 */

export class ContentValidator {
  constructor() {
    this.britishSpellings = {
      'color': 'colour',
      'colors': 'colours',
      'colorful': 'colourful',
      'coloring': 'colouring',
      'colored': 'coloured',
      'favor': 'favour',
      'favors': 'favours',
      'favorable': 'favourable',
      'favorite': 'favourite',
      'favorites': 'favourites',
      'honor': 'honour',
      'honors': 'honours',
      'honorable': 'honourable',
      'labor': 'labour',
      'labors': 'labours',
      'neighbor': 'neighbour',
      'neighbors': 'neighbours',
      'rumor': 'rumour',
      'rumors': 'rumours',
      'humor': 'humour',
      'humors': 'humours',
      'tumor': 'tumour',
      'tumors': 'tumours',
      'realize': 'realise',
      'realizes': 'realises',
      'realized': 'realised',
      'realizing': 'realising',
      'recognize': 'recognise',
      'recognizes': 'recognises',
      'recognized': 'recognised',
      'recognizing': 'recognising',
      'organize': 'organise',
      'organizes': 'organises',
      'organized': 'organised',
      'organizing': 'organising',
      'organization': 'organisation',
      'organizations': 'organisations',
      'analyze': 'analyse',
      'analyzes': 'analyses',
      'analyzed': 'analysed',
      'analyzing': 'analysing',
      'analysis': 'analysis',
      'utilize': 'utilise',
      'utilizes': 'utilises',
      'utilized': 'utilised',
      'utilizing': 'utilising',
      'capitalize': 'capitalise',
      'capitalizes': 'capitalises',
      'capitalized': 'capitalised',
      'capitalizing': 'capitalising',
      'center': 'centre',
      'centers': 'centres',
      'centered': 'centred',
      'centering': 'centring',
      'theater': 'theatre',
      'theaters': 'theatres',
      'meter': 'metre',
      'meters': 'metres',
      'liter': 'litre',
      'liters': 'litres',
      'fiber': 'fibre',
      'fibers': 'fibres',
      'defense': 'defence',
      'defenses': 'defences',
      'offense': 'offence',
      'offenses': 'offences',
      'license': 'licence',
      'licenses': 'licences',
      'practice': 'practise',
      'practices': 'practises',
      'advice': 'advice',
      'advise': 'advise',
      'device': 'device',
      'devise': 'devise',
      'gray': 'grey',
      'grays': 'greys',
      'grayish': 'greyish',
      'aging': 'ageing',
      'catalog': 'catalogue',
      'catalogs': 'catalogues',
      'dialog': 'dialogue',
      'dialogs': 'dialogues',
      'program': 'programme',
      'programs': 'programmes',
      'check': 'check',
      'checks': 'checks',
      'tire': 'tyre',
      'tires': 'tyres',
      'aluminum': 'aluminium',
      'draft': 'draught',
      'drafts': 'draughts'
    };

    this.britishTerms = [
      'whilst', 'amongst', 'towards', 'backwards', 'forwards', 'afterwards',
      'learnt', 'burnt', 'dreamt', 'spelt', 'smelt', 'leapt',
      'behaviour', 'flavour', 'honour', 'labour', 'neighbour', 'colour',
      'organisation', 'realise', 'recognise', 'analyse', 'centre', 'theatre',
      'metre', 'litre', 'defence', 'offence', 'licence', 'practise',
      'grey', 'ageing', 'catalogue', 'dialogue', 'programme', 'tyre', 'aluminium'
    ];

    this.requiredElements = [
      'title', 'content', 'summary', 'category'
    ];

    this.minLengths = {
      title: 10,
      content: 500,
      summary: 50,
      excerpt: 30
    };

    this.maxLengths = {
      title: 100,
      seo_title: 60,
      seo_description: 160,
      summary: 300,
      excerpt: 150
    };
  }

  /**
   * Validate article content comprehensively
   * @param {Object} article - Article object to validate
   * @returns {Object} Validation result
   */
  async validateArticle(article) {
    const errors = [];
    const warnings = [];

    // Check required fields
    this.validateRequiredFields(article, errors);

    // Check content length requirements
    this.validateContentLength(article, errors, warnings);

    // Validate British English usage
    this.validateBritishEnglish(article, errors, warnings);

    // Check content structure and formatting
    this.validateContentStructure(article, errors, warnings);

    // Validate SEO elements
    this.validateSEO(article, errors, warnings);

    // Check for professional tone and quality
    this.validateProfessionalTone(article, warnings);

    // Validate business relevance
    this.validateBusinessRelevance(article, warnings);

    const isValid = errors.length === 0;
    
    return {
      isValid,
      errors,
      warnings,
      score: this.calculateQualityScore(article, errors, warnings),
      recommendations: this.generateRecommendations(errors, warnings)
    };
  }

  /**
   * Validate required fields are present
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   */
  validateRequiredFields(article, errors) {
    this.requiredElements.forEach(field => {
      if (!article[field] || article[field].trim().length === 0) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  /**
   * Validate content length requirements
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateContentLength(article, errors, warnings) {
    // Check minimum lengths
    Object.entries(this.minLengths).forEach(([field, minLength]) => {
      if (article[field] && article[field].length < minLength) {
        errors.push(`${field} must be at least ${minLength} characters (current: ${article[field].length})`);
      }
    });

    // Check maximum lengths
    Object.entries(this.maxLengths).forEach(([field, maxLength]) => {
      if (article[field] && article[field].length > maxLength) {
        errors.push(`${field} must be no more than ${maxLength} characters (current: ${article[field].length})`);
      }
    });

    // Check optimal content length
    if (article.content && article.content.length < 1000) {
      warnings.push('Content length is below recommended minimum of 1000 characters for comprehensive articles');
    }

    if (article.content && article.content.length > 10000) {
      warnings.push('Content length is above recommended maximum of 10000 characters - consider breaking into multiple articles');
    }
  }

  /**
   * Validate British English usage
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateBritishEnglish(article, errors, warnings) {
    const textToCheck = `${article.title || ''} ${article.content || ''} ${article.summary || ''}`.toLowerCase();
    
    // Check for American spellings
    const americanSpellings = [];
    Object.entries(this.britishSpellings).forEach(([american, british]) => {
      const americanRegex = new RegExp(`\\b${american}\\b`, 'gi');
      if (americanRegex.test(textToCheck)) {
        americanSpellings.push({ american, british });
      }
    });

    if (americanSpellings.length > 0) {
      errors.push(`American spellings detected. Please use British English: ${americanSpellings.map(s => `"${s.american}" → "${s.british}"`).join(', ')}`);
    }

    // Check for British terms usage
    const britishTermsFound = this.britishTerms.filter(term => 
      textToCheck.includes(term.toLowerCase())
    );

    if (britishTermsFound.length === 0) {
      warnings.push('Consider using more British English terms to maintain consistency with UK audience');
    }

    // Check for -ize vs -ise endings
    const izeWords = textToCheck.match(/\b\w+ize\b/gi);
    if (izeWords && izeWords.length > 0) {
      warnings.push(`Consider using -ise endings instead of -ize for British English: ${izeWords.join(', ')}`);
    }
  }

  /**
   * Validate content structure and formatting
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateContentStructure(article, errors, warnings) {
    if (!article.content) return;

    const content = article.content;

    // Check for proper heading structure
    const headings = content.match(/^#{1,6}\s.+$/gm);
    if (!headings || headings.length < 2) {
      warnings.push('Content should include multiple headings for better structure');
    }

    // Check for paragraph structure
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length < 3) {
      warnings.push('Content should be broken into multiple paragraphs for better readability');
    }

    // Check for proper introduction
    const firstParagraph = paragraphs[0];
    if (firstParagraph && firstParagraph.length < 100) {
      warnings.push('Introduction paragraph should be more substantial (at least 100 characters)');
    }

    // Check for conclusion
    const lastParagraph = paragraphs[paragraphs.length - 1];
    const conclusionKeywords = ['conclusion', 'summary', 'in summary', 'to conclude', 'finally', 'next steps'];
    const hasConclusion = conclusionKeywords.some(keyword => 
      lastParagraph.toLowerCase().includes(keyword)
    );

    if (!hasConclusion) {
      warnings.push('Consider adding a clear conclusion or next steps section');
    }

    // Check for lists or bullet points
    const hasLists = content.includes('- ') || content.includes('* ') || /\d+\.\s/.test(content);
    if (!hasLists) {
      warnings.push('Consider adding lists or bullet points to improve readability');
    }

    // Check for professional formatting
    if (content.includes('!!!') || content.includes('???')) {
      errors.push('Avoid excessive punctuation - maintain professional tone');
    }

    // Check for proper spacing
    if (content.includes('  ')) {
      warnings.push('Remove extra spaces for cleaner formatting');
    }
  }

  /**
   * Validate SEO elements
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateSEO(article, errors, warnings) {
    // Check SEO title
    if (article.seo_title) {
      if (article.seo_title.length < 30) {
        warnings.push('SEO title is too short - aim for 50-60 characters');
      }
      if (article.seo_title.length > 60) {
        errors.push('SEO title is too long - must be under 60 characters');
      }
    }

    // Check SEO description
    if (article.seo_description) {
      if (article.seo_description.length < 120) {
        warnings.push('SEO description is too short - aim for 150-160 characters');
      }
      if (article.seo_description.length > 160) {
        errors.push('SEO description is too long - must be under 160 characters');
      }
    }

    // Check for keyword density
    const title = article.title.toLowerCase();
    const content = article.content.toLowerCase();
    const category = article.category.toLowerCase();

    if (!content.includes(category)) {
      warnings.push(`Content should include the category keyword "${category}" for better SEO`);
    }

    // Check for relevant keywords
    const techKeywords = ['technology', 'digital', 'enterprise', 'solution', 'strategy', 'consulting'];
    const keywordCount = techKeywords.filter(keyword => content.includes(keyword)).length;

    if (keywordCount < 2) {
      warnings.push('Consider including more relevant technology consulting keywords');
    }
  }

  /**
   * Validate professional tone
   * @param {Object} article - Article object
   * @param {Array} warnings - Array to push warnings to
   */
  validateProfessionalTone(article, warnings) {
    const content = article.content.toLowerCase();
    
    // Check for informal language
    const informalWords = ['gonna', 'wanna', 'kinda', 'sorta', 'yeah', 'ok', 'awesome', 'cool', 'stuff'];
    const informalFound = informalWords.filter(word => content.includes(word));
    
    if (informalFound.length > 0) {
      warnings.push(`Avoid informal language for professional tone: ${informalFound.join(', ')}`);
    }

    // Check for first person usage
    const firstPersonWords = ['i ', 'me ', 'my ', 'mine ', 'myself'];
    const firstPersonFound = firstPersonWords.filter(word => content.includes(word));
    
    if (firstPersonFound.length > 2) {
      warnings.push('Consider reducing first-person language for more authoritative tone');
    }

    // Check for contractions
    const contractions = ["won't", "can't", "don't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't"];
    const contractionsFound = contractions.filter(contraction => content.includes(contraction));
    
    if (contractionsFound.length > 0) {
      warnings.push(`Consider avoiding contractions for formal tone: ${contractionsFound.join(', ')}`);
    }
  }

  /**
   * Validate business relevance
   * @param {Object} article - Article object
   * @param {Array} warnings - Array to push warnings to
   */
  validateBusinessRelevance(article, warnings) {
    const content = article.content.toLowerCase();
    
    // Check for business-focused keywords
    const businessKeywords = [
      'business', 'enterprise', 'organization', 'company', 'roi', 'cost',
      'efficiency', 'productivity', 'strategy', 'competitive', 'market',
      'revenue', 'profit', 'investment', 'budget', 'resources', 'scalability'
    ];
    
    const businessKeywordCount = businessKeywords.filter(keyword => content.includes(keyword)).length;
    
    if (businessKeywordCount < 3) {
      warnings.push('Consider adding more business-focused context and implications');
    }

    // Check for actionable insights
    const actionableWords = ['implement', 'strategy', 'recommend', 'consider', 'should', 'plan', 'next steps'];
    const actionableCount = actionableWords.filter(word => content.includes(word)).length;
    
    if (actionableCount < 2) {
      warnings.push('Consider adding more actionable insights and recommendations');
    }
  }

  /**
   * Calculate quality score
   * @param {Object} article - Article object
   * @param {Array} errors - Array of errors
   * @param {Array} warnings - Array of warnings
   * @returns {number} Quality score (0-100)
   */
  calculateQualityScore(article, errors, warnings) {
    let score = 100;

    // Deduct points for errors
    score -= errors.length * 10;

    // Deduct points for warnings
    score -= warnings.length * 5;

    // Bonus points for good structure
    if (article.content && article.content.includes('##')) score += 5;
    if (article.content && article.content.includes('- ')) score += 5;
    if (article.reading_time && article.reading_time >= 5) score += 5;
    if (article.word_count && article.word_count >= 1000) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate recommendations for improvement
   * @param {Array} errors - Array of errors
   * @param {Array} warnings - Array of warnings
   * @returns {Array} Array of recommendations
   */
  generateRecommendations(errors, warnings) {
    const recommendations = [];

    if (errors.length > 0) {
      recommendations.push('Fix all errors before publishing');
    }

    if (warnings.length > 3) {
      recommendations.push('Address warnings to improve article quality');
    }

    recommendations.push('Review content for British English consistency');
    recommendations.push('Ensure content provides actionable business insights');
    recommendations.push('Verify proper heading structure and formatting');
    recommendations.push('Check SEO elements are optimized');

    return recommendations;
  }

  /**
   * Auto-fix common issues
   * @param {Object} article - Article object
   * @returns {Object} Fixed article object
   */
  autoFixArticle(article) {
    let fixedArticle = { ...article };

    // Fix American spellings
    Object.entries(this.britishSpellings).forEach(([american, british]) => {
      const americanRegex = new RegExp(`\\b${american}\\b`, 'gi');
      if (fixedArticle.content) {
        fixedArticle.content = fixedArticle.content.replace(americanRegex, british);
      }
      if (fixedArticle.title) {
        fixedArticle.title = fixedArticle.title.replace(americanRegex, british);
      }
      if (fixedArticle.summary) {
        fixedArticle.summary = fixedArticle.summary.replace(americanRegex, british);
      }
    });

    // Fix extra spaces
    if (fixedArticle.content) {
      fixedArticle.content = fixedArticle.content.replace(/\s+/g, ' ');
    }

    // Generate slug if missing
    if (!fixedArticle.slug && fixedArticle.title) {
      fixedArticle.slug = this.generateSlug(fixedArticle.title);
    }

    return fixedArticle;
  }

  /**
   * Generate URL-friendly slug
   * @param {string} title - Article title
   * @returns {string} URL slug
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }
}

/**
 * Main validation function
 * @param {Object} article - Article to validate
 * @returns {Promise<Object>} Validation result
 */
export async function validateArticle(article) {
  const validator = new ContentValidator();
  return await validator.validateArticle(article);
}

/**
 * Auto-fix article issues
 * @param {Object} article - Article to fix
 * @returns {Object} Fixed article
 */
export function autoFixArticle(article) {
  const validator = new ContentValidator();
  return validator.autoFixArticle(article);
}

export default ContentValidator;