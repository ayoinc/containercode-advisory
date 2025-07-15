/**
 * Main Queue Worker
 * Entry point for Cloudflare Workers queue processing
 * Handles all queue consumers and durable object exports
 */

import { QueueProcessor } from './queue-processor.js';
import { JobState } from './durable-objects/job-state.js';
import { RateLimiter } from './durable-objects/rate-limiter.js';
import { PipelineOrchestrator } from './durable-objects/pipeline-orchestrator.js';

// Export Durable Object classes
export { JobState, RateLimiter, PipelineOrchestrator };

// Queue processor instance
let queueProcessor = null;

/**
 * Initialize queue processor
 */
function initializeProcessor(env) {
  if (!queueProcessor) {
    queueProcessor = new QueueProcessor(env);
  }
  return queueProcessor;
}

/**
 * Main queue consumer handler
 * Processes messages from all queues
 */
export default {
  async queue(batch, env) {
    const processor = initializeProcessor(env);
    
    try {
      const results = await processor.handleMessage(batch);
      
      // Log processing results
      console.log(`Processed ${batch.messages.length} messages:`, {
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        queue: batch.queue
      });
      
      return results;
    } catch (error) {
      console.error('Queue processing error:', error);
      
      // Retry all messages on critical error
      batch.messages.forEach(message => {
        message.retry();
      });
      
      throw error;
    }
  },

  /**
   * HTTP handler for queue management and monitoring
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route API requests
      if (path.startsWith('/api/')) {
        return await handleApiRequest(request, env, path);
      }

      // Queue management endpoints
      if (path.startsWith('/queue/')) {
        return await handleQueueRequest(request, env, path);
      }

      // Durable Object endpoints
      if (path.startsWith('/job/')) {
        return await handleJobRequest(request, env, path);
      }

      // Pipeline endpoints
      if (path.startsWith('/pipeline/')) {
        return await handlePipelineRequest(request, env, path);
      }

      // WebSocket endpoints
      if (path.startsWith('/ws/')) {
        return await handleWebSocketRequest(request, env, path);
      }

      // Default response
      return new Response(JSON.stringify({
        message: 'ContainerCode Queue Processor',
        version: '1.0.0',
        endpoints: {
          queue: '/queue/*',
          jobs: '/job/*',
          pipelines: '/pipeline/*',
          websocket: '/ws/*',
          api: '/api/*'
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Request handling error:', error);
      return new Response(JSON.stringify({
        error: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  /**
   * Scheduled handler for maintenance tasks
   */
  async scheduled(event, env, ctx) {
    console.log('Running scheduled maintenance tasks');
    
    try {
      // Cleanup old job states
      await cleanupJobStates(env);
      
      // Cleanup rate limiter data
      await cleanupRateLimiters(env);
      
      // Generate analytics report
      await generateAnalyticsReport(env);
      
      console.log('Scheduled maintenance completed successfully');
    } catch (error) {
      console.error('Scheduled maintenance error:', error);
    }
  }
};

/**
 * Handle API requests
 */
async function handleApiRequest(request, env, path) {
  const processor = initializeProcessor(env);
  
  const pathParts = path.split('/').filter(Boolean);
  const endpoint = pathParts[1]; // Skip 'api'
  
  switch (endpoint) {
    case 'health':
      return await handleHealthCheck(env);
    
    case 'stats':
      return await handleStatsRequest(env);
    
    case 'trigger':
      return await handleTriggerRequest(request, env);
    
    default:
      return new Response(JSON.stringify({ error: 'Unknown API endpoint' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

/**
 * Handle queue management requests
 */
async function handleQueueRequest(request, env, path) {
  const pathParts = path.split('/').filter(Boolean);
  const action = pathParts[1]; // Skip 'queue'
  
  switch (action) {
    case 'send':
      return await handleQueueSend(request, env);
    
    case 'status':
      return await handleQueueStatus(env);
    
    case 'clear':
      return await handleQueueClear(request, env);
    
    default:
      return new Response(JSON.stringify({ error: 'Unknown queue action' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

/**
 * Handle job state requests
 */
async function handleJobRequest(request, env, path) {
  const pathParts = path.split('/').filter(Boolean);
  const jobId = pathParts[1]; // Skip 'job'
  const action = pathParts[2];
  
  if (!jobId) {
    return new Response(JSON.stringify({ error: 'Job ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const jobState = env.JOB_STATE.get(env.JOB_STATE.idFromName(jobId));
  
  switch (action) {
    case 'status':
      const status = await jobState.getJob();
      return new Response(JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
      });
    
    case 'logs':
      const logs = await jobState.getLogs();
      return new Response(JSON.stringify(logs), {
        headers: { 'Content-Type': 'application/json' }
      });
    
    case 'cancel':
      await jobState.cancelJob();
      return new Response(JSON.stringify({ message: 'Job cancelled' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    
    case 'retry':
      const retryResult = await jobState.retryJob();
      return new Response(JSON.stringify(retryResult), {
        headers: { 'Content-Type': 'application/json' }
      });
    
    default:
      return new Response(JSON.stringify({ error: 'Unknown job action' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

/**
 * Handle pipeline requests
 */
async function handlePipelineRequest(request, env, path) {
  const pathParts = path.split('/').filter(Boolean);
  const pipelineId = pathParts[1]; // Skip 'pipeline'
  const action = pathParts[2];
  
  if (!pipelineId) {
    return new Response(JSON.stringify({ error: 'Pipeline ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const orchestrator = env.PIPELINE_ORCHESTRATOR.get(
    env.PIPELINE_ORCHESTRATOR.idFromName(pipelineId)
  );
  
  switch (action) {
    case 'start':
      const result = await orchestrator.startPipeline();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    
    case 'status':
      const status = await orchestrator.getStatus();
      return new Response(JSON.stringify(status), {
        headers: { 'Content-Type': 'application/json' }
      });
    
    default:
      if (request.method === 'POST' && !action) {
        // Create new pipeline
        const pipelineConfig = await request.json();
        const pipeline = await orchestrator.createPipeline(
          pipelineId,
          pipelineConfig.stages,
          pipelineConfig.dependencies,
          pipelineConfig.metadata
        );
        return new Response(JSON.stringify(pipeline), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ error: 'Unknown pipeline action' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

/**
 * Handle WebSocket requests
 */
async function handleWebSocketRequest(request, env, path) {
  const pathParts = path.split('/').filter(Boolean);
  const type = pathParts[1]; // Skip 'ws'
  const id = pathParts[2];
  
  if (!type || !id) {
    return new Response('WebSocket type and ID required', { status: 400 });
  }
  
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }
  
  const [client, server] = Object.values(new WebSocketPair());
  
  switch (type) {
    case 'job':
      const jobState = env.JOB_STATE.get(env.JOB_STATE.idFromName(id));
      await jobState.handleWebSocket(server);
      break;
    
    case 'rate':
      const rateLimiter = env.RATE_LIMITER.get(env.RATE_LIMITER.idFromName(id));
      await rateLimiter.handleWebSocket(server);
      break;
    
    default:
      server.close(1011, 'Unknown WebSocket type');
  }
  
  return new Response(null, {
    status: 101,
    webSocket: client
  });
}

/**
 * Utility functions
 */
async function handleHealthCheck(env) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    queues: {
      article: 'available',
      newsletter: 'available',
      email: 'available',
      image: 'available',
      deadLetter: 'available'
    },
    durableObjects: {
      jobState: 'available',
      rateLimiter: 'available',
      pipelineOrchestrator: 'available'
    }
  };
  
  return new Response(JSON.stringify(health), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleStatsRequest(env) {
  // Get rate limiter stats
  const rateLimiter = env.RATE_LIMITER.get(env.RATE_LIMITER.idFromName('default'));
  const rateLimiterStats = await rateLimiter.getStatistics();
  
  const stats = {
    timestamp: new Date().toISOString(),
    rateLimiting: rateLimiterStats,
    // Add more stats as needed
  };
  
  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleTriggerRequest(request, env) {
  const body = await request.json();
  const { type, payload } = body;
  
  const processor = initializeProcessor(env);
  
  switch (type) {
    case 'article_generation':
      await processor.queueMessage('article_research', payload);
      break;
    
    case 'newsletter_generation':
      await processor.queueMessage('newsletter_generation', payload);
      break;
    
    default:
      return new Response(JSON.stringify({ error: 'Unknown trigger type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
  }
  
  return new Response(JSON.stringify({ message: 'Trigger successful' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleQueueSend(request, env) {
  const body = await request.json();
  const { queue, message } = body;
  
  const queueBinding = env[queue.toUpperCase() + '_QUEUE'];
  if (!queueBinding) {
    return new Response(JSON.stringify({ error: 'Queue not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  await queueBinding.send(message);
  
  return new Response(JSON.stringify({ message: 'Message sent to queue' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleQueueStatus(env) {
  // This would typically return queue depth and other metrics
  // Implementation depends on available Cloudflare APIs
  const status = {
    queues: {
      article: { depth: 'unknown', status: 'available' },
      newsletter: { depth: 'unknown', status: 'available' },
      email: { depth: 'unknown', status: 'available' },
      image: { depth: 'unknown', status: 'available' },
      deadLetter: { depth: 'unknown', status: 'available' }
    },
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleQueueClear(request, env) {
  // This would clear specific queues
  // Implementation depends on available Cloudflare APIs
  return new Response(JSON.stringify({ 
    message: 'Queue clear not implemented yet' 
  }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function cleanupJobStates(env) {
  // This would iterate through job states and cleanup old ones
  // Implementation depends on available Durable Object APIs
  console.log('Cleaning up old job states');
}

async function cleanupRateLimiters(env) {
  // This would cleanup old rate limiter data
  console.log('Cleaning up rate limiter data');
}

async function generateAnalyticsReport(env) {
  // This would generate analytics reports
  console.log('Generating analytics report');
}