import { Container } from "@cloudflare/containers";

export class ContainerCodeApp extends Container {
  defaultPort = 8080;
  sleepAfter = '5m';
  
  envVars = {
    MESSAGE: 'ContainerCode Advisory - Running in Container Mode!',
    NODE_ENV: 'production',
    ANALYTICS_ENABLED: 'true',
  };

  async onStart() {
    console.log('ContainerCodeApp container starting...');
  }

  async onStop() {
    console.log('ContainerCodeApp container stopping...');
  }

  async onError(error) {
    console.error('ContainerCodeApp container error:', error);
  }
}
