# ContainerCode Newsletter Automation System

A comprehensive automated newsletter system built on Cloudflare Workers that generates articles from RSS feeds using AI, validates content in British English, creates Notion pages, and distributes weekly newsletters to subscribers.

## 🎯 System Overview

This system provides:
- **Daily Article Generation**: Parses 17+ RSS feeds, generates comprehensive articles using AI
- **Content Validation**: Ensures British English formatting and professional quality
- **Notion Integration**: Automatically creates formatted pages with images
- **AI Image Generation**: Creates header images using Stable Diffusion
- **Weekly Newsletter**: Generates and distributes HTML newsletters to subscribers
- **Analytics & Monitoring**: Tracks performance and engagement metrics

## 🏗️ Architecture

```
RSS Feeds → Article Generator → Content Validator → Notion API → Newsletter Generator → Email Distribution
     ↓              ↓                 ↓                 ↓                    ↓                    ↓
  Cron Job    AI Processing    Format Validation   Image Generation    HTML Template    Batch Email Sending
```

## 📁 Project Structure

```
workers/
├── article-generator.js          # Main article generation worker
├── newsletter-generator.js       # Newsletter creation and distribution
├── utils/
│   ├── rss-parser.js             # RSS feed parsing and filtering
│   ├── content-generator.js      # AI-powered article generation
│   ├── content-validator.js      # British English validation
│   ├── notion-client.js          # Notion API integration
│   ├── image-generator.js        # AI image generation
│   ├── newsletter-generator.js   # HTML newsletter templates
│   └── email-sender.js           # Batch email distribution
├── deploy.sh                     # Deployment script
└── package.json                  # Dependencies and scripts

database/
└── schema.sql                    # Complete database schema

wrangler.toml                     # Cloudflare Workers configuration
```

## 🚀 Quick Start

### Prerequisites

1. **Cloudflare Account** with Workers, D1, R2, and AI enabled
2. **Wrangler CLI** installed and authenticated
3. **Notion Integration** with database access
4. **Resend Account** for email delivery

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd workers
   npm install
   ```

2. **Configure Environment Variables**
   
   Update `wrangler.toml` with your credentials:
   ```toml
   [vars]
   NOTION_TOKEN = "your-notion-token"
   RESEND_API_KEY = "your-resend-key"
   NOTION_DATABASE_GENERATED_ARTICLES = "your-notion-db-id"
   # ... other variables
   ```

3. **Deploy the System**
   ```bash
   npm run deploy
   ```

   This will:
   - Create D1 database and apply schema
   - Set up R2 buckets for images
   - Deploy both workers
   - Configure cron schedules
   - Test deployments

## ⚙️ Configuration

### RSS Feed Sources

The system monitors 17 RSS feeds across categories:

- **AI**: OpenAI Blog, Google AI, O'Reilly AI Radar
- **DevOps**: DevOps.com, Kubernetes Blog, Medium DevOps
- **Cybersecurity**: The Hacker News, Krebs on Security, Dark Reading
- **Cloud**: AWS Blog, Azure Blog, Google Cloud Blog
- **Software Engineering**: Stack Overflow, GitHub, Martin Fowler

### Cron Schedules

- **Article Generation**: Daily at 9 AM UTC (`0 9 * * *`)
- **Newsletter Distribution**: Monday at 5 PM UTC (`0 17 * * 1`)

### Content Validation Rules

- Minimum 500 characters for articles
- British English spelling enforcement
- Professional tone validation
- SEO optimization checks
- Business relevance scoring

## 📊 Database Schema

### Core Tables

- **articles**: Generated articles with metadata
- **subscribers**: Newsletter subscriber management
- **newsletter_issues**: Newsletter tracking
- **email_campaigns**: Individual email delivery tracking
- **rss_feeds**: RSS source management
- **content_validations**: Quality assurance records
- **analytics**: Performance metrics
- **cron_logs**: Job execution tracking

## 🔧 Usage

### Manual Operations

**Generate Test Article**
```bash
curl https://article-generator.containercode.workers.dev/generate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"rss_url": "https://openai.com/blog/rss/", "category": "ai"}'
```

**Preview Newsletter**
```bash
curl https://newsletter-generator.containercode.workers.dev/preview
```

**Send Test Newsletter**
```bash
curl https://newsletter-generator.containercode.workers.dev/test \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Check System Status**
```bash
curl https://article-generator.containercode.workers.dev/status
curl https://newsletter-generator.containercode.workers.dev/stats
```

### Monitoring

**View Worker Logs**
```bash
npm run logs:article
npm run logs:newsletter
```

**Database Queries**
```bash
npm run db:query "SELECT COUNT(*) FROM articles WHERE status = 'published'"
npm run db:query "SELECT * FROM newsletter_issues ORDER BY sent_at DESC LIMIT 5"
```

**System Health Check**
```bash
npm run monitor
```

## 🎨 Newsletter Template

The newsletter template features:

- **Professional Design**: Blue and white color scheme matching ContainerCode branding
- **Responsive Layout**: Mobile-friendly HTML with 600px max width
- **Article Cards**: Featured images, reading time, categories
- **CTA Sections**: Service promotion and consultation booking
- **Footer Links**: Unsubscribe, preferences, company information
- **Analytics Ready**: Open/click tracking integration

## 🤖 AI Integration

### Content Generation

Uses Cloudflare Workers AI with:
- **Model**: Llama 3.1 8B Instruct
- **Content Length**: 1500-2500 words
- **Style**: Professional, British English, business-focused
- **Structure**: Headings, bullet points, actionable insights

### Image Generation

Uses Stable Diffusion XL for:
- **Article Headers**: 1024x576 professional images
- **Newsletter Headers**: Branded template images
- **Automatic Fallbacks**: Default images if generation fails
- **R2 Storage**: CDN-optimized delivery

## 📧 Email System

### Features

- **Batch Processing**: 50 recipients per API call
- **Rate Limiting**: 100 emails/second with delays
- **Personalization**: Name, preferences, unsubscribe tokens
- **Tracking**: Opens, clicks, bounces, complaints
- **Compliance**: GDPR, CAN-SPAM headers
- **Fallbacks**: Plain text versions, error handling

### Delivery Statistics

Track metrics including:
- Total subscribers
- Delivery rates
- Open rates
- Click-through rates
- Bounce management
- Unsubscribe handling

## 🔍 Content Quality Assurance

### Validation Pipeline

1. **Required Fields**: Title, content, summary validation
2. **Length Checks**: Minimum/maximum character limits
3. **British English**: Spelling and terminology verification
4. **Professional Tone**: Informal language detection
5. **SEO Optimization**: Title/description length, keyword density
6. **Business Relevance**: Industry keyword analysis
7. **Structure Quality**: Headings, lists, formatting

### Auto-Fixing

- American to British spelling conversion
- Extra whitespace removal
- Slug generation
- Meta field optimization

## 📈 Analytics & Reporting

### Tracked Events

- Article generation success/failure
- Content validation results
- Newsletter distribution metrics
- Email engagement (opens/clicks)
- Subscriber growth/churn
- System performance metrics

### Available Reports

- Daily article generation summary
- Weekly newsletter performance
- Monthly subscriber analytics
- Content quality trends
- System health monitoring

## 🛠️ Development & Testing

### Local Development

```bash
# Start article generator locally
npm run test:article-generator

# Start newsletter generator locally
npm run test:newsletter-generator

# Test article generation
npm run trigger:articles

# Test newsletter generation
npm run trigger:newsletter
```

### Database Management

```bash
# Apply schema updates
npm run db:schema

# Query data
npm run db:query "SELECT * FROM articles LIMIT 5"

# Backup data
wrangler d1 export newsletter-automation-db --output backup.sql
```

## 🔒 Security & Compliance

### Data Protection

- **API Keys**: Stored as Cloudflare environment variables
- **Access Control**: Worker-to-worker authentication
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: All user inputs sanitized and validated
- **HTTPS Only**: All communications encrypted

### Email Compliance

- **Unsubscribe Links**: One-click unsubscribe in every email
- **Sender Identification**: Clear from address and company info
- **List Management**: Automatic bounce and complaint handling
- **Data Retention**: Configurable subscriber data lifecycle

## 📚 API Reference

### Article Generator Endpoints

- `POST /generate` - Generate article from RSS URL
- `GET /status` - System health and statistics

### Newsletter Generator Endpoints

- `GET /preview` - Preview next newsletter
- `POST /test` - Send test newsletter
- `GET /stats` - Newsletter statistics
- `POST /webhook` - Email event webhooks

## 🚨 Troubleshooting

### Common Issues

**Articles Not Generating**
- Check RSS feed accessibility
- Verify AI model availability
- Review content validation errors

**Newsletter Not Sending**
- Confirm active subscribers exist
- Check Resend API limits
- Verify email template rendering

**Images Not Loading**
- Check R2 bucket permissions
- Verify image generation models
- Review CDN configuration

### Debug Commands

```bash
# Check recent job logs
wrangler d1 execute newsletter-automation-db --command "SELECT * FROM cron_logs ORDER BY start_time DESC LIMIT 10"

# View failed articles
wrangler d1 execute newsletter-automation-db --command "SELECT title, validation_errors FROM articles WHERE validation_status = 'invalid'"

# Check email delivery status
wrangler d1 execute newsletter-automation-db --command "SELECT status, COUNT(*) FROM email_campaigns GROUP BY status"
```

## 🔮 Future Enhancements

### Planned Features

- **A/B Testing**: Subject line and content variations
- **Segmentation**: Subscriber categories and preferences
- **Social Integration**: Auto-posting to social media
- **Content Scheduling**: Advanced publication workflows
- **Multi-language**: Support for additional languages
- **Advanced Analytics**: Detailed engagement metrics

### Integration Opportunities

- **CRM Integration**: HubSpot, Salesforce connectivity
- **Analytics Platforms**: Google Analytics, Mixpanel
- **Social Media**: LinkedIn, Twitter auto-posting
- **Webhooks**: Custom integration endpoints

## 📞 Support

For technical support or feature requests:

- **Email**: tech@containercode.club
- **Documentation**: [docs.containercode.club](https://docs.containercode.club)
- **Issues**: GitHub repository issues
- **Community**: ContainerCode Slack workspace

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**ContainerCode Newsletter Automation** - Powered by Cloudflare Workers, AI, and modern web technologies.