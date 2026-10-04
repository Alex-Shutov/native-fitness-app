// Expo inlines EXPO_PUBLIC_* only on direct process.env references at bundle time.
export const APP_API_URL = process.env.EXPO_PUBLIC_API_URL || '';
export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';