/**
 * Newsletter Generator for Newsletter Automation
 * Generates HTML newsletters with articles and professional styling
 */

export class NewsletterGenerator {
  constructor() {
    this.brandColors = {
      primary: '#1e40af', // Blue
      secondary: '#06b6d4', // Cyan
      accent: '#0ea5e9', // Light blue
      text: '#1f2937', // Dark gray
      background: '#ffffff',
      light: '#f8fafc' // Light gray
    };
  }

  /**
   * Generate newsletter HTML from articles
   * @param {Object} newsletterData - Newsletter configuration
   * @param {Array} articles - Array of articles to include
   * @returns {Promise<Object>} Newsletter HTML content
   */
  async generateNewsletter(newsletterData, articles) {
    const newsletter = {
      issue_number: newsletterData.issue_number || this.getNextIssueNumber(),
      subject: newsletterData.subject || this.generateSubject(articles),
      preheader: newsletterData.preheader || this.generatePreheader(articles),
      content_html: this.generateHTML(newsletterData, articles),
      content_text: this.generatePlainText(newsletterData, articles),
      article_ids: articles.map(a => a.id)
    };

    return newsletter;
  }

  /**
   * Generate HTML content for newsletter
   * @param {Object} newsletterData - Newsletter configuration
   * @param {Array} articles - Array of articles
   * @returns {string} HTML content
   */
  generateHTML(newsletterData, articles) {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const html = `
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${newsletterData.subject}</title>
    <style>
        ${this.getNewsletterCSS()}
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Preheader -->
        <div class="preheader">${newsletterData.preheader}</div>
        
        <!-- Header -->
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <img src="https://containercode.club/images/containercode-logo-horizontal.svg" 
                         alt="ContainerCode Advisory" class="logo">
                    <div class="header-text">
                        <h1>ContainerCode Weekly</h1>
                        <p class="date">${currentDate}</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <div class="container">
                <!-- Introduction -->
                <section class="intro">
                    <h2>This Week in Technology Consulting</h2>
                    <p>Welcome to your weekly digest of the latest insights in cloud computing, cybersecurity, DevOps, and digital transformation. Our team has curated the most relevant developments for UK enterprise technology leaders.</p>
                </section>

                <!-- Featured Articles -->
                <section class="articles">
                    <h2>Featured Articles</h2>
                    ${this.generateArticlesSections(articles)}
                </section>

                <!-- Quick Links -->
                <section class="quick-links">
                    <h2>Quick Links</h2>
                    <div class="links-grid">
                        <a href="https://containercode.club/services" class="link-card">
                            <h3>Our Services</h3>
                            <p>Explore our consulting offerings</p>
                        </a>
                        <a href="https://containercode.club/blog" class="link-card">
                            <h3>Latest Blog Posts</h3>
                            <p>Read our latest insights</p>
                        </a>
                        <a href="https://containercode.club/contact" class="link-card">
                            <h3>Get In Touch</h3>
                            <p>Schedule a consultation</p>
                        </a>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta-section">
                    <div class="cta-card">
                        <h2>Ready to Transform Your Technology Strategy?</h2>
                        <p>Our experienced consultants are ready to help you navigate the evolving technology landscape. From cloud migration to cybersecurity strategy, we provide the expertise you need.</p>
                        <a href="https://containercode.club/contact" class="cta-button">Schedule a Free Consultation</a>
                    </div>
                </section>
            </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>ContainerCode Advisory</h3>
                        <p>Your trusted partner for enterprise technology consulting in the UK.</p>
                    </div>
                    <div class="footer-section">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="https://containercode.club/services/cloud-technologies">Cloud Technologies</a></li>
                            <li><a href="https://containercode.club/services/cybersecurity">Cybersecurity</a></li>
                            <li><a href="https://containercode.club/services/devops">DevOps</a></li>
                            <li><a href="https://containercode.club/services/digital-transformation">Digital Transformation</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Connect</h3>
                        <ul>
                            <li><a href="https://containercode.club/about">About Us</a></li>
                            <li><a href="https://containercode.club/blog">Blog</a></li>
                            <li><a href="https://containercode.club/contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} ContainerCode Advisory. All rights reserved.</p>
                    <div class="footer-links">
                        <a href="{{unsubscribe_url}}">Unsubscribe</a>
                        <a href="https://containercode.club/privacy">Privacy Policy</a>
                        <a href="{{preferences_url}}">Email Preferences</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate articles sections HTML
   * @param {Array} articles - Array of articles
   * @returns {string} Articles HTML
   */
  generateArticlesSections(articles) {
    return articles.map((article, index) => {
      const isFirst = index === 0;
      const cardClass = isFirst ? 'article-card featured' : 'article-card';
      
      return `
        <div class="${cardClass}">
            ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" class="article-image">` : ''}
            <div class="article-content">
                <div class="article-meta">
                    <span class="category">${this.formatCategory(article.category)}</span>
                    <span class="reading-time">${article.reading_time || 5} min read</span>
                </div>
                <h3><a href="https://containercode.club/blog/${article.slug}">${article.title}</a></h3>
                <p class="excerpt">${article.excerpt || article.summary}</p>
                <div class="article-footer">
                    <span class="author">By ${article.author}</span>
                    <a href="https://containercode.club/blog/${article.slug}" class="read-more">Read More →</a>
                </div>
            </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Generate newsletter CSS
   * @returns {string} CSS styles
   */
  getNewsletterCSS() {
    return `
        /* Reset and base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: ${this.brandColors.text};
            background-color: #f5f5f5;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${this.brandColors.background};
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .container {
            padding: 0 20px;
        }
        
        .preheader {
            display: none;
            font-size: 1px;
            color: ${this.brandColors.background};
            line-height: 1px;
            max-height: 0;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, ${this.brandColors.primary} 0%, ${this.brandColors.secondary} 100%);
            color: white;
            padding: 30px 0;
        }
        
        .header-content {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .logo {
            height: 40px;
            width: auto;
        }
        
        .header-text h1 {
            font-size: 24px;
            margin: 0;
            font-weight: 700;
        }
        
        .date {
            font-size: 14px;
            opacity: 0.9;
            margin: 0;
        }
        
        /* Main content */
        .main-content {
            padding: 40px 0;
        }
        
        .intro {
            margin-bottom: 40px;
            text-align: center;
            padding: 20px;
            background-color: ${this.brandColors.light};
            border-radius: 8px;
        }
        
        .intro h2 {
            font-size: 24px;
            margin-bottom: 15px;
            color: ${this.brandColors.primary};
        }
        
        .intro p {
            font-size: 16px;
            color: #666;
        }
        
        /* Articles */
        .articles {
            margin-bottom: 40px;
        }
        
        .articles h2 {
            font-size: 22px;
            margin-bottom: 25px;
            color: ${this.brandColors.primary};
            border-bottom: 2px solid ${this.brandColors.primary};
            padding-bottom: 10px;
        }
        
        .article-card {
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
            transition: transform 0.2s;
        }
        
        .article-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .article-card.featured {
            border-color: ${this.brandColors.primary};
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .article-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        
        .article-content {
            padding: 20px;
        }
        
        .article-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .category {
            background-color: ${this.brandColors.primary};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .reading-time {
            color: #666;
            font-size: 12px;
        }
        
        .article-card h3 {
            margin-bottom: 10px;
            font-size: 18px;
            line-height: 1.3;
        }
        
        .article-card h3 a {
            color: ${this.brandColors.text};
            text-decoration: none;
        }
        
        .article-card h3 a:hover {
            color: ${this.brandColors.primary};
        }
        
        .excerpt {
            color: #666;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .article-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e5e5e5;
            padding-top: 15px;
        }
        
        .author {
            color: #666;
            font-size: 12px;
        }
        
        .read-more {
            color: ${this.brandColors.primary};
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
        }
        
        .read-more:hover {
            color: ${this.brandColors.secondary};
        }
        
        /* Quick Links */
        .quick-links {
            margin-bottom: 40px;
        }
        
        .quick-links h2 {
            font-size: 22px;
            margin-bottom: 20px;
            color: ${this.brandColors.primary};
        }
        
        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .link-card {
            background-color: ${this.brandColors.light};
            padding: 20px;
            border-radius: 8px;
            text-decoration: none;
            color: ${this.brandColors.text};
            transition: background-color 0.2s;
        }
        
        .link-card:hover {
            background-color: #e2e8f0;
        }
        
        .link-card h3 {
            font-size: 16px;
            margin-bottom: 8px;
            color: ${this.brandColors.primary};
        }
        
        .link-card p {
            font-size: 14px;
            color: #666;
        }
        
        /* CTA Section */
        .cta-section {
            margin-bottom: 40px;
        }
        
        .cta-card {
            background: linear-gradient(135deg, ${this.brandColors.primary} 0%, ${this.brandColors.secondary} 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
        }
        
        .cta-card h2 {
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .cta-card p {
            font-size: 16px;
            margin-bottom: 25px;
            opacity: 0.9;
        }
        
        .cta-button {
            display: inline-block;
            background-color: white;
            color: ${this.brandColors.primary};
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        /* Footer */
        .footer {
            background-color: ${this.brandColors.text};
            color: white;
            padding: 40px 0 20px;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .footer-section h3 {
            font-size: 16px;
            margin-bottom: 15px;
            color: ${this.brandColors.secondary};
        }
        
        .footer-section p {
            font-size: 14px;
            opacity: 0.8;
        }
        
        .footer-section ul {
            list-style: none;
        }
        
        .footer-section ul li {
            margin-bottom: 8px;
        }
        
        .footer-section ul li a {
            color: white;
            text-decoration: none;
            font-size: 14px;
            opacity: 0.8;
        }
        
        .footer-section ul li a:hover {
            opacity: 1;
            color: ${this.brandColors.secondary};
        }
        
        .footer-bottom {
            border-top: 1px solid #444;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            opacity: 0.8;
        }
        
        .footer-links {
            display: flex;
            gap: 15px;
        }
        
        .footer-links a {
            color: white;
            text-decoration: none;
        }
        
        .footer-links a:hover {
            color: ${this.brandColors.secondary};
        }
        
        /* Responsive */
        @media (max-width: 600px) {
            .container {
                padding: 0 15px;
            }
            
            .header-content {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .links-grid {
                grid-template-columns: 1fr;
            }
            
            .footer-bottom {
                flex-direction: column;
                gap: 10px;
            }
        }
    `;
  }

  /**
   * Generate plain text version of newsletter
   * @param {Object} newsletterData - Newsletter configuration
   * @param {Array} articles - Array of articles
   * @returns {string} Plain text content
   */
  generatePlainText(newsletterData, articles) {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let text = `
CONTAINERCODE WEEKLY
${currentDate}

This Week in Technology Consulting
==================================

Welcome to your weekly digest of the latest insights in cloud computing, cybersecurity, DevOps, and digital transformation. Our team has curated the most relevant developments for UK enterprise technology leaders.

FEATURED ARTICLES
================

`;

    articles.forEach((article, index) => {
      text += `
${index + 1}. ${article.title}
${'-'.repeat(article.title.length)}

${article.excerpt || article.summary}

Category: ${this.formatCategory(article.category)}
Reading Time: ${article.reading_time || 5} minutes
Read more: https://containercode.club/blog/${article.slug}

`;
    });

    text += `
QUICK LINKS
===========

• Our Services: https://containercode.club/services
• Latest Blog Posts: https://containercode.club/blog
• Get In Touch: https://containercode.club/contact

READY TO TRANSFORM YOUR TECHNOLOGY STRATEGY?
===========================================

Our experienced consultants are ready to help you navigate the evolving technology landscape. From cloud migration to cybersecurity strategy, we provide the expertise you need.

Schedule a Free Consultation: https://containercode.club/contact

------------------------------------------
ContainerCode Advisory
Your trusted partner for enterprise technology consulting in the UK.

© ${new Date().getFullYear()} ContainerCode Advisory. All rights reserved.

Unsubscribe: {{unsubscribe_url}}
Privacy Policy: https://containercode.club/privacy
Email Preferences: {{preferences_url}}
`;

    return text;
  }

  /**
   * Generate newsletter subject line
   * @param {Array} articles - Array of articles
   * @returns {string} Subject line
   */
  generateSubject(articles) {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const topics = [...new Set(articles.map(a => this.formatCategory(a.category)))];
    const topicText = topics.length > 2 ? 
      `${topics.slice(0, 2).join(', ')} & More` : 
      topics.join(' & ');

    return `ContainerCode Weekly: ${topicText} Insights - ${currentDate}`;
  }

  /**
   * Generate newsletter preheader
   * @param {Array} articles - Array of articles
   * @returns {string} Preheader text
   */
  generatePreheader(articles) {
    const keyTopics = articles.slice(0, 3).map(a => a.title.substring(0, 30) + '...');
    return `This week: ${keyTopics.join(' | ')} | ContainerCode Advisory`;
  }

  /**
   * Format category for display
   * @param {string} category - Category name
   * @returns {string} Formatted category
   */
  formatCategory(category) {
    const categoryMap = {
      'ai': 'AI & ML',
      'devops': 'DevOps',
      'cybersecurity': 'Cybersecurity',
      'cloud': 'Cloud Computing',
      'software_engineering': 'Software Engineering',
      'technology': 'Technology'
    };

    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Get next issue number
   * @returns {number} Next issue number
   */
  getNextIssueNumber() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((now - startOfYear) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber;
  }
}

/**
 * Generate newsletter from articles
 * @param {Array} articles - Array of articles
 * @param {Object} options - Newsletter options
 * @returns {Promise<Object>} Generated newsletter
 */
export async function generateNewsletter(articles, options = {}) {
  const generator = new NewsletterGenerator();
  return await generator.generateNewsletter(options, articles);
}

export default NewsletterGenerator;