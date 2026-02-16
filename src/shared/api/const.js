const env = typeof process !== 'undefined' && process?.env ? process.env : {};

export const APP_API_URL = env.EXPO_PUBLIC_API_URL || '';
export const SENTRY_DSN = env.EXPO_PUBLIC_SENTRY_DSN || '';