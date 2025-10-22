/**
 * Application configuration
 * Centralized configuration management for environment variables
 */

export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10),
  },
  features: {
    monitoring:
      process.env.NEXT_PUBLIC_ENABLE_MONITORING === "true" ||
      process.env.NODE_ENV === "development",
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  },
  app: {
    name: "LexAI",
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },
  external: {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
} as const;

export default config;
