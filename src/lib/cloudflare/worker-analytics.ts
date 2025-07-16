export class CloudflareWorkerAnalytics {
  static async trackEvent(event: any, env: any): Promise<void> {
    try {
      // Use Cloudflare Analytics Engine
      await env.ANALYTICS.writeDataPoint({
        blobs: [event.category, event.action, event.label],
        doubles: [event.value || 1],
        indexes: [event.userId || 'anonymous'],
      });

      // Store in D1 for detailed analysis
      await env.DB.prepare(`
        INSERT INTO analytics_events (
          category, action, label, value, user_id, timestamp, properties
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        event.category,
        event.action,
        event.label,
        event.value || 1,
        event.userId || 'anonymous',
        Date.now(),
        JSON.stringify(event.properties || {})
      ).run();
    } catch (error) {
      console.error('Cloudflare analytics failed:', error);
    }
  }

  static async getAnalytics(env: any, timeRange: string = '24h'): Promise<any> {
    try {
      const query = `
        SELECT 
          category,
          action,
          COUNT(*) as count,
          AVG(value) as avg_value
        FROM analytics_events 
        WHERE timestamp > ? 
        GROUP BY category, action
        ORDER BY count DESC
      `;

      const since = Date.now() - (timeRange === '24h' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000);
      const results = await env.DB.prepare(query).bind(since).all();

      return results.results;
    } catch (error) {
      console.error('Analytics query failed:', error);
      return [];
    }
  }

  static async trackServiceWorkerPerformance(data: any, env: any): Promise<void> {
    try {
      await env.ANALYTICS.writeDataPoint({
        blobs: ['service-worker', 'cache', data.strategy],
        doubles: [data.loadTime],
        indexes: [data.url],
      });
    } catch (error) {
      console.error('SW performance tracking failed:', error);
    }
  }

  static async getPerformanceMetrics(env: any): Promise<any> {
    try {
      const query = `
        SELECT 
          action,
          AVG(value) as avg_load_time,
          COUNT(*) as total_requests
        FROM analytics_events 
        WHERE category = 'performance' 
        AND timestamp > ?
        GROUP BY action
        ORDER BY avg_load_time DESC
      `;

      const since = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
      const results = await env.DB.prepare(query).bind(since).all();

      return results.results;
    } catch (error) {
      console.error('Performance metrics query failed:', error);
      return [];
    }
  }
}