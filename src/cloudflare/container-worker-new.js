import { Container, getRandom, getClosest } from "@cloudflare/containers";

// Keep the old class export for migration compatibility
export class ContainerCodeApp {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request) {
    return new Response(JSON.stringify({
      message: 'Old container class deprecated - please use ContainerCodeAppAdvanced',
      timestamp: new Date().toISOString(),
      migration: 'Use ContainerCodeAppAdvanced for latest features'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Advanced Container class with latest Container APIs
export class ContainerCodeAppAdvanced extends Container {
  // Container configuration
  defaultPort = 8080;
  sleepAfter = "10m";
  manualStart = false;
  
  // Resource configuration
  memoryRequest = "256MB";
  cpuRequest = "0.5";
  instanceType = "standard"; // standard, large, xlarge
  
  // Health check configuration
  healthCheckPath = "/health";
  healthCheckInterval = 30000; // 30 seconds
  healthCheckTimeout = 5000; // 5 seconds
  healthCheckRetries = 3;
  
  // Load balancing configuration
  loadBalancingStrategy = "round_robin"; // round_robin, least_connections, weighted
  weights = { default: 100 };
  
  constructor(state, env) {
    super(state, env);
    this.sql = state.storage.sql;
    this.containerId = state.id.toString();
    this.startTime = Date.now();
    
    // Enhanced analytics and monitoring
    this.analytics = {
      requestCount: 0,
      errorCount: 0,
      totalResponseTime: 0,
      avgResponseTime: 0,
      healthStatus: 'healthy',
      lastHealthCheck: Date.now(),
      memoryUsage: 0,
      cpuUsage: 0,
      connectionCount: 0,
      lastActivity: Date.now(),
      uptime: 0
    };
    
    // Connection tracking
    this.connections = new Map();
    this.circuitBreaker = {
      isOpen: false,
      failureCount: 0,
      lastFailureTime: 0,
      threshold: 5,
      timeout: 30000 // 30 seconds
    };
    
    // Initialize container
    this.initializeContainer();
  }
  
  async initializeContainer() {
    try {
      // Initialize SQLite with advanced schema
      await this.initializeSQLite();
      
      // Set up health check alarm
      await this.setupHealthCheckAlarm();
      
      // Load persisted analytics
      await this.loadAnalytics();
      
      console.log(`Container ${this.containerId} initialized successfully`);
    } catch (error) {
      console.error('Container initialization failed:', error);
      this.analytics.healthStatus = 'unhealthy';
    }
  }
  
  async initializeSQLite() {
    if (this.sql) {
      await this.sql.exec(`
        CREATE TABLE IF NOT EXISTS analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          container_id TEXT NOT NULL,
          request_count INTEGER DEFAULT 0,
          error_count INTEGER DEFAULT 0,
          avg_response_time REAL DEFAULT 0,
          health_status TEXT DEFAULT 'healthy',
          memory_usage INTEGER DEFAULT 0,
          cpu_usage REAL DEFAULT 0,
          connection_count INTEGER DEFAULT 0,
          uptime INTEGER DEFAULT 0
        )
      `);
      
      await this.sql.exec(`
        CREATE TABLE IF NOT EXISTS health_checks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          container_id TEXT NOT NULL,
          status TEXT NOT NULL,
          response_time INTEGER,
          error_message TEXT
        )
      `);
      
      await this.sql.exec(`
        CREATE TABLE IF NOT EXISTS request_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          container_id TEXT NOT NULL,
          method TEXT NOT NULL,
          path TEXT NOT NULL,
          status INTEGER NOT NULL,
          response_time INTEGER,
          user_agent TEXT,
          ip_address TEXT
        )
      `);
    }
  }
  
  async setupHealthCheckAlarm() {
    try {
      // Set up recurring health check using Durable Object alarms
      const currentAlarm = await this.state.storage.getAlarm();
      if (!currentAlarm) {
        await this.state.storage.setAlarm(Date.now() + this.healthCheckInterval);
      }
    } catch (error) {
      console.error('Failed to setup health check alarm:', error);
    }
  }
  
  async loadAnalytics() {
    try {
      const storedAnalytics = await this.state.storage.get('analytics');
      if (storedAnalytics) {
        this.analytics = { ...this.analytics, ...storedAnalytics };
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }
  
  async saveAnalytics() {
    try {
      await this.state.storage.put('analytics', this.analytics);
      
      // Save to SQLite for persistence
      if (this.sql) {
        await this.sql.exec(`
          INSERT INTO analytics (
            container_id, request_count, error_count, avg_response_time,
            health_status, memory_usage, cpu_usage, connection_count, uptime
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          this.containerId,
          this.analytics.requestCount,
          this.analytics.errorCount,
          this.analytics.avgResponseTime,
          this.analytics.healthStatus,
          this.analytics.memoryUsage,
          this.analytics.cpuUsage,
          this.analytics.connectionCount,
          this.analytics.uptime
        ]);
      }
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }
  
  // Advanced health check implementation
  async performHealthCheck() {
    const startTime = Date.now();
    let healthStatus = 'healthy';
    let errorMessage = null;
    
    try {
      // Check memory usage
      const memoryInfo = process.memoryUsage();
      this.analytics.memoryUsage = memoryInfo.heapUsed;
      
      // Check if memory usage is too high (> 80% of available)
      const memoryLimit = this.getMemoryLimit();
      if (memoryInfo.heapUsed > memoryLimit * 0.8) {
        healthStatus = 'warning';
        errorMessage = 'High memory usage detected';
      }
      
      // Check error rate
      const errorRate = this.analytics.requestCount > 0 ? 
        (this.analytics.errorCount / this.analytics.requestCount) * 100 : 0;
      
      if (errorRate > 10) {
        healthStatus = 'unhealthy';
        errorMessage = `High error rate: ${errorRate.toFixed(2)}%`;
      }
      
      // Check circuit breaker status
      if (this.circuitBreaker.isOpen) {
        healthStatus = 'unhealthy';
        errorMessage = 'Circuit breaker is open';
      }
      
      // Update analytics
      this.analytics.healthStatus = healthStatus;
      this.analytics.lastHealthCheck = Date.now();
      this.analytics.uptime = Date.now() - this.startTime;
      
      // Log health check
      if (this.sql) {
        await this.sql.exec(`
          INSERT INTO health_checks (container_id, status, response_time, error_message)
          VALUES (?, ?, ?, ?)
        `, [this.containerId, healthStatus, Date.now() - startTime, errorMessage]);
      }
      
      return {
        status: healthStatus,
        timestamp: new Date().toISOString(),
        containerId: this.containerId,
        responseTime: Date.now() - startTime,
        memory: memoryInfo,
        uptime: this.analytics.uptime,
        requests: this.analytics.requestCount,
        errors: this.analytics.errorCount,
        errorRate: errorRate,
        circuitBreaker: this.circuitBreaker,
        errorMessage
      };
      
    } catch (error) {
      console.error('Health check failed:', error);
      this.analytics.healthStatus = 'unhealthy';
      
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        containerId: this.containerId,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }
  
  getMemoryLimit() {
    // Return memory limit based on instance type
    switch (this.instanceType) {
      case 'standard': return 256 * 1024 * 1024; // 256MB
      case 'large': return 512 * 1024 * 1024; // 512MB
      case 'xlarge': return 1024 * 1024 * 1024; // 1GB
      default: return 256 * 1024 * 1024;
    }
  }
  
  // Circuit breaker implementation
  async checkCircuitBreaker() {
    const now = Date.now();
    
    if (this.circuitBreaker.isOpen) {
      // Check if timeout has passed
      if (now - this.circuitBreaker.lastFailureTime > this.circuitBreaker.timeout) {
        this.circuitBreaker.isOpen = false;
        this.circuitBreaker.failureCount = 0;
        console.log(`Circuit breaker closed for container ${this.containerId}`);
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
  }
  
  async recordFailure() {
    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailureTime = Date.now();
    
    if (this.circuitBreaker.failureCount >= this.circuitBreaker.threshold) {
      this.circuitBreaker.isOpen = true;
      console.log(`Circuit breaker opened for container ${this.containerId}`);
    }
  }
  
  async recordSuccess() {
    this.circuitBreaker.failureCount = 0;
  }
  
  // Connection tracking
  trackConnection(connectionId, request) {
    this.connections.set(connectionId, {
      startTime: Date.now(),
      request: {
        method: request.method,
        url: request.url,
        userAgent: request.headers.get('User-Agent'),
        ip: request.headers.get('CF-Connecting-IP')
      }
    });
    this.analytics.connectionCount = this.connections.size;
  }
  
  untrackConnection(connectionId) {
    this.connections.delete(connectionId);
    this.analytics.connectionCount = this.connections.size;
  }
  
  // Enhanced request logging
  async logRequest(request, response, responseTime, connectionId) {
    try {
      if (this.sql) {
        await this.sql.exec(`
          INSERT INTO request_logs (
            container_id, method, path, status, response_time, user_agent, ip_address
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          this.containerId,
          request.method,
          new URL(request.url).pathname,
          response.status,
          responseTime,
          request.headers.get('User-Agent'),
          request.headers.get('CF-Connecting-IP')
        ]);
      }
    } catch (error) {
      console.error('Failed to log request:', error);
    }
  }
  
  async fetch(request) {
    const url = new URL(request.url);
    
    try {
      // Extract routing information from headers
      const sessionId = request.headers.get('X-Container-Session') || 'default';
      const routingMode = request.headers.get('X-Routing-Mode') || 'default';
      const originalPath = request.headers.get('X-Original-Path') || url.pathname;
      
      // Increment request count
      this.analytics.requestCount++;
      
      // Handle different endpoints
      if (originalPath.startsWith('/health')) {
        return new Response(JSON.stringify({
          status: 'healthy',
          containerId: sessionId,
          routingMode: routingMode,
          timestamp: new Date().toISOString(),
          uptime: Date.now() - this.analytics.startTime,
          requests: this.analytics.requestCount,
          memory: process.memoryUsage ? process.memoryUsage() : null,
          port: this.defaultPort,
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Container-Session': sessionId,
            'X-Routing-Mode': routingMode,
          }
        });
      }
      
      if (originalPath.startsWith('/api/analytics')) {
        return new Response(JSON.stringify({
          analytics: this.analytics,
          containerId: sessionId,
          routingMode: routingMode,
          timestamp: new Date().toISOString(),
        }), {
          headers: {
            'Content-Type': 'application/json',
            'X-Container-Session': sessionId,
            'X-Routing-Mode': routingMode,
          }
        });
      }
      
      // Default response for all other paths
      return new Response(JSON.stringify({
        message: 'Container Service Active',
        containerId: sessionId,
        routingMode: routingMode,
        path: originalPath,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.analytics.startTime,
        requests: this.analytics.requestCount,
        port: this.defaultPort,
      }), {
        headers: {
          'Content-Type': 'application/json',
          'X-Container-Session': sessionId,
          'X-Routing-Mode': routingMode,
        }
      });
      
    } catch (error) {
      console.error('Container processing error:', error);
      
      return new Response(JSON.stringify({
        error: 'Container Processing Error',
        message: error.message,
        timestamp: new Date().toISOString(),
        containerId: sessionId,
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Error-Source': 'container-instance'
        }
      });
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    try {
      // Parse request for session or container routing
      let sessionId = 'default';
      let routingMode = 'default';
      
      // Check for session ID in headers or query params
      if (request.headers.get('X-Session-ID')) {
        sessionId = request.headers.get('X-Session-ID');
      } else if (url.searchParams.get('session')) {
        sessionId = url.searchParams.get('session');
      }
      
      // Determine routing mode from path
      if (url.pathname.startsWith('/container/')) {
        sessionId = url.pathname.split('/')[2] || 'default';
        routingMode = 'named';
      } else if (url.pathname.startsWith('/lb')) {
        sessionId = `lb-${Math.floor(Math.random() * 3)}`;
        routingMode = 'load-balanced';
      } else if (url.pathname.startsWith('/singleton')) {
        sessionId = 'singleton';
        routingMode = 'singleton';
      } else if (url.pathname.startsWith('/health') || url.pathname.startsWith('/api/')) {
        sessionId = 'api';
        routingMode = 'api';
      }
      
      // Get the container instance from the binding
      const containerBinding = env.CONTAINER_CODE_APP_SQLITE;
      if (!containerBinding) {
        throw new Error('Container binding not found');
      }
      
      // Create ID for the container instance
      const id = containerBinding.idFromName(sessionId);
      const containerInstance = containerBinding.get(id);
      
      // Add routing metadata to request headers
      const modifiedRequest = new Request(request, {
        headers: {
          ...request.headers,
          'X-Container-Session': sessionId,
          'X-Routing-Mode': routingMode,
          'X-Original-Path': url.pathname,
          'X-Worker-Timestamp': Date.now().toString(),
        }
      });
      
      // Pass the request to the container instance
      return await containerInstance.fetch(modifiedRequest);
      
    } catch (error) {
      console.error('Container routing error:', error);
      
      // Fallback response with error details
      return new Response(JSON.stringify({
        error: 'Container Service Error',
        message: error.message,
        timestamp: new Date().toISOString(),
        path: url.pathname,
        method: request.method,
        binding: env.CONTAINER_CODE_APP_SQLITE ? 'found' : 'not found',
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'X-Error-Source': 'container-worker'
        }
      });
    }
  }
};