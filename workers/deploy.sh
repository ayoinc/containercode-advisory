#!/bin/bash

# Deployment script for ContainerCode Newsletter Automation
# This script deploys all workers and sets up cron triggers

set -e

echo "🚀 Starting ContainerCode Newsletter Automation Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI is not installed. Please install it first:${NC}"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
echo -e "${BLUE}🔐 Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare. Please run:${NC}"
    echo "wrangler login"
    exit 1
fi

echo -e "${GREEN}✅ Cloudflare authentication verified${NC}"

# Create D1 database if it doesn't exist
echo -e "${BLUE}💾 Setting up D1 database...${NC}"
DB_NAME="newsletter-automation-db"
echo "Creating D1 database: $DB_NAME"

# Check if database exists
if wrangler d1 list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  Database $DB_NAME already exists${NC}"
else
    echo "Creating new D1 database..."
    wrangler d1 create "$DB_NAME"
fi

# Create R2 buckets
echo -e "${BLUE}🪣 Setting up R2 buckets...${NC}"

BUCKETS=("blog-images" "newsletter-assets")
for BUCKET in "${BUCKETS[@]}"; do
    echo "Creating R2 bucket: $BUCKET"
    if wrangler r2 bucket list | grep -q "$BUCKET"; then
        echo -e "${YELLOW}⚠️  Bucket $BUCKET already exists${NC}"
    else
        wrangler r2 bucket create "$BUCKET"
        echo -e "${GREEN}✅ Created bucket: $BUCKET${NC}"
    fi
done

# Apply database schema
echo -e "${BLUE}📊 Applying database schema...${NC}"
wrangler d1 execute "$DB_NAME" --file="./database/schema.sql"
echo -e "${GREEN}✅ Database schema applied${NC}"

# Deploy workers
echo -e "${BLUE}⚙️  Deploying workers...${NC}"

# Deploy article generator worker
echo "Deploying article-generator worker..."
wrangler deploy workers/article-generator.js \
    --name "article-generator" \
    --compatibility-date "2024-12-30" \
    --compatibility-flags nodejs_compat

echo -e "${GREEN}✅ Article generator deployed${NC}"

# Deploy newsletter generator worker
echo "Deploying newsletter-generator worker..."
wrangler deploy workers/newsletter-generator.js \
    --name "newsletter-generator" \
    --compatibility-date "2024-12-30" \
    --compatibility-flags nodejs_compat

echo -e "${GREEN}✅ Newsletter generator deployed${NC}"

# Set up cron triggers
echo -e "${BLUE}⏰ Setting up cron triggers...${NC}"

# Daily article generation at 9 AM UTC
echo "Setting up daily article generation cron..."
wrangler triggers deploy \
    --name "article-generator" \
    --cron "0 9 * * *"

echo -e "${GREEN}✅ Daily article generation cron set (9 AM UTC)${NC}"

# Weekly newsletter on Monday at 5 PM UTC
echo "Setting up weekly newsletter cron..."
wrangler triggers deploy \
    --name "newsletter-generator" \
    --cron "0 17 * * 1"

echo -e "${GREEN}✅ Weekly newsletter cron set (Monday 5 PM UTC)${NC}"

# Deploy main Next.js application
echo -e "${BLUE}🌐 Deploying main Next.js application...${NC}"
npm run build
wrangler deploy

echo -e "${GREEN}✅ Main application deployed${NC}"

# Test deployments
echo -e "${BLUE}🧪 Testing deployments...${NC}"

# Test article generator
echo "Testing article generator..."
ARTICLE_WORKER_URL=$(wrangler deployment list --name "article-generator" --limit 1 --json | jq -r '.[0].url')
if curl -s "$ARTICLE_WORKER_URL/status" | grep -q "total_articles"; then
    echo -e "${GREEN}✅ Article generator is responding${NC}"
else
    echo -e "${RED}❌ Article generator test failed${NC}"
fi

# Test newsletter generator
echo "Testing newsletter generator..."
NEWSLETTER_WORKER_URL=$(wrangler deployment list --name "newsletter-generator" --limit 1 --json | jq -r '.[0].url')
if curl -s "$NEWSLETTER_WORKER_URL/stats" | grep -q "total_subscribers"; then
    echo -e "${GREEN}✅ Newsletter generator is responding${NC}"
else
    echo -e "${RED}❌ Newsletter generator test failed${NC}"
fi

# Display deployment summary
echo -e "\n${GREEN}🎉 Deployment Summary${NC}"
echo "===================="
echo -e "📅 Article Generator: Daily at 9 AM UTC"
echo -e "📧 Newsletter Generator: Weekly on Monday at 5 PM UTC"
echo -e "💾 Database: $DB_NAME"
echo -e "🪣 R2 Buckets: blog-images, newsletter-assets"
echo -e "\n${BLUE}🔗 Useful Commands:${NC}"
echo "- View logs: wrangler tail [worker-name]"
echo "- Check database: wrangler d1 list"
echo "- Test workers: curl [worker-url]/status"
echo "- Trigger manually: wrangler triggers deploy --name [worker-name]"

echo -e "\n${GREEN}✅ ContainerCode Newsletter Automation deployed successfully!${NC}"

# Optional: Set up monitoring
read -p "Would you like to set up monitoring and alerting? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}📊 Setting up monitoring...${NC}"
    
    # Create monitoring script
    cat > monitor.sh << 'EOF'
#!/bin/bash
# Simple monitoring script for newsletter automation

# Check article generator health
ARTICLE_STATUS=$(curl -s "https://article-generator.containercode.workers.dev/status" | jq -r '.total_articles // "error"')
if [[ "$ARTICLE_STATUS" == "error" ]]; then
    echo "❌ Article generator unhealthy"
else
    echo "✅ Article generator healthy - $ARTICLE_STATUS total articles"
fi

# Check newsletter generator health
NEWSLETTER_STATUS=$(curl -s "https://newsletter-generator.containercode.workers.dev/stats" | jq -r '.total_subscribers // "error"')
if [[ "$NEWSLETTER_STATUS" == "error" ]]; then
    echo "❌ Newsletter generator unhealthy"
else
    echo "✅ Newsletter generator healthy - $NEWSLETTER_STATUS subscribers"
fi

# Check recent cron job executions
echo "📊 Recent job executions:"
wrangler d1 execute newsletter-automation-db --command "SELECT job_name, status, start_time FROM cron_logs ORDER BY start_time DESC LIMIT 5"
EOF

    chmod +x monitor.sh
    echo -e "${GREEN}✅ Monitoring script created: ./monitor.sh${NC}"
fi

echo -e "\n${BLUE}📚 Next Steps:${NC}"
echo "1. Add subscribers to your database"
echo "2. Configure RSS feeds in the database"  
echo "3. Test the system with manual triggers"
echo "4. Monitor logs and performance"
echo "5. Set up custom domain (optional)"

echo -e "\n${GREEN}🚀 Your automated newsletter system is ready!${NC}"