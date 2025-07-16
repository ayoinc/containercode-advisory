/**
 * Container-based SQLite Database Implementation
 * Unified analytics, request counters, user sessions, and stateful computations
 * Ensures coherent D1 migrations, KV bindings, and R2 references
 */

export class ContainerSQLiteManager {
  constructor(sql, containerId) {
    this.sql = sql;
    this.containerId = containerId;
    this.initialized = false;
    this.schemaVersion = '1.0.0';
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Initialize all tables with proper schema
      await this.createTables();
      await this.createIndexes();
      await this.runMigrations();
      
      this.initialized = true;
      console.log(`Container SQLite initialized for container ${this.containerId}`);
    } catch (error) {
      console.error('Failed to initialize Container SQLite:', error);
      throw error;
    }
  }

  async createTables() {
    // Analytics table - unified event tracking
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        container_id TEXT NOT NULL,
        session_id TEXT,
        user_id TEXT,
        event_type TEXT NOT NULL,
        event_category TEXT,
        event_action TEXT,
        event_label TEXT,
        event_value INTEGER,
        page_url TEXT,
        referrer TEXT,
        user_agent TEXT,
        ip_address TEXT,
        device_type TEXT,
        browser TEXT,
        os TEXT,
        country TEXT,
        custom_data TEXT, -- JSON
        processing_time INTEGER,
        error_message TEXT
      )
    `);

    // Request counters table - track API usage and performance
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS request_counters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        container_id TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        status_code INTEGER NOT NULL,
        response_time INTEGER,
        bytes_sent INTEGER,
        bytes_received INTEGER,
        user_agent TEXT,
        ip_address TEXT,
        session_id TEXT,
        rate_limit_remaining INTEGER,
        cache_hit BOOLEAN DEFAULT 0,
        error_type TEXT,
        error_details TEXT
      )
    `);

    // User sessions table - comprehensive session management
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        user_id TEXT,
        container_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        ip_address TEXT,
        user_agent TEXT,
        device_fingerprint TEXT,
        country TEXT,
        city TEXT,
        is_active BOOLEAN DEFAULT 1,
        page_views INTEGER DEFAULT 0,
        events_count INTEGER DEFAULT 0,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        conversion_events TEXT, -- JSON array
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        initial_referrer TEXT,
        session_data TEXT -- JSON
      )
    `);

    // Stateful computations table - for complex operations
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS stateful_computations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        computation_id TEXT UNIQUE NOT NULL,
        container_id TEXT NOT NULL,
        computation_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, running, completed, failed
        input_data TEXT, -- JSON
        output_data TEXT, -- JSON
        progress REAL DEFAULT 0.0,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        timeout_at DATETIME,
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        priority INTEGER DEFAULT 1,
        metadata TEXT -- JSON
      )
    `);

    // D1 migration tracking table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS d1_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        migration_name TEXT UNIQUE NOT NULL,
        container_id TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'completed',
        error_message TEXT,
        schema_version TEXT,
        rollback_sql TEXT
      )
    `);

    // KV bindings state table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS kv_bindings_state (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        binding_name TEXT NOT NULL,
        container_id TEXT NOT NULL,
        key_name TEXT NOT NULL,
        operation TEXT NOT NULL, -- get, put, delete, list
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN DEFAULT 1,
        error_message TEXT,
        metadata TEXT -- JSON
      )
    `);

    // R2 references table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS r2_references (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference_id TEXT UNIQUE NOT NULL,
        container_id TEXT NOT NULL,
        bucket_name TEXT NOT NULL,
        object_key TEXT NOT NULL,
        operation TEXT NOT NULL, -- get, put, delete, list
        content_type TEXT,
        content_length INTEGER,
        etag TEXT,
        last_modified DATETIME,
        metadata TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        access_count INTEGER DEFAULT 0,
        last_accessed DATETIME
      )
    `);

    // Performance metrics table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        container_id TEXT NOT NULL,
        metric_type TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        metric_value REAL NOT NULL,
        unit TEXT,
        tags TEXT, -- JSON
        session_id TEXT,
        user_id TEXT
      )
    `);

    // Container health table
    await this.sql.exec(`
      CREATE TABLE IF NOT EXISTS container_health (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        container_id TEXT NOT NULL,
        health_status TEXT NOT NULL,
        memory_usage INTEGER,
        cpu_usage REAL,
        connection_count INTEGER,
        uptime INTEGER,
        request_count INTEGER,
        error_count INTEGER,
        response_time_avg REAL,
        circuit_breaker_open BOOLEAN DEFAULT 0,
        last_error TEXT,
        metadata TEXT -- JSON
      )
    `);
  }

  async createIndexes() {
    // Analytics indexes
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_analytics_container_id ON analytics(container_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)');

    // Request counters indexes
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_request_counters_container_id ON request_counters(container_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_request_counters_endpoint ON request_counters(endpoint)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_request_counters_timestamp ON request_counters(timestamp)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_request_counters_status ON request_counters(status_code)');

    // User sessions indexes
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_user_sessions_container_id ON user_sessions(container_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity)');

    // Stateful computations indexes
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_stateful_computations_computation_id ON stateful_computations(computation_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_stateful_computations_container_id ON stateful_computations(container_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_stateful_computations_status ON stateful_computations(status)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_stateful_computations_type ON stateful_computations(computation_type)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_stateful_computations_created_at ON stateful_computations(created_at)');

    // R2 references indexes
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_r2_references_reference_id ON r2_references(reference_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_r2_references_container_id ON r2_references(container_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_r2_references_bucket_name ON r2_references(bucket_name)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_r2_references_object_key ON r2_references(object_key)');

    // Performance metrics indexes
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_performance_metrics_container_id ON performance_metrics(container_id)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp)');
    await this.sql.exec('CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type)');
  }

  async runMigrations() {
    // Check if migrations have been run
    const migrationCheck = await this.sql.prepare(
      'SELECT COUNT(*) as count FROM d1_migrations WHERE migration_name = ?'
    ).bind('initial_schema_v1.0.0').first();

    if (migrationCheck.count === 0) {
      await this.sql.exec(`
        INSERT INTO d1_migrations (migration_name, container_id, schema_version)
        VALUES ('initial_schema_v1.0.0', ?, ?)
      `, [this.containerId, this.schemaVersion]);
    }
  }

  // Analytics methods
  async trackEvent(eventData) {
    const stmt = this.sql.prepare(`
      INSERT INTO analytics (
        container_id, session_id, user_id, event_type, event_category,
        event_action, event_label, event_value, page_url, referrer,
        user_agent, ip_address, device_type, browser, os, country,
        custom_data, processing_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      this.containerId,
      eventData.sessionId,
      eventData.userId,
      eventData.eventType,
      eventData.eventCategory,
      eventData.eventAction,
      eventData.eventLabel,
      eventData.eventValue,
      eventData.pageUrl,
      eventData.referrer,
      eventData.userAgent,
      eventData.ipAddress,
      eventData.deviceType,
      eventData.browser,
      eventData.os,
      eventData.country,
      JSON.stringify(eventData.customData || {}),
      eventData.processingTime
    ).run();
  }

  async getAnalytics(filters = {}) {
    let query = 'SELECT * FROM analytics WHERE container_id = ?';
    const params = [this.containerId];

    if (filters.sessionId) {
      query += ' AND session_id = ?';
      params.push(filters.sessionId);
    }

    if (filters.eventType) {
      query += ' AND event_type = ?';
      params.push(filters.eventType);
    }

    if (filters.startDate) {
      query += ' AND timestamp >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND timestamp <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY timestamp DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const stmt = this.sql.prepare(query);
    return await stmt.bind(...params).all();
  }

  // Request counter methods
  async logRequest(requestData) {
    const stmt = this.sql.prepare(`
      INSERT INTO request_counters (
        container_id, endpoint, method, status_code, response_time,
        bytes_sent, bytes_received, user_agent, ip_address, session_id,
        rate_limit_remaining, cache_hit, error_type, error_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      this.containerId,
      requestData.endpoint,
      requestData.method,
      requestData.statusCode,
      requestData.responseTime,
      requestData.bytesSent,
      requestData.bytesReceived,
      requestData.userAgent,
      requestData.ipAddress,
      requestData.sessionId,
      requestData.rateLimitRemaining,
      requestData.cacheHit ? 1 : 0,
      requestData.errorType,
      requestData.errorDetails
    ).run();
  }

  async getRequestStats(timeframe = '1h') {
    const timeframeMap = {
      '1h': "datetime('now', '-1 hour')",
      '24h': "datetime('now', '-1 day')",
      '7d': "datetime('now', '-7 days')",
      '30d': "datetime('now', '-30 days')"
    };

    const stmt = this.sql.prepare(`
      SELECT 
        COUNT(*) as total_requests,
        AVG(response_time) as avg_response_time,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count,
        COUNT(CASE WHEN cache_hit = 1 THEN 1 END) as cache_hits,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM request_counters 
      WHERE container_id = ? 
        AND timestamp >= ${timeframeMap[timeframe] || timeframeMap['1h']}
    `);

    return await stmt.bind(this.containerId).first();
  }

  // User session methods
  async createSession(sessionData) {
    const stmt = this.sql.prepare(`
      INSERT INTO user_sessions (
        session_id, user_id, container_id, expires_at, ip_address,
        user_agent, device_fingerprint, country, city, utm_source,
        utm_medium, utm_campaign, initial_referrer, session_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      sessionData.sessionId,
      sessionData.userId,
      this.containerId,
      sessionData.expiresAt,
      sessionData.ipAddress,
      sessionData.userAgent,
      sessionData.deviceFingerprint,
      sessionData.country,
      sessionData.city,
      sessionData.utmSource,
      sessionData.utmMedium,
      sessionData.utmCampaign,
      sessionData.initialReferrer,
      JSON.stringify(sessionData.sessionData || {})
    ).run();
  }

  async getSession(sessionId) {
    const stmt = this.sql.prepare(`
      SELECT * FROM user_sessions 
      WHERE session_id = ? AND container_id = ? AND is_active = 1
    `);

    const result = await stmt.bind(sessionId, this.containerId).first();
    if (result && result.session_data) {
      result.session_data = JSON.parse(result.session_data);
    }
    return result;
  }

  async updateSession(sessionId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const stmt = this.sql.prepare(`
      UPDATE user_sessions 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP, last_activity = CURRENT_TIMESTAMP
      WHERE session_id = ? AND container_id = ?
    `);

    const values = Object.values(updates);
    values.push(sessionId, this.containerId);

    return await stmt.bind(...values).run();
  }

  async cleanupExpiredSessions() {
    const stmt = this.sql.prepare(`
      UPDATE user_sessions 
      SET is_active = 0 
      WHERE expires_at < CURRENT_TIMESTAMP AND container_id = ?
    `);

    return await stmt.bind(this.containerId).run();
  }

  // Stateful computation methods
  async createComputation(computationData) {
    const stmt = this.sql.prepare(`
      INSERT INTO stateful_computations (
        computation_id, container_id, computation_type, input_data,
        timeout_at, max_retries, priority, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      computationData.computationId,
      this.containerId,
      computationData.computationType,
      JSON.stringify(computationData.inputData || {}),
      computationData.timeoutAt,
      computationData.maxRetries || 3,
      computationData.priority || 1,
      JSON.stringify(computationData.metadata || {})
    ).run();
  }

  async updateComputation(computationId, updates) {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const stmt = this.sql.prepare(`
      UPDATE stateful_computations 
      SET ${setClause}
      WHERE computation_id = ? AND container_id = ?
    `);

    const values = Object.values(updates);
    values.push(computationId, this.containerId);

    return await stmt.bind(...values).run();
  }

  async getComputation(computationId) {
    const stmt = this.sql.prepare(`
      SELECT * FROM stateful_computations 
      WHERE computation_id = ? AND container_id = ?
    `);

    const result = await stmt.bind(computationId, this.containerId).first();
    if (result) {
      if (result.input_data) result.input_data = JSON.parse(result.input_data);
      if (result.output_data) result.output_data = JSON.parse(result.output_data);
      if (result.metadata) result.metadata = JSON.parse(result.metadata);
    }
    return result;
  }

  async getPendingComputations() {
    const stmt = this.sql.prepare(`
      SELECT * FROM stateful_computations 
      WHERE container_id = ? AND status IN ('pending', 'running')
        AND (timeout_at IS NULL OR timeout_at > CURRENT_TIMESTAMP)
      ORDER BY priority DESC, created_at ASC
    `);

    const results = await stmt.bind(this.containerId).all();
    return results.results.map(result => {
      if (result.input_data) result.input_data = JSON.parse(result.input_data);
      if (result.output_data) result.output_data = JSON.parse(result.output_data);
      if (result.metadata) result.metadata = JSON.parse(result.metadata);
      return result;
    });
  }

  // KV bindings state methods
  async logKVOperation(operation) {
    const stmt = this.sql.prepare(`
      INSERT INTO kv_bindings_state (
        binding_name, container_id, key_name, operation, success, error_message, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      operation.bindingName,
      this.containerId,
      operation.keyName,
      operation.operation,
      operation.success ? 1 : 0,
      operation.errorMessage,
      JSON.stringify(operation.metadata || {})
    ).run();
  }

  // R2 references methods
  async createR2Reference(referenceData) {
    const stmt = this.sql.prepare(`
      INSERT INTO r2_references (
        reference_id, container_id, bucket_name, object_key, operation,
        content_type, content_length, etag, last_modified, metadata, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      referenceData.referenceId,
      this.containerId,
      referenceData.bucketName,
      referenceData.objectKey,
      referenceData.operation,
      referenceData.contentType,
      referenceData.contentLength,
      referenceData.etag,
      referenceData.lastModified,
      JSON.stringify(referenceData.metadata || {}),
      referenceData.expiresAt
    ).run();
  }

  async getR2Reference(referenceId) {
    const stmt = this.sql.prepare(`
      SELECT * FROM r2_references 
      WHERE reference_id = ? AND container_id = ?
    `);

    const result = await stmt.bind(referenceId, this.containerId).first();
    if (result && result.metadata) {
      result.metadata = JSON.parse(result.metadata);
    }
    return result;
  }

  async updateR2Access(referenceId) {
    const stmt = this.sql.prepare(`
      UPDATE r2_references 
      SET access_count = access_count + 1, last_accessed = CURRENT_TIMESTAMP
      WHERE reference_id = ? AND container_id = ?
    `);

    return await stmt.bind(referenceId, this.containerId).run();
  }

  // Performance metrics methods
  async recordMetric(metricData) {
    const stmt = this.sql.prepare(`
      INSERT INTO performance_metrics (
        container_id, metric_type, metric_name, metric_value, unit, tags, session_id, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      this.containerId,
      metricData.metricType,
      metricData.metricName,
      metricData.metricValue,
      metricData.unit,
      JSON.stringify(metricData.tags || {}),
      metricData.sessionId,
      metricData.userId
    ).run();
  }

  // Container health methods
  async recordHealthCheck(healthData) {
    const stmt = this.sql.prepare(`
      INSERT INTO container_health (
        container_id, health_status, memory_usage, cpu_usage, connection_count,
        uptime, request_count, error_count, response_time_avg, circuit_breaker_open,
        last_error, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return await stmt.bind(
      this.containerId,
      healthData.healthStatus,
      healthData.memoryUsage,
      healthData.cpuUsage,
      healthData.connectionCount,
      healthData.uptime,
      healthData.requestCount,
      healthData.errorCount,
      healthData.responseTimeAvg,
      healthData.circuitBreakerOpen ? 1 : 0,
      healthData.lastError,
      JSON.stringify(healthData.metadata || {})
    ).run();
  }

  async getContainerHealth() {
    const stmt = this.sql.prepare(`
      SELECT * FROM container_health 
      WHERE container_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    const result = await stmt.bind(this.containerId).first();
    if (result && result.metadata) {
      result.metadata = JSON.parse(result.metadata);
    }
    return result;
  }

  // Cleanup methods
  async cleanup(maxAge = '7 days') {
    const tables = [
      'analytics',
      'request_counters',
      'performance_metrics',
      'kv_bindings_state'
    ];

    for (const table of tables) {
      const stmt = this.sql.prepare(`
        DELETE FROM ${table} 
        WHERE container_id = ? AND timestamp < datetime('now', '-${maxAge}')
      `);
      await stmt.bind(this.containerId).run();
    }

    // Clean up expired sessions
    await this.cleanupExpiredSessions();

    // Clean up expired R2 references
    const r2Stmt = this.sql.prepare(`
      DELETE FROM r2_references 
      WHERE container_id = ? AND expires_at < CURRENT_TIMESTAMP
    `);
    await r2Stmt.bind(this.containerId).run();

    // Clean up completed computations older than 1 day
    const computationStmt = this.sql.prepare(`
      DELETE FROM stateful_computations 
      WHERE container_id = ? AND status = 'completed' AND completed_at < datetime('now', '-1 day')
    `);
    await computationStmt.bind(this.containerId).run();
  }

  // Migration methods
  async runMigration(migrationName, migrationSql, rollbackSql) {
    try {
      await this.sql.exec(migrationSql);
      
      const stmt = this.sql.prepare(`
        INSERT INTO d1_migrations (migration_name, container_id, schema_version, rollback_sql)
        VALUES (?, ?, ?, ?)
      `);
      
      await stmt.bind(migrationName, this.containerId, this.schemaVersion, rollbackSql).run();
      
      return { success: true, message: `Migration ${migrationName} completed successfully` };
    } catch (error) {
      const stmt = this.sql.prepare(`
        INSERT INTO d1_migrations (migration_name, container_id, status, error_message)
        VALUES (?, ?, 'failed', ?)
      `);
      
      await stmt.bind(migrationName, this.containerId, error.message).run();
      
      throw error;
    }
  }

  // Utility methods
  async getDatabaseStats() {
    const tables = [
      'analytics', 'request_counters', 'user_sessions', 'stateful_computations',
      'r2_references', 'performance_metrics', 'container_health'
    ];

    const stats = {};
    
    for (const table of tables) {
      const stmt = this.sql.prepare(`
        SELECT COUNT(*) as count FROM ${table} WHERE container_id = ?
      `);
      const result = await stmt.bind(this.containerId).first();
      stats[table] = result.count;
    }

    return stats;
  }

  async exportData(tables = null) {
    const tablesToExport = tables || [
      'analytics', 'request_counters', 'user_sessions', 'stateful_computations',
      'r2_references', 'performance_metrics', 'container_health'
    ];

    const exportData = {};
    
    for (const table of tablesToExport) {
      const stmt = this.sql.prepare(`
        SELECT * FROM ${table} WHERE container_id = ?
      `);
      const result = await stmt.bind(this.containerId).all();
      exportData[table] = result.results;
    }

    return exportData;
  }
}
