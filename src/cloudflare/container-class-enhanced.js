/**
 * Enhanced Container Class with Unified SQLite Integration
 * Integrates analytics, request counters, user sessions, and stateful computations
 * Maintains coherent D1 migrations, KV bindings, and R2 references
 */

import { Container } from '@cloudflare/containers';
import { ContainerSQLiteManager } from './container-sqlite.js';

export class ContainerCodeAppEnhanced extends Container {
  constructor(state, env) {
    super(state, env);
    this.state = state;
    this.env = env;
    this.containerId = state.id.toString();
    this.startTime = Date.now();
    
    // Initialize SQLite manager
    this.sqliteManager = new ContainerSQLiteManager(state.storage.sql, this.containerId);
    
    // Analytics and metrics
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      avgResponseTime: 0,
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      connectionCount: 0
    };
    
    // Session management
    this.sessions = new Map();
    this.sessionCleanupInterval = 300000; // 5 minutes
    
    // Circuit breaker
    this.circuitBreaker = {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: 0,
      threshold: 5,
      timeout: 30000
    };
    
    // Rate limiting
    this.rateLimiter = {
      requests: new Map(),
      maxRequests: 100,
      windowMs: 60000 // 1 minute
    };
    
    // Initialize container
    this.initialize();
  }
  
  async initialize() {
    try {
      // Initialize SQLite database
      await this.sqliteManager.initialize();
      
      // Set up periodic cleanup
      this.setupCleanupSchedule();
      
      // Load existing sessions
      await this.loadActiveSessions();
      
      // Set up health check alarm
      await this.setupHealthCheckAlarm();
      
      console.log(`Enhanced container ${this.containerId} initialized successfully`);
    } catch (error) {
      console.error('Container initialization failed:', error);
      throw error;
    }
  }
  
  async setupCleanupSchedule() {
    // Set up periodic cleanup using Durable Object alarms
    try {
      const cleanupTime = Date.now() + (60 * 60 * 1000); // 1 hour
      await this.state.storage.setAlarm(cleanupTime);
    } catch (error) {
      console.error('Failed to setup cleanup schedule:', error);
    }
  }
  
  async loadActiveSessions() {
    try {
      // Load active sessions from SQLite
      const stmt = this.sqliteManager.sql.prepare(`
        SELECT session_id, session_data FROM user_sessions 
        WHERE container_id = ? AND is_active = 1 AND expires_at > CURRENT_TIMESTAMP
      `);
      
      const sessions = await stmt.bind(this.containerId).all();
      
      for (const session of sessions.results) {
        const sessionData = session.session_data ? JSON.parse(session.session_data) : {};
        this.sessions.set(session.session_id, {
          ...sessionData,
          lastActivity: new Date()
        });
      }
      
      console.log(`Loaded ${sessions.results.length} active sessions`);
    } catch (error) {
      console.error('Failed to load active sessions:', error);
    }
  }
  
  async setupHealthCheckAlarm() {
    try {
      const healthCheckTime = Date.now() + 30000; // 30 seconds
      await this.state.storage.setAlarm(healthCheckTime);
    } catch (error) {
      console.error('Failed to setup health check alarm:', error);
    }
  }
  
  // Durable Object alarm handler
  async alarm() {
    try {
      // Run health check
      await this.performHealthCheck();
      
      // Clean up expired data
      await this.cleanup();
      
      // Process pending computations
      await this.processPendingComputations();
      
      // Schedule next alarm
      await this.setupHealthCheckAlarm();
    } catch (error) {
      console.error('Alarm handler failed:', error);
    }
  }
  
  async performHealthCheck() {
    const startTime = Date.now();
    
    try {
      // Update metrics
      this.metrics.uptime = Date.now() - this.startTime;
      this.metrics.avgResponseTime = this.metrics.requestCount > 0 ? 
        this.metrics.totalResponseTime / this.metrics.requestCount : 0;
      
      // Get memory usage
      this.metrics.memoryUsage = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
      
      // Determine health status
      const errorRate = this.metrics.requestCount > 0 ? 
        (this.metrics.errorCount / this.metrics.requestCount) * 100 : 0;
      
      let healthStatus = 'healthy';
      if (errorRate > 10) healthStatus = 'unhealthy';
      else if (errorRate > 5) healthStatus = 'warning';
      if (this.circuitBreaker.isOpen) healthStatus = 'unhealthy';
      
      // Record health check
      await this.sqliteManager.recordHealthCheck({
        healthStatus,
        memoryUsage: this.metrics.memoryUsage,
        cpuUsage: this.metrics.cpuUsage,
        connectionCount: this.metrics.connectionCount,
        uptime: this.metrics.uptime,
        requestCount: this.metrics.requestCount,
        errorCount: this.metrics.errorCount,
        responseTimeAvg: this.metrics.avgResponseTime,
        circuitBreakerOpen: this.circuitBreaker.isOpen,
        lastError: this.lastError,
        metadata: {
          errorRate,
          sessionCount: this.sessions.size,
          rateLimitHits: this.rateLimiter.requests.size
        }
      });
      
      console.log(`Health check completed in ${Date.now() - startTime}ms - Status: ${healthStatus}`);
    } catch (error) {
      console.error('Health check failed:', error);
      this.lastError = error.message;
    }
  }
  
  async cleanup() {
    try {
      // Clean up SQLite data
      await this.sqliteManager.cleanup();
      
      // Clean up expired sessions
      await this.cleanupExpiredSessions();
      
      // Clean up rate limiter
      this.cleanupRateLimiter();
      
      console.log('Container cleanup completed');
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
  
  async cleanupExpiredSessions() {
    const now = Date.now();
    const expiredSessions = [];
    
    for (const [sessionId, session] of this.sessions) {
      if (session.expiresAt && session.expiresAt < now) {
        expiredSessions.push(sessionId);
      }
    }
    
    for (const sessionId of expiredSessions) {
      this.sessions.delete(sessionId);
    }
    
    if (expiredSessions.length > 0) {
      console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }
  
  cleanupRateLimiter() {
    const now = Date.now();
    const expiredEntries = [];
    
    for (const [key, data] of this.rateLimiter.requests) {
      if (now - data.windowStart > this.rateLimiter.windowMs) {
        expiredEntries.push(key);
      }
    }
    
    for (const key of expiredEntries) {
      this.rateLimiter.requests.delete(key);
    }
  }
  
  async processPendingComputations() {
    try {
      const pendingComputations = await this.sqliteManager.getPendingComputations();
      
      for (const computation of pendingComputations) {
        if (computation.status === 'pending') {
          await this.processComputation(computation);
        }
      }
    } catch (error) {
      console.error('Failed to process pending computations:', error);
    }
  }
  
  async processComputation(computation) {
    try {
      // Mark as running
      await this.sqliteManager.updateComputation(computation.computation_id, {
        status: 'running',
        started_at: new Date().toISOString(),
        progress: 0.1
      });
      
      // Process based on computation type
      let result;
      switch (computation.computation_type) {
        case 'analytics_aggregation':
          result = await this.processAnalyticsAggregation(computation);
          break;
        case 'session_analysis':
          result = await this.processSessionAnalysis(computation);
          break;
        case 'performance_report':
          result = await this.processPerformanceReport(computation);
          break;
        default:
          throw new Error(`Unknown computation type: ${computation.computation_type}`);
      }
      
      // Mark as completed
      await this.sqliteManager.updateComputation(computation.computation_id, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress: 1.0,
        output_data: JSON.stringify(result)
      });
      
    } catch (error) {
      console.error(`Computation ${computation.computation_id} failed:`, error);
      
      // Mark as failed and increment retry count
      await this.sqliteManager.updateComputation(computation.computation_id, {
        status: 'failed',
        error_message: error.message,
        retry_count: computation.retry_count + 1
      });
      
      // Reschedule if retries remaining
      if (computation.retry_count < computation.max_retries) {
        await this.sqliteManager.updateComputation(computation.computation_id, {
          status: 'pending'
        });
      }
    }
  }
  
  async processAnalyticsAggregation(computation) {
    // Aggregate analytics data
    const filters = computation.input_data.filters || {};
    const analytics = await this.sqliteManager.getAnalytics(filters);
    
    // Perform aggregation
    const aggregation = {
      totalEvents: analytics.results.length,
      uniqueUsers: new Set(analytics.results.map(a => a.user_id)).size,
      uniqueSessions: new Set(analytics.results.map(a => a.session_id)).size,
      eventTypes: {},
      deviceTypes: {},
      browsers: {},
      countries: {}
    };
    
    for (const event of analytics.results) {
      aggregation.eventTypes[event.event_type] = (aggregation.eventTypes[event.event_type] || 0) + 1;
      if (event.device_type) aggregation.deviceTypes[event.device_type] = (aggregation.deviceTypes[event.device_type] || 0) + 1;
      if (event.browser) aggregation.browsers[event.browser] = (aggregation.browsers[event.browser] || 0) + 1;
      if (event.country) aggregation.countries[event.country] = (aggregation.countries[event.country] || 0) + 1;
    }
    
    return aggregation;
  }
  
  async processSessionAnalysis(computation) {
    // Analyze session data
    const sessionStats = await this.sqliteManager.sql.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(page_views) as avg_page_views,
        AVG(events_count) as avg_events,
        AVG(julianday('now') - julianday(created_at)) * 24 * 60 as avg_duration_minutes
      FROM user_sessions 
      WHERE container_id = ? AND created_at >= datetime('now', '-1 day')
    `).bind(this.containerId).first();
    
    return sessionStats;
  }
  
  async processPerformanceReport(computation) {
    // Generate performance report
    const timeframe = computation.input_data.timeframe || '24h';
    const requestStats = await this.sqliteManager.getRequestStats(timeframe);
    
    return {
      timeframe,
      requestStats,
      containerMetrics: this.metrics,
      generatedAt: new Date().toISOString()
    };
  }
  
  // Rate limiting
  async checkRateLimit(identifier) {
    const now = Date.now();
    const key = `${identifier}`;
    
    if (!this.rateLimiter.requests.has(key)) {
      this.rateLimiter.requests.set(key, {
        count: 1,
        windowStart: now
      });
      return { allowed: true, remaining: this.rateLimiter.maxRequests - 1 };
    }
    
    const entry = this.rateLimiter.requests.get(key);
    
    // Reset window if expired
    if (now - entry.windowStart > this.rateLimiter.windowMs) {
      entry.count = 1;
      entry.windowStart = now;
      return { allowed: true, remaining: this.rateLimiter.maxRequests - 1 };
    }
    
    // Check if rate limit exceeded
    if (entry.count >= this.rateLimiter.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: entry.windowStart + this.rateLimiter.windowMs };
    }
    
    entry.count++;
    return { allowed: true, remaining: this.rateLimiter.maxRequests - entry.count };
  }
  
  // Session management
  async createSession(sessionData) {
    const sessionId = sessionData.sessionId || this.generateSessionId();
    const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString(); // 24 hours
    
    const session = {
      sessionId,
      userId: sessionData.userId,
      expiresAt,
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      deviceFingerprint: sessionData.deviceFingerprint,
      country: sessionData.country,
      city: sessionData.city,
      utmSource: sessionData.utmSource,
      utmMedium: sessionData.utmMedium,
      utmCampaign: sessionData.utmCampaign,
      initialReferrer: sessionData.initialReferrer,
      sessionData: sessionData.sessionData || {}
    };
    
    // Store in SQLite
    await this.sqliteManager.createSession(session);
    
    // Store in memory
    this.sessions.set(sessionId, {
      ...session,
      lastActivity: new Date()
    });
    
    return sessionId;
  }
  
  async getSession(sessionId) {
    // Check memory first
    const memorySession = this.sessions.get(sessionId);
    if (memorySession) {
      return memorySession;
    }
    
    // Check SQLite
    const session = await this.sqliteManager.getSession(sessionId);
    if (session) {
      this.sessions.set(sessionId, {
        ...session,
        lastActivity: new Date()
      });
      return session;
    }
    
    return null;
  }
  
  async updateSession(sessionId, updates) {
    // Update SQLite
    await this.sqliteManager.updateSession(sessionId, updates);
    
    // Update memory
    const memorySession = this.sessions.get(sessionId);
    if (memorySession) {
      Object.assign(memorySession, updates);
      memorySession.lastActivity = new Date();
    }
  }
  
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Main fetch handler
  async fetch(request) {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    // Extract request metadata
    const sessionId = request.headers.get('X-Session-ID') || this.extractSessionFromCookie(request);
    const ipAddress = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For');
    const userAgent = request.headers.get('User-Agent');
    const country = request.headers.get('CF-IPCountry');
    
    // Rate limiting
    const rateLimitCheck = await this.checkRateLimit(ipAddress);
    if (!rateLimitCheck.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        resetTime: rateLimitCheck.resetTime
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitCheck.resetTime.toString()
        }
      });
    }
    
    let response;
    let statusCode = 200;
    
    try {
      // Handle different endpoints
      if (url.pathname === '/health') {
        response = await this.handleHealthCheck(request);
      } else if (url.pathname.startsWith('/api/analytics')) {
        response = await this.handleAnalyticsAPI(request);
      } else if (url.pathname.startsWith('/api/sessions')) {
        response = await this.handleSessionAPI(request);
      } else if (url.pathname.startsWith('/api/computations')) {
        response = await this.handleComputationAPI(request);
      } else if (url.pathname.startsWith('/api/metrics')) {
        response = await this.handleMetricsAPI(request);
      } else {
        response = await this.handleDefaultRequest(request);
      }
      
      statusCode = response.status;
      
    } catch (error) {
      console.error('Request handling failed:', error);
      this.metrics.errorCount++;
      this.lastError = error.message;
      
      statusCode = 500;
      response = new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update metrics
    this.metrics.requestCount++;
    const responseTime = Date.now() - startTime;
    this.metrics.totalResponseTime += responseTime;
    this.metrics.avgResponseTime = this.metrics.totalResponseTime / this.metrics.requestCount;
    
    // Log request
    await this.logRequest({
      endpoint: url.pathname,
      method: request.method,
      statusCode,
      responseTime,
      bytesSent: parseInt(response.headers.get('content-length') || '0'),
      bytesReceived: parseInt(request.headers.get('content-length') || '0'),
      userAgent,
      ipAddress,
      sessionId,
      rateLimitRemaining: rateLimitCheck.remaining,
      cacheHit: response.headers.get('x-cache') === 'HIT',
      errorType: statusCode >= 400 ? 'http_error' : null,
      errorDetails: statusCode >= 400 ? response.statusText : null
    });
    
    // Add headers
    response.headers.set('X-Container-ID', this.containerId);
    response.headers.set('X-Response-Time', responseTime.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitCheck.remaining.toString());
    
    return response;
  }
  
  async handleHealthCheck(request) {
    const health = await this.sqliteManager.getContainerHealth();
    
    return new Response(JSON.stringify({
      status: health?.health_status || 'healthy',
      containerId: this.containerId,
      timestamp: new Date().toISOString(),
      uptime: this.metrics.uptime,
      metrics: this.metrics,
      sessions: this.sessions.size,
      circuitBreaker: this.circuitBreaker,
      rateLimiter: {
        activeEntries: this.rateLimiter.requests.size,
        maxRequests: this.rateLimiter.maxRequests
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async handleAnalyticsAPI(request) {
    const url = new URL(request.url);
    const method = request.method;
    
    if (method === 'POST' && url.pathname === '/api/analytics/track') {
      const eventData = await request.json();
      await this.trackEvent(eventData);
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (method === 'GET' && url.pathname === '/api/analytics/data') {
      const filters = Object.fromEntries(url.searchParams.entries());
      const analytics = await this.sqliteManager.getAnalytics(filters);
      return new Response(JSON.stringify(analytics), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
  
  async handleSessionAPI(request) {
    const url = new URL(request.url);
    const method = request.method;
    
    if (method === 'POST' && url.pathname === '/api/sessions/create') {
      const sessionData = await request.json();
      const sessionId = await this.createSession(sessionData);
      return new Response(JSON.stringify({ sessionId }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (method === 'GET' && url.pathname.startsWith('/api/sessions/')) {
      const sessionId = url.pathname.split('/').pop();
      const session = await this.getSession(sessionId);
      return new Response(JSON.stringify(session), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
  
  async handleComputationAPI(request) {
    const url = new URL(request.url);
    const method = request.method;
    
    if (method === 'POST' && url.pathname === '/api/computations/create') {
      const computationData = await request.json();
      computationData.computationId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await this.sqliteManager.createComputation(computationData);
      return new Response(JSON.stringify({ computationId: computationData.computationId }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (method === 'GET' && url.pathname.startsWith('/api/computations/')) {
      const computationId = url.pathname.split('/').pop();
      const computation = await this.sqliteManager.getComputation(computationId);
      return new Response(JSON.stringify(computation), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
  
  async handleMetricsAPI(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/metrics/stats') {
      const timeframe = url.searchParams.get('timeframe') || '1h';
      const requestStats = await this.sqliteManager.getRequestStats(timeframe);
      const dbStats = await this.sqliteManager.getDatabaseStats();
      
      return new Response(JSON.stringify({
        container: this.metrics,
        requests: requestStats,
        database: dbStats,
        sessions: this.sessions.size,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
  
  async handleDefaultRequest(request) {
    return new Response(JSON.stringify({
      message: 'Enhanced Container Service Active',
      containerId: this.containerId,
      timestamp: new Date().toISOString(),
      uptime: this.metrics.uptime,
      version: '2.0.0'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  async trackEvent(eventData) {
    // Enrich event data
    const enrichedData = {
      ...eventData,
      containerId: this.containerId,
      timestamp: new Date().toISOString(),
      processingTime: Date.now()
    };
    
    // Store in SQLite
    await this.sqliteManager.trackEvent(enrichedData);
    
    // Record metric
    await this.sqliteManager.recordMetric({
      metricType: 'event',
      metricName: eventData.eventType,
      metricValue: eventData.eventValue || 1,
      unit: 'count',
      tags: {
        category: eventData.eventCategory,
        action: eventData.eventAction,
        label: eventData.eventLabel
      },
      sessionId: eventData.sessionId,
      userId: eventData.userId
    });
  }
  
  async logRequest(requestData) {
    await this.sqliteManager.logRequest(requestData);
  }
  
  extractSessionFromCookie(request) {
    const cookie = request.headers.get('Cookie');
    if (!cookie) return null;
    
    const sessionMatch = cookie.match(/session=([^;]+)/);
    return sessionMatch ? sessionMatch[1] : null;
  }
  
  // KV and R2 integration helpers
  async withKVLogging(binding, operation, keyName, fn) {
    const startTime = Date.now();
    let success = true;
    let errorMessage = null;
    let result = null;
    
    try {
      result = await fn();
    } catch (error) {
      success = false;
      errorMessage = error.message;
      throw error;
    } finally {
      await this.sqliteManager.logKVOperation({
        bindingName: binding,
        keyName,
        operation,
        success,
        errorMessage,
        metadata: {
          duration: Date.now() - startTime
        }
      });
    }
    
    return result;
  }
  
  async withR2Logging(referenceId, bucketName, objectKey, operation, fn) {
    const startTime = Date.now();
    let result = null;
    
    try {
      result = await fn();
      
      // Create R2 reference if successful
      if (result && operation === 'get') {
        await this.sqliteManager.createR2Reference({
          referenceId,
          bucketName,
          objectKey,
          operation,
          contentType: result.headers?.get('content-type'),
          contentLength: result.headers?.get('content-length'),
          etag: result.headers?.get('etag'),
          lastModified: result.headers?.get('last-modified'),
          metadata: {
            duration: Date.now() - startTime
          }
        });
      }
      
      // Update access count
      if (operation === 'get') {
        await this.sqliteManager.updateR2Access(referenceId);
      }
      
    } catch (error) {
      console.error(`R2 ${operation} failed:`, error);
      throw error;
    }
    
    return result;
  }
}
