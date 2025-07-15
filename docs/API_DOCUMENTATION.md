# ContainerCode Newsletter Automation API Documentation

## Overview

This documentation covers the comprehensive API for the ContainerCode newsletter automation system, including queue-based processing, AI integration, and real-time monitoring.

## Base URL

```
https://containercode.club/api
```

## Authentication

All API requests require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your-api-key>
```

## Rate Limits

- **Standard endpoints**: 100 requests per minute
- **AI processing endpoints**: 10 requests per minute
- **Webhook endpoints**: 1000 requests per minute

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Core API Endpoints

### Newsletter Management

#### Subscribe to Newsletter

```http
POST /api/newsletter-subscribe
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "industry": "Technology",
  "jobTitle": "CTO",
  "preferences": {
    "topics": ["AI", "cloud", "cybersecurity"],
    "frequency": "weekly",
    "contentType": "technical"
  }
}
```

**Response:**

```json
{
  "success": true,
  "subscriberId": "sub_123456789",
  "message": "Successfully subscribed to newsletter",
  "confirmationRequired": true,
  "confirmationToken": "token_abcdef123456"
}
```

#### Unsubscribe from Newsletter

```http
POST /api/newsletter-unsubscribe
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "token": "unsubscribe_token_123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

#### Update Subscription Preferences

```http
PUT /api/newsletter-preferences
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "preferences": {
    "topics": ["AI", "DevOps"],
    "frequency": "monthly",
    "contentType": "business"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "preferences": {
    "topics": ["AI", "DevOps"],
    "frequency": "monthly",
    "contentType": "business"
  }
}
```

#### Send Newsletter

```http
POST /api/send-newsletter
```

**Request Body:**

```json
{
  "campaignId": "campaign_123",
  "subject": "Weekly Tech Update - January 2024",
  "template": "weekly_newsletter",
  "segments": ["enterprise-executives", "technical-professionals"],
  "scheduledAt": "2024-01-15T10:00:00Z",
  "testMode": false
}
```

**Response:**

```json
{
  "success": true,
  "campaignId": "campaign_123",
  "message": "Newsletter scheduled for delivery",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "estimatedRecipients": 1250,
  "jobId": "job_newsletter_123"
}
```

### Content Generation

#### Generate Article

```http
POST /api/content/generate-article
```

**Request Body:**

```json
{
  "topic": "AI in Enterprise Cloud Computing",
  "targetAudience": "enterprise",
  "wordCount": 1500,
  "tone": "professional",
  "includeResearch": true,
  "researchDomains": ["techcrunch.com", "wired.com", "arstechnica.com"],
  "aiProvider": "deepseek",
  "priority": "high"
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_article_456",
  "estimatedDuration": 180,
  "message": "Article generation started",
  "statusUrl": "/api/jobs/job_article_456/status"
}
```

#### Enhance Content

```http
POST /api/content/enhance
```

**Request Body:**

```json
{
  "content": "Original content to enhance...",
  "enhancementType": "quality",
  "targetAudience": "enterprise",
  "aiProvider": "deepseek"
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_enhance_789",
  "estimatedDuration": 60,
  "message": "Content enhancement started",
  "statusUrl": "/api/jobs/job_enhance_789/status"
}
```

#### Analyze Content

```http
POST /api/content/analyze
```

**Request Body:**

```json
{
  "content": "Content to analyze...",
  "analysisType": "comprehensive",
  "includeCompetitiveAnalysis": true
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_analyze_101",
  "estimatedDuration": 45,
  "message": "Content analysis started",
  "statusUrl": "/api/jobs/job_analyze_101/status"
}
```

### Search and Research

#### Search with BraveSearch

```http
POST /api/search/brave
```

**Request Body:**

```json
{
  "query": "enterprise cloud security best practices",
  "searchType": "topic_research",
  "domain": "technology",
  "targetAudience": "enterprise",
  "depth": "comprehensive",
  "domains": ["techcrunch.com", "wired.com"],
  "excludeDomains": ["example.com"],
  "freshness": "month",
  "maxResults": 50
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_search_202",
  "estimatedDuration": 30,
  "message": "Search started",
  "statusUrl": "/api/jobs/job_search_202/status"
}
```

#### Domain-Specific Search

```http
POST /api/search/domain-specific
```

**Request Body:**

```json
{
  "query": "fintech regulatory compliance",
  "domains": ["fca.org.uk", "gov.uk", "ft.com"],
  "excludeDomains": ["spam-site.com"],
  "contentType": "news",
  "freshness": "week"
}
```

**Response:**

```json
{
  "success": true,
  "jobId": "job_domain_search_303",
  "estimatedDuration": 20,
  "message": "Domain-specific search started",
  "statusUrl": "/api/jobs/job_domain_search_303/status"
}
```

### Job Management

#### Get Job Status

```http
GET /api/jobs/{jobId}/status
```

**Response:**

```json
{
  "jobId": "job_article_456",
  "status": "processing",
  "progress": 65,
  "message": "Generating article content",
  "startTime": "2024-01-15T10:00:00Z",
  "estimatedCompletion": "2024-01-15T10:03:00Z",
  "result": null,
  "error": null
}
```

#### Get Job Result

```http
GET /api/jobs/{jobId}/result
```

**Response (for completed article generation):**

```json
{
  "jobId": "job_article_456",
  "status": "completed",
  "result": {
    "title": "AI in Enterprise Cloud Computing: A Comprehensive Guide",
    "content": "Full article content...",
    "summary": "Article summary...",
    "tags": ["AI", "cloud", "enterprise"],
    "category": "technology",
    "readingTime": 8,
    "keyPoints": ["Key insight 1", "Key insight 2"],
    "callToAction": "Learn more about our AI solutions",
    "slug": "ai-enterprise-cloud-computing-guide",
    "notionPageId": "notion_page_123"
  },
  "completedAt": "2024-01-15T10:03:15Z",
  "duration": 195000
}
```

#### Cancel Job

```http
POST /api/jobs/{jobId}/cancel
```

**Response:**

```json
{
  "success": true,
  "message": "Job cancelled successfully",
  "jobId": "job_article_456"
}
```

#### Retry Job

```http
POST /api/jobs/{jobId}/retry
```

**Response:**

```json
{
  "success": true,
  "message": "Job retry initiated",
  "newJobId": "job_article_789",
  "statusUrl": "/api/jobs/job_article_789/status"
}
```

### Subscriber Segmentation

#### Get Segments

```http
GET /api/subscribers/segments
```

**Response:**

```json
{
  "segments": [
    {
      "id": "enterprise-executives",
      "name": "Enterprise Executives",
      "description": "C-level executives and senior management",
      "subscriberCount": 245,
      "engagementRate": 0.34,
      "contentPreferences": {
        "topics": ["strategy", "leadership", "ROI"],
        "formats": ["executive summary", "case study"],
        "frequency": "monthly"
      }
    }
  ]
}
```

#### Create Custom Segment

```http
POST /api/subscribers/segments
```

**Request Body:**

```json
{
  "name": "Healthcare CTOs",
  "description": "CTOs in healthcare organizations",
  "criteria": {
    "demographic": {
      "industries": ["Healthcare"],
      "jobTitles": ["CTO", "Chief Technology Officer"]
    },
    "behavioral": {
      "minEngagementScore": 60
    }
  },
  "contentPreferences": {
    "topics": ["healthcare IT", "patient data", "compliance"],
    "formats": ["technical guide", "case study"],
    "frequency": "bi-weekly"
  }
}
```

**Response:**

```json
{
  "success": true,
  "segment": {
    "id": "custom-healthcare-ctos",
    "name": "Healthcare CTOs",
    "description": "CTOs in healthcare organizations",
    "subscriberCount": 0,
    "engagementRate": 0,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### Get Segment Analytics

```http
GET /api/subscribers/segments/{segmentId}/analytics
```

**Response:**

```json
{
  "segmentId": "enterprise-executives",
  "analytics": {
    "subscriberCount": 245,
    "engagementRate": 0.34,
    "growthRate": 0.15,
    "topTopics": ["strategy", "leadership", "ROI"],
    "preferredFormats": ["executive summary", "case study"],
    "optimalSendTime": "9:00 AM Tuesday"
  }
}
```

### Monitoring and Alerts

#### Get Pipeline Status

```http
GET /api/monitoring/pipeline-status
```

**Response:**

```json
{
  "status": "healthy",
  "lastUpdated": "2024-01-15T10:00:00Z",
  "components": {
    "database": { "status": "healthy", "responseTime": 45 },
    "notionApi": { "status": "healthy", "responseTime": 234 },
    "deepseekApi": { "status": "healthy", "responseTime": 1234 },
    "braveSearchApi": { "status": "healthy", "responseTime": 567 },
    "emailService": { "status": "healthy", "responseTime": 123 }
  },
  "queues": {
    "article-processing": { "depth": 5, "processingRate": 15 },
    "newsletter-generation": { "depth": 2, "processingRate": 8 },
    "email-distribution": { "depth": 50, "processingRate": 25 }
  }
}
```

#### Get Active Alerts

```http
GET /api/monitoring/alerts
```

**Response:**

```json
{
  "alerts": [
    {
      "id": "alert-123",
      "type": "queue_depth_high",
      "severity": "medium",
      "message": "Queue 'email-distribution' depth exceeds threshold",
      "createdAt": "2024-01-15T09:55:00Z",
      "status": "active"
    }
  ]
}
```

#### Get Metrics Dashboard

```http
GET /api/monitoring/dashboard
```

**Response:**

```json
{
  "activeAlerts": 2,
  "healthStatus": "warning",
  "metrics": {
    "jobs": {
      "totalJobs": 1000,
      "completedJobs": 850,
      "failedJobs": 100,
      "failureRate": 0.1
    },
    "queues": {
      "totalDepth": 105,
      "averageProcessingRate": 16.5
    },
    "apis": {
      "deepseek": { "avgLatency": 45000, "errorRate": 0.05 },
      "braveSearch": { "avgLatency": 2000, "errorRate": 0.02 }
    }
  },
  "lastUpdated": "2024-01-15T10:00:00Z"
}
```

### Queue Management

#### Send Message to Queue

```http
POST /api/queues/{queueName}/send
```

**Request Body:**

```json
{
  "message": {
    "type": "article_generation",
    "payload": {
      "topic": "Cloud Security Best Practices",
      "targetAudience": "enterprise"
    }
  },
  "priority": "normal",
  "delay": 0
}
```

**Response:**

```json
{
  "success": true,
  "messageId": "msg_456789",
  "queueName": "article-processing",
  "estimatedProcessingTime": 120
}
```

#### Get Queue Status

```http
GET /api/queues/{queueName}/status
```

**Response:**

```json
{
  "queueName": "article-processing",
  "depth": 15,
  "processingRate": 12,
  "averageProcessingTime": 145,
  "lastProcessed": "2024-01-15T09:58:30Z",
  "status": "active"
}
```

### Webhooks

#### Newsletter Events

```http
POST /api/webhooks/newsletter
```

**Webhook Payload (Email Sent):**

```json
{
  "event": "email.sent",
  "data": {
    "campaignId": "campaign_123",
    "messageId": "msg_456",
    "recipient": "user@example.com",
    "subject": "Weekly Newsletter",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

**Webhook Payload (Email Opened):**

```json
{
  "event": "email.opened",
  "data": {
    "campaignId": "campaign_123",
    "messageId": "msg_456",
    "recipient": "user@example.com",
    "timestamp": "2024-01-15T10:05:00Z",
    "userAgent": "Mozilla/5.0..."
  }
}
```

#### Pipeline Events

```http
POST /api/webhooks/pipeline
```

**Webhook Payload (Job Completed):**

```json
{
  "event": "job.completed",
  "data": {
    "jobId": "job_article_456",
    "type": "article_generation",
    "duration": 195000,
    "result": {
      "title": "Generated Article Title",
      "wordCount": 1500
    },
    "timestamp": "2024-01-15T10:03:15Z"
  }
}
```

**Webhook Payload (Alert Triggered):**

```json
{
  "event": "alert.triggered",
  "data": {
    "alertId": "alert-123",
    "type": "queue_depth_high",
    "severity": "medium",
    "message": "Queue depth exceeds threshold",
    "timestamp": "2024-01-15T09:55:00Z"
  }
}
```

## WebSocket Endpoints

### Real-time Job Updates

```javascript
// Connect to job status WebSocket
const ws = new WebSocket('wss://containercode.club/api/ws/job/job_article_456');

// Listen for status updates
ws.onmessage = function(event) {
  const update = JSON.parse(event.data);
  console.log('Job update:', update);
};

// Example update message
{
  "type": "status_update",
  "jobId": "job_article_456",
  "status": "processing",
  "progress": 45,
  "message": "Generating article content",
  "timestamp": "2024-01-15T10:01:30Z"
}
```

### Real-time Pipeline Monitoring

```javascript
// Connect to pipeline monitoring WebSocket
const ws = new WebSocket('wss://containercode.club/api/ws/monitoring/pipeline');

// Listen for pipeline updates
ws.onmessage = function(event) {
  const update = JSON.parse(event.data);
  console.log('Pipeline update:', update);
};

// Example pipeline update
{
  "type": "metric_update",
  "component": "queue",
  "queueName": "article-processing",
  "depth": 12,
  "processingRate": 15,
  "timestamp": "2024-01-15T10:02:00Z"
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
const ContainerCodeAPI = require('@containercode/api-client');

const client = new ContainerCodeAPI({
  apiKey: 'your-api-key',
  baseUrl: 'https://containercode.club/api'
});

// Generate article
const job = await client.content.generateArticle({
  topic: 'AI in Enterprise Cloud Computing',
  targetAudience: 'enterprise',
  wordCount: 1500
});

// Poll for completion
const result = await client.jobs.waitForCompletion(job.jobId);
console.log('Article generated:', result.title);
```

### Python

```python
from containercode_api import ContainerCodeAPI

client = ContainerCodeAPI(
    api_key='your-api-key',
    base_url='https://containercode.club/api'
)

# Generate article
job = client.content.generate_article(
    topic='AI in Enterprise Cloud Computing',
    target_audience='enterprise',
    word_count=1500
)

# Wait for completion
result = client.jobs.wait_for_completion(job['jobId'])
print(f'Article generated: {result["title"]}')
```

### cURL Examples

```bash
# Subscribe to newsletter
curl -X POST https://containercode.club/api/newsletter-subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "preferences": {
      "topics": ["AI", "cloud"],
      "frequency": "weekly"
    }
  }'

# Generate article
curl -X POST https://containercode.club/api/content/generate-article \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "AI in Enterprise Cloud Computing",
    "targetAudience": "enterprise",
    "wordCount": 1500
  }'

# Check job status
curl -X GET https://containercode.club/api/jobs/job_article_456/status \
  -H "Authorization: Bearer your-api-key"
```

## Response Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **202 Accepted**: Request accepted for processing
- **400 Bad Request**: Invalid request parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **502 Bad Gateway**: External service error
- **503 Service Unavailable**: Service temporarily unavailable

## Common Error Codes

- **INVALID_REQUEST**: Malformed request
- **AUTHENTICATION_FAILED**: Invalid API key
- **RATE_LIMIT_EXCEEDED**: Too many requests
- **INSUFFICIENT_QUOTA**: API quota exceeded
- **VALIDATION_ERROR**: Request validation failed
- **RESOURCE_NOT_FOUND**: Requested resource not found
- **PROCESSING_ERROR**: Error during processing
- **EXTERNAL_SERVICE_ERROR**: Third-party service error
- **TIMEOUT_ERROR**: Request timeout
- **MAINTENANCE_MODE**: System under maintenance

## Testing

### Test Environment

```
https://test.containercode.club/api
```

### Test API Key

Contact support to obtain test API credentials.

### Postman Collection

Download the Postman collection: [ContainerCode API Collection](https://containercode.club/api/postman-collection.json)

### OpenAPI Specification

View the OpenAPI spec: [API Specification](https://containercode.club/api/openapi.json)

## Support

- **Documentation**: [https://docs.containercode.club](https://docs.containercode.club)
- **Support Email**: [support@containercode.club](mailto:support@containercode.club)
- **GitHub Issues**: [https://github.com/containercode/api-issues](https://github.com/containercode/api-issues)
- **Status Page**: [https://status.containercode.club](https://status.containercode.club)

## Changelog

### Version 1.0.0 (2024-01-15)

- Initial API release
- Newsletter subscription management
- AI-powered content generation
- Queue-based processing
- Real-time monitoring
- Subscriber segmentation
- WebSocket support

---

*Last updated: January 15, 2024*
