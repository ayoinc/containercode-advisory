-- Newsletter System Database Schema
-- This schema defines the structure for automated newsletter generation

-- Articles table - stores generated articles from RSS feeds
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  notion_page_id TEXT,
  source_url TEXT,
  source_feed TEXT,
  category TEXT NOT NULL,
  tags TEXT, -- JSON array of tags
  author TEXT DEFAULT 'ContainerCode Advisory Team',
  word_count INTEGER,
  reading_time INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  validation_status TEXT DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid')),
  validation_errors TEXT, -- JSON array of validation errors
  seo_title TEXT,
  seo_description TEXT,
  featured BOOLEAN DEFAULT 0,
  view_count INTEGER DEFAULT 0
);

-- Subscribers table - manages newsletter subscribers
CREATE TABLE subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'unsubscribed', 'bounced')),
  subscription_source TEXT DEFAULT 'website',
  interests TEXT, -- JSON array of interests
  preferred_frequency TEXT DEFAULT 'weekly' CHECK (preferred_frequency IN ('daily', 'weekly', 'monthly')),
  timezone TEXT DEFAULT 'Europe/London',
  language TEXT DEFAULT 'en-GB',
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME,
  last_activity DATETIME,
  email_opens INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0,
  confirmation_token TEXT,
  confirmed_at DATETIME,
  double_opt_in BOOLEAN DEFAULT 0
);

-- Newsletter issues table - stores generated newsletters
CREATE TABLE newsletter_issues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue_number INTEGER UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  preheader TEXT,
  content_html TEXT NOT NULL,
  content_text TEXT,
  template_version TEXT DEFAULT 'v1',
  article_ids TEXT, -- JSON array of article IDs included
  scheduled_at DATETIME,
  sent_at DATETIME,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  total_subscribers INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- RSS feeds table - manages RSS feed sources
CREATE TABLE rss_feeds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT 1,
  last_fetched DATETIME,
  last_error TEXT,
  fetch_frequency INTEGER DEFAULT 3600, -- in seconds
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email campaigns table - tracks email sending
CREATE TABLE email_campaigns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  newsletter_issue_id INTEGER NOT NULL,
  subscriber_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  sent_at DATETIME,
  delivered_at DATETIME,
  opened_at DATETIME,
  clicked_at DATETIME,
  bounced_at DATETIME,
  unsubscribed_at DATETIME,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  error_message TEXT,
  FOREIGN KEY (newsletter_issue_id) REFERENCES newsletter_issues(id),
  FOREIGN KEY (subscriber_id) REFERENCES subscribers(id)
);

-- Content validation results table
CREATE TABLE content_validations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id INTEGER NOT NULL,
  validation_type TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  errors TEXT, -- JSON array of error messages
  warnings TEXT, -- JSON array of warning messages
  validated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Analytics table - tracks performance metrics
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON data
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT
);

-- Cron job logs table - tracks scheduled job execution
CREATE TABLE cron_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  duration INTEGER, -- in milliseconds
  result TEXT, -- JSON result data
  error_message TEXT,
  records_processed INTEGER DEFAULT 0
);

-- Indexes for performance optimization
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_created_at ON articles(created_at);
CREATE INDEX idx_articles_slug ON articles(slug);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);
CREATE INDEX idx_subscribers_subscribed_at ON subscribers(subscribed_at);

CREATE INDEX idx_newsletter_issues_status ON newsletter_issues(status);
CREATE INDEX idx_newsletter_issues_sent_at ON newsletter_issues(sent_at);
CREATE INDEX idx_newsletter_issues_issue_number ON newsletter_issues(issue_number);

CREATE INDEX idx_email_campaigns_newsletter_issue_id ON email_campaigns(newsletter_issue_id);
CREATE INDEX idx_email_campaigns_subscriber_id ON email_campaigns(subscriber_id);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

CREATE INDEX idx_rss_feeds_active ON rss_feeds(active);
CREATE INDEX idx_rss_feeds_category ON rss_feeds(category);

CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);

CREATE INDEX idx_cron_logs_job_name ON cron_logs(job_name);
CREATE INDEX idx_cron_logs_status ON cron_logs(status);
CREATE INDEX idx_cron_logs_start_time ON cron_logs(start_time);

-- Insert default RSS feeds
INSERT INTO rss_feeds (name, url, category, description) VALUES
  ('AI News', 'https://feeds.feedburner.com/oreilly/radar/ai', 'ai', 'AI and machine learning news from O''Reilly'),
  ('OpenAI Blog', 'https://openai.com/blog/rss/', 'ai', 'Official OpenAI blog posts'),
  ('Google AI Blog', 'https://blog.google/technology/ai/rss/', 'ai', 'Google AI research and developments'),
  ('DevOps.com', 'https://devops.com/feed/', 'devops', 'DevOps news and best practices'),
  ('Kubernetes Blog', 'https://kubernetes.io/feed.xml', 'devops', 'Official Kubernetes blog'),
  ('Stack Overflow Blog', 'https://stackoverflow.blog/feed/', 'software_engineering', 'Software engineering insights'),
  ('GitHub Blog', 'https://github.blog/feed/', 'software_engineering', 'GitHub platform updates and engineering'),
  ('Martin Fowler', 'https://martinfowler.com/feed.atom', 'software_engineering', 'Software architecture and design'),
  ('The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'cybersecurity', 'Cybersecurity news and threats'),
  ('Krebs on Security', 'https://krebsonsecurity.com/feed/', 'cybersecurity', 'Security research and analysis'),
  ('Dark Reading', 'https://www.darkreading.com/rss.xml', 'cybersecurity', 'Enterprise security news'),
  ('TechCrunch', 'https://techcrunch.com/feed/', 'technology', 'Technology startup and innovation news'),
  ('Ars Technica', 'https://feeds.arstechnica.com/arstechnica/index', 'technology', 'Technology analysis and reviews'),
  ('MIT Technology Review', 'https://www.technologyreview.com/feed/', 'technology', 'Emerging technology insights'),
  ('AWS News', 'https://aws.amazon.com/blogs/aws/feed/', 'cloud', 'AWS cloud computing updates'),
  ('Microsoft Azure Blog', 'https://azure.microsoft.com/blog/feed/', 'cloud', 'Azure cloud platform news'),
  ('Google Cloud Blog', 'https://cloud.google.com/blog/rss/', 'cloud', 'Google Cloud platform updates');

-- Insert sample subscriber for testing
INSERT INTO subscribers (email, name, first_name, last_name, confirmed_at, double_opt_in) VALUES
  ('test@containercode.club', 'Test User', 'Test', 'User', CURRENT_TIMESTAMP, 1);