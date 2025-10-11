import * as Sentry from '@sentry/react-native';

import App from './src';

Sentry.init({
  dsn: 'https://5424e448f001caad9348ee803499d758@o4508313135087616.ingest.de.sentry.io/4509929561325648',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1,
  // integrations: [Sentry.mobileReplayIntegration()],
  // debug:true
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(App);
