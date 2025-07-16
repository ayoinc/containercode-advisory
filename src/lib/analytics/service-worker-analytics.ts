export class ServiceWorkerAnalytics {
  private static instance: ServiceWorkerAnalytics;
  private queue: Array<any> = [];
  private isOnline: boolean = navigator.onLine;

  static getInstance(): ServiceWorkerAnalytics {
    if (!ServiceWorkerAnalytics.instance) {
      ServiceWorkerAnalytics.instance = new ServiceWorkerAnalytics();
    }
    return ServiceWorkerAnalytics.instance;
  }

  constructor() {
    this.setupOfflineHandling();
    this.registerServiceWorkerEvents();
  }

  private setupOfflineHandling(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private registerServiceWorkerEvents(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'ANALYTICS_SYNC') {
          this.handleAnalyticsSync(event.data.payload);
        }
      });
    }
  }

  trackEvent(event: any): void {
    const eventData = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      offline: !this.isOnline,
    };

    if (this.isOnline) {
      this.sendToAnalytics(eventData);
    } else {
      this.queue.push(eventData);
      this.storeInIndexedDB(eventData);
    }
  }

  private async sendToAnalytics(data: any): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Analytics send failed:', error);
      this.queue.push(data);
    }
  }

  private async flushQueue(): Promise<void> {
    const queueCopy = [...this.queue];
    this.queue = [];

    for (const event of queueCopy) {
      await this.sendToAnalytics(event);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }

  private async storeInIndexedDB(data: any): Promise<void> {
    try {
      const request = indexedDB.open('AnalyticsDB', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['events'], 'readwrite');
        const store = transaction.objectStore('events');
        store.add(data);
      };
    } catch (error) {
      console.error('IndexedDB storage failed:', error);
    }
  }

  private handleAnalyticsSync(payload: any): void {
    console.log('Analytics sync completed:', payload);
  }
}