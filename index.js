import { registerRootComponent } from 'expo';
import App from './App';

// для iOS PWA: мета и манифест в <head>, чтобы Safari создал standalone, а не ярлык вкладки
if (typeof document !== 'undefined' && document.head) {
  if (!document.getElementById('pwa-manifest-link')) {
    const link = document.createElement('link');
    link.id = 'pwa-manifest-link';
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
  }
  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-capable';
    meta.content = 'yes';
    document.head.appendChild(meta);
  }
  if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
    const bar = document.createElement('meta');
    bar.name = 'apple-mobile-web-app-status-bar-style';
    bar.content = 'black-translucent';
    document.head.appendChild(bar);
  }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
