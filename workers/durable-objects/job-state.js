/**
 * Job State Durable Object
 * Manages persistent state for long-running jobs in the newsletter automation pipeline
 * Provides distributed coordination and status tracking
 */

export class JobState {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.storage = state.storage;
    this.initPromise = this.initialize();
  }

  async initialize() {
    // Initialize job state if not exists
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      await this.storage.put('jobData', {
        id: null,
        status: 'pending',
        type: null,
        payload: null,
        createdAt: null,
        updatedAt: null,
        progress: 0,
        logs: [],
        metadata: {}
      });
    }
  }

  /**
   * Create new job with initial state
   */
  async createJob(jobId, type, payload, options = {}) {
    await this.initPromise;
    
    const jobData = {
      id: jobId,
      status: 'pending',
      type,
      payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
      logs: [{
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Job ${jobId} created with type ${type}`
      }],
      metadata: {
        priority: options.priority || 'normal',
        maxRetries: options.maxRetries || 3,
        retryCount: 0,
        timeout: options.timeout || 300000, // 5 minutes default
        ...options.metadata
      }
    };

    await this.storage.put('jobData', jobData);
    await this.scheduleTimeout(jobData.metadata.timeout);
    
    return jobData;
  }

  /**
   * Update job status with optional progress and metadata
   */
  async updateStatus(status, update = {}) {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      throw new Error('Job not found');
    }

    const updatedJob = {
      ...jobData,
      status,
      updatedAt: new Date().toISOString(),
      progress: update.progress || jobData.progress,
      metadata: {
        ...jobData.metadata,
        ...update.metadata
      }
    };

    // Add log entry
    updatedJob.logs.push({
      timestamp: new Date().toISOString(),
      level: update.level || 'info',
      message: update.message || `Status updated to ${status}`,
      details: update.details
    });

    // Handle specific status updates
    if (status === 'processing') {
      updatedJob.metadata.startedAt = update.startTime || new Date().toISOString();
    } else if (status === 'completed') {
      updatedJob.metadata.completedAt = update.endTime || new Date().toISOString();
      updatedJob.metadata.result = update.result;
      updatedJob.progress = 100;
      await this.clearTimeout();
    } else if (status === 'failed') {
      updatedJob.metadata.failedAt = update.endTime || new Date().toISOString();
      updatedJob.metadata.error = update.error;
      updatedJob.metadata.retryCount = update.retryCount || 0;
      await this.clearTimeout();
    }

    await this.storage.put('jobData', updatedJob);
    await this.notifyStatusChange(updatedJob);
    
    return updatedJob;
  }

  /**
   * Update job progress
   */
  async updateProgress(progress, message = null) {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      throw new Error('Job not found');
    }

    const updatedJob = {
      ...jobData,
      progress: Math.min(100, Math.max(0, progress)),
      updatedAt: new Date().toISOString()
    };

    if (message) {
      updatedJob.logs.push({
        timestamp: new Date().toISOString(),
        level: 'info',
        message,
        progress
      });
    }

    await this.storage.put('jobData', updatedJob);
    return updatedJob;
  }

  /**
   * Add log entry to job
   */
  async addLog(level, message, details = null) {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      throw new Error('Job not found');
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };

    jobData.logs.push(logEntry);
    jobData.updatedAt = new Date().toISOString();

    // Keep only last 100 logs to prevent memory issues
    if (jobData.logs.length > 100) {
      jobData.logs = jobData.logs.slice(-100);
    }

    await this.storage.put('jobData', jobData);
    return logEntry;
  }

  /**
   * Get current job state
   */
  async getJob() {
    await this.initPromise;
    return await this.storage.get('jobData');
  }

  /**
   * Get job logs with filtering
   */
  async getLogs(filter = {}) {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      throw new Error('Job not found');
    }

    let logs = jobData.logs;

    // Apply filters
    if (filter.level) {
      logs = logs.filter(log => log.level === filter.level);
    }

    if (filter.since) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(filter.since));
    }

    if (filter.limit) {
      logs = logs.slice(-filter.limit);
    }

    return logs;
  }

  /**
   * Mark job as cancelled
   */
  async cancelJob(reason = 'Job cancelled by user') {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      throw new Error('Job not found');
    }

    if (jobData.status === 'completed' || jobData.status === 'failed') {
      throw new Error('Cannot cancel completed or failed job');
    }

    await this.updateStatus('cancelled', {
      message: reason,
      metadata: {
        cancelledAt: new Date().toISOString(),
        cancelReason: reason
      }
    });

    await this.clearTimeout();
  }

  /**
   * Retry failed job
   */
  async retryJob() {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      throw new Error('Job not found');
    }

    if (jobData.status !== 'failed') {
      throw new Error('Only failed jobs can be retried');
    }

    if (jobData.metadata.retryCount >= jobData.metadata.maxRetries) {
      throw new Error('Maximum retry attempts exceeded');
    }

    const updatedJob = {
      ...jobData,
      status: 'pending',
      updatedAt: new Date().toISOString(),
      metadata: {
        ...jobData.metadata,
        retryCount: jobData.metadata.retryCount + 1,
        retriedAt: new Date().toISOString()
      }
    };

    updatedJob.logs.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Job retry attempt ${updatedJob.metadata.retryCount}/${updatedJob.metadata.maxRetries}`
    });

    await this.storage.put('jobData', updatedJob);
    await this.scheduleTimeout(jobData.metadata.timeout);
    
    return updatedJob;
  }

  /**
   * Set job timeout
   */
  async scheduleTimeout(timeoutMs) {
    const timeoutId = await this.storage.setAlarm(Date.now() + timeoutMs);
    await this.storage.put('timeoutId', timeoutId);
  }

  /**
   * Clear job timeout
   */
  async clearTimeout() {
    const timeoutId = await this.storage.get('timeoutId');
    if (timeoutId) {
      await this.storage.deleteAlarm();
      await this.storage.delete('timeoutId');
    }
  }

  /**
   * Handle timeout alarm
   */
  async alarm() {
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      return;
    }

    if (jobData.status === 'processing' || jobData.status === 'pending') {
      await this.updateStatus('timeout', {
        message: 'Job timed out',
        metadata: {
          timeoutAt: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Notify external systems about status changes
   */
  async notifyStatusChange(jobData) {
    // Send webhook notification if configured
    if (this.env.WEBHOOK_URL) {
      try {
        await fetch(this.env.WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Job-Event': 'status-change'
          },
          body: JSON.stringify({
            jobId: jobData.id,
            status: jobData.status,
            progress: jobData.progress,
            timestamp: jobData.updatedAt
          })
        });
      } catch (error) {
        console.error('Failed to send webhook notification:', error);
      }
    }

    // Store status change in analytics
    if (this.env.ANALYTICS) {
      await this.env.ANALYTICS.writeDataPoint({
        blobs: [jobData.id, jobData.status, jobData.type],
        doubles: [jobData.progress],
        indexes: [jobData.updatedAt]
      });
    }
  }

  /**
   * Get job statistics
   */
  async getStatistics() {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      return null;
    }

    const stats = {
      id: jobData.id,
      type: jobData.type,
      status: jobData.status,
      progress: jobData.progress,
      createdAt: jobData.createdAt,
      updatedAt: jobData.updatedAt,
      retryCount: jobData.metadata.retryCount,
      maxRetries: jobData.metadata.maxRetries,
      logCount: jobData.logs.length
    };

    // Calculate duration
    if (jobData.metadata.startedAt) {
      const endTime = jobData.metadata.completedAt || jobData.metadata.failedAt || new Date().toISOString();
      stats.duration = new Date(endTime) - new Date(jobData.metadata.startedAt);
    }

    return stats;
  }

  /**
   * Cleanup old job data
   */
  async cleanup() {
    await this.initPromise;
    
    const jobData = await this.storage.get('jobData');
    if (!jobData) {
      return;
    }

    // Clean up completed jobs older than 24 hours
    const cutoff = Date.now() - (24 * 60 * 60 * 1000);
    const updatedAt = new Date(jobData.updatedAt).getTime();

    if ((jobData.status === 'completed' || jobData.status === 'failed') && updatedAt < cutoff) {
      await this.storage.deleteAll();
    }
  }

  /**
   * WebSocket handler for real-time updates
   */
  async handleWebSocket(webSocket) {
    await this.initPromise;
    
    webSocket.accept();
    
    // Send current job state
    const jobData = await this.storage.get('jobData');
    if (jobData) {
      webSocket.send(JSON.stringify({
        type: 'job_state',
        data: jobData
      }));
    }

    // Set up periodic updates
    const interval = setInterval(async () => {
      const currentJob = await this.storage.get('jobData');
      if (currentJob) {
        webSocket.send(JSON.stringify({
          type: 'job_update',
          data: currentJob
        }));
      }
    }, 1000);

    webSocket.addEventListener('close', () => {
      clearInterval(interval);
    });
  }
}

export default JobState;