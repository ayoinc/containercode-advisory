/**
 * Pipeline Orchestrator Durable Object
 * Coordinates complex multi-stage pipelines with dependencies and parallel execution
 * Manages workflow state and handles pipeline recovery
 */

export class PipelineOrchestrator {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.storage = state.storage;
    this.initPromise = this.initialize();
  }

  async initialize() {
    // Initialize pipeline state if not exists
    const pipelineState = await this.storage.get('pipelineState');
    if (!pipelineState) {
      await this.storage.put('pipelineState', {
        id: null,
        status: 'idle',
        stages: [],
        dependencies: {},
        currentStage: null,
        completedStages: [],
        failedStages: [],
        metadata: {},
        createdAt: null,
        updatedAt: null
      });
    }
  }

  /**
   * Create new pipeline with stages and dependencies
   */
  async createPipeline(pipelineId, stages, dependencies = {}, metadata = {}) {
    await this.initPromise;
    
    // Validate pipeline configuration
    this.validatePipelineConfig(stages, dependencies);
    
    const pipelineState = {
      id: pipelineId,
      status: 'pending',
      stages: stages.map(stage => ({
        ...stage,
        status: 'pending',
        attempts: 0,
        startTime: null,
        endTime: null,
        result: null,
        error: null
      })),
      dependencies,
      currentStage: null,
      completedStages: [],
      failedStages: [],
      parallelGroups: this.identifyParallelGroups(stages, dependencies),
      metadata: {
        ...metadata,
        maxRetries: metadata.maxRetries || 3,
        timeout: metadata.timeout || 1800000, // 30 minutes default
        createdBy: metadata.createdBy || 'system'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.storage.put('pipelineState', pipelineState);
    await this.scheduleTimeout(pipelineState.metadata.timeout);
    
    return pipelineState;
  }

  /**
   * Start pipeline execution
   */
  async startPipeline() {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    if (!pipeline) {
      throw new Error('Pipeline not found');
    }

    if (pipeline.status !== 'pending') {
      throw new Error(`Pipeline is in ${pipeline.status} state and cannot be started`);
    }

    pipeline.status = 'running';
    pipeline.updatedAt = new Date().toISOString();
    
    await this.storage.put('pipelineState', pipeline);
    
    // Start executing ready stages
    await this.executeReadyStages();
    
    return pipeline;
  }

  /**
   * Execute stages that are ready to run
   */
  async executeReadyStages() {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    if (!pipeline) return;

    const readyStages = this.getReadyStages(pipeline);
    
    for (const stage of readyStages) {
      await this.executeStage(stage.id);
    }
  }

  /**
   * Execute individual stage
   */
  async executeStage(stageId) {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    if (!pipeline) return;

    const stage = pipeline.stages.find(s => s.id === stageId);
    if (!stage) {
      throw new Error(`Stage ${stageId} not found`);
    }

    if (stage.status !== 'pending') {
      return; // Stage already processed
    }

    // Update stage status
    stage.status = 'running';
    stage.startTime = new Date().toISOString();
    stage.attempts += 1;
    pipeline.currentStage = stageId;
    pipeline.updatedAt = new Date().toISOString();
    
    await this.storage.put('pipelineState', pipeline);

    try {
      // Execute stage based on type
      let result;
      switch (stage.type) {
        case 'article_research':
          result = await this.executeArticleResearch(stage);
          break;
        case 'article_generation':
          result = await this.executeArticleGeneration(stage);
          break;
        case 'content_validation':
          result = await this.executeContentValidation(stage);
          break;
        case 'parallel_processing':
          result = await this.executeParallelProcessing(stage);
          break;
        case 'newsletter_generation':
          result = await this.executeNewsletterGeneration(stage);
          break;
        case 'email_distribution':
          result = await this.executeEmailDistribution(stage);
          break;
        default:
          throw new Error(`Unknown stage type: ${stage.type}`);
      }

      // Mark stage as completed
      await this.completeStage(stageId, result);
      
    } catch (error) {
      await this.failStage(stageId, error);
    }
  }

  /**
   * Mark stage as completed
   */
  async completeStage(stageId, result) {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    const stage = pipeline.stages.find(s => s.id === stageId);
    
    stage.status = 'completed';
    stage.endTime = new Date().toISOString();
    stage.result = result;
    pipeline.completedStages.push(stageId);
    pipeline.updatedAt = new Date().toISOString();
    
    await this.storage.put('pipelineState', pipeline);
    
    // Check if pipeline is complete
    if (this.isPipelineComplete(pipeline)) {
      await this.completePipeline();
    } else {
      // Execute next ready stages
      await this.executeReadyStages();
    }
  }

  /**
   * Mark stage as failed
   */
  async failStage(stageId, error) {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    const stage = pipeline.stages.find(s => s.id === stageId);
    
    stage.error = error.message;
    stage.endTime = new Date().toISOString();
    
    // Check if we should retry
    if (stage.attempts < pipeline.metadata.maxRetries) {
      stage.status = 'pending';
      pipeline.updatedAt = new Date().toISOString();
      
      await this.storage.put('pipelineState', pipeline);
      
      // Retry after delay
      setTimeout(async () => {
        await this.executeStage(stageId);
      }, Math.pow(2, stage.attempts) * 1000); // Exponential backoff
      
    } else {
      // Mark as failed
      stage.status = 'failed';
      pipeline.failedStages.push(stageId);
      pipeline.updatedAt = new Date().toISOString();
      
      await this.storage.put('pipelineState', pipeline);
      
      // Check if pipeline should fail
      if (this.shouldFailPipeline(pipeline, stage)) {
        await this.failPipeline(error);
      } else {
        // Continue with other stages if possible
        await this.executeReadyStages();
      }
    }
  }

  /**
   * Complete entire pipeline
   */
  async completePipeline() {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    pipeline.status = 'completed';
    pipeline.updatedAt = new Date().toISOString();
    pipeline.metadata.completedAt = new Date().toISOString();
    
    await this.storage.put('pipelineState', pipeline);
    await this.clearTimeout();
    
    // Send completion notification
    await this.notifyCompletion(pipeline);
  }

  /**
   * Fail entire pipeline
   */
  async failPipeline(error) {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    pipeline.status = 'failed';
    pipeline.updatedAt = new Date().toISOString();
    pipeline.metadata.failedAt = new Date().toISOString();
    pipeline.metadata.error = error.message;
    
    await this.storage.put('pipelineState', pipeline);
    await this.clearTimeout();
    
    // Send failure notification
    await this.notifyFailure(pipeline, error);
  }

  /**
   * Get stages ready for execution
   */
  getReadyStages(pipeline) {
    return pipeline.stages.filter(stage => {
      if (stage.status !== 'pending') return false;
      
      // Check if all dependencies are completed
      const dependencies = pipeline.dependencies[stage.id] || [];
      return dependencies.every(depId => 
        pipeline.completedStages.includes(depId)
      );
    });
  }

  /**
   * Check if pipeline is complete
   */
  isPipelineComplete(pipeline) {
    return pipeline.stages.every(stage => 
      stage.status === 'completed' || 
      (stage.status === 'failed' && !stage.critical)
    );
  }

  /**
   * Check if pipeline should fail
   */
  shouldFailPipeline(pipeline, failedStage) {
    // Fail if critical stage failed
    if (failedStage.critical) {
      return true;
    }
    
    // Fail if too many stages failed
    const failureThreshold = pipeline.metadata.failureThreshold || 0.5;
    const failureRate = pipeline.failedStages.length / pipeline.stages.length;
    
    return failureRate > failureThreshold;
  }

  /**
   * Identify parallel execution groups
   */
  identifyParallelGroups(stages, dependencies) {
    const groups = [];
    const processed = new Set();
    
    for (const stage of stages) {
      if (processed.has(stage.id)) continue;
      
      const group = this.findParallelGroup(stage, stages, dependencies, processed);
      if (group.length > 1) {
        groups.push(group);
      }
    }
    
    return groups;
  }

  /**
   * Find stages that can run in parallel
   */
  findParallelGroup(startStage, stages, dependencies, processed) {
    const group = [startStage.id];
    processed.add(startStage.id);
    
    const startDeps = dependencies[startStage.id] || [];
    
    for (const stage of stages) {
      if (processed.has(stage.id)) continue;
      
      const stageDeps = dependencies[stage.id] || [];
      
      // Can run in parallel if they have the same dependencies
      if (this.arraysEqual(startDeps, stageDeps)) {
        group.push(stage.id);
        processed.add(stage.id);
      }
    }
    
    return group;
  }

  /**
   * Execute stage implementations
   */
  async executeArticleResearch(stage) {
    const { topic, depth } = stage.config;
    
    // Queue research job
    await this.env.ARTICLE_QUEUE.send({
      type: 'article_research',
      payload: {
        jobId: `${stage.id}_research`,
        topic,
        researchDepth: depth,
        priority: 'high'
      }
    });
    
    return { status: 'queued', type: 'article_research' };
  }

  async executeArticleGeneration(stage) {
    const { topic, researchData } = stage.config;
    
    // Queue generation job
    await this.env.ARTICLE_QUEUE.send({
      type: 'article_generation',
      payload: {
        jobId: `${stage.id}_generation`,
        topic,
        researchData,
        priority: 'high'
      }
    });
    
    return { status: 'queued', type: 'article_generation' };
  }

  async executeContentValidation(stage) {
    const { article } = stage.config;
    
    // Queue validation job
    await this.env.ARTICLE_QUEUE.send({
      type: 'content_validation',
      payload: {
        jobId: `${stage.id}_validation`,
        article,
        priority: 'normal'
      }
    });
    
    return { status: 'queued', type: 'content_validation' };
  }

  async executeParallelProcessing(stage) {
    const { tasks } = stage.config;
    
    // Queue all tasks in parallel
    const promises = tasks.map(task => 
      this.env.ARTICLE_QUEUE.send({
        type: task.type,
        payload: {
          jobId: `${stage.id}_${task.id}`,
          ...task.config,
          priority: 'normal'
        }
      })
    );
    
    await Promise.all(promises);
    
    return { status: 'queued', parallelTasks: tasks.length };
  }

  async executeNewsletterGeneration(stage) {
    const { campaignId, segments } = stage.config;
    
    // Queue newsletter generation
    await this.env.NEWSLETTER_QUEUE.send({
      type: 'newsletter_generation',
      payload: {
        jobId: `${stage.id}_newsletter`,
        campaignId,
        subscriberSegments: segments,
        priority: 'high'
      }
    });
    
    return { status: 'queued', type: 'newsletter_generation' };
  }

  async executeEmailDistribution(stage) {
    const { newsletter, segments } = stage.config;
    
    // Queue email distribution for each segment
    const promises = segments.map(segment =>
      this.env.EMAIL_QUEUE.send({
        type: 'email_batch',
        payload: {
          jobId: `${stage.id}_email_${segment.id}`,
          newsletter,
          segment,
          priority: 'high'
        }
      })
    );
    
    await Promise.all(promises);
    
    return { status: 'queued', emailBatches: segments.length };
  }

  /**
   * Get pipeline status
   */
  async getStatus() {
    await this.initPromise;
    
    const pipeline = await this.storage.get('pipelineState');
    if (!pipeline) {
      return null;
    }

    return {
      id: pipeline.id,
      status: pipeline.status,
      progress: this.calculateProgress(pipeline),
      currentStage: pipeline.currentStage,
      completedStages: pipeline.completedStages.length,
      failedStages: pipeline.failedStages.length,
      totalStages: pipeline.stages.length,
      createdAt: pipeline.createdAt,
      updatedAt: pipeline.updatedAt
    };
  }

  /**
   * Calculate pipeline progress
   */
  calculateProgress(pipeline) {
    const totalStages = pipeline.stages.length;
    const completedStages = pipeline.completedStages.length;
    const runningStages = pipeline.stages.filter(s => s.status === 'running').length;
    
    return Math.round(((completedStages + runningStages * 0.5) / totalStages) * 100);
  }

  /**
   * Validate pipeline configuration
   */
  validatePipelineConfig(stages, dependencies) {
    // Check for duplicate stage IDs
    const stageIds = stages.map(s => s.id);
    const uniqueIds = [...new Set(stageIds)];
    if (stageIds.length !== uniqueIds.length) {
      throw new Error('Duplicate stage IDs found');
    }

    // Check for circular dependencies
    if (this.hasCircularDependencies(dependencies)) {
      throw new Error('Circular dependencies detected');
    }

    // Check for invalid dependencies
    for (const [stageId, deps] of Object.entries(dependencies)) {
      if (!stageIds.includes(stageId)) {
        throw new Error(`Invalid stage ID in dependencies: ${stageId}`);
      }
      
      for (const depId of deps) {
        if (!stageIds.includes(depId)) {
          throw new Error(`Invalid dependency ID: ${depId}`);
        }
      }
    }
  }

  /**
   * Check for circular dependencies
   */
  hasCircularDependencies(dependencies) {
    const visited = new Set();
    const recStack = new Set();
    
    const hasCycle = (node) => {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;
      
      visited.add(node);
      recStack.add(node);
      
      const deps = dependencies[node] || [];
      for (const dep of deps) {
        if (hasCycle(dep)) return true;
      }
      
      recStack.delete(node);
      return false;
    };
    
    for (const node of Object.keys(dependencies)) {
      if (hasCycle(node)) return true;
    }
    
    return false;
  }

  /**
   * Utility methods
   */
  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
  }

  async scheduleTimeout(timeoutMs) {
    await this.storage.setAlarm(Date.now() + timeoutMs);
  }

  async clearTimeout() {
    await this.storage.deleteAlarm();
  }

  async notifyCompletion(pipeline) {
    if (this.env.WEBHOOK_URL) {
      await fetch(this.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'pipeline_completed',
          pipelineId: pipeline.id,
          timestamp: new Date().toISOString()
        })
      });
    }
  }

  async notifyFailure(pipeline, error) {
    if (this.env.WEBHOOK_URL) {
      await fetch(this.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'pipeline_failed',
          pipelineId: pipeline.id,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      });
    }
  }

  /**
   * Handle timeout alarm
   */
  async alarm() {
    const pipeline = await this.storage.get('pipelineState');
    if (!pipeline) return;

    if (pipeline.status === 'running') {
      await this.failPipeline(new Error('Pipeline timeout'));
    }
  }
}

export default PipelineOrchestrator;